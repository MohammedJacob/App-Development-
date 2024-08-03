import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, StatusBar, ScrollView, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
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

const cardData = [
  {
    id: 1,
    title: 'Title 1',
    price: '$11,900,000',
    targetPrice: '$12,000,000',
    image: 'https://t4.ftcdn.net/jpg/05/50/33/47/360_F_550334715_0d2cdaljV4Xd3x7yVUhRxfmLLEUyMdXr.jpg',
    return: '5 year total return: 48.65%',
    investment: 'Yearly investment return: 9.73%',
    yield: 'Projected net yield: 5.53%',
  },
  {
    id: 2,
    title: 'Title 2',
    price: '$12,000,000',
    targetPrice: '$12,000,000',
    image: 'https://img.freepik.com/premium-photo/cool-wallpapers_947865-14366.jpg',
    return: '5 year total return: 47.14%',
    investment: 'Yearly investment return: 9.43%',
    yield: 'Projected net yield: 5.5%',
  },
  {
    id: 3,
    title: 'Title 3',
    price: '$9,950,000',
    targetPrice: '$12,000,000',
    image: 'https://backiee.com/static/wpdb/wallpapers/v2/560x315/375311.jpg',
    return: '5 year total return: 52.80%',
    investment: 'Yearly investment return: 10.56%',
    yield: 'Projected net yield: 4.95%',
  },
  {
    id: 4,
    title: 'Title 4',
    price: '$4,500,000',
    targetPrice: '$12,000,000',
    image: 'https://static.vecteezy.com/system/resources/thumbnails/025/061/745/small_2x/4k-beautiful-colorful-abstract-wallpaper-photo.jpg',
    return: '5 year total return: 45.20%',
    investment: 'Yearly investment return: 9.04%',
    yield: 'Projected net yield: 5.2%',
  },
  {
    id: 5,
    title: 'Title 5',
    price: '$12,000,000',
    targetPrice: '$12,000,000',
    image: 'https://img.freepik.com/premium-photo/cityscape-with-neon-city-lights-night_602166-1067.jpg',
    return: '5 year total return: 49.50%',
    investment: 'Yearly investment return: 9.9%',
    yield: 'Projected net yield: 6.0%',
  },
  {
    id: 6,
    title: 'Title 6',
    price: '$3,200,000',
    targetPrice: '$12,000,000',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_vWVTexNtwXarflavpy-M4dIDPXxXeH6XpG-M5WhRF95MMtuncjhz-Q94WE83AnQJVg4&usqp=CAU',
    return: '5 year total return: 51.80%',
    investment: 'Yearly investment return: 10.36%',
    yield: 'Projected net yield: 5.8%',
  },
  {
    id: 7,
    title: 'Title 7',
    price: '$3,200,000',
    targetPrice: '$12,000,000',
    image: 'https://www.shutterstock.com/image-photo/aerial-top-view-huge-power-600nw-2386665213.jpg',
    return: '5 year total return: 51.80%',
    investment: 'Yearly investment return: 10.36%',
    yield: 'Projected net yield: 5.8%',
  },
  {
    id: 8,
    title: 'Title 8',
    price: '$1,725,000',
    targetPrice: '$12,000,000',
    image: 'https://www.shutterstock.com/image-photo/aerial-top-view-huge-power-600nw-2386665213.jpg',
    return: '3 year total return: 51.80%',
    investment: 'Yearly investment return: 10.36%',
    yield: 'Projected net yield: 5.8%',
  },
  {
    id: 9,
    title: 'Title 9',
    price: '$3,200,000',
    targetPrice: '$12,000,000',
    image: 'https://www.shutterstock.com/image-photo/aerial-top-view-huge-power-600nw-2386665213.jpg',
    return: '5 year total return: 51.80%',
    investment: 'Yearly investment return: 10.36%',
    yield: 'Projected net yield: 5.8%',
  },
  {
    id: 10,
    title: 'Title 10',
    price: '$3,200,000',
    targetPrice: '$12,000,000',
    image: 'https://www.shutterstock.com/image-photo/aerial-top-view-huge-power-600nw-2386665213.jpg',
    return: '5 year total return: 51.80%',
    investment: 'Yearly investment return: 10.36%',
    yield: 'Projected net yield: 5.8%',
  },
];

const tabs = ['Available', 'Sold'];

const Card = ({ card, onPress }) => {
  const currentPrice = parseFloat(card.price.replace(/[^0-9.-]+/g, ''));
  const targetPrice = parseFloat(card.targetPrice.replace(/[^0-9.-]+/g, ''));
  const fundedPercentage = targetPrice ? Math.min(100, (currentPrice / targetPrice) * 100) : 0;

  return (
    <TouchableOpacity key={card.id} onPress={onPress}>
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
            {['return', 'investment', 'yield'].map((key, index) => (
              <React.Fragment key={key}>
                <View style={styles.cardColumn}>
                  <Text style={styles.cardValue}>{card[key].split(': ')[1]}</Text>
                  <Text style={styles.cardLabel}>{key.replace(/^\w/, c => c.toUpperCase())}</Text>
                </View>
                {index < 2 && <View style={styles.verticalDivider} />}
              </React.Fragment>
            ))}
          </View>
        </PaperCard.Content>
      </PaperCard>
    </TouchableOpacity>
  );
};

function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = React.useState('Available');

  const filterCards = (cards) => {
    if (activeTab === 'Available') {
      return cards.filter(card => {
        const currentPrice = parseFloat(card.price.replace(/[^0-9.-]+/g, ''));
        const targetPrice = parseFloat(card.targetPrice.replace(/[^0-9.-]+/g, ''));
        return currentPrice < targetPrice;
      });
    }
    if (activeTab === 'Sold') {
      return cards.filter(card => {
        const currentPrice = parseFloat(card.price.replace(/[^0-9.-]+/g, ''));
        const targetPrice = parseFloat(card.targetPrice.replace(/[^0-9.-]+/g, ''));
        return currentPrice >= targetPrice;
      });
    }
    return cards;
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
        {tabs.map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tab}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            {activeTab === tab && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView}>
        {filterCards(cardData).map(card => (
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
}

function DetailsScreen({ route }) {
  const { card } = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView>
        <View style={styles.card}>
          <Image source={{ uri: card.image }} style={styles.image} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardPrice}>{card.price}</Text>
            <Text style={styles.cardText}>{card.return}</Text>
            <Text style={styles.cardText}>{card.investment}</Text>
            <Text style={styles.cardText}>{card.yield}</Text>
            {card.targetPrice && <Text style={styles.cardText}>Target Price: {card.targetPrice}</Text>}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  headerText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#001f54', // Dark blue for header text
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: '#F8F8F8', // Light grey background for the tabs
  },
  tab: {
    paddingVertical: 8,
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '700',
    color: '#007BFF', // Blue color for active tab text
  },
  activeTabIndicator: {
    marginTop: 4,
    height: 2,
    backgroundColor: '#007BFF', // Blue color for active tab indicator
    width: '100%',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F2F4F6', // Light background for the scroll view
  },
  card: {
    margin: 16,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 4, // Shadow effect for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4, // Shadow effect for iOS
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cardHeaderContent: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1b2644', // Dark blue for card title
  },
  cardPrice: {
    fontSize: 22,
    color: '#3ac15c',
    fontWeight: '500',
    marginTop: 4,
  },
  cardTarget: {
    fontSize: 14,
    color: '#d5e3ec', 
    marginTop: 2,
    marginLeft: 'auto', // Aligns the target price to the right
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8, // Rounded corners for image
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e8f2f4', // Light grey background for progress bar
    width: '65%',
    borderRadius: 4,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#55d576', 
    borderRadius: 4,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardColumn: {
    flex: 1,
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#363f54',
  },
  cardLabel: {
    fontSize: 14,
    color: '#6C757D', // Grey for label text
    marginTop: 4,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#E9ECEF', // Light grey divider
    height: '100%',
  },
});
