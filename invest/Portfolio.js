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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PortfolioScreen = ({ navigation }) => {
  const { userData } = useUser();
  const [portfolioInvestments, setPortfolioInvestments] = useState([]);
  const [recInvestments, setRecInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [netWorth, setNetWorth] = useState(0);
  const [recWorth, setRecWorth] = useState(0);
  const [activeTab, setActiveTab] = useState('All'); // Tracks the active tab
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchInvestments = async () => {
      if (userData && userData.id) {
        try {
          const [portfolioRes, recRes] = await Promise.all([
            fetch(`http://192.168.1.241:3000/api/portfolio/${userData.id}`),
            fetch(`http://192.168.1.241:3000/api/recs/${userData.id}`),
          ]);

          if (!portfolioRes.ok || !recRes.ok) {
            throw new Error('Failed to fetch data');
          }

          const portfolioData = await portfolioRes.json();
          const recData = await recRes.json();

          setPortfolioInvestments(portfolioData);
          setRecInvestments(recData);

          const totalNetWorth = portfolioData.reduce(
            (sum, item) => sum + (parseFloat(item.amount_invested) || 0),
            0
          );

          const totalRecWorth = recData.reduce(
            (sum, item) => sum + (parseFloat(item.amount_invested) || 0),
            0
          );

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

  const filteredInvestments =
    activeTab === 'Shares'
      ? portfolioInvestments
      : activeTab === 'RECs'
      ? recInvestments
      : [...portfolioInvestments, ...recInvestments];

  const calculateTotal = () => {
    if (activeTab === 'Shares') return netWorth;
    if (activeTab === 'RECs') return recWorth;
    return netWorth + recWorth;
  };

  if (!userData || !userData.id) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.box}>
            <Text style={styles.message}>Please log in to access this page</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.signUpButton]}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Move FooterTabs outside the overlay */}
        <FooterTabs />
      </SafeAreaView>
    );
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Header />
        <View style={styles.tabs}>
          {['All', 'Shares', 'RECs'].map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tab, activeTab === tab && styles.activeTab]} // Highlight active tab
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
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
              <Text style={styles.portfolioTitle}>{activeTab} Value</Text>
              <Text style={styles.portfolioValue}>${calculateTotal().toFixed(2)}</Text>
              <View style={styles.chartContainer}>
                <View style={styles.legendContainer}>
                  <View style={styles.legendRow}>
                    <Icon name="id-card" size={26} color="#37c0b9" style={styles.legendIcon} />
                    <View>
                      <Text style={styles.legendText}>RECs</Text>
                      <Text style={styles.legendValue}>
                        ${activeTab === 'Shares' ? '0' : recWorth.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.legendRow}>
                    <Icon name="clock-outline" size={26} color="#3f87ef" style={styles.legendIcon} />
                    <View>
                      <Text style={styles.legendText}>Shares</Text>
                      <Text style={styles.legendValue}>
                        ${activeTab === 'RECs' ? '0' : netWorth.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
                <PieChart
                  data={[
                    {
                      name: 'RECs',
                      value: activeTab === 'Shares' ? 0 : recWorth,
                      color: '#37c0b9',
                      legendFontColor: '#000',
                      legendFontSize: 14,
                    },
                    {
                      name: 'Shares',
                      value: activeTab === 'RECs' ? 0 : netWorth,
                      color: '#3f87ef',
                      legendFontColor: '#000',
                      legendFontSize: 14,
                    },
                  ]}
                  width={screenWidth} // Adjusted width to fit next to the legend
                  height={150}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="value"
                  backgroundColor="transparent"
                  paddingLeft="0"
                  center={[0, 0]}
                  absolute
                />
              </View>
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
    flex:1,
    backgroundColor: '#F8F9FA',
    paddingStart: 15,
    paddingEnd: 15,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    elevation: 5, // Adds shadow effect on Android
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    alignItems: 'center',
    width: 250,
  },
  message: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  signUpButton: {
    backgroundColor: '#3f87ef',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#4CAF50',
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
    color: '#1b2745',
    fontWeight: 'bold',
  },
  portfolioValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1b2745',
    marginVertical: 10,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginRight: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 5,
  },
  legendValue: {
    fontSize: 14,
    color: '#000',
    marginLeft: 5,
  },
  legendIcon: {
    marginBottom: 0,
  },
  investmentItem: {
    marginVertical: 5,
  },
  investmentText: {
    fontSize: 16,
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
