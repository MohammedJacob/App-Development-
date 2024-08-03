import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const PrivacyPolicy = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.header}>Privacy Policy</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subheader}>1. Introduction</Text>
        <Text style={styles.text}>
          Welcome to Renuem ("Company", "we", "our", "us")! We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with respect to your personal information, please contact us at [contact information].
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subheader}>2. Information We Collect</Text>
        <Text style={styles.text}>
          We collect personal information that you voluntarily provide to us when registering on the Services, expressing an interest in obtaining information about us or our products and services, when participating in activities on the Services, or otherwise contacting us.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subheader}>3. How We Use Your Information</Text>
        <Text style={styles.text}>
          We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subheader}>4. Sharing Your Information</Text>
        <Text style={styles.text}>
          We may share information we have collected about you in certain situations. Your information may be disclosed as follows: [include relevant details].
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subheader}>5. Security of Your Information</Text>
        <Text style={styles.text}>
          We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subheader}>6. Contact Us</Text>
        <Text style={styles.text}>
          If you have questions or comments about this Privacy Policy, please contact us at:
          {'\n'}Email: [Your Email]
          {'\n'}Address: [Your Address]
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',

  },
  section: {
    marginBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subheader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
});

export default PrivacyPolicy;
