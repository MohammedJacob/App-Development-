import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, Switch, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // You may need to install this library

const SettingsScreen = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [activeSection, setActiveSection] = useState('Profile'); // Default active section is 'Profile'

  const handlePress = (screenName, section) => {
    // Toggle the active section; if clicked again, it will collapse
    setActiveSection(prevSection => (prevSection === section ? '' : section));
    if (screenName && section !== 'Profile') {
      navigation.navigate(screenName);
    }
  };

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Profile Group */}
        <TouchableOpacity
          style={[styles.header, activeSection === 'Profile' && styles.activeHeader]} 
          onPress={() => handlePress(null, 'Profile')} // No navigation for Profile, just toggling
        >
          <Text style={styles.headerText}>
            <Icon name="person-outline" size={20} /> Profile
          </Text>
        </TouchableOpacity>

        {/* Only show Profile group when active */}
        {activeSection === 'Profile' && (
          <View style={styles.indexGroup}>
            <TouchableOpacity 
              style={[styles.setting, activeSection === 'Security' && styles.activeSetting]}
              onPress={() => handlePress('SecurityScreen', 'Security')}
            >
              <View style={styles.settingLeft}>
                <Icon name="shield-outline" size={20} color="#fff" />
                <Text style={styles.settingText}>Security</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.setting, activeSection === 'SocialConnections' && styles.activeSetting]}
                                                                                                                                                                                                                                                                                                                                                                                                                                                    onPress={() => handlePress('SocialConnectionsScreen', 'SocialConnections')}
            >
              <View style={styles.settingLeft}>
                <Icon name="people-outline" size={20} color="#fff" />
                <Text style={styles.settingText}>Social Connections</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.setting, activeSection === 'LoginHistory' && styles.activeSetting]}
              onPress={() => handlePress('LoginHistoryScreen', 'LoginHistory')}
            >
              <View style={styles.settingLeft}>
                <Icon name="time-outline" size={20} color="#fff" />
                <Text style={styles.settingText}>Login History</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.setting, activeSection === 'KYC' && styles.activeSetting]}
              onPress={() => handlePress('KYC', 'KYC')}
            >
              <View style={styles.settingLeft}>
                <Icon name="document-text-outline" size={20} color="#fff" />
                <Text style={styles.settingText}>KYC</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.setting, activeSection === 'TandC' && styles.activeSetting]}
              onPress={() => handlePress('T&CScreen', 'TandC')}
            >
              <View style={styles.settingLeft}>
                <Icon name="document-outline" size={20} color="#fff" />
                <Text style={styles.settingText}>Terms & Conditions</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Notifications & Help Center Group */}
        <View>
          <TouchableOpacity
            style={[styles.header, activeSection === 'Notifications' && styles.activeHeader]} 
            onPress={() => handlePress(null, 'Notifications')} // No navigation, just toggle
          >
            <View style={styles.settingLeft}>
              <Icon name="notifications-outline" size={20} color="#fff" />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
          </TouchableOpacity>

          {/* Display Notifications subcategory when active */}
          {activeSection === 'Notifications' && (
            <View style={styles.indexGroup}>
              <View style={styles.settingLeft}>
                <Text style={styles.subCategoryText}>Enable Notifications</Text>
              </View>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#5EFF5E" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.header, activeSection === 'HelpCenter' && styles.activeHeader]} 
            onPress={() => handlePress(null, 'HelpCenter')} // No navigation, just toggle
          >
            <View style={styles.settingLeft}>
              <Icon name="help-circle-outline" size={20} color="#fff" />
              <Text style={styles.settingText}>Help Center</Text>
            </View>
          </TouchableOpacity>

          {/* Display Help Center subcategories when active */}
          {activeSection === 'HelpCenter' && (
            <View style={styles.indexGroup}>
              {/* About Us Subcategory */}
              <TouchableOpacity 
                style={[styles.setting, activeSection === 'About Us' && styles.activeSetting]}
                onPress={() => handlePress('AboutUsScreen', 'AboutUs')}
              >
                <View style={styles.settingLeft}>
                  <Icon name="information-circle-outline" size={20} color="#fff" />
                  <Text style={styles.settingText}>About Us</Text>
                </View>
              </TouchableOpacity>

              {/* FAQ Subcategory */}
              <TouchableOpacity 
                style={[styles.setting, activeSection === 'FAQ' && styles.activeSetting]}
                onPress={() => handlePress('FAQScreen', 'FAQ')}
              >
                <View style={styles.settingLeft}>
                  <Icon name="help-buoy-outline" size={20} color="#fff" />
                  <Text style={styles.settingText}>FAQ</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f24', // Dark background color
  },
  header: {
    backgroundColor: '#1e40af', // Header background color
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#6b21a8', // Border color
  },
  activeHeader: {
    borderBottomWidth: 3,
    borderColor: '#f72585', // Highlight border color when active
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingHorizontal: 15,
  },
  indexGroup: {
    marginTop: 10, // Group elements with spacing
    left: 40,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  activeSetting: {
    backgroundColor: '#242a37', // Highlight active section background
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 15,
  },
  subCategoryText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SettingsScreen;
