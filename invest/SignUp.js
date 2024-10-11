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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    // ... (existing validation logic)

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://192.168.1.241:3000/addUser', {
        name,
        last_name: lastName,
        email_address: emailAddress.trim().toLowerCase(),
        password,
        joined_date: new Date().toISOString().split('T')[0]
      });

      if (response.status === 201) {
        navigation.navigate('LoginMethod');
      } else {
        Alert.alert('Error', 'Failed to add User');
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

  const handleGuestLogin = () => {
    Alert.alert(
      'Guest Login',
      'Some features may be restricted if you don’t sign in.',
      [
        {
          text: 'Continue as Guest',
          onPress: () => navigation.navigate('Welcome'), // Navigate to the home screen for guest login
        },
        {
          text: 'Cancel',
          style: 'cancel', // Adds a cancel button
        },
      ]
    );
  };

  const handleAppleLogin = async () => {
    
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

            {/* Password Inputs */}
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
                secureTextEntry={!showConfirmPassword}
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

            {/* Password Requirements */}
            <View style={styles.passwordRequirementsContainer}>
              <Text style={styles.passwordRequirementsHeader}>Password requirements:</Text>
              <Text style={styles.passwordRequirements}>
                <Text style={styles.valid}>+ </Text>be minimum 8 characters long
              </Text>
              <Text style={styles.passwordRequirements}>
                <Text style={styles.valid}>+ </Text>Have at least one number
              </Text>
              <Text style={styles.passwordRequirements}>
                <Text style={styles.invalid}>- </Text>Have at least one uppercase character
              </Text>
              <Text style={styles.passwordRequirements}>
                <Text style={styles.invalid}>- </Text>Have at least one lowercase character
              </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>SUBMIT</Text>
            </TouchableOpacity>
            {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}

            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={handleGoogleLogin}>
                <Image source={{ uri: 'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png' }} style={styles.iconGoogle} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAppleLogin}>
                <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCvh-j7HsTHJ8ZckknAoiZMx9VcFmsFkv72g&s' }} style={styles.iconApple} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleSignInPress} style={styles.signInLink}>
              <Text style={styles.signInText}>Already have an account? Sign in</Text>
            </TouchableOpacity>

            {/* Guest Login Button */}
            <TouchableOpacity onPress={handleGuestLogin} style={styles.signInLink}>
              <Text style={styles.signInText}>Continue as Guest</Text>
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
    marginTop: 15,
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
  },
  passwordInput: {
    height: 50,
    borderColor: '#6ba5fb',
    borderWidth: 2,
    borderRadius: 11,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  showPasswordButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  showPasswordsicon: {
    width: 24,
    height: 24,
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 8,
  },
  passwordRequirementsContainer: {
    backgroundColor: '#eef6ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
  },
  passwordRequirementsHeader: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  passwordRequirements: {
    fontSize: 14,
  },
  valid: {
    color: 'green',
  },
  invalid: {
    color: 'red',
  },
  button: {
    backgroundColor: '#6ba5fb',
    borderRadius: 11,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  iconGoogle: {
    width: 40,
    height: 40,
  },
  iconApple: {
    width: 40,
    height: 40,
  },
  signInLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  signInText: {
    color: '#6ba5fb',
  },
  guestButton: {
    backgroundColor: '#d3d3d3',
    borderRadius: 11,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  guestButtonText: {
    color: '#000',
    fontSize: 16,
  },
});

export default SignupPage;
