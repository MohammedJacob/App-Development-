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
              </View>
            </View>
          </View>
  
          {/* Price section - moved above the progress bar */}
          <View style={styles.priceContainer}>
            <Text style={styles.cardPrice}>${currentPrice}</Text>
            <Text style={styles.cardTarget}>${targetPrice}</Text>
          </View>
  
          {/* Progress Bar and Image Section */}
          <View style={styles.progressBarAndImageContainer}>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBar, { width: `${fundedPercentage}%` }]} />
              </View>
            </View>
  
            {/* Image to the right of the progress bar */}
            <Image source={{ uri: card.image }} style={styles.image} />
          </View>
          <Text style={styles.percentageText}>{fundedPercentage.toFixed(0)}%</Text>
  
          {/* Removed the old priceContainer section here */}
  
          <PaperCard.Content style={styles.cardContent}>
            {/* Investment details */}
            <View style={styles.investmentDetailContainer}>
              <View style={styles.investmentDetail}>
                <Text style={styles.label}>5 year total return</Text>
                <Text style={styles.value}>
                  {card.return_value ? card.return_value.split(': ')[1] : 'N/A'}
                </Text>
              </View>
  
              <View style={styles.investmentDetail}>
                <Text style={styles.label}>Yearly investment return</Text>
                <Text style={styles.value}>
                  {card.investment ? card.investment.split(': ')[1] : 'N/A'}
                </Text>
              </View>
  
              <View style={styles.investmentDetail}>
                <Text style={styles.label}>Projected net yield</Text>
                <Text style={styles.value}>
                  {card.yield ? card.yield.split(': ')[1] : 'N/A'}
                </Text>
              </View>
            </View>
  
            {/* Left-aligned button */}
            <Button mode="contained" style={styles.detailButtonLeft} onPress={onPress}>
              Show more information
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
  const [webSocket, setWebSocket] = useState(null);

  // WebSocket setup
  useEffect(() => {
    const ws = new WebSocket('ws://192.168.1.241:3000'); // WebSocket server address

    ws.onopen = () => {
      console.log('WebSocket connected');
      // Optionally send an initial message to the server
      ws.send(JSON.stringify({ type: 'subscribe', userId: userData?.id }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'portfolioUpdate') {
        console.log('Portfolio update received:', message.data);
        setCards(message.data); // Update the cards state with new portfolio data
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWebSocket(ws);

    return () => {
      ws.close();
    };
  }, [userData]);

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
    color: '#1f2545', // Darker text color for better readability
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
    marginVertical: -25, // Reduce vertical margins to lessen the spa
    top:15,
    fontWeight: '900',
    color: '#1f2545', // Darker title text color
  },

  progressBarAndImageContainer: {
    flexDirection: 'row', // Align items horizontally
    justifyContent: 'space-between', // Space between progress bar and image
    alignItems: 'center', // Align them vertically in the center 
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Places the prices on opposite sides
    width:'75%',
    top:30
  }, 

  cardPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#34c659', // Current price color (green)
    marginLeft:'5%'

  },
  cardTarget: {
    fontSize: 14,
    color: '#888', // Target price color (gray)
    marginRight:'5%' // Aligns target price to the right
  },
  
  investmentDetailContainer: {
    backgroundColor: '#eef6ff', // Light blue background color
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  investmentDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    marginBottom: 8, // spacing between rows
  },
  label: {
    fontSize: 14,
    color: '#777', // lighter color for the label
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000', // bold and dark color for the value
  },
  detailButtonLeft: {
    backgroundColor: '#4088f4',
    alignSelf: 'flex-start', // Align button to the left
  },

  
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    justifyContent:'flex-end',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width:'75%',
    paddingHorizontal: 16,
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
    marginLeft: '5%',
    fontSize: 12,
    color: '#888',
    bottom:25
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
});

export default HomeScreen;
