import React from 'react';
import { Text, SafeAreaView, StyleSheet, View, Image, ScrollView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>Available</Text>
          <Text style={styles.headerText}>Funded</Text>
          <Text style={styles.headerText}>Exited</Text>
        </View>

             {/* First Card */}
        <Card style={styles.card}>
          <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF9NRsc9oglJ-b0Vr4gYsn7Tsr2l-SEclE0Q&s' }} style={styles.image} />
          <Card.Content>
            <Title>1 Bed in The Links East, The Greens and Views</Title>
            <Paragraph>AED 1,718,000</Paragraph>
            <View style={styles.details}>
              <Text>5 year total return: 48.65%</Text>
              <Text>Yearly investment return: 9.73%</Text>
              <Text>Projected net yield: 5.53%</Text>
            </View>
          </Card.Content>
        </Card>
        {/* Second Card */}
        <Card style={styles.card}>
          <Image source={{ uri: 'https://www.rollingstone.com/wp-content/uploads/2024/06/INSIDE-OUT-2-ONLINE-USE-i140_15mT_pub.pub16.1581.jpg?w=1581&h=1054&crop=1300?text=Hi' }} style={styles.image} />
          <Card.Content>
            <Title>1 Bed in Burj Views C, Downtown Dubai</Title>
            <Paragraph>AED 1,540,000</Paragraph>
            <View style={styles.details}>
              <Text>5 year total return: 47.14%</Text>
              <Text>Yearly investment return: 9.43%</Text>
              <Text>Projected net yield: 5.5%</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Third Card */}
        <Card style={styles.card}>
          <Image source={{ uri: 'https://i.etsystatic.com/36262552/r/il/2df83a/4849750854/il_fullxfull.4849750854_t6m0.jpg' }} style={styles.image} />
          <Card.Content>
            <Title>2 Bed in Jumeirah Lake Towers</Title>
            <Paragraph>AED 2,300,000</Paragraph>
            <View style={styles.details}>
              <Text>5 year total return: 45.21%</Text>
              <Text>Yearly investment return: 9.04%</Text>
              <Text>Projected net yield: 5.2%</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Fourth Card */}
        <Card style={styles.card}>
          <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzd6yjN3KKHo9xNbIqAY9XK7ZdYM6EdqlokQ&s' }} style={styles.image} />
          <Card.Content>
            <Title>3 Bed in Dubai Marina</Title>
            <Paragraph>AED 3,800,000</Paragraph>
            <View style={styles.details}>
              <Text>5 year total return: 49.87%</Text>
              <Text>Yearly investment return: 9.97%</Text>
              <Text>Projected net yield: 5.6%</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Fifth Card */}
        <Card style={styles.card}>
          <Image source={{ uri: 'https://i.pinimg.com/originals/9c/7b/f3/9c7bf3962b307d2ecd13dedddeeaaf60.jpg' }} style={styles.image} />
          <Card.Content>
            <Title>Studio in Business Bay</Title>
            <Paragraph>AED 950,000</Paragraph>
            <View style={styles.details}>
              <Text>5 year total return: 42.18%</Text>
              <Text>Yearly investment return: 8.44%</Text>
              <Text>Projected net yield: 4.8%</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Sixth Card */}
        <Card style={styles.card}>
          <Image source={{ uri: 'https://d2t1xqejof9utc.cloudfront.net/screenshots/pics/685cf245f9a2bc1fc330292a54f8f53c/large.png' }} style={styles.image} />
          <Card.Content>
            <Title>2 Bed in Palm Jumeirah</Title>
            <Paragraph>AED 4,500,000</Paragraph>
            <View style={styles.details}>
              <Text>5 year total return: 52.36%</Text>
              <Text>Yearly investment return: 10.47%</Text>
              <Text>Projected net yield: 5.8%</Text>
            </View>
          </Card.Content>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 8,
    marginTop:50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 20,
  },
  image: {
    height: 250,
    width: '100%',
  },
  details: {
    marginTop: 10,
  },
});