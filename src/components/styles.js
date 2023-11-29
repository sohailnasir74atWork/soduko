import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // alignContent: 'center',
    // justifyItem:"center",
    padding: 5,
    paddingTop: 4,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    width: '100%',
  },
  halfRowItem: {
    backgroundColor: 'white', // White background
    height: 100,
    marginHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
    justifyContent: 'center',
    color: 'white',
    alignItems: 'center',
    flex: 1,
    padding: 5,
    // Shadow for iOS
    backgroundColor: "#ccc",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  halfRowItem2: {
    backgroundColor: 'white', // White background
    height: 80,
    marginHorizontal: 30,
    borderRadius: 5,

    marginVertical: 30,
    justifyContent: 'center',
    alignContent: 'center',
    color: 'white',
    alignItems: 'center',
    flex: 1,
    padding: 5,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 5,
  },
  fullRowItem: {
    backgroundColor: 'black', // White background
    minHeight: 60,
    marginHorizontal: 5,
    borderRadius: 10,
    flex: 2,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '95%',
    paddingVertical: 5,
    justifyContent: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 2,
  },
  title2: {
    color: 'black', // Text color
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    paddingVertical: 5,
  },
  title3: {
    fontSize: 14,
    textAlign: 'left',
    color: 'white',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  columnWrapper: {
    justifyContent: 'space-evenly',
  },
  title4: {
    fontSize: 16,
    textAlign: 'justify',
    color: 'white',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  phone: {
    color: '#8ad8f6', // Text color
    fontSize: 14,
    textAlign: 'left',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  containericon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  tag: {
    backgroundColor: 'white',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 3,
  },
  moreScreenContainer: {
    flex: 1,
    backgroundColor: '#4c5265',
    padding: 10,
    width: '100%',
  },
  moreButton: {
    flexDirection: 'row',
    minHeight: 40,
    width: '100%',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderColor: 'white',
  },
  moreIcon: {
    color: 'white',
  },

  moreText: {
    fontWeight: '800',
    color: 'white',
  },

  moreHeader: {
    fontWeight: '900',
    fontSize: 22,
    borderBottomWidth: 1.3,
    borderColor: 'white',
    color: 'white',
    paddingBottom: 5,
    marginBottom: 20,
  },
  spacer: {
    flex: 1,
    maxHeight: 10000,
  },
});
