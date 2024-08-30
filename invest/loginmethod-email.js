import React, { useState } from 'react';
import { SafeAreaView, TextInput, StyleSheet, TouchableOpacity, Text, Alert, View, Image } from 'react-native';
import axios from 'axios';

export default function LoginMethodEmail({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleContinue = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
  
    if (!password) {
      Alert.alert('Invalid Password', 'Password is required.');
      return;
    }
  
    try {
      const response = await axios.post('http://192.168.1.241:3000/loginWithEmail', { email, password });
      if (response.data.error) {
        Alert.alert('Error', response.data.error);
      } else {
        Alert.alert('Success', response.data.message);
        // Pass the user data to the profile screen
        navigation.navigate('Profile', { userData: response.data.userData });
      }
    } catch (error) {
      console.error('API request error:', error.response?.data || error.message);
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    }
  };
  
  

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // Toggle visibility
          autoCapitalize="none"
        />
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)} 
          style={styles.showPasswordButton}
        >
          <Image
            source={{ uri: showPassword ? 'https://img.icons8.com/material-outlined/24/000000/visible.png' : 'https://img.icons8.com/material-outlined/24/000000/invisible.png' }}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderColor: '#6ba5fb',
    borderWidth: 2,
    borderRadius: 11,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    borderColor: '#6ba5fb',
    borderWidth: 2,
    borderRadius: 11,
    paddingHorizontal: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  showPasswordButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});