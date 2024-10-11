// Onboarding.js
import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Onboarding = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={{ uri: 'https://i0.wp.com/www.loscerritosnews.net/wp-content/uploads/2024/05/solar-farm-in-agriculture.jpg?resize=1024%2C576&ssl=1' }} 
        style={styles.image}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Get Up to 15% Benefit</Text>
          <Text style={styles.subtitle}>
            Fund the development of new renewable energy sites via tokenised fractional ownership
          </Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('Welcome')}
          >
            <Text style={styles.buttonText}>Get started</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Onboarding;

