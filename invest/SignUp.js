import React, { useState } from 'react';
import { SafeAreaView, TextInput, StyleSheet, TouchableOpacity, Text, Alert, View, Image, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as AppleAuthentication from 'expo-apple-authentication';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Separate state for confirm password
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
  });

  const navigation = useNavigation();

  const handleSubmit = async () => {
    setErrors({
      name: '',
      lastName: '',
      emailAddress: '',
      password: '',
      confirmPassword: '',
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
        email_address: emailAddress.trim().toLowerCase(),
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.form}>
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
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)} 
                style={styles.showPasswordButton}
              >
                <Image
                  source={{ uri: showPassword ? 'https://img.icons8.com/material-outlined/24/000000/visible.png' : 'https://img.icons8.com/material-outlined/24/000000/invisible.png' }}
                  style={styles.showPasswordsicon}
                />
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword} // Updated to use showConfirmPassword
                autoCapitalize="none"
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)} 
                style={styles.showPasswordButton}
              >
                <Image
                  source={{ uri: showConfirmPassword ? 'https://img.icons8.com/material-outlined/24/000000/visible.png' : 'https://img.icons8.com/material-outlined/24/000000/invisible.png' }}
                  style={styles.showPasswordsicon}
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>SUBMIT</Text>
            </TouchableOpacity>
            {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}

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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:40
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 16,
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
    position: 'relative',
    marginBottom: 16,
  },
  passwordInput: {
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
  showPasswordsicon: {
    width: 20,
    height: 20,
  },
  button: {
    backgroundColor: '#6ba5fb',
    paddingVertical: 15,
    borderRadius: 11,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginTop: -10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  iconGoogle: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  iconApple: {
    width: 50,
    height: 50,
  },
  signInLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  signInText: {
    color: '#6ba5fb',
    fontSize: 16,
  },
});

export default SignupPage;
