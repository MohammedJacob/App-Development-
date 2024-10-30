import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const RecCard = ({ title, location, energy, onPress }) => {
  const imageUri = "https://www.windsystemsmag.com/wp-content/uploads/2019/10/1019-CW-I1.jpg";

  return (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderIcon}>🌬️ WIND</Text>
        <Text style={styles.cardHeaderLocation}>{location}</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.cardImage} />
        <View style={styles.descriptionBar}>
          <Text style={styles.cardTitle}>{title}</Text>
          <View style={styles.purchaseInfo}>
            <Text style={styles.purchaseStatus}>Available to Purchase</Text>
            <Text style={styles.energyAvailable}>{energy} 1000 MWh</Text>
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
};

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f4f8fc',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
    bottom:15,
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
    width:'60%',
    borderRadius: 5,
  },
  infoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RecCard;
