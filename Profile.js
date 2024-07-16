import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';

const ProfileScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: 'https://www.pngall.com/wp-content/uploads/5/Profile-PNG-Clipart.png' }}
          style={styles.profileImage}
        />
      </View>

      <Text style={styles.header}>Profile</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Personal Information</Text>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>Name: John Doe</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>Age: 30</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>Location: New York, USA</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Bio</Text>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod ex auctor ipsum
          consequat, nec venenatis quam vulputate.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 40,
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
});

export default ProfileScreen;
