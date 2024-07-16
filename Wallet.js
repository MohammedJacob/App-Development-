import React from 'react';
import { SafeAreaView, Text, StyleSheet, ImageBackground } from 'react-native';

const WalletScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://t3.ftcdn.net/jpg/03/89/93/32/360_F_389933228_BPMlKUev7J1u8AhZNhWAwRQqmoYwLDIM.jpg' }}
        style={styles.cardBackground}
      >
        <Text style={styles.title}>Wallet</Text>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBackground: {
    width: '100%',
    height: 200, // Adjust height as per your image aspect ratio
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white', // Ensuring the title is readable against the card background
    textAlign: 'center',
    marginTop: 20, // Adjust as needed to position the title below the card image
  },
});

export default WalletScreen;
