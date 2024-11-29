import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from './UserContext';
import Header from './components/Header';
import FooterTabs from './components/footer';
import axios from 'axios';

const ProfileScreen = ({ navigation }) => {
  const { userData, setUserData } = useUser(); // Access user data and setter from context

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(`${userData.name || ''} ${userData.last_name || ''}`);
  const [profileImage, setProfileImage] = useState(userData.profile_image || '');
  const [address, setAddress] = useState(userData.address || 'Fetching your location...');

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const fetchUserLocation = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required to fetch your address.');
        setAddress('Permission denied. Enable location access.');
        return;
      }
  
      // Fetch current location with high accuracy
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
  
      const { latitude, longitude } = location.coords;
  
      // Log coordinates for debugging
      console.log('Location coordinates:', { latitude, longitude });
  
      // Reverse geocode to get address
      const geocodedAddresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
  
      console.log('Reverse geocoding result:', geocodedAddresses);
  
      if (geocodedAddresses && geocodedAddresses.length > 0) {
        const { street, city, region, country } = geocodedAddresses[0];
        const formattedAddress = `${street || 'Unknown Street'}, ${city || 'Unknown City'}, ${region || 'Unknown Region'}, ${country || 'Unknown Country'}`;
        
        // Update state and user context
        setAddress(formattedAddress);
        setUserData({ ...userData, address: formattedAddress });
      } else {
        setAddress('Unable to resolve location to address.');
        console.warn('No address found for the given coordinates.');
      }
    } catch (error) {
      console.error('Error fetching or reverse geocoding location:', error.message);
      setAddress('Error fetching location. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };
  
  

  


  const handleImagePick = async () => {
    try {
      console.log('Requesting gallery permissions...');
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.granted) {
        console.log('Gallery permission granted. Launching image picker...');
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
  
        if (!result.canceled) {
          console.log('Image selected:', result.assets[0]?.uri || 'No URI found');
          setProfileImage(result.assets[0]?.uri);
          console.log('Image ready to upload');
          handleUploadImage(result.assets[0]?.uri);
        } else {
          console.log('No image selected');
        }
      } else {
        console.log('Gallery permission denied.');
        alert('Permission to access gallery is required!');
      }
    } catch (error) {
      console.error('Error during image selection:', error.message);
    }
  };
  
  const handleUploadImage = async (imageUri) => {
    console.log('Initiating image upload...');
    if (!imageUri) {
      console.log('Cannot upload image: No image selected');
      return;
    }
  
    console.log('Step 1: Preparing form data...');
    const formData = new FormData();
    formData.append('id', userData.id);
    formData.append('profile_image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });
  
    console.log('FormData prepared:');
    console.log(`User ID: ${userData.id}`);
    console.log(`Image URI: ${imageUri}`);
    console.log('Database column: profile_image');
  
    try {
      console.log('Step 2: Sending image to backend...');
      const response = await axios.put('http://192.168.1.241:3000/updateProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Response received from server:', response.status, response.data);
      if (response.data.message === 'Profile updated successfully') {
        console.log('Step 3: Image uploaded successfully.');
        setUserData({ ...userData, profile_image: imageUri });
        console.log('User data updated in context.');
        alert('Profile image updated successfully!');
      } else {
        console.log('Step 3: Image upload failed.');
        alert('Failed to update profile image');
      }
    } catch (error) {
      console.error('Error during image upload:', error.message);
      if (error.response) {
        console.log('Server response status:', error.response.status);
        console.log('Server response data:', error.response.data);
      } else {
        console.log('No response received from server.');
      }
      console.log('Verify the following:');
      console.log('- Is the server URL correct?');
      console.log('- Is the server running and accessible?');
      console.log('- Does the server accept multipart/form-data requests?');
      console.log('- Are there network issues?');
      alert('Error uploading image. Check logs for details.');
    }
  };
  
   

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="shield-checkmark" size={20} color="#bbcfdc" />
          <Text style={styles.headerText}>Security</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="link" size={20} color="#bbcfdc" />
          <Text style={styles.headerText}>Social connections</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="time" size={20} color="#bbcfdc" />
          <Text style={styles.headerText}>Login History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="person-circle-outline" size={20} color="#bbcfdc" />
            <Text style={styles.cardTitle}>Profile photo</Text>
          </View>
          <TouchableOpacity onPress={handleImagePick}>
            <Ionicons name="create-outline" size={20} color="#bbcfdc" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <TouchableOpacity onPress={handleImagePick}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Ionicons name="person-circle-outline" size={100} color="#bbb" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="information-circle-outline" size={20} color="#bbcfdc" />
            <Text style={styles.cardTitle}>Personal Information</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.row}>
            <Text style={styles.label}>First Name</Text>
            <Text style={styles.value}>{userData.name || 'John'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Last Name</Text>
            <Text style={styles.value}>{userData.last_name || 'Smith'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{userData.email_address || 'username@email.com'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{userData.phone || '+971 4 427 33 33'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="location-outline" size={20} color="#bbcfdc" />
            <Text style={styles.cardTitle}>Address</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.row}>
          
          
          <Text style={styles.label}>Current Address</Text>
          <Text style={styles.value}>{address|| 'Dubai'} </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="settings-outline" size={20} color="#bbcfdc" />
            <Text style={styles.cardTitle}>Account Information</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.row}>
            <Text style={styles.label}>KYC</Text>
            <Text style={styles.value}>{userData.kyc_status || 'Verified'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Two-factor authentication</Text>
            <Text style={styles.value}>{userData.two_factor || 'Google Authenticator'}</Text>
          </View>
          <View style={styles.row}>
  <Text style={styles.label}>Registered since</Text>
  <Text style={styles.value}>
    {userData.joined_date ? formatDate(userData.joined_date) : 'N/A'}
  </Text>
</View>

        </View>
      </View>

      <View style={styles.helpSection}>
        <Text style={styles.helpText}>Need help updating information?</Text>
        <TouchableOpacity>
          <Text style={styles.helpLink}>Contact Us</Text>
        </TouchableOpacity>
      </View>
      <FooterTabs />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    paddingStart: 15,
    paddingEnd: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2B2D42',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cardContent: {
    marginTop: 8,
  },
  row: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#6A6A6A',
  },
  value: {
    color: '#000',
    fontWeight: 'bold',
  },
  helpSection: {
    alignItems: 'center',
    marginTop: 16,
  },
  helpText: {
    color: '#6A6A6A',
  },
  helpLink: {
    color: '#0056B3',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
