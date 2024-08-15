import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, StyleSheet } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

import SettingsImage from './assets/settings.png';
import SearchIcon from './assets/SearchIcon.png';
import Footer from './components/footer';

const cardData = [
  // Your card data here...
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

function Projects() {
  const [activeTab, setActiveTab] = React.useState('Available');
  const navigation = useNavigation();

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

// DetailsScreen component added here
function DetailsScreen() {
  const { params } = useRoute();
  const { card } = params || {};  // Retrieve the card data passed from the Projects screen

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView>
        <View style={styles.card}>
          <Image source={{ uri: card?.image }} style={styles.image} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{card?.title}</Text>
            <Text style={styles.cardPrice}>{card?.price}</Text>
            <Text style={styles.cardText}>{card?.return}</Text>
            <Text style={styles.cardText}>{card?.investment}</Text>
            <Text style={styles.cardText}>{card?.yield}</Text>
            {card?.targetPrice && <Text style={styles.cardText}>Target Price: {card?.targetPrice}</Text>}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  iconContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  iconButton: {
    marginHorizontal: 8,
  },
  icon: {
    width: 20,
    height: 20,
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
    margin: 1,
    borderRadius: 5,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fcfcfc',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  cardPrice: {
    fontSize: 20,
    color: '#48cf6a',
    fontWeight: 'bold',
    marginTop: 2,
  },
  cardTarget: {
    fontSize: 16,
    color: '#bad1df',
    textAlign: 'right',
    alignSelf: 'center',
    marginTop: 45,
    marginRight: 14,
  },
  image: {
    width: 90,
    height: 90,
    marginRight: 10,
    borderRadius: 5,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    width: '65%',
    marginHorizontal: 16,
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#48cf6a',
    borderRadius: 3,
  },
  cardContent: {
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardColumn: {
    alignItems: 'center',
    flex: 1,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardLabel: {
    fontSize: 12,
    color: 'grey',
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 80,
  },
  cardText: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default Projects;
