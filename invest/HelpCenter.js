import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

const HelpCenter = () => {
  const navigation = useNavigation(); // Initialize navigation

  // Function to handle email link
  const handleEmailPress = () => {
    const email = 'contact@reneum.com';
    const subject = 'Support Inquiry';
    const mailTo = `mailto:${email}?subject=${subject}`;
    Linking.openURL(mailTo).catch((err) => console.error('Error opening email client', err));
  };

  // Reusable Card Component
  const Card = ({ title, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Help Center</Text>
      <Card title="Email Us" onPress={handleEmailPress} />
      <Card title="Road Map" onPress={() => navigation.navigate('Roadmap')} />
      <Card title="Our Mission" onPress={() => navigation.navigate('OurMission')} />
      <Card title="FAQ" onPress={() => navigation.navigate('FAQ')} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    width: '100%',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

export default HelpCenter;
