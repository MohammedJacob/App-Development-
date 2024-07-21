import * as React from 'react';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import SettingsImage from './assets/settings.png';
import Footer from './components/footer';
import SettingsScreen from './SettingScreen';
import AboutUsScreen from './About us';
import PaymentScreen from './payment';
import ProfileScreen from './Profile';
import WalletScreen from './Wallet';
import PrivacyPolicyScreen from './Privacy policy';
import PortfolioScreen from './Portfolio';
import DepositPage from './depositpage';
import WithdrawPage from './Withdrawpage';

const Stack = createStackNavigator();

const cardData = [
  {
    id: 1,
    title: '1 Bed in The Links East, The Greens and Views',
    price: '1,718,000',
    image: 'https://t4.ftcdn.net/jpg/05/50/33/47/360_F_550334715_0d2cdaljV4Xd3x7yVUhRxfmLLEUyMdXr.jpg',
    return: '5 year total return: 48.65%',
    investment: 'Yearly investment return: 9.73%',
    yield: 'Projected net yield: 5.53%',
    funded: '32%',
  },
  {
    id: 2,
    title: '1 Bed in Burj Views C, Downtown Dubai',
    price: '1,540,000',
    image: 'https://img.freepik.com/premium-photo/cool-wallpapers_947865-14366.jpg',
    return: '5 year total return: 47.14%',
    investment: 'Yearly investment return: 9.43%',
    yield: 'Projected net yield: 5.5%',
    funded: '46%',
  },
  {
    id: 3,
    title: '2 Bed in JBR, Dubai Marina',
    price: '2,950,000',
    image: 'https://backiee.com/static/wpdb/wallpapers/v2/560x315/375311.jpg',
    return: '5 year total return: 52.80%',
    investment: 'Yearly investment return: 10.56%',
    yield: 'Projected net yield: 4.95%',
    funded: '5%',
  },
  {
    id: 4,
    title: '3 Bed Villa in Arabian Ranches',
    price: '4,500,000',
    image: 'https://static.vecteezy.com/system/resources/thumbnails/025/061/745/small_2x/4k-beautiful-colorful-abstract-wallpaper-photo.jpg',
    return: '5 year total return: 45.20%',
    investment: 'Yearly investment return: 9.04%',
    yield: 'Projected net yield: 5.2%',
    funded: '100%',
  },
  {
    id: 5,
    title: 'Studio Apartment in JLT, Dubai',
    price: '780,000',
    image: 'https://img.freepik.com/premium-photo/cityscape-with-neon-city-lights-night_602166-1067.jpg',
    return: '5 year total return: 49.50%',
    investment: 'Yearly investment return: 9.9%',
    yield: 'Projected net yield: 6.0%',
    funded: '50%',
  },
  {
    id: 6,
    title: '2 Bed in Bluewaters Island, Dubai',
    price: '3,200,000',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_vWVTexNtwXarflavpy-M4dIDPXxXeH6XpG-M5WhRF95MMtuncjhz-Q94WE83AnQJVg4&usqp=CAU',
    return: '5 year total return: 51.80%',
    investment: 'Yearly investment return: 10.36%',
    yield: 'Projected net yield: 5.8%',
    funded: '70%',
  },
  {
    id: 7,
    title: '2 Bed in Bluewaters Island, Dubai',
    price: '3,200,000',
    image: 'https://www.shutterstock.com/image-photo/aerial-top-view-huge-power-600nw-2386665213.jpg',
    return: '5 year total return: 51.80%',
    investment: 'Yearly investment return: 10.36%',
    yield: 'Projected net yield: 5.8%',
    funded: '100%',
  },
  {
    id: 8,
    title: '4 Bed in Bluewaters Island, Dubai',
    price: '1,725,000',
    image: 'https://www.shutterstock.com/image-photo/aerial-top-view-huge-power-600nw-2386665213.jpg',
    return: '3 year total return: 51.80%',
    investment: 'Yearly investment return: 10.36%',
    yield: 'Projected net yield: 5.8%',
    funded: '100%',
  },
  {
    id: 9,
    title: '2 Bed in Bluewaters Island, Dubai',
    price: '3,200,000',
    image: 'https://www.shutterstock.com/image-photo/aerial-top-view-huge-power-600nw-2386665213.jpg',
    return: '5 year total return: 51.80%',
    investment: 'Yearly investment return: 10.36%',
    yield: 'Projected net yield: 5.8%',
    funded: '100%',
  },
  {
    id: 10,
    title: '2 Bed in Bluewaters Island, Dubai',
    price: '3,200,000',
    image: 'https://www.shutterstock.com/image-photo/aerial-top-view-huge-power-600nw-2386665213.jpg',
    return: '5 year total return: 51.80%',
    investment: 'Yearly investment return: 10.36%',
    yield: 'Projected net yield: 5.8%',
    funded: '100%',
  },
];


function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Available');

  const filterCards = (cards) => {
    switch (activeTab) {
      case 'Available':
        return cards.filter((card) => parseFloat(card.funded) < 100);
      case 'Sold':
        return cards.filter((card) => parseFloat(card.funded) === 100);
      default:
        return cards;
    }
  };

  const renderCard = (card) => (
    <TouchableOpacity key={card.id} onPress={() => navigation.navigate('Details', { card })}>
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Image source={{ uri: card.image }} style={styles.image} />
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardPrice}>{card.price}</Text>
          </View>
        </View>
        <Card.Content style={styles.cardContent}>
          <Text style={styles.cardDetailText}>{card.return}</Text>
          <Text style={styles.cardDetailText}>{card.investment}</Text>
          <Text style={styles.cardDetailText}>{card.yield}</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${parseFloat(card.funded)}%` }]} />
          </View>
          <Text style={styles.fundedText}>{parseFloat(card.funded) === 100 ? 'Sold' : `${card.funded} funded`}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Sites</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginLeft: 'auto' }}>
          <Image source={SettingsImage} style={styles.settingIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {['Available', 'Sold'].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tab}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            {activeTab === tab && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }}>
        {filterCards(cardData).map(renderCard)}
      </ScrollView>
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
}


function DetailsScreen({ route }) {
  const { card } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Image source={{ uri: card.image }} style={styles.image} />
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardPrice}>{card.price}</Text>
            </View>
          </View>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.cardDetailText}>{card.return}</Text>
            <Text style={styles.cardDetailText}>{card.investment}</Text>
            <Text style={styles.cardDetailText}>{card.yield}</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${parseFloat(card.funded)}%` }]} />
            </View>
            <Text style={styles.fundedText}>{parseFloat(card.funded) === 100 ? 'Sold' : `${card.funded} funded`}</Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} // This line hides the header
        />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="About Us" component={AboutUsScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="Privacy Policy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="Portfolio" component={PortfolioScreen} />
        <Stack.Screen name="Deposit" component={DepositPage} />
        <Stack.Screen name="Withdraw" component={WithdrawPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    backgroundColor: '#fcfcfc',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 24,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  settingIcon: {
    width: 40,
    height: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f8f8',
    paddingVertical: 8,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
  },
  tabText: {
    fontSize: 16,
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  activeTabIndicator: {
    width: '100%',
    height: 4,
    backgroundColor: '#2fbab3',
    marginTop: 4,
  },
  card: {
    margin: 16,
    borderRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fcfcfc',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardHeaderText: {
    marginLeft: 10,
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardPrice: {
    fontSize: 20,
    color: '#38c25c',
    fontWeight:'bold',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  cardContent: {
    padding: 10,
  },
  cardDetailText: {
    fontSize: 12,
    color: '#6b6b6b',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e8f2f4',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6fe08b',
  },
  fundedText: {
    fontSize: 12,
    color: '#6b6b6b',
    textAlign: 'right',
  },
});
