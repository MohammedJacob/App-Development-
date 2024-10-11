import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const FooterTabs = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const tabs = [
    { name: 'Welcome', icon: 'https://cdn-icons-png.freepik.com/512/20/20176.png', label: 'Welcome' },
    { name: 'Home', icon: 'https://cdn-icons-png.flaticon.com/512/2192/2192329.png', label: 'Projects' },
    { name: 'Portfolio', icon: 'https://cdn-icons-png.flaticon.com/512/122/122072.png', label: 'Portfolio' },
    { name: 'Profile', icon: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Free-Download.png', label: 'Profile' },
  ];

  // Get the current route name from the navigation state
  const getActiveTab = () => {
    const routes = navigation.getState()?.routes || [];
    const index = navigation.getState()?.index || 0;
    return routes[index]?.name;
  };

  const activeTab = getActiveTab();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          onPress={() => navigation.navigate(tab.name)}
          style={styles.tab}
        >
          <Image
            source={{ uri: tab.icon }}
            style={[styles.icon, { tintColor: activeTab === tab.name ? '#394052' : '#97b1c0' }]}
          />
          <Text style={[styles.label, { color: activeTab === tab.name ? '#394052' : 'grey' }]}>{tab.label}</Text>
          {activeTab === tab.name && <View style={styles.activeIndicator} />}
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
    backgroundColor: '#394052',
  },
});

export default FooterTabs;
