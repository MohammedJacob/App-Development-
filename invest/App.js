import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import creditCardType from 'credit-card-type';
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  TextInput
} from 'react-native';
import { Card as PaperCard } from 'react-native-paper';

import SettingsImage from './assets/settings.png';
import SearchIcon from './assets/SearchIcon.png';
import Footer from './components/footer';
import SettingsScreen from './SettingScreen';
import LoginMethod from './login-method';
import LoginMethodEmail from './loginmethod-email';
import AboutUsScreen from './Aboutus';
import PaymentScreen from './payment';
import ProfileScreen from './Profile';
import WalletScreen from './Wallet';
import PrivacyPolicyScreen from './Privacypolicy';
import PortfolioScreen from './Portfolio';
import DepositPage from './depositpage';
import WithdrawPage from './Withdrawpage';
import Onboarding from './Onboarding';
import SignUp from './SignUp';

const Stack = createStackNavigator();

// Fetching cards from the API
const fetchCards = async () => {
  try {
    const response = await fetch('http://192.168.1.241:3000/api/cards');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching cards:', error);
    Alert.alert('Network Error', 'Failed to load data. Please try again later.');
    return [];
  }
};

// Card component
const Card = ({ card, onPress }) => {
  const currentPrice = parseFloat(card.price.replace(/[^0-9.-]+/g, ''));
  const targetPrice = parseFloat(card.targetPrice.replace(/[^0-9.-]+/g, ''));
  const fundedPercentage = targetPrice ? Math.min(100, (currentPrice / targetPrice) * 100) : 0;
  return (
    <TouchableOpacity onPress={onPress}>
      <PaperCard style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderContent}>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardPrice}>{card.price}</Text>
            </View>
            <Text style={styles.cardTarget}>{card.targetPrice}</Text>
          </View>
          <Image source={{ uri: card.image }} style={styles.image} />
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${fundedPercentage}%` }]} />
        </View>
        <PaperCard.Content style={styles.cardContent}>
          <View style={styles.cardRow}>
            {['return_value', 'investment', 'yield'].map(key => (
              <React.Fragment key={key}>
                <View style={styles.cardColumn}>
                  <Text style={styles.cardValue}>{card[key] ? card[key].split(': ')[1] : 'N/A'}</Text>
                  <Text style={styles.cardLabel}>{key.replace(/^\w/, c => c.toUpperCase())}</Text>
                </View>
                {key !== 'yield' && <View style={styles.verticalDivider} />}
              </React.Fragment>
            ))}
          </View>
        </PaperCard.Content>
      </PaperCard>
    </TouchableOpacity>
  );
};

// Home screen component
const HomeScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Available');
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const loadCards = async () => {
      const fetchedCards = await fetchCards();
      setCards(fetchedCards);
    };

    // Load cards initially
    loadCards();

    // Set up polling to fetch cards every 1000 milliseconds
    const interval = setInterval(loadCards, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const filterCards = (cards) => {
    const getPrice = (price) => parseFloat(price.replace(/[^0-9.-]+/g, ''));
    return cards.filter(card => {
      const currentPrice = getPrice(card.price);
      const targetPrice = getPrice(card.targetPrice);
      return activeTab === 'Available' ? currentPrice < targetPrice : currentPrice >= targetPrice;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Sites</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Search')} style={styles.iconButton}>
            <Image source={SearchIcon} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.iconButton}>
            <Image source={SettingsImage} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabContainer}>
        {['Available', 'Sold'].map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tab}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            {activeTab === tab && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView}>
        {filterCards(cards).map(card => (
          <Card
            key={card.id}
            card={card}
            onPress={() => navigation.navigate('Details', { card })}
          />
        ))}
      </ScrollView>
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

const DetailsScreen = ({ route, navigation }) => {
  const { card } = route.params;
  const [amount, setAmount] = useState('');
  const [numberOnCard, setNumberCard] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');


  const currentPrice = parseFloat(card.price.replace(/[^0-9.-]+/g, ''));
  const targetPrice = parseFloat(card.targetPrice.replace(/[^0-9.-]+/g, ''));
  const remainingAmount = targetPrice - currentPrice;


  const handleInvest = async () => {
    // Validate if investment amount exceeds remaining amount
    if (parseFloat(investmentAmount) > remainingAmount) {
      Alert.alert(`Amount entered exceeds the remaining traget price`);
      return;
    }
    if (!nameOnCard || !cvv || !expiryDate || !investmentAmount) {
      Alert.alert('Input Error', 'Please fill out all fields.');
      return;
    }

    try {
      // Update the card price
      const response = await fetch(`http://192.168.1.241:3000/api/cards/${card.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: investmentAmount }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const updatedCard = await response.json();
      Alert.alert('Success', 'Card price updated successfully.');
      navigation.navigate('Home', { card: updatedCard, investmentAmount });
    } catch (error) {
      console.error('Error updating card price:', error);
      Alert.alert('Update Error', 'Failed to update card price. Please try again later.');
    }
  };

  // Formatting functions
  const formatCardNumber = (text) => {
    const digits = text.replace(/\D/g, '');
    const limitedDigits = digits.slice(0, 16);
    const formatted = limitedDigits.replace(/(.{4})/g, '$1 ').trim();
    return formatted;
  };

  const handleCardNumberChange = (text) => {
    const formattedText = formatCardNumber(text);
    setNumberCard(formattedText);
  };

  const handleCVVChange = (text) => {
    const formattedText = text.replace(/[^0-9]/g, '').slice(0, 3);
    setCvv(formattedText);
  };

  const handleExpiryDateChange = (text) => {
    let formattedText = text.replace(/\D/g, '').slice(0, 4);
    if (formattedText.length > 2) {
      formattedText = `${formattedText.slice(0, 2)}/${formattedText.slice(2)}`;
    }

    const [mm, yy] = formattedText.split('/');
    if (mm && parseInt(mm) > 12) {
      formattedText = `12/${yy || ''}`;
    }

    setExpiryDate(formattedText);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.detailsContainer}>
          <Image source={{ uri: card.image }} style={styles.detail_image} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardText}>Card Type: {card.cardType || 'N/A'}</Text>
            <Text style={styles.cardText}>Return Value: {card.return_value || 'N/A'}</Text>
            <Text style={styles.cardText}>Investment: {card.investment || 'N/A'}</Text>
            <Text style={styles.cardText}>Yield: {card.yield || 'N/A'}</Text>
            {card.targetPrice && <Text style={styles.cardText}>Target Price: {card.targetPrice}</Text>}
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Enter card detail:</Text>
            <TextInput
              style={styles.amountInput}
              value={nameOnCard}
              onChangeText={text => setNameOnCard(text)}
              placeholder="Name on bank card"
            />
          </View>

          <View style={styles.amountContainer}>
            <TextInput
              style={styles.amountInput}
              value={numberOnCard}
              onChangeText={handleCardNumberChange}
              keyboardType="numeric"
              placeholder="Card number"
              maxLength={19} // 16 digits + 3 spaces
            />
          </View>

          <View style={styles.rowContainer}>
        <TextInput
          style={[styles.amountInput, { flex: 1, marginRight: 10 }]}
          placeholder="MM/YY"
          value={expiryDate}
          onChangeText={handleExpiryDateChange}
          keyboardType="numeric"
          maxLength={5} 
        />
        
        <TextInput
          style={[styles.amountInput, { flex: 1 }]}
          placeholder="CVV"
          value={cvv}
          onChangeText={handleCVVChange }
          keyboardType="numeric"
          maxLength={3}
        />
      </View>

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Enter Investment Amount:</Text>
            <TextInput
              style={styles.amountInput}
              value={investmentAmount}
              onChangeText={text => setInvestmentAmount(text)}
              keyboardType="numeric"
              placeholder="0.00"
            />
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.investButton,
            (!numberOnCard || !nameOnCard || !cvv || !expiryDate || !investmentAmount) && { backgroundColor: '#ccc' }
          ]}
          onPress={handleInvest}
          disabled={!numberOnCard || !nameOnCard || !cvv || !expiryDate || !investmentAmount}
        >
          <Text style={styles.investButtonText}>Invest</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// App component
const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="SignUp">
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="LoginMethod" component={LoginMethod} options={{ headerShown: false }} />
      <Stack.Screen name="LoginMethodEmail" component={LoginMethodEmail} options={{ headerShown: false }} />
      <Stack.Screen name="About Us" component={AboutUsScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Privacy Policy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="Portfolio" component={PortfolioScreen} />
      <Stack.Screen name="Deposit" component={DepositPage} />
      <Stack.Screen name="Withdraw" component={WithdrawPage} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa', // Light background color for the whole screen
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16,
    backgroundColor: '#fff', // Background color for the header
    borderBottomWidth: 1, // Bottom border for the header
    borderBottomColor: '#ccc',
  },
  headerText: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#333', // Darker text color for better readability
  },
  iconContainer: { 
    flexDirection: 'row' 
  },
  iconButton: { 
    marginLeft: 16 
  },
  icon: { 
    width: 24, 
    height: 24 
  },
  tabContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc' 
  },
  tab: { 
    padding: 16 
  },
  tabText: { 
    fontSize: 16, 
    color: '#555', // Slightly lighter text color for inactive tabs
  },
  activeTabText: { 
    fontWeight: 'bold', 
    color: '#000' 
  },
  activeTabIndicator: { 
    height: 2, 
    backgroundColor: '#000', 
    marginTop: 8 
  },
  scrollView: { 
    flex: 1, 
    padding: 16 
  },
  scrollViewContent: { 
    flexGrow: 1, 
    paddingBottom: 80 
  },
  card: { 
    marginBottom: 16 
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 4 
  },
  cardHeaderContent: { 
    flex: 1 
  },
  cardHeaderText: { 
    marginBottom: 8 
  },
  cardTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#333', // Darker title text color
  },
  cardPrice: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#34c659' 
  },
  cardTarget: { 
    fontSize: 14, 
    color: '#888' 
  },
  image: { 
    width: 100, 
    height: 100, 
    borderRadius: 8 
  },
  detail_image: { 
    width: 250,
    height:259,
    borderRadius: 8 
  },
  progressBarContainer: { 
    height: 8, 
    backgroundColor: '#eee', 
    borderRadius: 4, 
    overflow: 'hidden', 
    marginTop: 8 
  },
  progressBar: { 
    height: '100%', 
    backgroundColor: '#57d577' 
  },
  cardContent: { 
    padding: 16 
  },
  cardRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  cardColumn: { 
    flex: 1, 
    alignItems: 'center' 
  },
  cardValue: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  cardLabel: { 
    fontSize: 14, 
    color: '#888' 
  },
  verticalDivider: { 
    width: 1, 
    height: '100%', 
    backgroundColor: '#ccc', 
    marginHorizontal: 8 
  },
  investButton: { 
    backgroundColor: '#34c659', 
    padding: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 8, 
    position: 'relative', 
    bottom:0, 
    left:0, 
    right:0 
  },
  investButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  saveButton: { 
    backgroundColor: '#007bff', 
    padding: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 8, 
    position: 'absolute', 
    bottom: 16, 
    left: 16, 
    right: 16 
  },
  saveButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  detailsSection: { 
    margin: 16, 
    backgroundColor: '#fff', // White background for detail sections
    borderRadius: 8, // Rounded corners
    padding: 11, // Padding inside the section
    shadowColor: '#000', // Light shadow for elevation effect
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailsText: { 
    fontSize: 16, 
    marginBottom: 8,
    color: '#555', // Darker text color for details
  },
  amountContainer: { 
    margin: 16 
  },
  amountLabel: { 
    fontSize: 16, 
    marginBottom: 8,
    color: '#333', // Darker label text color
    fontWeight: 'bold',
  },
  amountInput: { 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 9, 
    backgroundColor: '#fff', // White background for input
    color: '#000', // Black text color for input
  },
  cardTitleInput: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc', 
    paddingBottom: 4, 
    color: '#333', // Darker text color for title input
  },
  cardPriceInput: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#34c659', 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc', 
    paddingBottom: 4 
  },
  cardTextInput: { 
    fontSize: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc', 
    marginBottom: 8, 
    paddingBottom: 4, 
    color: '#555', // Darker text color for card text input
  },
  detailsInput: { 
    fontSize: 160, 
    borderWidth: 9, 
    borderColor: '#ccc', 
    marginBottom: 8, 
    paddingBottom: 80, 
    color: '#555', // Darker text color for details input
  },

  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },

  nonEditableText: { 
    fontSize: 160, 
    marginBottom: 8,
    color: '#888', // Lighter color for non-editable text
  },
});

export default App;