import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useUser } from './UserContext'; // Import useUser hook
import Footer from './components/footer'; // Ensure the correct import path

const PortfolioScreen = ({ navigation, route }) => {
  const { userData } = useUser(); // Access user data
  const [investedStock, setInvestedStock] = useState(userData.invested_stock || '');
  const [portfolioValue, setPortfolioValue] = useState(0);

  // Split investedStock string by comma and map through each stock
  const stockArray = investedStock ? investedStock.split(',') : [];

  useEffect(() => {
    // Calculate the total value of the portfolio by summing up the stock amounts
    let totalValue = 0;
    stockArray.forEach(stock => {
      const [_, amount] = stock.split(':');
      totalValue += parseFloat(amount);
    });
    setPortfolioValue(totalValue);
  }, [stockArray]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.portfolioValueText}>Your portfolio is worth: ${portfolioValue}</Text>
        
        <View style={styles.graphContainer}>
          <LineChart
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [
                {
                  data: [20, 45, 28, 80, 99, 43],
                  strokeWidth: 3,
                  color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`, // Line color - teal
                },
              ],
            }}
            width={Dimensions.get('window').width * 0.9} // Adjust width to be 90% of the screen width
            height={240} // Slightly increase height for better visibility
            chartConfig={{
              backgroundColor: '#e0f7fa', // Light green background
              backgroundGradientFrom: '#e0f7fa',
              backgroundGradientTo: '#e0f7fa',
              color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`, // Teal color for line and text
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              fillShadowGradient: '#00bfa5', // Teal fill under the line
              fillShadowGradientOpacity: 0.2,
              decimalPlaces: 2, // Adjust if necessary
              propsForDots: {
                r: "5", // Larger dots
                strokeWidth: "2",
                stroke: "#004d40", // Darker teal border for dots
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        <View style={styles.profileContainer}>
          {stockArray.length > 0 ? (
            stockArray.map((stock, index) => {
              const [title, amount] = stock.split(':');
              return (
                <View key={index} style={styles.card}>
                  <Text style={styles.stockTitle}>{title}</Text>
                  <Text style={styles.stockAmount}>Invested Amount: ${amount}</Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.noStock}>No stocks invested</Text>
          )}
        </View>
      </ScrollView>
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10, // Adjusted to move content up
    paddingBottom: 60,
  },
  portfolioValueText: {
    fontSize: 22, // Slightly larger text for visibility
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15, // Adjusted margin
  },
  graphContainer: {
    alignItems: 'center',
    marginBottom: 20, // Increased margin for separation
  },
  profileContainer: {
    alignItems: 'center', // Center-align the cards
    marginVertical: 15, // Adjusted spacing between cards and graph
    padding: 2,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    width: '95%', // Adjust the card width to be slightly wider
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  stockTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  stockAmount: {
    fontSize: 16,
    color: '#555',
  },
  noStock: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default PortfolioScreen;
