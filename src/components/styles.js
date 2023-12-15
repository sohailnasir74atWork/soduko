import {StyleSheet} from "react-native"


export const styles = StyleSheet.create({
    container: {
      flex: 1,
      // justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      // height: '100%',
      minHeight: '100%',
    },
    mainSudokuGrid: {
      flexDirection: 'column',
      // marginTop: 16,
      minHeight: 360,

    },
    // noteContainer: {
    //   flexDirection: 'row',
    // },
  
    noteText: {
      // Style for individual note text
      fontSize: 12,
      // Add any other styles you need
    },
  
    // Styles for positioning notes in the grid
    noteLine1: {
      justifyContent: 'flex-start', flexDirection:"row" // Align notes to the start of the container (left)
    },
    noteLine2: {
      justifyContent: 'center', flexDirection:"row"// Align notes to the center of the container
    },
    noteLine3: {
      justifyContent: 'flex-end',flexDirection:"row" // Align notes to the end of the container (right)
    },
    row: {
      flexDirection: 'row',
    },
    mainGridCell: {
      maxHeight: 40,
      // borderRadius: 2,
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
      marginVertical: 10,
    },
    timerContent: {
      flexDirection: 'row',
      textAlign: 'right',
    },
    timerText: {
      fontSize: 16,
      fontWeight: 'bold',
      flexDirection: 'row',
      justifyContent: 'center',
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
      marginTop: 15,
      marginBottom: 10,
    },
    pauseBtn: {
      height: 40,
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
      borderRadius: 8,
      backgroundColor: 'white',
      color: '#000',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      cursor: 'pointer',
      marginVertical: 5,
      flex: 1,
      marginHorizontal: 5,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.19,
      shadowRadius: 5.62,
      elevation: 2,
    },
  
    text: {
      color: 'grey',
      fontSize: 30,
    },
    text2: {
      color: 'grey',
      fontSize: 36,
    },
    dark: {
      color: 'grey',
      fontSize: 25,
    },
    icon: {
      color: 'white',
    },
    wrong: {
      color: 'red',
      fontSize: 25,
    },
    correct: {
      color: '#25D366',
      fontSize: 25,
    },
    spacer: {
      minHeight: '100%',
    },
  });