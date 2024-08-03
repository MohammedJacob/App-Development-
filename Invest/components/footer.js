import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

const FooterTabs = ({ navigation }) => {
  const isActiveTab = (tab) => navigation.getState().routes[navigation.getState().index].name === tab;

  const tabs = [
    { name: 'Home', icon: 'https://cdn-icons-png.freepik.com/512/20/20176.png', label: 'Projects' },
    { name: 'Wallet', icon: 'https://pnghq.com/wp-content/uploads/free-wallet-png-images-without-background.png', label: 'Wallet' },
    { name: 'Portfolio', icon: 'https://cdn-icons-png.flaticon.com/512/122/122072.png', label: 'Portfolio' },
    { name: 'Profile', icon: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Free-Download.png', label: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab.name} onPress={() => navigation.navigate(tab.name)} style={styles.tab}>
          <Image
            source={{ uri: tab.icon }}
            style={[styles.icon, { tintColor: isActiveTab(tab.name) ? '#394052' : '#97b1c0' }]}
          />
          <Text style={[styles.label, { color: isActiveTab(tab.name) ? '#394052' : 'grey' }]}>{tab.label}</Text>
          {isActiveTab(tab.name) && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#fefefe',
    backgroundColor: '#fcfcfc',
    paddingVertical: 7,
  },
  tab: {
    alignItems: 'center',
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 6,
  },
  activeIndicator: {
    height: 4,
    marginTop: 5,
    width: '100%',
  },
});

export default FooterTabs;
