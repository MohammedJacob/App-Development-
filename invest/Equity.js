import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Card as PaperCard, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';  // Import the hook
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
    console.error('Error fetching cards:', error);
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
        (parseFloat(currentPrice.replace(/[^0-9.-]+/g, '')) / parseFloat(targetPrice.replace(/[^0-9.-]+/g, ''))) * 100
      )
    : 0;

  return (
    <TouchableOpacity onPress={onPress}>
      <PaperCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardCountry}>🤩{card.Type}</Text>
          <Text style={styles.cardCountry}>{card.country}</Text>
        </View>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderContent}>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>{card.title}</Text>
            </View>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.cardPrice}>${currentPrice}</Text>
          <Text style={styles.cardTarget}>${targetPrice}</Text>
        </View>
        <View style={styles.progressBarAndImageContainer}>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBar, { width: `${fundedPercentage}%` }]} />
            </View>
          </View>
          <Image source={{ uri: card.image }} style={styles.image} />
        </View>
        <Text style={styles.percentageText}>{fundedPercentage.toFixed(0)}%</Text>
        <PaperCard.Content style={styles.cardContent}>
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
          <Button mode="contained" style={styles.detailButtonLeft} onPress={onPress}>
            Show more information
          </Button>
        </PaperCard.Content>
      </PaperCard>
    </TouchableOpacity>
  );
};

const Equity = () => {
  const { userData } = useUser();
  const [cards, setCards] = useState([]);
  const navigation = useNavigation();  // Use the hook to access navigation

  useEffect(() => {
    const ws = new WebSocket('ws://192.168.1.241:3000');
    ws.onopen = () => {
      console.log('WebSocket connected');
      ws.send(JSON.stringify({ type: 'subscribe', userId: userData?.id }));
    };
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'portfolioUpdate') {
        console.log('Portfolio update received:', message.data);
        setCards(message.data);
      }
    };
    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close(); // Cleanup the WebSocket connection on component unmount
    };
  }, [userData]);

  useEffect(() => {
    const loadCards = async () => {
      const fetchedCards = await fetchCards();
      setCards(fetchedCards);
    };
    loadCards();
  }, []);

  const handleCardPress = (card) => {
    if (!navigation) {
      console.error('Navigation is undefined');
      return;
    }
    navigation.navigate('Details', { card, userData });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {cards.map((card) => (
          <Card key={card.id} card={card} onPress={() => handleCardPress(card)} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
export default Equity;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#f3f9fa',
    },
    scrollView: {
      flex: 1,
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
      padding: 10,
    },
    cardHeaderText: {
      marginBottom: 8,
    },
    cardTitle: {
      fontSize: 28,
      fontWeight: "900",
      color: '#1f2545', // Darker title text color
    },
    cardcountry:{
      fontSize: 15,
      color: '#777', 
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
      width: 70,
      height: 70,
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
   
  });