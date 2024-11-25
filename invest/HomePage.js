import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // import the icon set
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Card as PaperCard} from 'react-native-paper';
import Footer from './components/footer';
import Header from './components/Header';
import searchIcon from './assets/SearchIcon.png';
import Equity from './Equity';
import Rec from './Recs';
import { useUser } from './UserContext';
// Utility function to format prices
const formatPrice = (price) => {
  const number = parseFloat(price.replace(/[^0-9.-]+/g, ''));
  if (isNaN(number)) return 'N/A';
  return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
// Fetching cards from the API
const fetchCards = async () => {
  try {
    const response = await fetch('http://192.168.1.241:3000/api/cards');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {  
    return [];
  }
};
// Card component
const Card = ({ card, onPress }) => {
  const currentPrice = formatPrice(card.price);
  const targetPrice = formatPrice(card.targetPrice);
  const yieldValue = formatPrice(card.yield);
  const fundedPercentage = parseFloat(targetPrice.replace(/[^0-9.-]+/g, ''))
    ? Math.min(
        100,
        (parseFloat(currentPrice.replace(/[^0-9.-]+/g, '')) / parseFloat(targetPrice.replace(/[^0-9.-]+/g, ''))) *
          100
      )
    : 0;
  
};
const HomeScreen = ({ navigation, route }) => {
  const { isGuest } = route.params || { isGuest: false };
  const { userData } = useUser();
  const [activeTab, setActiveTab] = useState("All"); // Default to "All"
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnology, setSelectedTechnology] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [cards, setCards] = useState([]);
  const [webSocket, setWebSocket] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const filterCards = (cards) => {
    return cards.filter((card) => {
      const matchesTechnology = selectedTechnology
        ? card.Type?.toLowerCase() === selectedTechnology.toLowerCase()
        : true;
      const matchesCountry = selectedCountry
        ? card.country?.toLowerCase() === selectedCountry.toLowerCase()
        : true;
      const matchesSearch = card.title?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTechnology && matchesCountry && matchesSearch;
    });
  };
  
  const renderContent = () => {
    if (activeTab === "All") {
      // Manually render REC and Equity cards
      return (
        <>
          {/* Render REC cards */}
          <Rec cards={cards.filter((card) => card.Type === 'Rec')} />
          {/* Render Equity cards */}
          <Equity cards={cards.filter((card) => card.Type === 'Equity')} />
          {/* You can add more types here if needed */}
        </>
      );
    }
    if (activeTab === 'Rec') {
      // Show only REC cards
      return <Rec cards={cards.filter((card) => card.Type === 'Rec')} />;
    }
    if (activeTab === 'Invest') {
      // Show only Equity cards
      return <Equity cards={cards.filter((card) => card.Type === 'Equity')} />;
    }
    if (activeTab === 'Loan') {
      // Show only Loan cards
      return cards
        .filter((card) => card.Type === 'Loan')
        .map((card) => <Card key={card.id} card={card} onPress={() => handleCardPress(card)} />);
    }
  };
  
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header />

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            key="All"
            onPress={() => setActiveTab('All')}
            style={styles.tab}
          >
            <View style={styles.tabItem}>
              <Icon name="view-list" size={20} color={'#99abaf'} />
              <Text style={[styles.tabText, activeTab === 'All' && styles.activeTabText]}>All</Text>
            </View>
            {activeTab === 'All' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            key="Rec"
            onPress={() => setActiveTab('Rec')}
            style={styles.tab}
          >
            <View style={styles.tabItem}>
              <Icon name="clock-outline" size={20} color={'#99abaf'} />
              <Text style={[styles.tabText, activeTab === 'Rec' && styles.activeTabText]}>RECs</Text>
            </View>
            {activeTab === 'Rec' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            key="Invest"
            onPress={() => setActiveTab('Invest')}
            style={styles.tab}
          >
            <View style={styles.tabItem}>
              <Icon name="chart-pie" size={20} color={'#99abaf'} />
              <Text style={[styles.tabText, activeTab === 'Invest' && styles.activeTabText]}>Equity</Text>
            </View>
            {activeTab === 'Invest' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            key="Loan"
            onPress={() => setActiveTab('Loan')}
            style={styles.tab}
          >
            <View style={styles.tabItem}>
              <Icon name="percent" size={20} color={'#99abaf'} />
              <Text style={[styles.tabText, activeTab === 'Loan' && styles.activeTabText]}>Loans</Text>
            </View>
            {activeTab === 'Loan' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Render Content Based on Active Tab */}
        {renderContent()}
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#f3f9fa',
    paddingStart:15,
    paddingEnd:15,
  },
  marketplaceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  CatogoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  headerText: {
    fontSize: 25,
    marginTop:10,
    marginBottom: 15,
    fontWeight: '900',
    color: '#1f2545', // Darker text color for better readability
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  tab: {
    alignItems: 'center',
    flexDirection: 'column',
    paddingVertical: 5,
    marginHorizontal: 10, // Add horizontal space between each tab
  },
  tabItem: {
    flexDirection: 'row', // Aligns icon and text in a row
  },
  tabText: {
    fontSize: 16,
    color: '#535d69',
    marginLeft: 2, // Adds space between icon and text
  },
  activeTabText: {
    color: '#535d69', // Color for active tab text
  },
  activeTabIndicator: {
    height: 2,
    backgroundColor: '#34c659',
    width: '100%',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:20
  },
  scrollView: {
    flex: 1,
   },
  searchButtonText: {
    fontSize: 16,
    color: '#000', // Color for search button text
  },
  clearButtonText: {
    fontSize: 16,
    color: '#FF0000', // Color for clear button text
  },
  searchContainer: {
    backgroundColor:'#fff'
  },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  filterContainer: {
    flexDirection: 'column', // Change to 'column' for vertical stacking
    margin: 10,
  },
  dropdown: {
    borderColor: '#ccc',
    borderWidth: 88,
    borderRadius: 5,
    padding: 10,
  },
  searchIcon: {
    width: 24,
    height: 24,
  },
  picker: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    backgroundColor: 'white', // Optional: Set background color for visibility
  },
});
export default HomeScreen;