import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const VerificationCard = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [sessionUrl, setSessionUrl] = useState(null);

  const createVeriffSession = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://api.veriff.com/v1/sessions',
        {
          verification: {
            callback: 'https://your-callback-url.com', // Set your callback URL here
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer YOUR_VERIFF_API_KEY', // Replace with your Veriff API key
          },
        }
      );
      setSessionUrl(response.data.verification.url);
      setLoading(false);
      // Navigate to the Veriff session
      navigation.navigate('WebViewScreen', { url: response.data.verification.url });
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to create a Veriff session. Please try again later.');
      console.error('Failed to create Veriff session:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Identity</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Start Verification" onPress={createVeriffSession} />
      )}
      {sessionUrl && (
        <Text style={styles.link}>Your Veriff session URL: {sessionUrl}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  link: {
    marginTop: 20,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default VerificationCard;
