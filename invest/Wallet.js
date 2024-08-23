// Wallet.js
import React from 'react';
import { SafeAreaView, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, View } from 'react-native';
import FooterTabs from './components/footer'; // Ensure correct import path for FooterTabs

const WalletScreen = ({ navigation }) => {
  const balance = 6790.98;
  const cards = [
    { id: '1', type: 'Work Card', number: '**** 7798' },
    { id: '2', type: 'Travel Card', number: '**** 8900' },
  ];
  const transactions = [
    { id: '1', name: 'Dan', amount: -314 },
    { id: '2', name: 'Amanda', amount: 90 },
    { id: '3', name: 'Pete', amount: -19 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ImageBackground
          source={{ uri: 'https://t3.ftcdn.net/jpg/03/89/93/32/360_F_389933228_BPMlKUev7J1u8AhZNhWAwRQqmoYwLDIM.jpg' }}
          style={styles.cardBackground}
        >
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balance}>${balance.toFixed(2)}</Text>
        </ImageBackground>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Deposit')}>
            <Text style={styles.primaryButtonText}>Deposit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Withdraw')}>
            <Text style={styles.primaryButtonText}>Withdraw</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Home', { activeTab: 'Available' })}>
            <Text style={styles.primaryButtonText}>Invest</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Payment')}>
          <Text style={styles.secondaryButtonText}>Add Payment Method</Text>
        </TouchableOpacity>

        <View style={styles.accountContainer}>
          <Text style={styles.accountTitle}>My Account</Text>

          <Text style={styles.sectionTitle}>Cards</Text>
          {cards.map(card => (
            <View key={card.id} style={styles.card}>
              <Text style={styles.cardText}>{card.type}</Text>
              <Text style={styles.cardNumber}>{card.number}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Transactions</Text>
          {transactions.map(transaction => (
            <View key={transaction.id} style={styles.transaction}>
              <Text style={styles.transactionName}>{transaction.name}</Text>
              <Text style={transaction.amount < 0 ? styles.transactionAmountNegative : styles.transactionAmountPositive}>
                ${transaction.amount}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Include FooterTabs component */}
      <FooterTabs navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Light gray background for a modern look
  },
  scrollView: {
    flex: 1,
  },
  cardBackground: {
    marginTop: 10,
    width: '100%',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5, // Add shadow effect for elevation
  },
  balanceLabel: {
    fontSize: 20,
    color: '#FFF',
    textAlign: 'center',
  },
  balance: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: '#007BFF', // Updated color
    paddingVertical: 15,
    paddingHorizontal: 0,
    borderRadius: 25,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#007BFF', // Updated color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  accountContainer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
    elevation: 3, // Add shadow effect for elevation
  },
  accountTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333', // Darker color for text
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#007BFF', // Accent color for section titles
  },
  card: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2, // Add shadow effect for elevation
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
  cardNumber: {
    fontSize: 14,
    color: '#777',
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  transactionName: {
    fontSize: 16,
    color: '#333',
  },
  transactionAmountPositive: {
    fontSize: 16,
    color: '#28A745',
  },
  transactionAmountNegative: {
    fontSize: 16,
    color: '#DC3545',
  },
});

export default WalletScreen;
