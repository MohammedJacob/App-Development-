import { StyleSheet } from 'react-native';

const RecCardStyles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    paddingStart: 15,
    paddingEnd: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f4f8fc',
  },
  cardHeaderIcon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#50b5ff',
  },
  cardHeaderLocation: {
    fontSize: 14,
    color: '#888',
  },
  imageContainer: {
    alignItems: 'center',
  },
  cardImage: {
    width: '95%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  descriptionBar: {
    position: 'absolute',
    bottom: 5,
    width: '90%',
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    borderRadius: 8,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  purchaseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  purchaseStatus: {
    fontSize: 14,
    fontWeight: '900',
    color: '#333',
  },
  energyAvailable: {
    fontSize: 14,
    fontWeight: '900',
    color: '#00c853',
  },
  cardContent: {
    padding: 10,
  },
  infoButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '65%',
    borderRadius: 5,
  },
  infoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RecCardStyles;
