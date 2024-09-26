import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, Switch } from 'react-native';

const SettingsScreen = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.setting} onPress={toggleSwitch}>
          <Text style={styles.settingText}>Enable Notifications</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#5EFF5E" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.setting} onPress={() => handlePress('About Us')}>
          <Text style={styles.settingText}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.setting} onPress={() => handlePress('Privacy Policy')}>
          <Text style={styles.settingText}>Privacy</Text>

          <TouchableOpacity style={styles.setting} onPress={() => handlePress('Privacy Policy')}>
          <Text style={styles.settingText}>change password</Text>
        </TouchableOpacity>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  settingText: {
    fontSize: 18,
  },
});

export default SettingsScreen;
