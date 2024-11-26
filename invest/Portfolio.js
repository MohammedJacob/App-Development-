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
import { PieChart } from 'react-native-chart-kit';
import FooterTabs from './components/footer';
import Header from './components/Header';

const PortfolioScreen = ({ navigation }) => {
  const { userData } = useUser();
  const [portfolioInvestments, setPortfolioInvestments] = useState([]); // General investments
  const [recInvestments, setRecInvestments] = useState([]); // REC-specific investments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [netWorth, setNetWorth] = useState(0); // Total of all investments
  const [recWorth, setRecWorth] = useState(0); // Total REC investments
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchInvestments = async () => {
      if (userData && userData.id) {
        try {
          // Fetch portfolio and REC investments from API
          const [portfolioRes, recRes] = await Promise.all([
            fetch(`http://192.168.1.241:3000/api/portfolio/${userData.id}`),
            fetch(`http://192.168.1.241:3000/api/recs/${userData.id}`),
          ]);

          if (!portfolioRes.ok || !recRes.ok) {
            throw new Error('Failed to fetch data');
          }

          const portfolioData = await portfolioRes.json();
          const recData = await recRes.json();

          // Set the data for both categories
          setPortfolioInvestments(portfolioData);
          setRecInvestments(recData);

          // Calculate net worth for general investments
          const totalNetWorth = portfolioData.reduce(
            (sum, item) => sum + (parseFloat(item.amount_invested) || 0),
            0
          );

          // Calculate REC worth
          const totalRecWorth = recData.reduce(
            (sum, item) => sum + (parseFloat(item.amount_invested) || 0),
            0
          );

          // Update states
          setNetWorth(totalNetWorth);
          setRecWorth(totalRecWorth);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [userData]);

  // Calculate the total portfolio value
  const totalPortfolioValue = netWorth + recWorth;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Header />
        <View style={styles.tabs}>
          {['RECs', 'Shares', 'Bonds', 'Transactions'].map((tab, index) => (
            <TouchableOpacity key={index} style={styles.tab}>
              <Text style={styles.tabText}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.portfolioTitle}>Portfolio Value</Text>
              <Text style={styles.portfolioValue}>${totalPortfolioValue.toFixed(2)}</Text>
              <PieChart
                data={[
                  {
                    name: 'RECs',
                    value: recWorth,
                    color: '#4CAF50',
                    legendFontColor: '#000',
                    legendFontSize: 14,
                  },
                  {
                    name: 'Other Investments',
                    value: netWorth,
                    color: '#FFC107',
                    legendFontColor: '#000',
                    legendFontSize: 14,
                  },
                ]}
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
          </>
        )}
      </ScrollView>
      <FooterTabs />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    padding: 10,
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  portfolioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  portfolioValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 10,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default PortfolioScreen;
