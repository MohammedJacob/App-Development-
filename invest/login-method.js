import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginMethod = () => {
  const navigation = useNavigation();

  const handleGoogleLogin = () => {
    navigation.navigate('Onboarding');
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={{ uri: 'https://i0.wp.com/www.loscerritosnews.net/wp-content/uploads/2024/05/solar-farm-in-agriculture.jpg?resize=1024%2C576&ssl=1' }} 
        style={styles.image}
      >
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>Login or Sign Up</Text>
            <Text style={styles.subtitle}>
              Please select your preferred method to continue setting up your account
            </Text>
            <TouchableOpacity 
              style={styles.buttonEmail} 
              onPress={() => navigation.navigate('LoginMethodEmail')}
            >
              <Text style={styles.buttonTextEmail}>Continue with Email</Text>
            </TouchableOpacity>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={handleGoogleLogin}>
                <Image source={{ uri: 'https://banner2.cleanpng.com/20180521/ers/kisspng-google-logo-5b02bbe1d5c6e0.2384399715269058258756.jpg' }} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Onboarding')}>
                <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCvh-j7HsTHJ8ZckknAoiZMx9VcFmsFkv72g&s' }} style={styles.icon} />
              </TouchableOpacity>
            </View>
            <Text style={styles.footerText}>
              If you are creating a new account, 
              <TouchableOpacity onPress={() => navigation.navigate('Privacy Policy')}>
                <Text style={styles.link}> Terms & Conditions</Text>
              </TouchableOpacity> and 
              <TouchableOpacity onPress={() => navigation.navigate('Privacy Policy')}>
                <Text style={styles.link}> Privacy Policy</Text>
              </TouchableOpacity> will apply.
            </Text>
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonEmail: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonTextEmail: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  icon: {
    width: 60,
    height: 60,
  },
  footerText: {
    color: '#000',
    fontSize: 12,
    textAlign: 'center',
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});

export default LoginMethod;