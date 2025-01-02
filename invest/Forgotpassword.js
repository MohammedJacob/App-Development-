import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import axios from 'axios';

const ForgotPassword = () => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showRequirements, setShowRequirements] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const heightAnim = useRef(new Animated.Value(0)).current;

  const passwordRequirements = {
    minLength: 8,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    specialChar: /[!@#$%^&*(),.?":{}|<>]/,
  };

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: showRequirements ? 140 : 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [showRequirements]);

  const validatePassword = (password) => {
    return (
      password.length >= passwordRequirements.minLength &&
      passwordRequirements.uppercase.test(password) &&
      passwordRequirements.lowercase.test(password) &&
      passwordRequirements.number.test(password) &&
      passwordRequirements.specialChar.test(password)
    );
  };

  const handleResetPassword = async () => {
    if (!emailInput || !passwordInput || !confirmPasswordInput) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (!validatePassword(passwordInput)) {
      setShowRequirements(true);
      Alert.alert('Error', 'Password does not meet the requirements.');
      return;
    }

    if (passwordInput !== confirmPasswordInput) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.241:3000/forgotPassword', {
        email: emailInput,
        newPassword: passwordInput,
      });
      Alert.alert('Success', response.data.message);
    } catch (error) {
      console.error('Error resetting password:', error);
      const errorMessage =
        error.response?.data?.error || 'Failed to reset password. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={emailInput}
        onChangeText={setEmailInput}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter your new password"
          value={passwordInput}
          onChangeText={(text) => {
            setPasswordInput(text);
            setShowRequirements(true);
          }}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm your password"
          value={confirmPasswordInput}
          onChangeText={setConfirmPasswordInput}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => setShowRequirements(!showRequirements)}
        style={styles.infoButton}
      >
        <Text style={styles.infoIcon}>ℹ️</Text>
      </TouchableOpacity>

      {/* Animated Password Requirements */}
      <Animated.View style={[styles.requirementsBox, { height: heightAnim }]}> 
        <Text style={styles.requirementsText}>Password Requirements:</Text>
        <Text style={styles.requirementsText}>- At least 8 characters</Text>
        <Text style={styles.requirementsText}>- 1 uppercase letter</Text>
        <Text style={styles.requirementsText}>- 1 lowercase letter</Text>
        <Text style={styles.requirementsText}>- 1 number</Text>
      </Animated.View>

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  eyeIcon: {
    fontSize: 18,
    marginLeft: 10,
    color: '#007BFF',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  requirementsBox: {
    overflow: 'hidden',
    backgroundColor: '#e8f4ff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  requirementsText: {
    fontSize: 12,
    color: '#555',
  },
  infoButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  infoIcon: {
    fontSize: 18,
    color: '#007BFF',
  },
});

export default ForgotPassword;
