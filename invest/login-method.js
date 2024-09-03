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
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
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
                <Image source={{ uri: 'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png' }} style={styles.iconGoogle} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Onboarding')}>
                <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCvh-j7HsTHJ8ZckknAoiZMx9VcFmsFkv72g&s' }} style={styles.iconApple} />
              </TouchableOpacity>
            </View>
            <Text style={styles.footerText}>
              If you are creating a new account, 
              <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
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
    justifyContent: 'flex-end', // Center the card
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    height:'50%',
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 18,
    padding : 5,
    color: '#888',
  },
  title: {
    marginTop:40,
    color: '#333',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    fontWeight:'bold'
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  buttonEmail: {
    backgroundColor: '#3d89f6',
    paddingVertical: 20,
    borderRadius: 20,
    marginBottom: 25,
    width: '100%',
    alignItems: 'center',
  },

  iconGoogle: {
    width: 50,
    height: 40,
    marginRight: 16,
  },
  iconApple: {
    width: 35,
    height: 35,
  },
  buttonTextEmail: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 30,
    gap:80
  },
  icon: {
    width: 36,
    height: 36,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  link: {
    color: '#007bff',
  },
});

export default LoginMethod;
