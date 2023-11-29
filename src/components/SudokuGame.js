import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, ActivityIndicator, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useNavigation } from '@react-navigation/native';
import { sudokuGen } from '../dummy';

const SudokuGame = ({ route, darkMode, toggleDarkMode }) => {
  const navigation = useNavigation();
  const { level, reset } = route.params;
  const [board, setBoard] = useState([]);
  const initialPuzzleRef = useRef([]);
  const [timer, setTimer] = useState(0);
  const [solved, setSolved] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [errors, setErrors] = useState(0);
  const [moves, setMoves] = useState(0);
  const [prevSelectedCell, setPrevSelectedCell] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isDarkmode, setIsDarkmode] = useState(false);
  const [validity, setValidity] = useState(Array.from({ length: 9 }, () => Array(9).fill(true)));
  const [cellStyles, setCellStyles] = useState(Array.from({ length: 9 }, () => Array(9).fill(styles.text)));
  const timerRef = useRef(0);
  const [savedGameLoaded, setSavedGameLoaded] = useState(false);

  const STORAGE_KEY = '@SudokuGameState';

  useEffect(() => {
    const loadGameState = async () => {
      try {
        if (reset) {
          // If reset is true, use data from route.params
          const { original, question } = sudokuGen(level);
          setBoard(question);
          initialPuzzleRef.current = question;
          setSolved(original);
          setSavedGameLoaded(true);
        } else {
          // If reset is false, load data from local storage
          const savedState = await AsyncStorage.getItem(STORAGE_KEY);
    
          if (savedState) {
            const parsedState = JSON.parse(savedState);
            setBoard(parsedState.board);
            setTimer(parsedState.timer);
            setSolved(parsedState.solved);
            setIsGameWon(parsedState.isGameWon);
            setSelectedCell(parsedState.selectedCell);
            setIsTimerRunning(parsedState.isTimerRunning);
            setTimer(parsedState.timer);
            timerRef.current = parsedState.timer; // Set the timer reference
            setErrors(parsedState.errors);
            setMoves(parsedState.moves);
            setPrevSelectedCell(parsedState.prevSelectedCell);
            setShowAlert(parsedState.showAlert);
            setIsDarkmode(parsedState.isDarkmode);
            setValidity(parsedState.validity);
            setCellStyles(parsedState.cellStyles);
            setSavedGameLoaded(true);
          } else {
            // If no saved game found, generate a new Sudoku puzzle
            const { original, question } = sudokuGen(level);
            setBoard(question);
            initialPuzzleRef.current = question;
            setSolved(original);
            setSavedGameLoaded(true);
          }
        }
      } catch (error) {
        console.error('Error loading game state:', error);
      }
    };
    

    loadGameState();
  }, [level]);

  useEffect(() => {
    const saveGameState = async () => {
      try {
        const gameState = {
          board,
          timer,
          solved,
          isGameWon,
          selectedCell,
          isTimerRunning,
          errors,
          moves,
          prevSelectedCell,
          showAlert,
          isDarkmode,
          validity,
          cellStyles,
        };

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
      } catch (error) {
        console.error('Error saving game state to storage:', error);
      }
    };

    if (savedGameLoaded) {
      saveGameState();
    }
  }, [
    board,
    timer,
    solved,
    isGameWon,
    selectedCell,
    isTimerRunning,
    errors,
    moves,
    prevSelectedCell,
    showAlert,
    isDarkmode,
    validity,
    cellStyles,
    savedGameLoaded,
  ]);

  // useEffect(() => {
  //   if (!savedGameLoaded) {
  //     const { original, question } = sudokuGen(level);
  //     setBoard(question);
  //     initialPuzzleRef.current = question;
  //     setSolved(original);
  //   }
  // }, [level, savedGameLoaded]);

  useEffect(() => {
    if (checkGameWin()) {
      console.log('won');
      setIsGameWon(true);
      setIsTimerRunning(false);
    }
  }, [board]);

  const checkGameWin = () => {
    // Check if both board and solved are non-empty arrays
    if (!board.length || !solved.length) {
      return false;
    }

    // Check if the current board matches the solved puzzle
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] !== solved[i][j]) {
          return false;
        }
      }
    }

    return true;
  };

  useEffect(() => {
    let interval;

    if (isTimerRunning) {
      interval = setInterval(() => {
        timerRef.current += 1;
        setTimer(prevTimer => prevTimer + 1); // Update the state to trigger a re-render
      }, 1000);
    }
    console.log(timer)
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  

  
  const updateCellStyles = (row, col, style) => {
    const newStyles = cellStyles.map(rowStyles => [...rowStyles]);
    newStyles[row][col] = style;
    setCellStyles(newStyles);
  };
  const handleBackPress = () => {
    navigation.navigate('ContinueScreen');
  };
  useEffect(() => {
    const hardwareBackPressHandler = () => {
      // Handle hardware back press
      handleBackPress();
      return true; // Returning true prevents the default behavior (going back)
    };

    // Subscribe to hardware back press event
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      hardwareBackPressHandler
    );

    return () => {
      // Unsubscribe when the component is unmounted
      backHandler.remove();
    };
  }, []);
  
  const handleCellPress = (row, col) => {
    setSelectedCell({row, col});
  };

  const removeCellText = () => {
    if (selectedCell) {
      const {row, col} = selectedCell;
      // if (initialPuzzleRef.current[row][col] !== 0) {
      //   console.log(initialPuzzleRef.current[row][col])
      //   return;
      // }

      const updatedBoard = [...board];
      updatedBoard[row][col] = 0;
      setBoard(updatedBoard);

      // Create a new copy of initialPuzzle before updating it

      // Reset the validity for the cleared cell
      const updatedValidity = validity.map(rowValidity => [...rowValidity]);
      updatedValidity[row][col] = true;
      setValidity(updatedValidity);

      setMoves(prevMoves => prevMoves + 1);

      // Reset the style for the cleared cell
      if (darkMode) {
        updateCellStyles(row, col, styles.dark);
      } else {
        updateCellStyles(row, col, styles.text);
      }
    }
  };

  const handleWinAlertClose = () => {
    setIsGameWon(false);
    navigation.goBack();
    // You can add any additional logic you want to perform when the user closes the win alert
  };

  const renderWinAlert = () => {
    return (
      <AwesomeAlert
        show={isGameWon}
        showProgress={false}
        title="Congratulations!"
        titleStyle={{
          fontSize: 20,
          textAlign: 'center',
          fontWeight: 'bold',
        }}
        message={`You've won the game in ${formatTime(
          timerRef.current,
        )} with ${moves} moves and ${errors} errors!`}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="New Game"
        confirmButtonColor="#DD6B55"
        confirmButtonTextStyle={{
          fontSize: 18,
          fontWeight: 'bold',
          borderRadius: 10,
        }}
        onConfirmPressed={handleWinAlertClose}
        overlayStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
        contentContainerStyle={{
          width: 300,
          height: 180,
        }}
        messageStyle={{
          fontSize: 16,
          fontWeight: 'bold',
          paddingVertical: 10,
        }}
      />
    );
  };

  const handleNumberPress = number => {
    const {row, col} = selectedCell;
    if (selectedCell) {
      // console.log(initialPuzzle[row][col]);
      // // Check if the selected cell is part of the initial puzzle (not inserted by the user)
      // if (initialPuzzle[row][col] !== 0) {
      //   return; // Do nothing if the cell is part of the initial puzzle
      // }
      const updatedBoard = [...board];
      const isValidMove = checkMoveValidity(row, col, number);

      // Check if the user's input matches the corresponding value in the solved puzzle
      const isCorrectMove = solved[row][col] === number;

      updatedBoard[row][col] = number;
      setBoard(updatedBoard);
      setMoves(prevMoves => prevMoves + 1);

      // Add logic to update the validity state for the selected cell
      const updatedValidity = [...validity];
      updatedValidity[row][col] = isValidMove;
      setValidity(updatedValidity);

      // Update the style based on correctness
      const style = isCorrectMove ? styles.correct : styles.wrong;
      updateCellStyles(row, col, style);

      // Increment errors if the move is incorrect
      if (!isCorrectMove) {
        setErrors(prevErrors => prevErrors + 1);
      }
    }
  };

  // ... (other functions)

  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((cell, colIndex) => {
          const isSelectedCell =
            selectedCell &&
            (selectedCell.row === rowIndex || selectedCell.col === colIndex);

          const cellStyle = cellStyles[rowIndex][colIndex];

          // Check if the selected cell has a value
          const isMatchingCell =
            selectedCell &&
            cell !== 0 &&
            (board[rowIndex][colIndex] ===
              board[selectedCell.row][selectedCell.col] ||
              (rowIndex === selectedCell.row && colIndex === selectedCell.col));

          // Check if the current cell has the same value as the selected cell
          const isSameValueAsSelected =
            selectedCell &&
            Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
            Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3) &&
            cell !== 0 &&
            cell === board[selectedCell.row][selectedCell.col];
          const isBoxSelected =
            selectedCell &&
            Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
            Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3) &&
            cell !== 0 &&
            cell === board[selectedCell.row][selectedCell.col];
          return (
            <TouchableOpacity
              key={colIndex}
              style={[
                [
                  styles.mainGridCell,
                  {
                    backgroundColor: darkMode ? '#2d2d30' : 'white',
                  },
                ],
                {width: cellWidth},
                rowIndex % 3 === 0 && {borderTopWidth: 2},
                colIndex % 3 === 0 && {borderLeftWidth: 2},
                rowIndex === 8 && {borderBottomWidth: 2},
                colIndex === 8 && {borderRightWidth: 2},
                {borderColor: 'black'},
                cell === 0 && styles.emptyCell,
                isSelectedCell && {backgroundColor: '#D3F8D3'},
                selectedCell &&
                  Math.floor(selectedCell.row / 3) ===
                    Math.floor(rowIndex / 3) &&
                  Math.floor(selectedCell.col / 3) ===
                    Math.floor(colIndex / 3) && {backgroundColor: '#D3F8D3'},
                isSelectedCell &&
                  cellStyle !== styles.text && {backgroundColor: '#D3F8D3'},
                isSameValueAsSelected &&
                  isSelectedCell && {backgroundColor: '#FFB6C1'},
                isMatchingCell &&
                  isSelectedCell &&
                  !isSameValueAsSelected && {backgroundColor: '#FFB6C1'},
                cellStyle,
                selectedCell &&
                  selectedCell.row === rowIndex &&
                  selectedCell.col === colIndex && {
                    backgroundColor: 'lightgreen',
                  },
              ]}
              onPress={() => handleCellPress(rowIndex, colIndex)}>
              {cell !== 0 && <Text style={[, cellStyle]}>{cell}</Text>}
              {cell === 0 && <Text style={[styles.text]}></Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    ));
  };

  const handlePausePress = () => {
    setIsTimerRunning(!isTimerRunning);
    setShowAlert(!showAlert);
  };

  const checkMoveValidity = (row, col, number) => {
    // Check if the number is valid in the row, column, and the 3x3 grid
    for (let i = 0; i < 9; i++) {
      if (
        board[row][i] === number ||
        board[i][col] === number ||
        board[row - (row % 3) + Math.floor(i / 3)][
          col - (col % 3) + (i % 3)
        ] === number
      ) {
        return false;
      }
    }
    return true;
  };

  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  };
  const screenWidth = Dimensions.get('window').width;
  const cellWidth = screenWidth / 9 - 1;
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: darkMode ? '#2d2d30' : 'white'},
      ]}>
       {savedGameLoaded ? (<>
      {renderWinAlert()}
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="PAUSED"
        titleStyle={{
          fontSize: 20, // Adjust font size
          textAlign: 'center', // Adjust text alignment
          fontWeight: 'bold',
        }}
        message={`Moves: ${moves}   Errors:${errors}    Time:${formatTime(
          timerRef.current,
        )}`}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="Continue"
        confirmButtonColor="#DD6B55"
        confirmButtonTextStyle={{
          fontSize: 18, // Adjust font size
          fontWeight: 'bold', // Adjust text color
          borderRadius: 10,
        }}
        onConfirmPressed={() => {
          handlePausePress();
        }}
        overlayStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker overlay color
        }}
        contentContainerStyle={{
          width: 300, // Adjust width
          height: 180, // Adjust height
        }}
        messageStyle={{
          fontSize: 16, // Adjust font size
          fontWeight: 'bold',
          paddingVertical: 10,
        }}
      />

      <View style={styles.settingContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{marginRight: 10}} onPress={handleBackPress}>
            <Ionicons name={'arrow-back'} size={30} color="black" />
          </Text>
          <Ionicons name={'logo-angular'} size={30} color="#3b5998" />
        </View>
        <Text onPress={handlePausePress}>
          <Ionicons
            name={isTimerRunning ? 'pause-circle' : 'play-circle'}
            size={30}
            color="green"
          />
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{marginRight: 10}} onPress={toggleDarkMode}>
            <Ionicons
              name={isDarkmode ? 'sunny' : 'contrast'}
              size={30}
              color="grey"
            />
          </Text>
          <Ionicons name={'settings'} size={30} color="tomato" />
        </View>
      </View>

      <View style={styles.timerContainer}>
        <View style={styles.timerContainer}>
          <Text
            style={[styles.timerText, {color: darkMode ? 'white' : 'black'}]}>
            Moves:{moves}
          </Text>
          <Text style={styles.mistakesText}>Mistakes: {errors}</Text>
          {/* <Text style={styles.timerText} >
            <Ionicons
              
              size={20}
              color="grey"
            />
          </Text> */}
          <View style={[styles.timerText]}>
            <Ionicons name="alarm" size={20} color="grey" />
            <Text
              style={[styles.timerText, {color: darkMode ? 'white' : 'black'}]}>
              {formatTime(timerRef.current)}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.mainSudokuGrid}>{renderBoard()}</View>

      <View style={styles.numbers}>
        {[1, 2, 3, 4, 5].map(number => (
          <TouchableOpacity
            key={number}
            style={[
              styles.number,
              {width: cellWidth, backgroundColor: darkMode ? 'grey' : 'white'},
            ]}
            onPress={() => handleNumberPress(number)}>
            <Text style={[styles.text, {color: darkMode ? 'white' : 'grey'}]}>
              {number}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={[styles.numbers]}>
        {[6, 7, 8, 9].map(number => (
          <TouchableOpacity
            key={number}
            style={[
              styles.number,
              {width: cellWidth, backgroundColor: darkMode ? 'grey' : 'white'},
            ]}
            onPress={() => handleNumberPress(number)}>
            <Text style={[styles.text, {color: darkMode ? 'white' : 'grey'}]}>
              {number}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[
            styles.number,
            {width: cellWidth, backgroundColor: darkMode ? 'grey' : 'white'},
          ]}>
          <Text
            style={[styles.text, {color: darkMode ? 'white' : 'grey'}]}
            onPress={removeCellText}>
            <Ionicons name="close-circle-outline" size={30} color="red" />
          </Text>
          <Text style={{fontSize: 10}}>Erase</Text>
        </TouchableOpacity>
      </View></>) : (<ActivityIndicator
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          size="large"
        />)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  mainSudokuGrid: {
    flexDirection: 'column',
    // marginTop: 16,
  },
  row: {
    flexDirection: 'row',
  },
  mainGridCell: {
    // height: 40,
    // borderRadius: 2,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    // margin: 1,
    // Add border styling
    borderColor: 'black',
    borderWidth: 0.5,
    // Shadow and elevation removed for clarity
  },

  emptyCell: {
    color: 'lightblue',
  },
  input: {
    flex: 1,
    textAlign: 'center',
  },
  // timerContainer: {
  //   flexDirection: 'row',
  //   justifyContent: "space-evenly",
  //   width: '100%',
  // },
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
    width: '80%',
    marginTop: 20,
    marginBottom: 30,
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
    marginTop: 5, // Adjusted marginTop
  },

  number: {
    height: 50,
    borderRadius: 8,
    backgroundColor: 'white',
    color: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
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
    fontSize: 25,
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
    color: 'blue',
    fontSize: 25,
  },
});

export default SudokuGame;