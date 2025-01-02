import React, { useState, useEffect,  useRef } from 'react';
import {
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Easing,
  View,
  Animated,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google';
import * as ImagePicker from 'expo-image-picker';
import * as AuthSession from 'expo-auth-session';

// Replace with your actual Android Client ID
const GOOGLE_ANDROID_CLIENT_ID = "260925531937-071qparpuvf8u1ih66l3ije15b34v3bn.apps.googleusercontent.com";

const SignupPage = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRequirements, setShowRequirements] = useState(false);
  const heightAnim = useRef(new Animated.Value(0)).current; 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({

    
    name: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Animate when showRequirements changes
    Animated.timing(heightAnim, {
      toValue: showRequirements ? 140 : 0, // Height of the box
      duration: 300, // Duration of animation
      easing: Easing.out(Easing.ease), // Smooth easing
      useNativeDriver: false, // Use native driver for non-layout properties
    }).start();
  }, [showRequirements]);

  const [expandedCard, setExpandedCard] = useState(null); // Track the expanded card

  const navigation = useNavigation();

  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    redirectUri,
    scopes: ['openid', 'profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        getUserInfo(authentication.accessToken);
      }
    }
  }, [response]);

  const getUserInfo = async (token) => {
    try {
      const userResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user information.");
      }

      const user = await userResponse.json();
      Alert.alert('Google Sign-In Success', `Welcome ${user.name}`);
      navigation.navigate('Home');
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Failed to fetch user information.');
    }
  };

  const handleSubmit = async () => {
    const isValid = validateInputs();
    if (!isValid) return;

    setLoading(true);
    try {
      const response = await axios.post('http://192.168.1.241:3000/addUser', {
        name,
        last_name: lastName,
        email_address: emailAddress.trim().toLowerCase(),
        password,
        joined_date: new Date().toISOString().split('T')[0],
      });

      if (response.status === 201) {
        navigation.navigate('LoginMethod');
      } else {
        Alert.alert('Error', 'Failed to add User');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Network error, please try again';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = () => {
    let valid = true;
    let newErrors = {
      name: '',
      lastName: '',
      emailAddress: '',
      password: '',
      confirmPassword: '',
    };
  
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
  
    if (!lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
      valid = false;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailAddress.trim()) {
      newErrors.emailAddress = 'Email Address is required';
      valid = false;
    } else if (!emailRegex.test(emailAddress.trim())) {
      newErrors.emailAddress = 'Invalid email format';
      valid = false;
    }
  
    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
      setShowRequirements(true); // Show requirements if password is empty
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
      setShowRequirements(true); // Show requirements if password is invalid
    } else {
      setShowRequirements(false); // Hide requirements if password is valid
    }
  
    if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
  
    setErrors(newErrors);
    return valid;
  };
  



  const toggleCard = (cardName) => {
    setExpandedCard((prevCard) => (prevCard === cardName ? null : cardName));
  };

  const handleSignInPress = () => {
    navigation.navigate('LoginMethodEmail');
  };

  const handleGoogleLogin = () => {
    navigation.navigate('Onboarding');
  };

  const handleVerifyIdentity = () => {
    console.log("Navigating to Welcome page...");
    
    // Navigate to Welcome page directly
    Alert.alert("Add veriff");
  };
  
  const launchImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (result.cancelled) {
        console.log("Image selection cancelled");
        return;
      }
  
      console.log("Image selected:", result.uri);
      Alert.alert('Image selected', `Image URI: ${result.uri}`);
    } catch (error) {
      console.error("Error launching image picker:", error);
      Alert.alert('Error', 'An error occurred while trying to open the image picker.');
    }
  };
  
  
  
  
  

  const handleGuestLogin = () => {
    Alert.alert(
      'Guest Login',
      'Some features may be restricted if you don’t sign in.',
      [
        {
          text: 'Continue as Guest',
          onPress: () => navigation.navigate('Welcome'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View>
            <Text style={styles.cardTitle}>Sign up</Text>
          </View>
          <View style={styles.form}>
            <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={emailAddress}
              onChangeText={setEmailAddress}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showPasswordButton}>
                <Image
                  source={{
                    uri: showPassword
                      ? 'https://img.icons8.com/material-outlined/24/000000/visible.png'
                      : 'https://img.icons8.com/material-outlined/24/000000/invisible.png',
                  }}
                  style={styles.showPasswordsicon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.showPasswordButton}
              >
                <Image
                  source={{
                    uri: showConfirmPassword
                      ? 'https://img.icons8.com/material-outlined/24/000000/visible.png'
                      : 'https://img.icons8.com/material-outlined/24/000000/invisible.png',
                  }}
                  style={styles.showPasswordsicon}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
          onPress={() => setShowRequirements(!showRequirements)}
          style={styles.infoButton}
        >
          <Text style={styles.infoIcon}>ℹ️</Text>
        </TouchableOpacity>

            {errors.confirmPassword ? <Text>{errors.confirmPassword}</Text> : null}

            <View>
      

      {/* Smoothly expanding requirements box */}
      <Animated.View
        style={{
          height: heightAnim,
          overflow: 'hidden',
          backgroundColor: '#f0f0f0',
          borderRadius: 5,
        }}
      >
           <Text>Password Requirements:</Text>
                <Text>• Must be at least 8 characters long</Text>
                <Text>• Must contain at least 1 uppercase letter</Text>
                <Text>• Must contain at least 1 lowercase letter</Text>
                <Text>• Must contain at least 1 number</Text>
      </Animated.View>
    </View>

            
            <Text style={styles.linkText} onPress={() => navigation.navigate('TandCdetails')}>
            <Text style={styles.signinLink}> Terms & Conditions</Text> and <Text style={styles.signinLink}>Risk Statement</Text>
            </Text>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Create account</Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.orText}>or</Text>


          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image
          source={{ uri: 'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png' }}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Sign In with Google</Text>
      </TouchableOpacity>

          {/* Sign In and Continue as Guest Links */}
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>
              Already have an account?{' '}
              <Text style={styles.signinLink} onPress={handleSignInPress}>
                Sign In
              </Text>
            </Text>
            <Text style={styles.signinLink} onPress={handleGuestLogin}>
              Continue as Guest
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:15,
    paddingTop:35,
    backgroundColor: '#F9F9F9',
  },
  scrollContainer: {
    paddingBottom: 40,
  },

  signinButton: {
    backgroundColor: '#090909', 
    paddingVertical: 12,     
    borderRadius: 5,     
    alignItems: 'center',       
    justifyContent: 'center',    
    marginTop: 20,              
  },
  
  signinButtonText: {
    color: '#FFF',             
    fontSize: 16,           
    textAlign: 'center',
   },
  
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '900',
    textAlign:'center',
    color: '#333',
  },
  cardTime: {
    fontSize: 14,
    color: '#666',
    fontWeight:'900',
  },
  form: {
    marginTop: 16,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
  passwordContainer: {
    position: 'relative',
    height: 45,
    marginBottom: 10,
  },
  passwordInput: {
    height: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingRight: 50,
    backgroundColor: '#FFF',
  },
  showPasswordButton: {
    position: 'absolute',
    right: 15,
    top: 10,
  },
  showPasswordsicon: {
    width: 24,
    height: 24,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    height: 55,
    marginTop:20,
    marginBottom:20,

    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
  },

  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  orText: {
    textAlign: 'center',
    color: '#aaa',
    marginVertical: 10,
  },
  googleButtonText: {
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
  },
  
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
  },
  signinLink: {
    textAlign:'center',
    color: '#3e89f7',
    marginLeft: 5,
    marginTop:15,
    textDecorationLine: 'underline',
  },

  verifyButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
  },

  infoButton: {
    alignSelf: 'flex-end', // Aligns the button to the end of the row
    marginLeft: 8,
    paddingBottom: 10,
    paddingTop: 5,
  },

  infoIcon:{
    justifyContent:'flex-end',
  },
  requirementsBox: {
    backgroundColor: '#edf5ff', // Light blue background
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  
  requirementsText: {
    color: '#991515', // Darker text color for contrast
    fontSize: 14,
  },

  skipButton: {
    backgroundColor: '#090909', // Choose your desired background color
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
    marginTop: 20, // Optional margin for spacing
  },
  skipButtonText: {
    color: '#fff', // Choose your desired text color
    fontSize: 16,
    textAlign:'center'
  },

  linkText: {
    textAlign:'center'
  },

  requirementsText: {
    fontSize: 16,
    color: 'black', // Default color
  },
  invalid: {
    color: 'red', // Turns red when the password doesn't meet the criteria
  },
});

export default SignupPage;
