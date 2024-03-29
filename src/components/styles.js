import {StyleSheet, Dimensions} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    // height: '100%',
    // minHeight: '100%',
  },
  mainSudokuGrid: {
    flexDirection: 'column',
    // marginTop: 16,
    minHeight: 300,
  },
  noteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // marginTop: 5,
    // borderWidth: 1, // Border for the note grid
  },

  noteCell: {
    width: '33%', // Divide the grid into 3 columns
    // height: 40, // Adjust the height as needed
    justifyContent: 'center',
    alignItems: 'center',
    // borderRightWidth: 1, // Border between cells
    // borderBottomWidth: 1, // Border between cells
  },

  noteText: {
    // Style for individual note text
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 12,
    // Add any other styles you need
  },
  row: {
    flexDirection: 'row',
  },
  mainGridCell: {
    height: Dimensions.get('window').height * 0.06,
    borderRadius: 2,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    // margin: 1,
    // Add border styling
    borderColor: 'black',
    borderWidth: 0.5,
  },

  emptyCell: {
    color: 'lightblue',
  },
  input: {
    flex: 1,
    textAlign: 'center',
  },

  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '97%',
    marginVertical: 5,
    marginBottom: 2,
  },
  timerContent: {
    flexDirection: 'row',
    textAlign: 'right',
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',

    // marginLeft: 8, // Adjust the margin as needed
  },
  mistakesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    // marginLeft: 8, // Adjust the margin as needed
  },
  infoText: {
    fontSize: 16,
  },
  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginTop: Dimensions.get('window').height * 0.025,
    marginBottom: Dimensions.get('window').height * 0.025,
  },
  pauseBtn: {
    height: Dimensions.get('window').height * 0.06,
    width: 80,
    borderRadius: 8,
    backgroundColor: '#0000ff',
    color: 'white',
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  numbers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  number: {
    // maxHeight: 60,
    height: Dimensions.get('window').height * 0.06,
    borderRadius: 8,
    backgroundColor: 'white',
    color: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#FAF9F6',
    borderWidth: 0.5,
    fontSize: 14,
    cursor: 'pointer',
    marginVertical: 5,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  text: {
    color: 'grey',
    fontSize: 26,
    lineHeight: 30,
    margin: 0,
    padding: 0,
  },
  text2: {
    color: 'grey',
    fontSize: 26,
    margin: 0,
    padding: 0,
  },
  dark: {
    color: 'grey',
    fontSize: 20,
  },
  icon: {
    color: 'white',
  },
  wrong: {
    color: 'red',
    fontSize: 20,
  },
  correct: {
    color: 'green',
    fontSize: 20,
  },
  spacer: {
    minHeight: '100%',
  },
});
