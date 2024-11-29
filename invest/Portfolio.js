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
            <View style={styles.card}>
              {filteredInvestments.map((item, index) => (
                <View key={index} style={styles.investmentItem}>
                  <Text style={styles.investmentText}>
                    {item.name || 'Investment'}: ${item.amount_invested || '0'}
                  </Text>
                </View>
              ))}
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
    flexDirection: 'column', // Stack the icon-text pairs vertically
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginRight: 10,
  },
  legendRow: {
    flexDirection: 'row', // Keep icon and text in a row
    alignItems: 'center', // Align them vertically
    marginBottom: 10, // Space between each row
  },
  legendText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 5, // Space between the icon and text
  },
  legendValue: {
    fontSize: 14,
    color: '#000',
    marginLeft: 5, // Space between the text and value
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
