import * as React from 'react';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import SettingsImage from './assets/settings.png';
import SettingsScreen from './SettingScreen';
import AboutUsScreen from './About us';
import ProfileScreen from './Profile';
import WalletScreen from './Wallet';
import RewardsScreen from './Rewards';
import PrivacyPolicyScreen from './Privacy policy';
import PortfolioScreen from './Portfolio';



const Stack = createStackNavigator();


  const cardData = [
    {
      id: 1,
      title: '1 Bed in The Links East, The Greens and Views',
      price: 'AED 1,718,000',
      image: 'https://t4.ftcdn.net/jpg/05/50/33/47/360_F_550334715_0d2cdaljV4Xd3x7yVUhRxfmLLEUyMdXr.jpg',
      return: '5 year total return: 48.65%',
      investment: 'Yearly investment return: 9.73%',
      yield: 'Projected net yield: 5.53%',
      funded: '32%',
    },
    {
      id: 2,
      title: '1 Bed in Burj Views C, Downtown Dubai',
      price: 'AED 1,540,000',
      image: 'https://img.freepik.com/premium-photo/cool-wallpapers_947865-14366.jpg',
      return: '5 year total return: 47.14%',
      investment: 'Yearly investment return: 9.43%',
      yield: 'Projected net yield: 5.5%',
      funded: '46%',
    },
    {
      id: 3,
      title: '2 Bed in JBR, Dubai Marina',
      price: 'AED 2,950,000',
      image: 'https://backiee.com/static/wpdb/wallpapers/v2/560x315/375311.jpg',
      return: '5 year total return: 52.80%',
      investment: 'Yearly investment return: 10.56%',
      yield: 'Projected net yield: 4.95%',
      funded: '5%',
    },
    {
      id: 4,
      title: '3 Bed Villa in Arabian Ranches',
      price: 'AED 4,500,000',
      image: 'https://static.vecteezy.com/system/resources/thumbnails/025/061/745/small_2x/4k-beautiful-colorful-abstract-wallpaper-photo.jpg',
      return: '5 year total return: 45.20%',
      investment: 'Yearly investment return: 9.04%',
      yield: 'Projected net yield: 5.2%',
      funded: '100%',
    },
    {
      id: 5,
      title: 'Studio Apartment in JLT, Dubai',
      price: 'AED 780,000',
      image: 'https://img.freepik.com/premium-photo/cityscape-with-neon-city-lights-night_602166-1067.jpg',
      return: '5 year total return: 49.50%',
      investment: 'Yearly investment return: 9.9%',
      yield: 'Projected net yield: 6.0%',
      funded: '50%',
    },
    {
      id: 6,
      title: '2 Bed in Bluewaters Island, Dubai',
      price: 'AED 3,200,000',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_vWVTexNtwXarflavpy-M4dIDPXxXeH6XpG-M5WhRF95MMtuncjhz-Q94WE83AnQJVg4&usqp=CAU',
      return: '5 year total return: 51.80%',
      investment: 'Yearly investment return: 10.36%',
      yield: 'Projected net yield: 5.8%',
      funded: '70%',
    },
    {
      id: 7,
      title: '2 Bed in Bluewaters Island, Dubai',
      price: 'AED 3,200,000',
      image: 'https://www.shutterstock.com/image-photo/aerial-top-view-huge-power-600nw-2386665213.jpg',
      return: '5 year total return: 51.80%',
      investment: 'Yearly investment return: 10.36%',
      yield: 'Projected net yield: 5.8%',
      funded: '100%',
    },
    {
      id: 8,
      title: '4 Bed in Bluewaters Island, Dubai',
      price: 'AED 1,725,000',
      image: 'https://www.shutterstock.com/image-photo/aerial-top-view-huge-power-600nw-2386665213.jpg',
      return: '3 year total return: 51.80%',
      investment: 'Yearly investment return: 10.36%',
      yield: 'Projected net yield: 5.8%',
      funded: '100%',
    },
    {
      id: 9,
      title: '2 Bed in Bluewaters Island, Dubai',
      price: 'AED 3,200,000',
      image: 'https://www.shutterstock.com/image-photo/aerial-top-view-huge-power-600nw-2386665213.jpg',
      return: '5 year total return: 51.80%',
      investment: 'Yearly investment return: 10.36%',
      yield: 'Projected net yield: 5.8%',
      funded: '100%',
    },
    {
      id: 10,
      title: '2 Bed in Bluewaters Island, Dubai',
      price: 'AED 3,200,000',
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
      case 'Funded':
        return cards.filter((card) => parseFloat(card.funded) > 0 && parseFloat(card.funded) < 100);
      case 'Sold':
        return cards.filter((card) => parseFloat(card.funded) === 100);
      default:
        return cards;
    }
  };

  const renderCard = (card) => (
    <TouchableOpacity key={card.id} onPress={() => navigation.navigate('Details', { card })}>
      <Card style={styles.card}>
        <Image source={{ uri: card.image }} style={styles.image} />
        <Card.Content>
          <Title>{card.title}</Title>
          <Paragraph>{card.price}</Paragraph>
          <View style={styles.details}>
            <Text>{card.return}</Text>
            <Text>{card.investment}</Text>
            <Text>{card.yield}</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${parseFloat(card.funded)}%` }]} />
          </View>
          <Text>{parseFloat(card.funded) === 100 ? 'Sold' : `${card.funded} funded`}</Text>
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
        {['Available', 'Funded', 'Sold'].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tab}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            {activeTab === tab && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }}>
        {filterCards(cardData).map(renderCard)}
      </ScrollView>

      <FooterTabs navigation={navigation} />
    </SafeAreaView>
  );
}

function DetailsScreen({ route }) {
  const { card } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Card style={styles.card}>
          <Image source={{ uri: card.image }} style={styles.image} />
          <Card.Content>
            <Title>{card.title}</Title>
            <Paragraph>{card.price}</Paragraph>
            <View style={styles.details}>
              <Text>{card.return}</Text>
              <Text>{card.investment}</Text>
              <Text>{card.yield}</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${parseFloat(card.funded)}%` }]} />
            </View>
            <Text>{parseFloat(card.funded) === 100 ? 'Sold' : `${card.funded} funded`}</Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function FooterTabs({ navigation }) {
  const isActiveTab = (tab) => navigation.getState().routes[navigation.getState().index].name === tab;

  const tabs = [
    { name: 'Home', icon: 'https://img.clipart-library.com/2/clip-black-houses/clip-black-houses-21.jpg', label: 'Projects' },
    { name: 'Wallet', icon: 'https://p7.hiclipart.com/preview/901/124/54/wallet-computer-icons-handbag-coin-wallet-thumbnail.jpg', label: 'Wallet' },
    { name: 'Portfolio', icon: 'https://png.pngtree.com/png-vector/20190226/ourmid/pngtree-vector-portfolio-icon-png-image_705750.jpg', label: 'Portfolio' },
    { name: 'Rewards', icon: 'https://www.clipartmax.com/png/small/462-4622640_collect-comments-big-star-black-and-white.png', label: 'Rewards' },
    { name: 'Profile', icon: 'https://i.pinimg.com/736x/69/a4/d9/69a4d9afcec8aefef5e1430f5587c273.jpg', label: 'Profile' },
  ];

  return (
    <View style={styles.footer}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab.name} onPress={() => navigation.navigate(tab.name)} style={styles.footerTab}>
          <Image source={{ uri: tab.icon }} style={styles.footerIcon} />
          <Text style={styles.footerText}>{tab.label}</Text>
          {isActiveTab(tab.name) && <View style={styles.activeFooterIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        <Stack.Screen name="AboutUs" component={AboutUsScreen} options={{ title: 'About Us' }} />
        <Stack.Screen name="Wallet" component={WalletScreen} options={{ title: 'Wallet' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        <Stack.Screen name="Portfolio" component={PortfolioScreen} options={{ title: 'Portfolio' }} />
        <Stack.Screen name="Rewards" component={RewardsScreen} options={{ title: 'Rewaeds' }} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ title: 'Privacy Policy' }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFFFC',
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    marginTop: 25,
    borderRadius: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  settingIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
  tab: {
    paddingVertical: 20,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'grey',
  },
  activeTabText: {
    color: '#000',
  },
  activeTabIndicator: {
    height: 4,
    backgroundColor: '#18F5FF',
    marginTop: 5,
  },
  card: {
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  image: {
    height: 180,
    borderRadius: 10,
  },
  details: {
    marginVertical: 10,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00f',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
  },
  footerTab: {
    alignItems: 'center',
    flex: 1,
  },
  footerIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  footerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'grey',
    marginTop: 5,
  },
  activeFooterIndicator: {
    height: 4,
    backgroundColor: '#18F5FF',
    marginTop: 5,
    width: '100%',
  },
});
