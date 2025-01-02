import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Footer from './components/footer';
import Header from './components/Header';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './UserContext';
import RecCardStyles from './RecCardStyle';
import { Picker } from '@react-native-picker/picker';
import EquityStyles from './EquityStyles';
import styles from './homepageStyle';

const fetchRecCards = async () => {
  try {
    const response = await fetch('http://192.168.1.241:3000/api/RecsCard');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching REC cards:', error);
    return [];
  }
};

const fetchEquityCards = async () => {
  try {
    const response = await fetch('http://192.168.1.241:3000/api/cards');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching equity cards:', error);
    return [];
  }
};

const HomeScreen = ({ route }) => {
  const { isGuest } = route.params || { isGuest: false };
  const { userData } = useUser();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('All');
  const [recCards, setRecCards] = useState([]);
  const [equityCards, setEquityCards] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');

  useEffect(() => {
    const fetchCards = async () => {
      const [fetchedRecCards, fetchedEquityCards] = await Promise.all([fetchRecCards(), fetchEquityCards()]);
      setRecCards(fetchedRecCards);
      setEquityCards(fetchedEquityCards);
    };

    fetchCards();
  }, []);

  const handleRecCardPress = (card) => {
    navigation.navigate('Details', { card });
  };

  const handleEquityCardPress = (card) => {
    navigation.navigate('Details', { card });
  };

  const filterCards = (cards, isEquity = false) => {
    return cards.filter((card) => {
      const cardType = isEquity ? card.Type : card.type; // Use `Type` for equityCards, `type` for recCards
      const matchesType = selectedType === 'All' || cardType === selectedType;
      const matchesCountry = selectedCountry === 'All' || card.country === selectedCountry;
      return matchesType && matchesCountry;
    });
  };

  const TabButton = ({ label, icon, tabName }) => (
    <TouchableOpacity onPress={() => setActiveTab(tabName)} style={styles.tab}>
      <View style={styles.tabItem}>
        <Icon name={icon} size={20} color={'#99abaf'} />
        <Text style={[styles.tabText, activeTab === tabName && styles.activeTabText]}>{label}</Text>
      </View>
      {activeTab === tabName && <View style={styles.activeTabIndicator} />}
    </TouchableOpacity>
  );

  const renderRecCard = ({ item }) => (
    <TouchableOpacity style={RecCardStyles.cardContainer} onPress={() => handleRecCardPress(item)}>
      <View style={RecCardStyles.cardHeader}>
        <Text style={RecCardStyles.cardHeaderIcon}>{item.type.toUpperCase()}</Text>
        <Text style={RecCardStyles.cardHeaderLocation}>{item.location}</Text>
      </View>
      <Text style={RecCardStyles.cardTitle}>{item.title}</Text>
      <View style={RecCardStyles.imageContainer}>
        <Image source={{ uri: item.image }} style={RecCardStyles.cardImage} />
        <View style={RecCardStyles.descriptionBar}>
          <View style={RecCardStyles.purchaseInfo}>
            <Text style={RecCardStyles.purchaseStatus}>Available to Purchase</Text>
            <Text style={RecCardStyles.energyAvailable}>{item.energy_available} MWh</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEquityCard = ({ item }) => {
    const currentPrice = parseFloat(item.price || 0).toFixed(2);
    const targetPrice = parseFloat(item.targetPrice || 0).toFixed(2);
    const fundedPercentage = targetPrice
      ? Math.min(100, (currentPrice / targetPrice) * 100)
      : 0;
  
    return (
      <TouchableOpacity style={EquityStyles.card} onPress={() => handleEquityCardPress(item)}>
        <View style={EquityStyles.cardHeader}>
          <Text style={EquityStyles.cardCountry}>{item.Type}</Text>
          <Text style={EquityStyles.cardCountry}>{item.country}</Text>
        </View>
        <Text style={EquityStyles.cardTitle}>{item.title}</Text>
        <View style={EquityStyles.priceContainer}>
          <Text style={EquityStyles.cardPrice}>${currentPrice}</Text>
          <Text style={EquityStyles.cardTarget}>${targetPrice}</Text>
        </View>
        <View style={EquityStyles.progressBarAndImageContainer}>
          <View style={EquityStyles.progressBarContainer}>
            <View style={EquityStyles.progressBarBackground}>
              <View style={[EquityStyles.progressBar, { width: `${fundedPercentage}%` }]} />
            </View>
          </View>
          <Image source={{ uri: item.image }} style={EquityStyles.image} />
        </View>
        <Text style={EquityStyles.percentageText}>{fundedPercentage.toFixed(0)}% Funded</Text>
  
        {/* Blue Box Section */}
        <View style={EquityStyles.investmentDetailContainer}>
          <View style={EquityStyles.investmentDetail}>
            <Text style={EquityStyles.label}>5-year total return</Text>
            <Text style={EquityStyles.value}>{item.return_value || 'N/A'}</Text>
          </View>
          <View style={EquityStyles.investmentDetail}>
            <Text style={EquityStyles.label}>Yearly investment return</Text>
            <Text style={EquityStyles.value}>{item.investment || 'N/A'}</Text>
          </View>
          <View style={EquityStyles.investmentDetail}>
            <Text style={EquityStyles.label}>Projected net yield</Text>
            <Text style={EquityStyles.value}>{item.yield || 'N/A'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  

  const renderContent = () => {
    const filteredRecCards = filterCards(recCards);
    const filteredEquityCards = filterCards(equityCards, true); // Pass `true` for equityCards

    switch (activeTab) {
      case 'All':
        return (
          <>
            <FlatList
              data={filteredRecCards}
              renderItem={renderRecCard}
              keyExtractor={(item) => `rec-${item.id}`}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={<Text>No REC cards available</Text>}
            />
            <FlatList
              data={filteredEquityCards}
              renderItem={renderEquityCard}
              keyExtractor={(item) => `equity-${item.id}`}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={<Text>No Equity cards available</Text>}
            />
          </>
        );
      case 'Rec':
        return (
          <FlatList
            data={filteredRecCards}
            renderItem={renderRecCard}
            keyExtractor={(item) => `rec-${item.id}`}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={<Text>No REC cards available</Text>}
          />
        );
      case 'Equity':
        return (
          <FlatList
            data={filteredEquityCards}
            renderItem={renderEquityCard}
            keyExtractor={(item) => `equity-${item.id}`}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={<Text>No Equity cards available</Text>}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header/>
        <View style={styles.marketplaceHeader}>
          <Text style={styles.headerText}>Marketplace</Text>
        </View>
        <View style={styles.tabContainer}>
          <TabButton label="All" icon="view-list" tabName="All" />
          <TabButton label="RECs" icon="clock-outline" tabName="Rec" />
          <TabButton label="Equity" icon="chart-pie" tabName="Equity" />
        </View>
        <Picker
          selectedValue={selectedType}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedType(itemValue)}
        >
          <Picker.Item label="All Type" value="All" />
          <Picker.Item label="Solar" value="Solar" />
          <Picker.Item label="Wind" value="Wind" />
        </Picker>
        <Picker
          selectedValue={selectedCountry}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedCountry(itemValue)}
        >
          <Picker.Item label="All Country" value="All" />
          <Picker.Item label="USA" value="USA" />
          <Picker.Item label="United Arab Emirates" value="United Arab Emirates" />
        </Picker>
        {renderContent()}
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

export default HomeScreen;
