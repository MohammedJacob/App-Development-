import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google'; // Import for Google sign-in
import * as AppleAuthentication from 'expo-apple-authentication'; // Import for Apple sign-in

const SignupPage = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    lastName: '',
    emailAddress: '',
    password: '',
  });
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google client ID
  });
  const navigation = useNavigation();

  const handleSubmit = async () => {
    setErrors({
      name: '',
      lastName: '',
      emailAddress: '',
      password: '',
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
    } else if (!emailAddress.includes('@')) {
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

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://192.168.1.241:3000/addPatient', {
        name,
        last_name: lastName,
        email_address: emailAddress,
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

  const handleGoogleLogin = async () => {
    try {
      const result = await promptAsync();

      if (result.type === 'success') {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${result.params.id_token}`,
          },
        });

        // Handle user sign-in and/or registration here
        console.log(userInfo.data);
      } else {
        Alert.alert('Error', 'Google sign-in was canceled');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during Google sign-in');
    }
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

  return (
    <View style={styles.container}>
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
          secureTextEntry={!isPasswordVisible}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Text style={styles.showPassword}>
            {isPasswordVisible ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>SUBMIT</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handleGoogleLogin}>
          <Image source={{ uri: 'https://banner2.cleanpng.com/20180521/ers/kisspng-google-logo-5b02bbe1d5c6e0.2384399715269058258756.jpg' }} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAppleLogin}>
          <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCvh-j7HsTHJ8ZckknAoiZMx9VcFmsFkv72g&s' }} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleSignInPress} style={styles.signInLink}>
        <Text style={styles.signInText}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  passwordInput: {
    flex: 1,
    height: 50,
  },
  showPassword: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
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
  icon: {
    width: 60,
    height: 60,
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
