import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useUser } from './UserContext'; // Import useUser hook
import Footer from './components/footer'; // Ensure the correct import path
import { LineChart } from 'react-native-chart-kit'; // Importing LineChart from chart kit

const PortfolioScreen = ({ navigation }) => {
  const { userData } = useUser();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [netWorth, setNetWorth] = useState(0);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (userData && userData.id) {
        try {
          const response = await fetch(`http://192.168.1.241:3000/api/portfolio/${userData.id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch portfolio data');
          }
          const data = await response.json();
          
          const portfolioData = Array.isArray(data) && data.length > 0 ? data[0] : [];
          setPortfolio(portfolioData);

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

              {/* Simplified Graph Component */}
              <LineChart
                data={{
                  datasets: [
                    {
                      data: portfolio.map(item => parseFloat(item.amount_invested) || 0),
                    },
                  ],
                }}
                width={340} // from react-native
                height={220}
                withDots={false} // No dots on the line
                withInnerLines={false} // Remove inner grid lines
                withHorizontalLabels={false} // Remove Y-axis labels
                withVerticalLabels={false} // Remove X-axis labels
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Line color
                  style: {
                    borderRadius: 16,
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />

              {/* Investment Cards */}
              {portfolio.map((item) => (
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
                onPress={() => navigation.navigate('SignUp')} // Navigate to the signup page
              >
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}
          {error && <Text style={styles.errorMessage}>{error}</Text>}
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

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
});

export default PortfolioScreen;
