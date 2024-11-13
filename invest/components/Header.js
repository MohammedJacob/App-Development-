import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import renuem from '../assets/Renuem.png';
import menuicon from '../assets/MenuIcon.png';

const Header = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  {/* Header View */}
  <View style={styles.header}>
  {/* Renuem Logo */}
  <Image source={renuem} style={styles.headerImage} />


 {/* Hamburger Menu Icon */}
 <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Settings')}>
<Image source={menuicon} style={styles.icon} />
</TouchableOpacity>
  </View>

  return (
    <View style={styles.container}>

       {/* Header View */}
  <View style={styles.header}>
  {/* Renuem Logo */}
  <Image source={renuem} style={styles.headerImage} />


 {/* Hamburger Menu Icon */}
 <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Settings')}>
<Image source={menuicon} style={styles.icon} />
</TouchableOpacity>
  </View>
      
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'transparent',
    
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position:'relative',
  },

  headerImage: {
    width: 200,
    height: 100, // Adjust these values based on your image dimensions
    
    // Adjust these values based on your image dimensions
    resizeMode: 'contain', // Ensures the image retains its aspect ratio
  },

  iconContainer: {
    flexDirection: 'row',
  },

  icon: {
    width: 30,
    height: 30,
  },


});

export default Header;
