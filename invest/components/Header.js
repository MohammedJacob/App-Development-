import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../UserContext'; // Import useUser hook
import renuem from '../assets/Renuem.png';
import menuicon from '../assets/MenuIcon.png';

const Header = () => {
  const navigation = useNavigation();
  const { userData } = useUser(); // Access user data from context

  return (
    <View style={styles.header}>
      {/* Renuem Logo */}
      <Image source={renuem} style={styles.headerImage} />

      {/* Profile Icon */}
      <TouchableOpacity 
        style={styles.profileIconContainer} 
        onPress={() => navigation.navigate('Profile')}
      >
        <Image
          source={{
            uri: userData.profile_image || 'https://e7.pngegg.com/pngimages/739/902/png-clipart-super-mario-illustration-super-mario-bros-nintendo-badge-arcade-super-mario-rpg-luigi-super-mario-bros-nintendo.png',
          }}
          style={styles.profileIcon}
        />
      </TouchableOpacity>
      <Text> {userData.name || 'User'}</Text>
      {/* Hamburger Menu Icon */}
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Settings')}>
        <Image source={menuicon} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent', // Add a background color if desired
  },
  headerImage: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  profileIconContainer: {
    marginRight: 10,
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 20, // Circular profile icon
  },
  iconContainer: {
    marginLeft: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default Header;
