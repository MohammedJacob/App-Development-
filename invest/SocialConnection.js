import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Linking, SafeAreaView } from 'react-native'; // Import SafeAreaView from react-native
import { useUser } from './UserContext';
import Header from './components/Header';
import FooterTabs from './components/footer';
import axios from 'axios';

const SocialConnection = ({ navigation }) => {
  const { userData } = useUser(); // Access user data from context
  const [socialLink, setSocialLink] = useState(''); // Default social link
  const [linkName, setLinkName] = useState(''); // Default name for the link
  const [savedLinks, setSavedLinks] = useState([]); // To store and display saved links

  // Fetch all social links when the component loads
  useEffect(() => {
    const fetchLinks = async () => {
      if (!userData || !userData.id) {
        console.warn('User ID is not available, cannot fetch links.');
        return;
      }

      try {
        const apiEndpoint = `http://192.168.1.241:3000/api/social_links/${userData.id}`;
        const response = await axios.get(apiEndpoint);

        if (response.data && response.data.links) {
          setSavedLinks(response.data.links);
        } else {
          setSavedLinks([]);
        }
      } catch (error) {
        console.error('Error fetching social links:', error.message);
      }
    };

    fetchLinks();
  }, [userData]); // Effect runs when userData changes

  const handleSaveLink = async () => {
    if (!socialLink || !linkName) {
      alert('Please enter both a name and a valid link');
      return;
    }

    if (!userData || !userData.id) {
      alert('User ID is not available. Please login first.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.241:3000/api/social_links', {
        user_id: userData.id, // Send the user_id to the backend
        link: socialLink,
        name: linkName, // Send the name of the link to the server
      });

      if (response.data.message === 'Link saved successfully') {
        alert('Link saved successfully!');
        setSocialLink('');
        setLinkName('');

        // Fetch updated links after saving
        const fetchLinks = async () => {
          try {
            const response = await axios.get(`http://192.168.1.241:3000/api/social_links/${userData.id}`);
            if (response.data && response.data.links) {
              setSavedLinks(response.data.links);
            } else {
              setSavedLinks([]);
            }
          } catch (error) {
            console.error('Error fetching updated social links:', error.message);
          }
        };

        fetchLinks();
      } else {
        alert('Failed to save link. Please try again.');
      }
    } catch (error) {
      console.error('Error saving social link:', error.message);
      alert('Error saving link. Please check the console for details.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header />
        <View style={styles.content}>
          <Text style={styles.title}>Social Links</Text>

          {/* Input for Name of the Link */}
          <TextInput
            style={styles.textInput}
            placeholder="Name of Link (e.g., Portfolio)"
            value={linkName}
            onChangeText={setLinkName}
          />

          {/* Input for the actual link */}
          <TextInput
            style={styles.textInput}
            placeholder="Paste your social link here"
            value={socialLink}
            onChangeText={setSocialLink}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveLink}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>

          <Text style={styles.savedLinksTitle}>Saved Links</Text>
          <View style={styles.linksContainer}>
            {savedLinks.length > 0 ? (
              savedLinks.map((link) => (
                <View key={link.id} style={styles.savedLinkCard}>
                  <TouchableOpacity onPress={() => Linking.openURL(link.link)}>
                    <Text style={styles.linkName}>{link.link_name}</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noLinksText}>No links saved yet.</Text>
            )}
          </View>
        </View>
      </ScrollView>
      <FooterTabs />
    </SafeAreaView>
  );
}; 

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8F9FA',
        paddingStart: 15,
        paddingEnd: 15,
      },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  textInput: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#0056B3',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  savedLinksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#333',
  },
  linksContainer: {
    width: '100%',
  },
  savedLinkCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Shadow for Android
  },
  linkName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0056B3',
    textDecorationLine: 'underline', // Make it look like a link
  },
  noLinksText: {
    fontSize: 16,
    color: '#888',
  },
});

export default SocialConnection;
