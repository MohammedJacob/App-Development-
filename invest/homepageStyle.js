import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f9fa',
    paddingStart: 15,
    paddingEnd: 15,
  },
  marketplaceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  CatogoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  headerText: {
    fontSize: 25,
    marginTop: 10,
    marginBottom: 15,
    fontWeight: '900',
    color: '#1f2545',
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  tab: {
    alignItems: 'center',
    flexDirection: 'column',
    paddingVertical: 5,
    marginHorizontal: 10,
  },
  tabItem: {
    flexDirection: 'row',
  },
  tabText: {
    fontSize: 16,
    color: '#535d69',
    marginLeft: 2,
  },
  activeTabText: {
    color: '#535d69',
  },
  activeTabIndicator: {
    height: 2,
    backgroundColor: '#34c659',
    width: '100%',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  searchButtonText: {
    fontSize: 16,
    color: '#000',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#FF0000',
  },
  searchContainer: {
    backgroundColor: '#fff',
  },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  filterContainer: {
    flexDirection: 'column',
    margin: 10,
  },
  dropdown: {
    borderColor: '#ccc',
    borderWidth: 88,
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
    backgroundColor: 'white',
  },
});
