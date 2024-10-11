import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  View,
  Linking,
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

  // Derived values
  const currentPrice = formatPrice(card.price);
  const targetPrice = formatPrice(card.targetPrice);
  const remainingAmount = parseFloat(card.targetPrice.replace(/[^0-9.-]+/g, '')) - parseFloat(card.price.replace(/[^0-9.-]+/g, ''));
  const fundedPercentage = Math.min(100, (parseFloat(card.price.replace(/[^0-9.-]+/g, '')) / parseFloat(card.targetPrice.replace(/[^0-9.-]+/g, ''))) * 100) || 0;

  // Handle file click - open the file URL in the browser or appropriate app
  const openFile = (fileUrl) => {
    if (fileUrl) {
      Linking.canOpenURL(fileUrl)
        .then((supported) => {
          if (supported) {
            Linking.openURL(fileUrl);
          } else {
            console.log('Cannot open URL: ', fileUrl);
            alert('Sorry, unable to open this file.');
          }
        })
        .catch((err) => console.error('Error opening file:', err));
    } else {
      alert('No files available to open.');
    }
  };

  const filesLinks = card.Files ? card.Files.split(',').map(file => file.trim()) : []; // Split by comma and trim spaces

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
        invested_stock: card.title,
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
      <Text style={styles.cardTitle}>{card.title}</Text>
        {/* Yield Information */}
        <View style={styles.yieldInfoContainer}>
          <Text style={styles.cardValue}>${currentPrice}</Text>
          <Text style={styles.cardTarget}>$`{targetPrice}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${fundedPercentage}%` }]} />
          </View>
          <Text style={styles.progressPercentage}>{`${fundedPercentage.toFixed(0)}% Funded`}</Text>
        </View>

        <PaperCard.Content style={styles.cardContent}>
            {/* Investment details */}
            <View style={styles.investmentDetailContainer}>
              <View style={styles.investmentDetail}>
                <Text style={styles.label}>5 year total return</Text>
                <Text style={styles.value}>
                  {card.return_value ? card.return_value.split(': ')[1] : 'N/A'}
                </Text>
              </View>
  
              <View style={styles.investmentDetail}>
                <Text style={styles.label}>Yearly investment return</Text>
                <Text style={styles.value}>
                  {card.investment ? card.investment.split(': ')[1] : 'N/A'}
                </Text>
              </View>
  
              <View style={styles.investmentDetail}>
                <Text style={styles.label}>Projected net yield</Text>
                <Text style={styles.value}>
                  {card.yield ? card.yield.split(': ')[1] : 'N/A'}
                </Text>
              </View>
              </View>
              </PaperCard.Content>
        

        
        {/* Investment Input Section */}
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
            placeholder="Card number"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={cardDetails.expiryDate}
            onChangeText={handleExpiryDateChange}
            placeholder="Expiry date (MM/YY)"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={cardDetails.cvv}
            onChangeText={handleCVVChange}
            placeholder="CVV"
            keyboardType="numeric"
            secureTextEntry={true}
          />

          {/* Investment Amount */}
          <Text style={styles.inputLabel}>Investment Amount:</Text>
          <TextInput
            style={styles.input}
            value={cardDetails.investmentAmount}
            onChangeText={handleInvestmentAmountChange}
            placeholder="Amount"
            keyboardType="numeric"
          />

          {/* Invest Button */}
          <TouchableOpacity style={styles.investButton} onPress={handleInvest}>
            <Text style={styles.investButtonText}>proceed with payment</Text>
          </TouchableOpacity>

        {/* Card Section */}
        <PaperCard style={styles.card}>
          <Image source={{ uri: card.image }} style={styles.image} />
        </PaperCard>


        {/* File Link Section */}
        {filesLinks.length > 0 ? (
          filesLinks.map((fileUrl, index) => (
            <TouchableOpacity key={index} onPress={() => openFile(fileUrl)} style={styles.filesContainer}>
              <Icon name="document-outline" size={24} color="#007AFF" />
              <Text style={styles.filesSection}>File {index + 1}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.filesSection}>No files available</Text>
        )}

        {/* Description */}
        <Text style={styles.description}>
          {card.description}
        </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    padding: 16,
  },
  yieldInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '900',
    color:'#34c659'
  },

  investmentDetailContainer: {
    backgroundColor: '#eef6ff', // Light blue background color
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  investmentDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    marginBottom: 8, // spacing between rows
  },
  label: {
    fontSize: 14,
    color: '#777', // lighter color for the label
  },

  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000', // bold and dark color for the value
  },

  cardTarget: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777',
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  progress: {
    height: '100%',
    backgroundColor: '#34c659',
    borderRadius: 4,
  },
  progressPercentage: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 16,
    fontSize: 16,
    color: '#666',
  },
  filesSection: {
    marginTop: 8,
    fontSize: 16,
    color: '#007AFF',
  },
  filesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  investButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  investButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
