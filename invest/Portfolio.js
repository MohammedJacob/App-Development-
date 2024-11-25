import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useUser } from './UserContext';
import { PieChart, BarChart } from 'react-native-chart-kit';

const PortfolioScreen = ({ navigation }) => {
  const { userData } = useUser();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [netWorth, setNetWorth] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (userData && userData.id) {
        try {
          const response = await fetch(`http://192.168.1.241:3000/api/portfolio/${userData.id}`);
          if (!response.ok) throw new Error('Failed to fetch portfolio data');
          const data = await response.json();
          setPortfolio(data);

          // Calculate net worth
          const totalNetWorth = data.reduce((total, item) => {
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

  // Pie chart data
  const pieData = [
    { name: 'RECs', value: 0, color: '#4CAF50', legendFontColor: '#000', legendFontSize: 14 },
    { name: 'Invest', value: netWorth, color: '#FFC107', legendFontColor: '#000', legendFontSize: 14 },
    { name: 'Loan', value: 0, color: '#FF5722', legendFontColor: '#000', legendFontSize: 14 },
  ];

  // Bar chart data
  const barData = {
    labels: ['Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: [2000, 3000, 4000, 3500],
        color: (opacity = 1) => `rgba(68, 162, 86, ${opacity})`,
      },
      {
        data: [1500, 2000, 3000, 2500],
        color: (opacity = 1) => `rgba(255, 87, 34, ${opacity})`,
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Tabs */}
        <View style={styles.tabs}>
          {['RECs', 'Shares', 'Bonds', 'Transactions'].map((tab, index) => (
            <TouchableOpacity key={index} style={styles.tab}>
              <Text style={styles.tabText}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Content */}
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : userData && userData.id ? (
          <>
            {/* Portfolio Value */}
            <View style={styles.card}>
              <Text style={styles.portfolioTitle}>Portfolio Value</Text>
              <Text style={styles.portfolioValue}>${netWorth.toFixed(2)}</Text>
              <PieChart
                data={pieData}
                width={screenWidth - 32}
                height={150}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[0, 0]}
                absolute
              />
            </View>

            {/* Total Profit */}
            <View style={styles.card}>
              <Text style={styles.totalProfitTitle}>Total Profit</Text>
              <BarChart
                data={barData}
                width={screenWidth - 32}
                height={220}
                yAxisSuffix="k"
                chartConfig={{
                  backgroundGradientFrom: '#f9fef7',
                  backgroundGradientTo: '#ffffff',
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  barPercentage: 0.5,
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>
          </>
        ) : (
          // Guest View
          <View style={styles.guestContainer}>
            <Text style={styles.errorMessage}>Guest accounts cannot access this page.</Text>
            <Text style={styles.promptMessage}>Please log in to access full features.</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('LoginMethodEmail')}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Error Handling */}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContent: {
    padding: 16,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  portfolioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  portfolioValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  totalProfitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  guestContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
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
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default PortfolioScreen;
