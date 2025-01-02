import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useUser } from './UserContext'; // Adjust the path to your useUser context

const LoginMethodEmail = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setUserData } = useUser();

  const handleGoogleLogin = () => {
    navigation.navigate('Onboarding');
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleContinue = async () => {
    console.log("Continue button pressed");

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
      console.log('Login response:', response.data);

      if (response.data.error) {
        Alert.alert('Error', response.data.error);
      } else {
        setUserData(response.data.userData);
        navigation.navigate('TandC', { email });
      }
    } catch (error) {
      console.error('API request error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Email or password is incorrect, please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
          <Text>👁️</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signInButton} onPress={handleContinue}>
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
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.joinUsText}>Join us today</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Forgotpassword')}>
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
  footerText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  blacklink: {
    fontSize: 11,
  },
});

export default LoginMethodEmail;
