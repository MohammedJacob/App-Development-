import React, { useState } from 'react';
import { SafeAreaView, TextInput, StyleSheet, TouchableOpacity, Text, Alert, View, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as AppleAuthentication from 'expo-apple-authentication'; // Import for Apple sign-in

const SignupPage = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '', // Error state for confirm password
  });

  const navigation = useNavigation();

  const handleSubmit = async () => {
    setErrors({
      name: '',
      lastName: '',
      emailAddress: '',
      password: '',
      confirmPassword: '', // Reset confirm password errors
    });

    let isValid = true;
    const newErrors = { ...errors };

    if (!name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!lastName) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }
    if (!emailAddress) {
      newErrors.emailAddress = 'Email address is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address';
      isValid = false;
    }
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 3 || !/[A-Z]/.test(password)) {
      newErrors.password = 'Password must be at least 3 characters long and contain at least one uppercase letter';
      isValid = false;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://192.168.1.241:3000/addPatient', {
        name,
        last_name: lastName,
        email_address: emailAddress.trim().toLowerCase(), // Ensure email is lowercased
        password,
        joined_date: new Date().toISOString().split('T')[0]
      });

      if (response.status === 201) {
        navigation.navigate('LoginMethod');
      } else {
        Alert.alert('Error', 'Failed to add patient');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Network error, please try again';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignInPress = () => {
    navigation.navigate('LoginMethod');
  };

  const handleAppleLogin = async () => {
    try {
      const { identityToken, fullName, email } = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.Scope.FULL_NAME, AppleAuthentication.Scope.EMAIL],
      });

      if (identityToken) {
        // Handle user sign-in and/or registration here
        console.log({ identityToken, fullName, email });
      } else {
        Alert.alert('Error', 'Apple sign-in was canceled');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during Apple sign-in');
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Info', 'Google sign-in is not implemented');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={emailAddress}
        onChangeText={setEmailAddress}
        autoCapitalize="none"
      />
      {errors.emailAddress ? <Text style={styles.errorText}>{errors.emailAddress}</Text> : null}

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
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showPassword} // Ensure confirm password visibility matches password field
        autoCapitalize="none"
      />
      {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>SUBMIT</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handleGoogleLogin}>
          <Image source={{ uri: 'https://banner2.cleanpng.com/20180521/ers/kisspng-google-logo-5b02bbe1d5c6e0.2384399715269058258756.jpg' }} style={styles.iconGoogle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAppleLogin}>
          <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCvh-j7HsTHJ8ZckknAoiZMx9VcFmsFkv72g&s' }} style={styles.iconApple} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleSignInPress} style={styles.signInLink}>
        <Text style={styles.signInText}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  iconGoogle: {
    width: 48, 
    height: 48,
  },
  iconApple: {
    width: 48, 
    height: 48,
  },
  signInLink: {
    alignItems: 'center',
  },
  signInText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
});

export default SignupPage;