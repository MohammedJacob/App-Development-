import { StyleSheet } from 'react-native';

const EquityStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f9fa',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingStart: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1f2545',
  },
  cardCountry: {
    fontSize: 15,
    color: '#777',
  },
  progressBarAndImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '75%',
    paddingHorizontal: 16,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#34c659',
    borderRadius: 4,
  },
  percentageText: {
    marginLeft: '5%',
    fontSize: 12,
    color: '#888',
    bottom: 25,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '75%',
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#34c659',
    marginLeft: '5%',
  },
  cardTarget: {
    fontSize: 14,
    color: '#888',
    marginRight: '5%',
  },
  investmentDetailContainer: {
    backgroundColor: '#eef6ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  investmentDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#777',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  detailButtonLeft: {
    backgroundColor: '#4088f4',
    alignSelf: 'flex-start',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    justifyContent: 'flex-end',
  },
});

export default EquityStyles;
