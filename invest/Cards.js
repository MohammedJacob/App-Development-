import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ProgressBar, Card as PaperCard } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


// Equity Component
const Equity = () => {
  const [cards, setCards] = useState([]);
  const { socket } = useWebSocket();
  const navigation = useNavigation();

  useEffect(() => {
    // WebSocket Listener to get updates
    socket.on('portfolioUpdate', (updatedCards) => {
      setCards(updatedCards);
    });

    return () => {
      socket.off('portfolioUpdate');
    };
  }, [socket]);

  // Fetch cards from an API
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get('http://192.168.1.241:3000/api/cards');
        setCards(response.data);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, []);

  return (
    <FlatList
      data={cards}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <PaperCard style={styles.card}>
          <Image style={styles.image} source={{ uri: item.image }} />
          <Text style={styles.country}>{item.country}</Text>
          <Text style={styles.type}>{item.type}</Text>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.targetPrice}>Target: ${item.targetPrice}</Text>
          <ProgressBar progress={item.progress} color="#4CAF50" />
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Detail', { cardId: item.id })}
          >
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>
        </PaperCard>
      )}
    />
  );
};

// RecCard Component
const RecCard = () => {
  const [recCards, setRecCards] = useState([]);

  useEffect(() => {
    const fetchRecCards = async () => {
      try {
        const response = await axios.get('http://192.168.1.241:3000/api/RecsCard');
        setRecCards(response.data);
      } catch (error) {
        console.error('Error fetching recommended cards:', error);
      }
    };

    fetchRecCards();
  }, []);

  return (
    <FlatList
      data={recCards}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <PaperCard style={styles.card}>
          <Image style={styles.image} source={{ uri: item.image }} />
          <Text style={styles.country}>{item.type}</Text>
          <Text style={styles.type}>{item.location}</Text>
          <Text style={styles.price}>Energy Available: {item.energy_available}</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Show More</Text>
          </TouchableOpacity>
        </PaperCard>
      )}
    />
  );
};

// Common Styles
const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  country: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  type: {
    fontSize: 16,
    color: '#757575',
  },
  price: {
    fontSize: 16,
    color: '#4CAF50',
  },
  targetPrice: {
    fontSize: 16,
    color: '#FF9800',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default { Equity, RecCard };
