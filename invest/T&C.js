// Wallet.js (TandCScreen)
import React from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For arrow icon
import { useNavigation } from '@react-navigation/native';

const TandCScreen = () => {
  const navigation = useNavigation();

  const handleAccept = () => {
    navigation.navigate('Onboarding'); // Navigating to Home Screen on Accept button click
  };

  const handleTermsPress = () => {
    navigation.navigate('TandCdetails'); // Navigating to Terms details when the card is clicked
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Terms and Conditions</Text>
      <View style={styles.section}>
        <Text style={styles.subHeaderText}>Accept terms and conditions</Text>
        <Text style={styles.descriptionText}>
          To continue please read through and accept our terms and conditions
        </Text>

        <TouchableOpacity style={styles.card} onPress={handleTermsPress}>
          <View style={styles.cardContent}>
            <Ionicons name="document-text-outline" size={24} color="green" />
            <Text style={styles.cardText}>Terms and Conditions</Text>
          </View>
          <Ionicons name="arrow-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Accept Button */}
      <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
        <Text style={styles.acceptButtonText}>Accept</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    marginTop:80, // Add padding at the top to space content from the screen's edge
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20, // Margin below the title
  },
  section: {
    backgroundColor: '#f6f7f9', // Light background for the section
    padding: 15,
    borderRadius: 10,
    marginBottom: 20, // Margin below the section
  },
  subHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  acceptButton: {
    backgroundColor: '#000', // Dark color for the button
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent:'flex-end',
    alignItems: 'center',
    marginTop: '100%', 
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TandCScreen;
