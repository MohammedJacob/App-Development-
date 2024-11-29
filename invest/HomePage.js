import React, { useEffect, useState, useMemo } from 'react';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import Footer from './components/footer';
import Header from './components/Header';
import Equity from './Equity';
import Rec from './Recs';
import { useUser } from './UserContext';
import styles from './homepageStyle';

// Format prices into a readable format
const formatPrice = (price) => {
  const number = parseFloat(price.replace(/[^0-9.-]+/g, ''));
  return isNaN(number) ? 'N/A' : number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Fetch cards from the backend API
const fetchCards = async () => {
  try {
    const response = await fetch('http://192.168.1.241:3000/api/cards');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    console.log('Fetched cards from API:', data); // Debugging log
    return Array.isArray(data) ? data : []; // Ensure response is an array
  } catch (error) {
    console.error('Error fetching cards:', error); // Debugging log
    return [];
  }
};

const HomeScreen = ({ route }) => {
  const { isGuest } = route.params || { isGuest: false };
  const { userData } = useUser();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnology, setSelectedTechnology] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const getCards = async () => {
      const fetchedCards = await fetchCards();
      setCards(fetchedCards);
    };
    getCards();
  }, []);

  const filteredCards = useMemo(() => {
    const filtered = cards.filter((card) => {
      const matchesTechnology = selectedTechnology ? card.Type?.toLowerCase() === selectedTechnology.toLowerCase() : true;
      const matchesCountry = selectedCountry ? card.country?.toLowerCase() === selectedCountry.toLowerCase() : true;
      const matchesSearch = card.title?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTechnology && matchesCountry && matchesSearch;
    });
    console.log('Filtered cards:', filtered); // Debugging log
    return filtered;
  }, [cards, selectedTechnology, selectedCountry, searchQuery]);

  const renderContent = () => {
    const filteredByType = filteredCards.filter((card) => card.Type === activeTab || activeTab === 'All');
    switch (activeTab) {
      case 'Rec':
        return <Rec cards={filteredByType} />;
      case 'Invest':
        return <Equity cards={filteredByType} />;
      case 'Loan':
        return filteredByType.map((card) => <Card key={card.id} card={card} />);
      default:
        return (
          <>
            <Rec cards={filteredByType.filter((card) => card.Type === 'Rec')} />
            <Equity cards={filteredByType.filter((card) => card.Type === 'Equity')} />
          </>
        );
    }
  };

  const TabButton = ({ label, icon, tabName }) => (
    <TouchableOpacity onPress={() => setActiveTab(tabName)} style={styles.tab}>
      <View style={styles.tabItem}>
        <Icon name={icon} size={20} color={'#99abaf'} />
        <Text style={[styles.tabText, activeTab === tabName && styles.activeTabText]}>{label}</Text>
      </View>
      {activeTab === tabName && <View style={styles.activeTabIndicator} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header />
        
        <View style={styles.tabContainer}>
          <TabButton label="All" icon="view-list" tabName="All" />
          <TabButton label="RECs" icon="clock-outline" tabName="Rec" />
          <TabButton label="Equity" icon="chart-pie" tabName="Invest" />
          <TabButton label="Loans" icon="percent" tabName="Loan" />
        </View>

        {renderContent()}
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
};

export default HomeScreen;
