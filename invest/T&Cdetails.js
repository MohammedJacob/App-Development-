import React from 'react';
import { SafeAreaView, Text, StyleSheet, ScrollView } from 'react-native';

const TCDetails = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Terms and Conditions</Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.sectionText}>
          By using our app, you agree to comply with these Terms and Conditions. If you do not agree, please do not use our services.
        </Text>

        <Text style={styles.sectionTitle}>2. User Accounts</Text>
        <Text style={styles.sectionText}>
          You must create an account to use certain features of the app. You are responsible for maintaining the confidentiality of your account information.
        </Text>

        <Text style={styles.sectionTitle}>3. Investment Risks</Text>
        <Text style={styles.sectionText}>
          Investments carry risks, and you should carefully consider your financial situation before investing. We do not guarantee profits or returns on investments.
        </Text>

        <Text style={styles.sectionTitle}>4. User Obligations</Text>
        <Text style={styles.sectionText}>
          You agree to provide accurate information and to update it as necessary. You also agree to comply with all applicable laws and regulations.
        </Text>

        <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
        <Text style={styles.sectionText}>
          Our liability is limited to the fullest extent permitted by law. We are not responsible for any indirect, incidental, or consequential damages.
        </Text>

        <Text style={styles.sectionTitle}>6. Changes to Terms</Text>
        <Text style={styles.sectionText}>
          We reserve the right to modify these Terms and Conditions at any time. Your continued use of the app after changes constitutes acceptance of the new terms.
        </Text>

        <Text style={styles.sectionTitle}>7. Contact Information</Text>
        <Text style={styles.sectionText}>
          If you have any questions about these Terms and Conditions, please contact us at support@example.com.
        </Text>

        <Text style={styles.sectionTitle}>8. Governing Law</Text>
        <Text style={styles.sectionText}>
          These Terms and Conditions are governed by the laws of [Your Jurisdiction].
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light background color for the whole screen
    marginTop:25,
  },
  scrollView: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#333', // Dark text color for better readability
    marginBottom: 12,
  },
});

export default TCDetails;
