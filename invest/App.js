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
    loadCards();
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
  const [cardDetails, setCardDetails] = useState({
    title: card.title || '',
    number: card.number || '',
    expiryDate: card.expiryDate || '',
    cvv: card.cvv || '',
  });

  const handleInvest = async () => {
    if (!amount) {
      Alert.alert('Input Error', 'Please enter an amount.');
      return;
    }

    try {
      // Update the card price
      const response = await fetch(`http://192.168.1.241:3000/api/cards/${card.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: amount }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const updatedCard = await response.json();
      Alert.alert('Success', 'Card price updated successfully.');
      navigation.navigate('Home', { card: updatedCard, amount });
    } catch (error) {
      console.error('Error updating card price:', error);
      Alert.alert('Update Error', 'Failed to update card price. Please try again later.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.card}>
          <Image source={{ uri: card.image }} style={styles.image} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Card Title:</Text>
            <TextInput
              style={styles.cardTitleInput}
              value={cardDetails.title}
              onChangeText={text => setCardDetails({ ...cardDetails, title: text })}
              placeholder="Card Title"
            />
            <Text style={styles.cardText}>Card Number:</Text>
            <TextInput
              style={styles.cardTextInput}
              value={cardDetails.number}
              onChangeText={text => setCardDetails({ ...cardDetails, number: text })}
              placeholder="Card Number"
              keyboardType="numeric"
            />
            <Text style={styles.cardText}>Expiry Date:</Text>
            <TextInput
              style={styles.cardTextInput}
              value={cardDetails.expiryDate}
              onChangeText={text => setCardDetails({ ...cardDetails, expiryDate: text })}
              placeholder="MM/YY"
            />
            <Text style={styles.cardText}>CVV:</Text>
            <TextInput
              style={styles.cardTextInput}
              value={cardDetails.cvv}
              onChangeText={text => setCardDetails({ ...cardDetails, cvv: text })}
              placeholder="CVV"
              keyboardType="numeric"
            />
            <Text style={styles.cardText}>Card Type: {card.cardType || 'N/A'}</Text>
            <Text style={styles.cardText}>Return Value: {card.return_value || 'N/A'}</Text>
            <Text style={styles.cardText}>Investment: {card.investment || 'N/A'}</Text>
            <Text style={styles.cardText}>Yield: {card.yield || 'N/A'}</Text>
            {card.targetPrice && <Text style={styles.cardText}>Target Price: {card.targetPrice}</Text>}
          </View>
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Enter Amount:</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={text => setAmount(text)}
            keyboardType="numeric"
            placeholder="0.00"
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.investButton}
        onPress={handleInvest}
      >
        <Text style={styles.investButtonText}>Invest</Text>
      </TouchableOpacity>
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
      <Stack.Screen name="LoginMethod" component={LoginMethod} />
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
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerText: { fontSize: 24, fontWeight: 'bold' },
  iconContainer: { flexDirection: 'row' },
  iconButton: { marginLeft: 16 },
  icon: { width: 24, height: 24 },
  tabContainer: { flexDirection: 'row', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc' },
  tab: { padding: 16 },
  tabText: { fontSize: 16 },
  activeTabText: { fontWeight: 'bold', color: '#000' },
  activeTabIndicator: { height: 2, backgroundColor: '#000', marginTop: 8 },
  scrollView: { flex: 1, padding: 16 },
  scrollViewContent: { flexGrow: 1, paddingBottom: 80 },
  card: { marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  cardHeaderContent: { flex: 1 },
  cardHeaderText: { marginBottom: 8 },
  cardTitle: { fontSize: 28, fontWeight: 'bold' },
  cardPrice: { fontSize: 24, fontWeight: 'bold', color: '#34c659' },
  cardTarget: { fontSize: 14, color: '#888' },
  image: { width: 100, height: 100, borderRadius: 8 },
  progressBarContainer: { height: 8, backgroundColor: '#eee', borderRadius: 4, overflow: 'hidden', marginTop: 8 },
  progressBar: { height: '100%', backgroundColor: '#57d577' },
  cardContent: { padding: 16 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cardColumn: { flex: 1, alignItems: 'center' },
  cardValue: { fontSize: 16, fontWeight: 'bold' },
  cardLabel: { fontSize: 14, color: '#888' },
  verticalDivider: { width: 1, height: '100%', backgroundColor: '#ccc', marginHorizontal: 8 },
  investButton: { backgroundColor: '#34c659', padding: 16, alignItems: 'center', justifyContent: 'center', borderRadius: 8, position: 'absolute', bottom: 0, left: 0, right: 0 },
  investButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  saveButton: { backgroundColor: '#007bff', padding: 16, alignItems: 'center', justifyContent: 'center', borderRadius: 8, position: 'absolute', bottom: 16, left: 16, right: 16 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  detailsSection: { margin: 16 },
  detailsText: { fontSize: 16, marginBottom: 8 },
  amountContainer: { margin: 16 },
  amountLabel: { fontSize: 16, marginBottom: 8 },
  amountInput: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 12 },
  cardTitleInput: { fontSize: 28, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 4 },
  cardPriceInput: { fontSize: 24, fontWeight: 'bold', color: '#34c659', borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 4 },
  cardTextInput: { fontSize: 16, borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 8, paddingBottom: 4 },
  detailsInput: { fontSize: 16, borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 8, paddingBottom: 4 },
  nonEditableText: { fontSize: 16, marginBottom: 8 }
});



export default App;
