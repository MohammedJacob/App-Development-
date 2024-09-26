import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useUser } from './UserContext';

export default function ChangePassword() {
  const { userData } = useUser();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(null);
  const [currentPasswordStatusColor, setCurrentPasswordStatusColor] = useState('#f6f6f6');

  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    // Log user data to ensure it's being populated
    console.log('User Data:', userData);
  }, [userData]);

  const togglePasswordVisibility = (setter) => () => {
    setter((prev) => !prev);
  };

  const validateCurrentPassword = async (password) => {
    setCurrentPassword(password);

    // We won't validate current password here anymore as it's being handled on save.
    // You can keep this function if you want to have immediate feedback on current password validation.
  };

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirmation do not match.');
      return;
    }

    if (!userData?.user_id) {
      Alert.alert('Error', 'User ID is not available. Please try again.');
      return;
    }

    const requestData = {
      userId: userData.user_id,
      currentPassword,
      newPassword,
    };

    console.log('Request Data:', requestData);

    try {
      const response = await axios.post('http://192.168.1.241:3000/changePassword', requestData);

      if (response.status === 200) {
        Alert.alert('Success', 'Password updated successfully.');
        // Optionally, reset fields after success
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        Alert.alert('Error', 'Failed to update password. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while changing the password. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.whiteSection}>
        <Text style={styles.title}>Change Password</Text>
        <Text style={styles.subtitle}>Update your password regularly, following our password security guidelines</Text>

        <View style={[styles.inputWrapper, { backgroundColor: currentPasswordStatusColor }]}>
          <TextInput
            style={styles.input}
            placeholder="Current Password"
            placeholderTextColor="#999"
            secureTextEntry={!isCurrentPasswordVisible}
            value={currentPassword}
            onChangeText={validateCurrentPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility(setIsCurrentPasswordVisible)} style={styles.iconContainer}>
            <Icon name={isCurrentPasswordVisible ? 'eye-off' : 'eye'} size={18} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#999"
            secureTextEntry={!isNewPasswordVisible}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility(setIsNewPasswordVisible)} style={styles.iconContainer}>
            <Icon name={isNewPasswordVisible ? 'eye-off' : 'eye'} size={18} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            secureTextEntry={!isConfirmPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility(setIsConfirmPasswordVisible)} style={styles.iconContainer}>
            <Icon name={isConfirmPasswordVisible ? 'eye-off' : 'eye'} size={18} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f4f9fc',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  whiteSection: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 35,
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
    marginBottom: 25,
    borderRadius: 8,
    backgroundColor: '#f6f6f6',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    paddingRight: 50,
  },
  iconContainer: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  saveButton: {
    backgroundColor: '#3f88f7',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
