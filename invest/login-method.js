import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginMethod = () => {
  const navigation = useNavigation();

  const handleGoogleLogin = () => {
    navigation.navigate('Onboarding');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
        />
        <TouchableOpacity style={styles.eyeIcon}>
          <Text>👁️</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signInButton}>
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or</Text>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image
          source={{ uri: 'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png' }}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Sign In with Google</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.joinUsText}>Join us today</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
      </TouchableOpacity>
      
      <Text style={styles.footerText}>
        By continuing to Sign In you agree to the Renuem Labs{' '}
        <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
          <Text style={styles.blacklink}>Terms & Conditions</Text>
        </TouchableOpacity> and{' '}
        <TouchableOpacity onPress={() => navigation.navigate('Privacy')}>
          <Text style={styles.blacklink}>Risk Statement</Text>
        </TouchableOpacity>.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#333',
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 10,
  },
  signInButton: {
    backgroundColor: '#3d89f6',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    color: '#aaa',
    marginVertical: 10,
  },
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  googleIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  googleButtonText: {
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  signupText: {
    color: '#000',
    fontSize: 14,
  },
  joinUsText: {
    color: '#3d89f6',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  forgotPasswordText: {
    color: '#3d89f6',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  guestText: {
    color: '#3d89f6',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },

  blacklink:{
    fontSize:11
    
  },
});

export default LoginMethod;
