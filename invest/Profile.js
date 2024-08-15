import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, SafeAreaView } from 'react-native';
import FooterTabs from './components/footer'; // Import FooterTabs component

const ProfileScreen = ({ route, navigation }) => {
  // Safely retrieve the userData, fallback to empty object if not available
  const userData = route?.params?.userData || {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: userData.profileImage || 'https://www.pngall.com/wp-content/uploads/5/Profile-PNG-Clipart.png' }}
            style={styles.profileImage}
          />
        </View>

        <Text style={styles.header}>Profile</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Personal Information</Text>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>Name: {userData.name || 'N/A'}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>Age: {userData.age || 'N/A'}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>Location: {userData.location || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Bio</Text>
          <Text style={styles.text}>
            {userData.bio || 'No bio available.'}
          </Text>
        </View>
        
        {/* Spacer to push content above the footer */}
        <View style={styles.spacer} />

      </ScrollView>

      {/* FooterTabs component positioned at the bottom */}
      <FooterTabs navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60, // Adjust paddingBottom to accommodate the footer
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  listItemText: {
    fontSize: 16,
  },
  spacer: {
    height: 60, // Same as the paddingBottom in scrollContainer
  },
});

export default ProfileScreen;

