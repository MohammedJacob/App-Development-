import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useUser } from './UserContext';

const ForgotPassword = () => {
  const { userData } = useUser(); // Access email from context
  const [emailInput, setEmailInput] = useState(''); // User-editable email input
  const [passwordInput, setPasswordInput] = useState('');

  const handleResetPassword = () => {
    // Ensure both email and password inputs are filled
    if (!emailInput || !passwordInput) {
      Alert.alert('Error', 'Please fill in both email and password fields.');
      return;
    }

    // Normalize both emails to lowercase for case-insensitive comparison
    if (emailInput.toLowerCase() === userData.email_address.toLowerCase()) {
      console.log('All info matches. Proceeding with password reset...');
      // Add logic here to reset the password (e.g., send API request)
      Alert.alert('Success', 'Password reset successful.');
    } else {
      console.log('Information you provided was incorrect.');
      Alert.alert('Error', 'The email you entered does not match our records.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={emailInput}
        onChangeText={setEmailInput}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* New Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your new password"
        value={passwordInput}
        onChangeText={setPasswordInput}
        secureTextEntry
      />

      {/* Reset Button */}
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ForgotPassword;
