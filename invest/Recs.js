import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const RecCard = () => {
  const [recCards, setRecCards] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRecsCardData = async () => {
      try {
        const response = await axios.get('http://192.168.1.241:3000/api/RecsCard');
        setRecCards(response.data);
      } catch (error) {
        console.error('Error fetching RecsCard data:', error);
      }
    };

    fetchRecsCardData();
  }, []);

  const handlePress = (title, location, energy) => {
    navigation.navigate('Details', { title, location, energy });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item.title, item.location, item.energy_available)} style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderIcon}>{item.type.toUpperCase()}</Text>
        <Text style={styles.cardHeaderLocation}>{item.location}</Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.descriptionBar}>
          <View style={styles.purchaseInfo}>
            <Text style={styles.purchaseStatus}>Available to Purchase</Text>
            <Text style={styles.energyAvailable}>{item.energy_available} MWh</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <TouchableOpacity style={styles.infoButton}>
          <Text style={styles.infoButtonText}>Show more information</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={recCards}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    paddingStart:15,
    paddingEnd:15,
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
    backgroundColor: '#f4f8fc',
  },
  cardHeaderIcon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#50b5ff',
  },
  cardHeaderLocation: {
    fontSize: 14,
    color: '#888',
  },
  imageContainer: {
    alignItems: 'center',
  },
  cardImage: {
    width: '95%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  descriptionBar: {
    position: 'absolute',
    bottom: 5,
    width: '90%',
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    borderRadius: 8,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  purchaseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical:10,
    paddingHorizontal: 10,
  },
  purchaseStatus: {
    fontSize: 14,
    fontWeight: '900',
    color: '#333',
  },
  energyAvailable: {
    fontSize: 14,
    fontWeight: '900',
    color: '#00c853',
  },
  cardContent: {
    padding: 10,
  },
  infoButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '65%',
    borderRadius: 5,
  },
  infoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RecCard;
