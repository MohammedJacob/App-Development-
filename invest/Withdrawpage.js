import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const Withdrawpage = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [formComplete, setFormComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    validateForm();
  }, [amount]);

  const handleAmountChange = (text) => {
    const formattedText = text.replace(/[^0-9.]/g, '');
    setAmount(formattedText);
  };

  const validateForm = () => {
    if (amount && parseFloat(amount) > 0) {
      setFormComplete(true);
      setErrorMessage('');
    } else {
      setFormComplete(false);
      setErrorMessage('Please enter a valid amount greater than 0');
    }
  };

  const handleWithdraw = async () => {
    if (formComplete) {
      try {
        // Assuming you would make an API call to process the withdrawal
        const response = await fetch('http://your-api-endpoint/withdraw', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
          }),
        });

        if (response.ok) {
          Alert.alert('Withdraw Successful', `You have successfully withdrawn ${amount} USD.`);
          navigation.navigate('Home'); // Navigate to home or another screen
        } else {
          const errorData = await response.json();
          Alert.alert('Withdraw Failed', errorData.message || 'An error occurred during the withdrawal process.');
        }
      } catch (error) {
        Alert.alert('Withdraw Failed', 'An error occurred during the withdrawal process.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Withdraw Funds</Text>
      
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter amount"
        value={amount}
        onChangeText={handleAmountChange}
      />

      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

      <TouchableOpacity style={[styles.button, !formComplete && styles.buttonDisabled]} onPress={handleWithdraw} disabled={!formComplete}>
        <Text style={styles.buttonText}>Withdraw</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#E9ECEF',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  button: {
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonDisabled: {
    backgroundColor: '#A9A9A9',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default Withdrawpage;
