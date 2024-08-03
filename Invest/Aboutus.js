import React from 'react';
import { StyleSheet, View, Text, ScrollView, Linking, Image, TouchableOpacity } from 'react-native';


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
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.header}>About Us</Text>

        <Text style={styles.sectionHeader}>Who We Are</Text>
        <Text style={styles.text}>
          Reneum Labs is dedicated to democratizing access to renewable energy investments.
          We empower individuals to support global renewable energy projects through tokenized fractional ownership.
          By leveraging technology and transparent processes, we aim to unlock capital and drive positive environmental impact worldwide.
        </Text>

        <Text style={styles.sectionHeader}>What We Do</Text>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>- Fund New Renewable Energy Sites: Enable investments in new projects.</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>- Purchase Fractional Ownership In Existing Sites: Invest and earn dividends instantly.</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>- Loan Capital To Renewable Developers: Support infrastructure growth and earn monthly interest.</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>- Offset Scope 2 Emissions: Reduce carbon footprints through digital RECs.</Text>
        </View>

        <Text style={styles.sectionHeader}>Plans for the Future</Text>
        <Text style={styles.text}>
          Our roadmap outlines strategic milestones to advance renewable energy investments globally.
          We continue to innovate, expand our community, and drive towards a sustainable future for all.
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
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  listItemText: {
    fontSize: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
