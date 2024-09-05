import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { Card as PaperCard } from 'react-native-paper';

const DetailPage = ({ route, navigation }) => {
  const { card } = route.params;
  const [amount, setAmount] = useState('');
  const [numberOnCard, setNumberCard] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');

  const currentPrice = parseFloat(card.price.replace(/[^0-9.-]+/g, ''));
  const targetPrice = parseFloat(card.targetPrice.replace(/[^0-9.-]+/g, ''));
  const remainingAmount = targetPrice - currentPrice;
  const fundedPercentage = targetPrice ? Math.min(100, (currentPrice / targetPrice) * 100) : 0;

  const handleInvest = async () => {
    if (parseFloat(investmentAmount) > remainingAmount) {
      Alert.alert('Amount entered exceeds the remaining target price');
      return;
    }
    if (!nameOnCard || !cvv || !expiryDate || !investmentAmount) {
      Alert.alert('Input Error', 'Please fill out all fields.');
      return;
    }

    try {
      const newPrice = (currentPrice + parseFloat(investmentAmount)).toFixed(2);

      const response = await fetch(`http://192.168.1.241:3000/api/cards/${card.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: newPrice }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const updatedCard = await response.json();
      Alert.alert('Success', 'Card price updated successfully.');
      navigation.navigate('Home', { card: updatedCard });
    } catch (error) {
      console.error('Error updating card price:', error);
      Alert.alert('Update Error', 'Failed to update card price. Please try again later.');
    }
  };

  const formatCardNumber = (text) => {
    const digits = text.replace(/\D/g, '');
    const limitedDigits = digits.slice(0, 16);
    const formatted = limitedDigits.replace(/(.{4})/g, '$1 ').trim();
    return formatted;
  };

  const handleCardNumberChange = (text) => {
    const formattedText = formatCardNumber(text);
    setNumberCard(formattedText);
  };

  const handleCVVChange = (text) => {
    const formattedText = text.replace(/[^0-9]/g, '').slice(0, 3);
    setCvv(formattedText);
  };

  const handleExpiryDateChange = (text) => {
    let formattedText = text.replace(/\D/g, '').slice(0, 4);
    if (formattedText.length > 2) {
      formattedText = `${formattedText.slice(0, 2)}/${formattedText.slice(2)}`;
    }

    const [mm, yy] = formattedText.split('/');
    if (mm && parseInt(mm) > 12) {
      formattedText = `12/${yy || ''}`;
    }

    setExpiryDate(formattedText);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <PaperCard style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderContent}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardPrice}>{card.price}</Text>
              <Text style={styles.cardTarget}>{card.targetPrice}</Text>
            </View>
            <Image source={{ uri: card.image }} style={styles.image} />
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${fundedPercentage}%` }]} />
          </View>
          <PaperCard.Content style={styles.cardContent}>
            <View style={styles.cardRow}>
              {['return_value', 'investment', 'yield'].map(key => (
                <React.Fragment key={key}>
                  <View style={styles.cardColumn}>
                    <Text style={styles.cardValue}>{card[key] ? card[key].split(': ')[1] : 'N/A'}</Text>
                    <Text style={styles.cardLabel}>{key.replace(/^\w/, c => c.toUpperCase())}</Text>
                  </View>
                  {key !== 'yield' && <View style={styles.verticalDivider} />}
                </React.Fragment>
              ))}
            </View>
          </PaperCard.Content>
        </PaperCard>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Enter card details:</Text>
          <TextInput
            style={styles.input}
            value={nameOnCard}
            onChangeText={text => setNameOnCard(text)}
            placeholder="Full name on card"
          />
          <TextInput
            style={styles.input}
            value={numberOnCard}
            onChangeText={handleCardNumberChange}
            keyboardType="numeric"
            placeholder="Card number"
            maxLength={19}
          />
          <View style={styles.rowContainer}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="MM/YY"
              value={expiryDate}
              onChangeText={handleExpiryDateChange}
              keyboardType="numeric"
              maxLength={5}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="CVV"
              value={cvv}
              onChangeText={handleCVVChange}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
          <Text style={styles.inputLabel}>Enter Investment Amount:</Text>
          <TextInput
            style={styles.input}
            value={investmentAmount}
            onChangeText={text => setInvestmentAmount(text)}
            keyboardType="numeric"
            placeholder="0.00"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.investButton,
            (!numberOnCard || !nameOnCard || !cvv || !expiryDate || !investmentAmount) && { backgroundColor: '#ccc' }
          ]}
          onPress={handleInvest}
          disabled={!numberOnCard || !nameOnCard || !cvv || !expiryDate || !investmentAmount}
        >
          <Text style={styles.investButtonText}>Invest</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  card: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
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
    backgroundColor: '#fff',
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cardHeaderContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  cardPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34c659',
  },
  cardTarget: {
    fontSize: 14,
    color: '#888',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#34c659',
  },
  cardContent: {
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardColumn: {
    flex: 1,
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardLabel: {
    fontSize: 14,
    color: '#888',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#ccc',
    height: '100%',
    marginHorizontal: 8,
  },
  inputSection: {
    paddingHorizontal: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  investButton: {
    backgroundColor: '#34c659',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  investButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DetailPage;
