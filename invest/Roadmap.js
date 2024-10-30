import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Roadmap = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Phase 1 */}
      <View style={styles.phaseContainer}>
        <View style={styles.phaseIndicatorActive}></View>
        <View style={styles.phaseContent}>
          <Text style={styles.phaseTitleActive}>Phase 1</Text>
          <Text style={styles.heading}>Launch of Mobile App</Text>
          <Text style={styles.description}>
            Provide seamless access to renewable energy investments and real-time portfolio management with our mobile app.
          </Text>
        </View>
      </View>

      {/* Phase 2 */}
      <View style={styles.phaseContainer}>
        <View style={styles.phaseIndicator}></View>
        <View style={styles.phaseContent}>
          <Text style={styles.phaseTitle}>Phase 2</Text>
          <Text style={styles.heading}>Funding New Renewable Energy Sites</Text>
          <Text style={styles.description}>
            Allow new projects to be funded rather than just existing sites. Increasing the overall global renewable energy capacity.
          </Text>
        </View>
      </View>

      {/* Phase 3 */}
      <View style={styles.phaseContainer}>
        <View style={styles.phaseIndicator}></View>
        <View style={styles.phaseContent}>
          <Text style={styles.phaseTitle}>Phase 3</Text>
          <Text style={styles.heading}>Loyalty Program</Text>
          <Text style={styles.description}>
            Introduce a loyalty program, allowing investors to benefit from reduced fees.
          </Text>
        </View>
      </View>

      {/* Phase 4 */}
      <View style={styles.phaseContainer}>
        <View style={styles.phaseIndicator}></View>
        <View style={styles.phaseContent}>
          <Text style={styles.phaseTitle}>Phase 4</Text>
          <Text style={styles.heading}>Offset Scope 2 Emissions</Text>
          <Text style={styles.description}>
            Organizations can fund existing or new sites and burn their fractional ownership for a Scope 2 offset with true additionality.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  phaseContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  phaseIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#d1d5db', // Light gray for inactive phases
    marginRight: 20,
    marginTop: 8,
  },
  phaseIndicatorActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00A86B', // Green for active phase
    marginRight: 20,
    marginTop: 8,
  },
  phaseContent: {
    flex: 1,
  },
  phaseTitle: {
    color: '#9CA3AF', // Gray color
    fontWeight: '600',
    marginBottom: 4,
  },
  phaseTitleActive: {
    color: '#00A86B', // Green color for active phase
    fontWeight: '600',
    marginBottom: 4,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937', // Dark color for text
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#4B5563', // Medium gray for description text
  },
});

export default Roadmap;
