import React from 'react';
import { StyleSheet, View, Text, ScrollView, Linking, Image, TouchableOpacity } from 'react-native';
import NavBar from './components/NavBar'; // Ensure the path is correct according to your project structure

const linkedinIcon = 'https://image.similarpng.com/very-thumbnail/2020/07/Linkedin-logo-on-transparent-Background-PNG-.png';
const instagramIcon = 'https://image.similarpng.com/very-thumbnail/2020/11/Instagram-icon-on-transparent-background-PNG.png';
const twitterIcon = 'https://static.dezeen.com/uploads/2023/07/x-logo-twitter-elon-musk_dezeen_2364_col_0-1.jpg';
const companyLogo = require('./assets/Company_logo.png');

const AboutUsScreen = ({ navigation }) => {
  const handleLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <NavBar navigation={navigation} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.header}>About Us</Text>
        <Text style={styles.text}>
          Welcome to our company. We are dedicated to providing the best services and products to our customers.
        </Text>
        <Text style={styles.text}>
          Our mission is to make the world a better place through our innovative solutions and exceptional customer service.
        </Text>

        {/* Social Media Links */}
        <View style={styles.socialContainer}>
          <TouchableOpacity onPress={() => handleLink('https://www.linkedin.com/company/reneum/posts/?feedView=all')}>
            <Image source={{ uri: linkedinIcon }} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLink('https://instagram.com/reneum_institute/')}>
            <Image source={{ uri: instagramIcon }} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLink('https://x.com/reneuminstitute?lang=en')}>
            <Image source={{ uri: twitterIcon }} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLink('https://reneum.com/#our-mission')}>
            <Image source={companyLogo} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensures even spacing between items
    marginTop: 20,
    marginHorizontal: 10,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default AboutUsScreen;
