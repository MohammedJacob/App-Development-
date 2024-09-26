import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Card as PaperCard, Button } from 'react-native-paper';
import Footer from './components/footer'; // Ensure the correct import path
import SettingsImage from './assets/settings.png';
import SearchIcon from './assets/SearchIcon.png';
import { useUser } from './UserContext'; // Import useUser hook

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
    console.error('Error fetching cards:', error);
    Alert.alert('Network Error', 'Failed to load data. Please try again later.');
    return [];
  }
};

// Card component
const Card = ({ card, onPress }) => {
  const currentPrice = formatPrice(card.price);
  const targetPrice = formatPrice(card.targetPrice);

  const fundedPercentage = parseFloat(targetPrice.replace(/[^0-9.-]+/g, ''))
    ? Math.min(
        100,
        (parseFloat(currentPrice.replace(/[^0-9.-]+/g, '')) / parseFloat(targetPrice.replace(/[^0-9.-]+/g, ''))) *
          100
      )
    : 0;

  return (
    <TouchableOpacity onPress={onPress}>
      <PaperCard style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderContent}>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardPrice}>{currentPrice}</Text>
            </View>
            <Text style={styles.cardTarget}>{targetPrice}</Text>
          </View>
          <Image source={{ uri: card.image }} style={styles.image} />
        </View>

        {/* Progress Bar Section */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBar, { width: `${fundedPercentage}%` }]} />
          </View>
          <Text style={styles.percentageText}>{fundedPercentage.toFixed(0)}%</Text>
        </View>

        <PaperCard.Content style={styles.cardContent}>
          {/* Updated Layout - Stacked items */}
          <View style={styles.cardStackedRow}>
            <Text style={styles.cardValue}>{card.return_value ? card.return_value.split(': ')[1] : 'N/A'}</Text>
            <Text style={styles.cardLabel}>Return Value</Text>
          </View>

          <View style={styles.cardStackedRow}>
            <Text style={styles.cardValue}>{card.investment ? card.investment.split(': ')[1] : 'N/A'}</Text>
            <Text style={styles.cardLabel}>Investment</Text>
          </View>

          <View style={styles.cardStackedRow}>
            <Text style={styles.cardValue}>{card.yield ? card.yield.split(': ')[1] : 'N/A'}</Text>
            <Text style={styles.cardLabel}>Yield</Text>
          </View>

          {/* Left-aligned button */}
          <Button mode="contained" style={styles.detailButtonLeft} onPress={onPress}>
            View Details
          </Button>
        </PaperCard.Content>
      </PaperCard>
    </TouchableOpacity>
  );
};

const HomeScreen = ({ navigation, route }) => {
  const { isGuest } = route.params || { isGuest: false }; // Default to false if not provided
  const { userData } = useUser(); // Access userData from context
  const [activeTab, setActiveTab] = useState('Available');
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const loadCards = async () => {
      const fetchedCards = await fetchCards();
      setCards(fetchedCards);
    };

    loadCards();

    const interval = setInterval(loadCards, 1000);

    return () => clearInterval(interval);
  }, []);

  const filterCards = (cards) => {
    const getPrice = (price) => parseFloat(price.replace(/[^0-9.-]+/g, ''));
    return cards.filter((card) => {
      const currentPrice = getPrice(card.price);
      const targetPrice = getPrice(card.targetPrice);
      return activeTab === 'Available' ? currentPrice < targetPrice : currentPrice >= targetPrice;
    });
  };

  const handleCardPress = (card) => {
    if (isGuest) {
      Alert.alert('Login Required', 'Log into an account to buy shares.');
    } else {
      navigation.navigate('Details', { card, userData });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Sites</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Search')} style={styles.iconButton}>
            <Image source={SearchIcon} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.iconButton}>
            <Image source={SettingsImage} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabContainer}>
        {['Available', 'Sold'].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tab}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            {activeTab === tab && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView}>
        {filterCards(cards).map((card) => (
          <Card key={card.id} card={card} onPress={() => handleCardPress(card)} />
        ))}
      </ScrollView>
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light background color for the whole screen
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff', // Background color for the header
    borderBottomWidth: 1, // Bottom border for the header
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Darker text color for better readability
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tab: {
    padding: 16,
  },
  tabText: {
    fontSize: 16,
    color: '#555', // Slightly lighter text color for inactive tabs
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#000',
  },
  activeTabIndicator: {
    height: 3,
    backgroundColor: '#34c659',
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff', // White background to engulf the entire card
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cardHeaderContent: {
    flex: 1,
  },
  cardHeaderText: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333', // Darker title text color
  },
  cardPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34c659',
  },
  cardTarget: {
    fontSize: 14,
    color: '#888',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginLeft: 16,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#34c659',
    borderRadius: 4,
  },
  percentageText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#888',
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardStackedRow: {
    marginBottom: 8, // Add spacing between stacked items
    alignItems: 'flex-start', // Align text to the left
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardLabel: {
    fontSize: 12,
    color: '#888',
  },
  detailButtonLeft: {
    marginTop: 16,
    backgroundColor: '#34c659',
    alignSelf: 'flex-start', // Align button to the left
  },
});
