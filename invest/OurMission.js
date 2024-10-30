import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const OurMission = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>DEMOCRATISING RENEWABLE ENERGY INVESTMENTS</Text>
      <Text style={styles.heading}>Our Mission</Text>
      <Text style={styles.description}>
        At Reneum Labs, our mission is to democratize access to renewable energy investments, making it possible for
        everyone to contribute to and benefit from a sustainable future. By leveraging innovative technologies and
        transparent processes, we empower investors to support renewable energy projects worldwide, unlocking capital,
        driving positive environmental impact, and earning sustainable returns. Join us in revolutionizing the
        investment landscape and building a greener, more resilient planet.
      </Text>
      <Text style={styles.description}>
        Leveraging innovative technologies and transparent processes, we enable retail investors to enter the
        renewables market and earn attractive yields of 8-12%. By releasing equity from existing renewable energy
        assets, project developers can quickly realise profits and reinvest in future projects, accelerating growth and
        ensuring ongoing innovation.
      </Text>
      <Text style={styles.boldText}>
        Join us in revolutionising the investment landscape, driving positive environmental impact, and building a
        greener, more resilient planet.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.releaseButton}>
          <Text style={styles.buttonText}>To Release Equity</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.investButton}>
          <Text style={styles.buttonText}>To Invest</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F4F8FC',
    flexGrow: 1,
  },
  title: {
    color: '#00A862',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    color: '#4F4F4F',
  },
  boldText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#4F4F4F',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  releaseButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '48%',
  },
  investButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '48%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OurMission;
