import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For the arrow icon

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: 'What is the minimum investment amount?',
      answer: 'The minimum investment amount is $100. You can invest in increments of $100 after that.',
    },
    {
      question: 'How do I track my investments?',
      answer: 'You can track your investments directly through the app. Just navigate to the "My Investments" section.',
    },
    {
      question: 'What are the risks associated with investing?',
      answer: 'All investments carry some level of risk, including the potential loss of principal. Always consider your financial situation before investing.',
    },
    {
      question: 'How do I withdraw my returns?',
      answer: 'You can request a withdrawal directly through the app. Funds will be transferred to your linked bank account within 3-5 business days.',
    },
    {
      question: 'Are there any fees for investing?',
      answer: 'Yes, a small management fee of 1% is deducted annually from your total invested amount to cover administrative costs.',
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      {faqData.map((faq, index) => (
        <View key={index} style={styles.card}>
          <TouchableOpacity style={styles.questionRow} onPress={() => toggleFAQ(index)}>
            <Text style={styles.question}>{faq.question}</Text>
            <MaterialIcons
              name={activeIndex === index ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
              color="black"
            />
          </TouchableOpacity>
          {activeIndex === index && <Text style={styles.answer}>{faq.answer}</Text>}
        </View>
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  answer: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
});

export default FAQ;
