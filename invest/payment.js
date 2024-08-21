import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import creditCardType from 'credit-card-type';

const PaymentScreen = ({ navigation }) => {
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [formComplete, setFormComplete] = useState(false);
  const [cardType, setCardType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    validateForm();
  }, [cardholderName, cardNumber, expiryDate, cvv]);

  const handleCardholderNameChange = (text) => {
    setCardholderName(text);
  };

  const handleCardNumberChange = (text) => {
    const formattedText = text.replace(/[^0-9]/g, '');
    setCardNumber(formattedText);
    detectCardType(formattedText);
  };

  const detectCardType = (number) => {
    if (number.length >= 4) {
      const cards = creditCardType(number);
      const card = cards[0];
      console.log('Detected Card:', card); // Debugging line
      if (card) {
        setCardType(card.type);
        console.log('Card Type Detected:', card.type); // Check if 'american-express' is being set
      } else {
        setCardType('');
      }
    } else {
      setCardType(''); 
    }
  };

  const handleExpiryDateChange = (text) => {
    const formattedText = text.replace(/[^0-9]/g, '');
    if (formattedText.length <= 4) {
      if (formattedText.length === 1 && parseInt(formattedText) > 1) {
        setExpiryDate(`0${formattedText}/`);
      } else if (formattedText.length > 2) {
        const mm = formattedText.slice(0, 2);
        const yy = formattedText.slice(2);
        if (parseInt(mm) <= 12) {
          setExpiryDate(`${mm}/${yy}`);
        } else {
          setExpiryDate(formattedText.slice(0, 2));
        }
      } else {
        setExpiryDate(formattedText);
      }
    }
  };

  const handleCvvChange = (text) => {
    if (text.length <= 3) {
      setCvv(text.replace(/[^0-9]/g, ''));
    }
  };

  const validateCardNumber = (number) => {
    const cardNumber = number.replace(/\s+/g, '');
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return (sum % 10 === 0);
  };

  const validateForm = () => {
    if (cardholderName && cardNumber && validateCardNumber(cardNumber) &&
        expiryDate.length === 5 && cvv.length === 3) {
      setFormComplete(true);
      setErrorMessage('');
    } else {
      setFormComplete(false);
      if (!validateCardNumber(cardNumber)) {
        setErrorMessage('Card number is invalid');
      } else if (cardNumber.length < 13 || cardNumber.length > 19) {
        setErrorMessage('Card number must be between 13 and 19 digits');
      } else if (expiryDate.length !== 5) {
        setErrorMessage('Expiry date must be in MM/YY format');
      } else if (cvv.length !== 3) {
        setErrorMessage('CVV must be 3 digits');
      } else {
        setErrorMessage('');
      }
    }
  };

  const handleSubmit = () => {
    if (formComplete) {
      navigation.navigate('Home');
    }
  };

  const getCardLogo = () => {
    switch (cardType) {
      case 'visa':
        return 'https://www.pngall.com/wp-content/uploads/2017/05/Visa-Logo-Free-Download-PNG.png';
      case 'mastercard':
        return 'https://pngimg.com/d/mastercard_PNG16.png';
      case 'american-express':
        return 'https://1000logos.net/wp-content/uploads/2016/10/American-Express-Color.png';
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Card Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Cardholder name"
        value={cardholderName}
        onChangeText={handleCardholderNameChange}
      />

      <View style={styles.cardInputContainer}>
        <TextInput
          style={[styles.input, styles.cardNumberInput]}
          placeholder="Card Number"
          value={cardNumber}
          onChangeText={handleCardNumberChange}
          keyboardType="numeric"
          maxLength={19} 
        />

        {getCardLogo() && (
          <Image
            source={{ uri: getCardLogo() }}
            style={styles.cardLogo}
          />
        )}
      </View>

      <View style={styles.rowContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 10 }]}
          placeholder="MM/YY"
          value={expiryDate}
          onChangeText={handleExpiryDateChange}
          keyboardType="numeric"
          maxLength={5} 
        />
        
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="CVV"
          value={cvv}
          onChangeText={handleCvvChange}
          keyboardType="numeric"
          maxLength={3}
        />
      </View>

      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

      <Button
        title="Submit"
        onPress={handleSubmit}
        disabled={!formComplete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  cardInputContainer: {
    width: '100%',
    position: 'relative',
  },
  cardNumberInput: {
    paddingRight: 50,
  },
  cardLogo: {
    position: 'absolute',
    right: 10,
    top: 5,
    width: 40,
    height: 25,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
});

export default PaymentScreen;

