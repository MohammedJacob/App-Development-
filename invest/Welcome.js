import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // For gradient background
import Footer from './components/footer'; // Assuming you have a FooterTabs component

const Welcome = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#e0f7fa', '#a7ffeb']}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        {/* Main Content: Title and Subtitle */}
        <View style={styles.content}>
          <Text style={styles.title}>Join The Renewable Energy Revolution</Text>
          <Text style={styles.subtitle}>
            Invest in solar panels, wind turbines, and more through tokenized equity. Earn yields and contribute to a sustainable future with our platform.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Footer navigation={navigation} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Welcome;

const styles = {
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2545',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#4f6367',
    textAlign: 'center',
    marginBottom: 24,
  },
  footerContainer: {
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    elevation: 2, // Add shadow/elevation similar to the PortfolioScreen footer
  },
};
