import React from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, Dimensions } from 'react-native';
import FooterTabs from './components/footer'; // Import FooterTabs component
import { LineChart } from 'react-native-chart-kit';

const data = {
  portfolio: [
    { id: '1', name: 'Cuberto', amount: '$1,200.87', dividends: '$40 dividends' },
    { id: '2', name: 'Healthily Ltd.', amount: '$3,467.32', dividends: '$120 dividends' },
    { id: '3', name: 'Neotroy', amount: '$2,837.41', dividends: '$70 dividends' },
  ],
  futureProjections: {
    amount: '$2.4M',
    graphData: [2200, 2400, 2600, 2800, 3000, 3200],
  },
  upcomingEvents: [
    { id: '1', event: 'A property in your area is distributing dividends' },
    { id: '2', event: 'Investment seminar on July 20' },
  ],
  propertyListings: [
    { id: '3', name: 'Chrysler Building', amount: '$1,867 per sqft' },
    { id: '4', name: 'One Wilshire Building', amount: '$2,987 per sqft' },
  ],
};

const PortfolioScreen = ({ navigation }) => {
  const renderSectionHeader = (title) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  const renderPortfolioItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardAmount}>{item.amount}</Text>
      <Text style={styles.cardDividends}>{item.dividends}</Text>
    </View>
  );

  const renderEventItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.event}</Text>
    </View>
  );

  const renderPropertyItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardAmount}>{item.amount}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[
          { title: 'Your Portfolio', data: data.portfolio, renderItem: renderPortfolioItem },
          { title: 'Future Projections', data: [data.futureProjections], renderItem: (props) => (
            <View style={styles.projectionsCard}>
              <Text style={styles.projectionsAmount}>{data.futureProjections.amount}</Text>
              <LineChart
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  datasets: [{ data: data.futureProjections.graphData }],
                }}
                width={Dimensions.get('window').width - 32}
                height={220}
                yAxisLabel="$"
                yAxisSuffix="k"
                chartConfig={{
                  backgroundColor: '#C4E5CC',
                  backgroundGradientFrom: '#48cf6a',
                  backgroundGradientTo: '#C4E5CC',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: { borderRadius: 16 },
                  propsForDots: { r: '6', strokeWidth: '2', stroke: '#fff' },
                }}
                style={{ marginVertical: 8, borderRadius: 16 }}
              />
            </View>
          )},
          { title: 'Upcoming Events', data: data.upcomingEvents, renderItem: renderEventItem },
          { title: 'Open Property Listings', data: data.propertyListings, renderItem: renderPropertyItem },
        ]}
        keyExtractor={(item, index) => `section-${index}`}  // Use section index as a key
        renderItem={({ item }) => (
          <View style={styles.section}>
            {renderSectionHeader(item.title)}
            <FlatList
              data={item.data}
              renderItem={item.renderItem}
              keyExtractor={(subItem) => subItem.id}  // Use the unique ID for sub-items
            />
          </View>
        )}
      />
      <FooterTabs navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardAmount: { fontSize: 14, color: 'green', marginTop: 5 },
  cardDividends: { fontSize: 12, color: 'grey', marginTop: 2 },
  projectionsCard: { backgroundColor: 'white', padding: 20, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2, alignItems: 'center' },
  projectionsAmount: { fontSize: 22, fontWeight: 'bold', color: 'blue' },
});

export default PortfolioScreen;
