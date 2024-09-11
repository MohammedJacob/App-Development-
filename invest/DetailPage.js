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

  // State Management
  const [cardDetails, setCardDetails] = useState({
    numberOnCard: '',
    nameOnCard: '',
    cvv: '',
    expiryDate: '',
    investmentAmount: '',
  });
  const [investmentConfirmation, setInvestmentConfirmation] = useState('');

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

  const handleInvest = async () => {
    const { numberOnCard, nameOnCard, cvv, expiryDate, investmentAmount } = cardDetails;

    if (!numberOnCard || !nameOnCard || !cvv || !expiryDate || !investmentAmount) {
      Alert.alert('Input Error', 'Please fill out all fields.');
      return;
    }

    try {
      // Calculate the new price of the card after the investment
      const newPrice = (
        parseFloat(card.price.replace(/[^0-9.-]+/g, '')) +
        parseFloat(investmentAmount.replace(/,/g, ''))
      ).toFixed(2);

      // Update the card price
      const response = await fetch(`http://192.168.1.241:3000/api/cards/${card.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: newPrice }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      // Save investment details to the Patients table
      const investmentDetails = {
        email: userData.email_address,
        card_id: card.id,
        amount_invested: parseFloat(investmentAmount.replace(/,/g, '')),
      };

      const patientResponse = await fetch(`http://192.168.1.241:3000/api/Patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(investmentDetails),
      });

      if (!patientResponse.ok) throw new Error(`HTTP error! status: ${patientResponse.status}`);

      Alert.alert('Success', 'Investment saved successfully!');
      setInvestmentConfirmation(`Invested in "${card.title}" with amount: $${investmentAmount}`);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to save the investment. Please try again later.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <PaperCard style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderContent}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardPrice}>${currentPrice}</Text>
              <Text style={styles.cardTarget}>Target: ${targetPrice}</Text>
            </View>
            <Image source={{ uri: card.image }} style={styles.image} />
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${fundedPercentage}%` }]} />
          </View>
          <PaperCard.Content style={styles.cardContent}>
            <View style={styles.cardRow}>
              {['return_value', 'investment', 'yield'].map((key) => (
                <React.Fragment key={key}>
                  <View style={styles.cardColumn}>
                    <Text style={styles.cardValue}>{card[key] ? card[key].split(': ')[1] : 'N/A'}</Text>
                    <Text style={styles.cardLabel}>{key.replace(/^\w/, (c) => c.toUpperCase())}</Text>
                  </View>
                  {key !== 'yield' && <View style={styles.verticalDivider} />}
                </React.Fragment>
              ))}
            </View>
          </PaperCard.Content>
        </PaperCard>

        {/* Input Section */}
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
            (!cardDetails.numberOnCard || !cardDetails.nameOnCard || !cardDetails.cvv || !cardDetails.expiryDate || !cardDetails.investmentAmount) && { backgroundColor: '#ccc' },
          ]}
          onPress={handleInvest}
          disabled={!cardDetails.numberOnCard || !cardDetails.nameOnCard || !cardDetails.cvv || !cardDetails.expiryDate || !cardDetails.investmentAmount}
        >
          <Text style={styles.investButtonText}>Invest</Text>
        </TouchableOpacity>

        {investmentConfirmation ? (
          <Text style={styles.confirmationText}>{investmentConfirmation}</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles (Consider separating this into its own file)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollViewContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardHeaderContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardPrice: {
    fontSize: 18,
    color: 'green',
  },
  cardTarget: {
    fontSize: 16,
    color: '#777',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'green',
  },
  cardContent: {
    padding: 10,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardLabel: {
    fontSize: 12,
    color: '#777',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
  inputSection: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  investButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  investButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmationText: {
    color: 'green',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DetailPage;
