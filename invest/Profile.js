import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import FooterTabs from './components/footer';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const ProfileScreen = ({ route, navigation }) => {
  const initialUserData = route?.params?.userData || {};
  
  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(`${userData.name || ''} ${userData.last_name || ''}`);
  const [profileImage, setProfileImage] = useState(userData.profile_image_url || '');

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const handleEditPress = () => {
    setIsEditing(!isEditing);
  };

  const handleSavePress = async () => {
    const formData = new FormData();
    formData.append('id', userData.id);
    formData.append('username', username);
    
    if (profileImage) {
      const localUri = profileImage.startsWith('file://') 
        ? profileImage 
        : (await FileSystem.downloadAsync(profileImage, FileSystem.cacheDirectory + 'temp.jpg')).uri;

      formData.append('profileImage', {
        uri: localUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });
    }

    try {
      console.log('Sending request with formData:', formData);
      const response = await axios.put('http://192.168.1.241:3000/updateProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response from server:', response.data);
      Alert.alert('Success', 'Profile updated successfully!');
      setUserData({ ...userData, name: username.split(' ')[0], last_name: username.split(' ')[1], profile_image_url: profileImage }); // Update local userData with new values
    } catch (error) {
      console.error('Error updating user data:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'There was a problem updating your profile. Please try again.');
    }
    setIsEditing(false);
  };

  const handleImagePick = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedImageUri = result.assets[0].uri;
        setProfileImage(pickedImageUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={handleImagePick} style={styles.imageWrapper}>
            <Image
              source={{ uri: profileImage || 'https://seeklogo.com/images/M/man-silhouette-logo-081359B969-seeklogo.com.png' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          {isEditing ? (
            <TextInput
              style={styles.editInput}
              value={username}
              onChangeText={setUsername}
              autoFocus
            />
          ) : (
            <Text style={styles.username}>{username}</Text>
          )}
          <TouchableOpacity style={styles.editButton} onPress={isEditing ? handleSavePress : handleEditPress}>
            <Text style={styles.editButtonText}>{isEditing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
          <Text style={styles.email}>{userData.email_address || 'example@example.com'}</Text>
        </View>

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
            <Text style={styles.infoValue}>{userData.email_address || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <FooterTabs navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 60,
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editInput: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#007AFF',
    width: '100%',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoContainer: {
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
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
  spacer: {
    height: 60,
  },
});

export default ProfileScreen;
