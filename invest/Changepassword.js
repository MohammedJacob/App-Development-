import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { useUser } from './UserContext'; // Import the useUser hook
import FooterTabs from './components/footer'; // Assuming you have a FooterTabs component

const ChangePassword = ({ navigation }) => {
  const { userData } = useUser(); // Access user data from the context
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false); // State to track the validity of the current password

  const validatePassword = (password) => {
    const minLength = 8;
    const upperCasePattern = /[A-Z]/;
    const lowerCasePattern = /[a-z]/;
    const numberPattern = /[0-9]/;

    return (
      password.length >= minLength &&
      upperCasePattern.test(password) &&
      lowerCasePattern.test(password) &&
      numberPattern.test(password)
    );
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match!');
      return;
    }

    if (!validatePassword(newPassword)) {
      Alert.alert('Error', 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a number.');
      return;
    }

    // Perform your password change logic here (e.g., API call)
    Alert.alert('Success', 'Password changed successfully!');
    // Optionally reset the input fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsCurrentPasswordValid(false); // Reset the current password validity after submission
  };

  const handleCurrentPasswordChange = (text) => {
    setCurrentPassword(text);

    // Assuming userData contains the correct password
    if (text === userData.password) { // Replace with actual validation logic (like a server call)
      setIsCurrentPasswordValid(true); // Set to true if the password matches
    } else {
      setIsCurrentPasswordValid(false); // Set to false if it does not match
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'; // Return default if date is not available
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options); // Format date to "Month Day, Year"
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Change Password</Text>
        <TextInput
          style={[styles.input, isCurrentPasswordValid && styles.validInput]} // Conditionally apply style
          placeholder="Current Password"
          secureTextEntry
          value={currentPassword}
          onChangeText={handleCurrentPasswordChange}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        {/* User Data Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Personal Information</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>First Name:</Text>
            <Text style={styles.infoValue}>{userData.name || 'N/A'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Last Name:</Text>
            <Text style={styles.infoValue}>{userData.last_name || 'N/A'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email Address:</Text>
            <Text style={styles.infoValue}>{userData.email_address || 'guest@example.com'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date Joined:</Text>
            <Text style={styles.infoValue}>{formatDate(userData.joined_date)}</Text>
          </View>
        </View>
      </View>
      <FooterTabs navigation={navigation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 60,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  validInput: {
    backgroundColor: '#b3e5fc', // Light blue background
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginVertical: 20,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  infoValue: {
    marginLeft: 10,
    color: '#333',
  },
});

export default ChangePassword;
