import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const PaymentScreen = ({ navigation }) => {
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [formComplete, setFormComplete] = useState(false);

  useEffect(() => {
    // Validate form completeness whenever any relevant state changes
    validateForm();
  }, [cardholderName, cardNumber, expiryDate, cvv]);

  const handleCardholderNameChange = (text) => {
    setCardholderName(text);
  };

  const handleCardNumberChange = (text) => {
    setCardNumber(text);
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

  const validateForm = () => {
    // Check if all fields are filled
    if (cardholderName && cardNumber && expiryDate.length === 5 && cvv.length === 3) {
      setFormComplete(true);
    } else {
      setFormComplete(false);
    }
  };

  const handleSubmit = () => {
    // Implement your submission logic here
    navigation.navigate('Home');
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
      
      <TextInput
        style={styles.input}
        placeholder="Card Number"
        value={cardNumber}
        onChangeText={handleCardNumberChange}
        keyboardType="numeric"
      />
      
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
});

export default PaymentScreen;
