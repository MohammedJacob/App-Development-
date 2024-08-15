// Wallet.js
import React from 'react';
import { SafeAreaView, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, View } from 'react-native';
import FooterTabs from './components/footer'; // Ensure correct import path for FooterTabs

const WalletScreen = ({ navigation }) => {
  const balance = 6790.98;
  const cards = [
    { id: '1', type: 'Work card', number: '**** 7798' },
    { id: '2', type: 'Travel card', number: '**** 8900' },
  ];
  const transactions = [
    { id: '1', name: 'Dan', amount: -314 },
    { id: '2', name: 'Amanda', amount: 90 },
    { id: '3', name: 'Pete', amount: -19 },
  ];

  return (
    
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
      <ImageBackground
        source={{ uri: 'https://t3.ftcdn.net/jpg/03/89/93/32/360_F_389933228_BPMlKUev7J1u8AhZNhWAwRQqmoYwLDIM.jpg' }}
        style={styles.cardBackground}
      >
        <Text style={styles.balanceLabel}>Current balance</Text>
        <Text style={styles.balance}>${balance.toFixed(2)}</Text>
      </ImageBackground>

      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Deposit')}>
  <Text style={styles.buttonText}>Deposit</Text>
</TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Withdraw')}>
          <Text style={styles.buttonText}>Withdraw</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home', { activeTab: 'Available' })}>
          <Text style={styles.buttonText}>Invest</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Payment')} // Navigate to 'Home' screen
      >
        <Text style={styles.buttonText}>Add payment method</Text>
      </TouchableOpacity>


        <View style={styles.accountContainer}>
          <Text style={styles.accountTitle}>My account</Text>

          <Text style={styles.sectionTitle}>Cards</Text>
          {cards.map(card => (
            <View key={card.id} style={styles.card}>
              <Text style={styles.cardText}>{card.type} / {card.number}</Text>
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
    backgroundColor:'#FFF'
  },
  cardBackground: {
    marginTop: 5,
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  accountContainer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 20,
  },
  accountTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  transactionName: {
    fontSize: 16,
  },
  transactionAmountPositive: {
    fontSize: 16,
    color: 'green',
  },
  transactionAmountNegative: {
    fontSize: 16,
    color: 'red',
  },
});

export default WalletScreen;
