import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Picker,
  ScrollView,
  StyleSheet,
} from 'react-native';
import RecCard from './RecCard'; // Adjust the path as needed
import Equity from './Equity'; // Adjust the path as needed

const SearchAndFilter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleSearch = () => {
    console.log('Search:', searchQuery, 'Filter:', selectedFilter);
    // Add your search and filtering logic here
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedFilter('all');
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Search and Filter Section */}
      <View style={styles.searchContainer}>
        {/* Search Input */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Filter Dropdown */}
        <View style={styles.filterContainer}>
          <Picker
            selectedValue={selectedFilter}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedFilter(itemValue)}
          >
            <Picker.Item label="All" value="all" />
            <Picker.Item label="Category 1" value="category1" />
            <Picker.Item label="Category 2" value="category2" />
          </Picker>
        </View>

        {/* Buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cards Section */}
      <ScrollView style={{ flex: 1 }}>
        <RecCard />
        <Equity />
      </ScrollView>
    </View>
  );
};

export default SearchAndFilter;

const styles = StyleSheet.create({
  searchButtonText: {
    fontSize: 16,
    color: '#000', // Color for search button text
  },
  clearButtonText: {
    fontSize: 16,
    color: '#FF0000', // Color for clear button text
  },
  searchContainer: {
    backgroundColor: '#fff',
    padding: 10,
  },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'column', // Change to 'column' for vertical stacking
    marginBottom: 10,
  },
  dropdown: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  searchIcon: {
    width: 24,
    height: 24,
  },
  picker: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    backgroundColor: 'white', // Optional: Set background color for visibility
  },
});
