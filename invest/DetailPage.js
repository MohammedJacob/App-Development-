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
  Alert,
} from 'react-native';
import { useUser } from './UserContext'; // Import useUser hook
import { Card as PaperCard } from 'react-native-paper';

// Utility Functions
const formatPrice = (price) => {
  const number = parseFloat(price.replace(/[^0-9.-]+/g, ''));
  return isNaN(number) ? 'N/A' : number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatNumberWithCommas = (number) => {
  const [integer, decimal] = number.split('.');
  return decimal ? `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decimal}` : integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const DetailPage = ({ route, navigation }) => {
  const { card } = route.params;
  const { userData } = useUser(); // Access user data from context

  // Log user data to verify if user_id is set correctly
  console.log('User Data:', userData);

  // State Management
  const [cardDetails, setCardDetails] = useState({
    numberOnCard: '',
    nameOnCard: '',
    cvv: '',
    expiryDate: '',
    investmentAmount: '',
  });

  // Derived values
  const currentPrice = formatPrice(card.price);
  const targetPrice = formatPrice(card.targetPrice);
  const remainingAmount = parseFloat(card.targetPrice.replace(/[^0-9.-]+/g, '')) - parseFloat(card.price.replace(/[^0-9.-]+/g, ''));
  const fundedPercentage = Math.min(100, (parseFloat(card.price.replace(/[^0-9.-]+/g, '')) / parseFloat(card.targetPrice.replace(/[^0-9.-]+/g, ''))) * 100) || 0;

  // Input handlers
  const handleInputChange = (field, value) => {
    setCardDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormattedInputChange = (field, formatFunction) => (text) => {
    const formattedText = formatFunction(text);
    handleInputChange(field, formattedText);
  };

  const handleCardNumberChange = handleFormattedInputChange('numberOnCard', (text) => {
    const digits = text.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  });

  const handleCVVChange = handleFormattedInputChange('cvv', (text) => text.replace(/[^0-9]/g, '').slice(0, 3));

  const handleExpiryDateChange = handleFormattedInputChange('expiryDate', (text) => {
    let formattedText = text.replace(/\D/g, '').slice(0, 4);
    if (formattedText.length > 2) formattedText = `${formattedText.slice(0, 2)}/${formattedText.slice(2)}`;
    const [mm, yy] = formattedText.split('/');
    return mm && parseInt(mm) > 12 ? `12/${yy || ''}` : formattedText;
  });

  const handleInvestmentAmountChange = (text) => {
    const formattedText = text.replace(/[^0-9.]/g, '');
    const value = parseFloat(formattedText);

    if (!isNaN(value)) {
      const newAmount = value > remainingAmount ? remainingAmount.toFixed(2) : formattedText;
      handleInputChange('investmentAmount', formatNumberWithCommas(newAmount));
    } else {
      handleInputChange('investmentAmount', '');
    }
  };

  // Function to navigate to Home page
  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  const handleInvest = async () => {
    const { numberOnCard, nameOnCard, cvv, expiryDate, investmentAmount } = cardDetails;
  
    if (!numberOnCard || !nameOnCard || !cvv || !expiryDate || !investmentAmount) {
      Alert.alert('Input Error', 'Please fill out all fields.');
      return;
    }
  
    if (!userData || !userData.id) {
      Alert.alert('Authentication Error', 'User is not authenticated. Please log in.');
      return;
    }
  
    try {
      const newPrice = (parseFloat(card.price.replace(/[^0-9.-]+/g, '')) + parseFloat(investmentAmount.replace(/,/g, ''))).toFixed(2);
  
      const updateResponse = await fetch(`http://192.168.1.241:3000/api/cards/${card.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: newPrice }),
      });
  
      if (!updateResponse.ok) throw new Error(`HTTP error! status: ${updateResponse.status}`);
  
      const investmentDetails = {
        user_id: userData.id,
        card_id: card.id,
        amount_invested: parseFloat(investmentAmount.replace(/,/g, '')),
        investment_date: new Date().toISOString(),
        invested_stock: card.title,  // Add card title as invested_stock
      };
  
      const investmentResponse = await fetch(`http://192.168.1.241:3000/api/investments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(investmentDetails),
      });
  
      if (!investmentResponse.ok) throw new Error(`HTTP error! status: ${investmentResponse.status}`);
  
      Alert.alert('Success', 'Investment saved successfully!');
      navigateToHome();
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to save the investment. Please try again later.');
    }
  };
  

  
  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Yield Information */}
        <View style={styles.yieldInfoContainer}>
          <Text style={styles.cardValue}>{currentPrice}</Text>
          <Text style={styles.cardTarget}>Target: {targetPrice}</Text>
          <Text style={styles.cardTarget}>Remaining: {formatPrice(remainingAmount.toFixed(2))}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${fundedPercentage}%` }]} />
          </View>
          <Text style={styles.progressPercentage}>{`${fundedPercentage.toFixed(0)}% Funded`}</Text>
        </View>

        {/* Card Section */}
        <PaperCard style={styles.card}>
          <Image source={{ uri: card.image }} style={styles.image} />
          <Text style={styles.cardTitle}>{card.title}</Text>
        </PaperCard>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Enter card details:</Text>
          <TextInput
            style={styles.input}
            value={cardDetails.nameOnCard}
            onChangeText={(text) => handleInputChange('nameOnCard', text)}
            placeholder="Full name on card"
          />
          <TextInput
            style={styles.input}
            value={cardDetails.numberOnCard}
            onChangeText={handleCardNumberChange}
            keyboardType="numeric"
            placeholder="Card number"
            maxLength={19}
          />
          <View style={styles.rowContainer}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="MM/YY"
              value={cardDetails.expiryDate}
              onChangeText={handleExpiryDateChange}
              keyboardType="numeric"
              maxLength={5}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="CVV"
              value={cardDetails.cvv}
              onChangeText={handleCVVChange}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
          <Text style={styles.inputLabel}>Enter Investment Amount:</Text>
          <TextInput
            style={styles.input}
            value={cardDetails.investmentAmount}
            onChangeText={handleInvestmentAmountChange}
            keyboardType="numeric"
            placeholder="0.00"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.investButton,
            (!cardDetails.numberOnCard || !cardDetails.nameOnCard || !cardDetails.cvv || !cardDetails.expiryDate || !cardDetails.investmentAmount) && { backgroundColor: 'gray' }
          ]}
          onPress={handleInvest}
          disabled={!cardDetails.numberOnCard || !cardDetails.nameOnCard || !cardDetails.cvv || !cardDetails.expiryDate || !cardDetails.investmentAmount}
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
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  yieldInfoContainer: {
    marginBottom: 20,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  cardTarget: {
    fontSize: 16,
    color: '#757575',
  },
  progressBarContainer: {
    marginVertical: 20,
  },
  progressBar: {
    height: 20,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressPercentage: {
    textAlign: 'right',
    marginTop: 5,
  },
  card: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  investButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  investButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DetailPage;
