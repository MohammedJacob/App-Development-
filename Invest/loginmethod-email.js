import React, { useState } from 'react';
import { SafeAreaView, TextInput, StyleSheet, View, Text, TouchableOpacity, Switch, Alert } from 'react-native';
import axios from 'axios';

export default function LoginMethodEmail({ navigation }) {
  const [email, setEmail] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  // Email validation function
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const handleContinue = async () => {
    // Check if email is valid before proceeding
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.241:3000/loginWithEmail', { email });
      console.log('Response:', response.data); // Log the response to inspect
      if (response.data.error) {
        Alert.alert('Error', response.data.error);
      } 
;
        // Navigate to the "Home" page if email is recognized
        navigation.navigate('Home');
      
    } catch (error) {
      Alert.alert('Error', 'We do not reconize this');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>Back</Text>
      </TouchableOpacity>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>@</Text>
      </View>
      <Text style={styles.title}>Get going with email</Text>
      <Text style={styles.subtitle}>
        Please enter your email address to continue
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.switchContainer}>
        <Switch
          trackColor={{ false: '#767577', true: '#90b3c6' }} 
          thumbColor={isEnabled ? '#90b3c6' : '#f4f3f4'} 
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={styles.switch}
        />
        <Text style={styles.switchLabel}>
          Stay up to date with the latest news and resources delivered directly to your inbox
        </Text>
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
  },
  backButton: {
    color: '#007AFF',
    fontSize: 18,
    marginBottom: 16,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 50,
    color: '#ccc',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
    backgroundColor: '#f4f9fb'
  },
  input: {
    height: 50,
    borderColor: '#6ba5fb',
    borderWidth: 2,
    borderRadius: 11,
    paddingHorizontal: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  switch: {
    marginRight: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: '#90b3c6', 
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
