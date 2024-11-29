import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

const SettingsScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false); // Initially hidden
  const [selectedItem, setSelectedItem] = useState(null);

  const menuItems = [
    { label: 'Marketplace', screen: 'Marketplace', icon: 'storefront-outline' },
    { label: 'Portfolio', screen: 'Portfolio', icon: 'chart-pie' },
    { label: 'Wallet', screen: 'Wallet', icon: 'wallet-outline' },
    { label: 'Profile', screen: 'Profile', icon: 'account-outline' },
    { label: 'Notifications', screen: 'Notifications', icon: 'bell-outline' },
    { label: 'Help Center', screen: 'HelpCenter', icon: 'help-circle-outline' },
    { label: 'Log Out', screen: 'LogOut', icon: 'logout' },
  ];

  const closeModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  const handleSelection = (item, screen) => {
    setSelectedItem(item);
    setModalVisible(false); // Close the modal after selection
    navigation.navigate(screen);
  };

  // Reset modal visibility when returning to the screen
  useFocusEffect(
    useCallback(() => {
      setModalVisible(true); // Show modal when the screen is focused
      return () => setModalVisible(false); // Cleanup when unfocused
    }, [])
  );

  return (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="slide"
      onRequestClose={closeModal}
    >
      <SafeAreaView style={styles.container}>
        {/* Overlay */}
        <View style={styles.overlay} />

        {/* Modal Content */}
        <View style={styles.modalContent}>
          {/* Close Button */}
          <Pressable style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>✖</Text>
          </Pressable>

          {/* Menu Items */}
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {menuItems.map(({ label, screen, icon }) => (
              <TouchableOpacity
                key={label}
                style={[
                  styles.menuItem,
                  selectedItem === label && styles.selectedMenuItem,
                ]}
                onPress={() => handleSelection(label, screen)}
              >
                <Icon
                  name={icon}
                  size={20}
                  style={[
                    styles.menuIcon,
                    selectedItem === label && styles.selectedMenuIcon,
                  ]}
                />
                <Text
                  style={[
                    styles.menuText,
                    selectedItem === label && styles.selectedMenuText,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  },
  modalContent: {
    width: '95%',
    height: '70%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
    position: 'absolute',
    bottom: 0,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 18,
    color: '#000',
    marginLeft: 15,
  },
  menuIcon: {
    color: '#bbcfdc', // Lime green icon
  },
  selectedMenuItem: {
    backgroundColor: '#004AAD',
  },
  selectedMenuText: {
    color: '#fff',
  },
  selectedMenuIcon: {
    color: '#fff',
  },
});

export default SettingsScreen;
