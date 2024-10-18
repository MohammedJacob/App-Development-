import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useUser } from './UserContext';
import Footer from './components/footer';
import { LineChart } from 'react-native-chart-kit';

// PortfolioScreen Component
const PortfolioScreen = ({ navigation }) => {
  const { userData } = useUser();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [netWorth, setNetWorth] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (userData && userData.id) {
        try {
          const response = await fetch(`http://192.168.1.241:3000/api/portfolio/${userData.id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch portfolio data');
          }
          const data = await response.json();

          const portfolioData = Array.isArray(data) ? data : [];
          setPortfolio(portfolioData);

          // Calculate total net worth
          const totalNetWorth = portfolioData.reduce((total, item) => {
            const amount = parseFloat(item.amount_invested) || 0;
            return total + amount;
          }, 0);
          setNetWorth(totalNetWorth);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [userData]);

  // Helper function to generate the last 7 days' dates
  const generateLast7Days = () => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      result.push(date);
    }
    return result;
  };

  const last7Days = generateLast7Days();

  // Calculate total portfolio value up to each date
  const cumulativeInvestmentData = [];
  let cumulativeTotal = 0;

  last7Days.forEach(date => {
    const investment = portfolio.find(item => new Date(item.investment_date).toDateString() === date.toDateString());
    if (investment) {
      cumulativeTotal += parseFloat(investment.amount_invested) || 0;
    }
    cumulativeInvestmentData.push(cumulativeTotal);
  });

  // Create labels for the last 7 days
  const dateLabels = last7Days.map(date => `${date.getMonth() + 1}/${date.getDate()}`);

  // Handle touch and drag movement
  const handleTouch = (event, chartWidth) => {
    event.persist();
    const touchX = event.nativeEvent.locationX;
    const index = Math.floor((touchX / chartWidth) * last7Days.length);
    const clampedIndex = Math.max(0, Math.min(index, last7Days.length - 1));
    setSelectedIndex(clampedIndex);
  };

  const handleTouchMove = (event) => {
    handleTouch(event, screenWidth - 32);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentContainer}>
          {loading ? (
            <Text>Loading...</Text>
          ) : userData && userData.id ? (
            <View style={styles.userContent}>
              {/* Display Net Worth */}
              <Text style={styles.netWorthText}>Net Worth: ${netWorth.toFixed(2)}</Text>

              {/* Graph with touch functionality */}
              <View
                onTouchMove={handleTouchMove}
                onTouchEnd={() => setSelectedIndex(null)}
                onTouchStart={(e) => handleTouch(e, screenWidth - 32)}
              >
                <LineChart
                  data={{
                    labels: dateLabels,
                    datasets: [
                      {
                        data: cumulativeInvestmentData,
                      },
                    ],
                  }}
                  width={screenWidth - 32}
                  height={220}
                  withDots={false}
                  withInnerLines={false}
                  withHorizontalLabels={false}
                  bezier
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
                {/* Highlighted vertical line */}
                {selectedIndex !== null && (
                  <View style={[styles.verticalLine, { left: (selectedIndex / cumulativeInvestmentData.length) * (screenWidth - 32) }]} />
                )}
                {/* Display total portfolio value and date when touched */}
                {selectedIndex !== null && (
                  <Text style={styles.portfolioValueText}>
                    Date: {dateLabels[selectedIndex]} - Total Portfolio Value: ${cumulativeInvestmentData[selectedIndex].toFixed(2)}
                  </Text>
                )}
              </View>

              {/* Investment Cards sorted by newest first */}
              {portfolio
                .sort((a, b) => new Date(b.investment_date) - new Date(a.investment_date)) // Sort by date
                .map((item) => (
                  <View key={item.id} style={styles.investmentCard}>
                    <Text style={styles.itemText}>{item.invested_stock}</Text>
                    <Text style={styles.itemText}>${item.amount_invested}</Text>
                  </View>
                ))}
            </View>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorMessage}>Guest accounts cannot access this page.</Text>
              <Text style={styles.promptMessage}>Please log in to access full features.</Text>
              <TouchableOpacity
                style={styles.signUpButton}
                onPress={() => navigation.navigate('SignUp')}
              >
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}
          {error && <Text style={styles.errorMessage}>{error}</Text>}
        </View>
      </ScrollView>

      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  contentContainer: {
    alignItems: 'center',
  },
  userContent: {
    alignItems: 'center',
    width: '100%',
  },
  netWorthText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#28a745',
  },
  investmentCard: {
    padding: 16,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
    width: '100%',
  },
  itemText: {
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    width: '90%',
  },
  errorMessage: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  promptMessage: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginVertical: 10,
  },
  signUpButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  verticalLine: {
    position: 'absolute',
    width: 1,
    height: 220,
    backgroundColor: 'rgba(0, 0, 255, 0.5)',
  },
  portfolioValueText: {
    position: 'absolute',
    top: 230,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#000',
    fontSize: 16,
  },
});

// Exporting the component
export default PortfolioScreen;
