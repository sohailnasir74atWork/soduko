import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AwesomeAlert from 'react-native-awesome-alerts';
import {useNavigation} from '@react-navigation/native';
import {sudokuGen} from './generateGame';
import Sound from 'react-native-sound';
import AppContext from './globleState/AppContext';
Sound.setCategory('Playback');
// const correctSound = new Sound('sound.mp3', Sound.MAIN_BUNDLE, error => {
//   if (error) {
//     console.error('Failed to load correct sound', error);
//   }
// });
const SudokuGame = ({route, darkMode, toggleDarkMode}) => {
  const navigation = useNavigation();
  const {level, reset} = route.params;
  const [clickSound, setClickSound] = useState(null);
  const [sound, setSound] = useState(true);
  const [clickSoundW, setClickSoundW] = useState(null);
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
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showHintAlert, setShowHintAlert] = useState(false);
  const [isDarkmode, setIsDarkmode] = useState(false);
  const {loaded, showInterstitialAd, adClosed} = useContext(AppContext);
  const [hints, setHints] = useState(2);
  const [validity, setValidity] = useState(
    Array.from({length: 9}, () => Array(9).fill(true)),
  );
  const [cellStyles, setCellStyles] = useState(
    Array.from({length: 9}, () => Array(9).fill(styles.text)),
  );
  const timerRef = useRef(0);
  const [savedGameLoaded, setSavedGameLoaded] = useState(false);

  const STORAGE_KEY = '@SudokuGameState';
  useEffect(() => {
    const sound = new Sound('sound.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.error('Failed to load the sound', error);
        return;
      }

      setClickSound(sound);
    });

    return () => {
      // Release the sound when the component is unmounted
      if (clickSound) {
        clickSound.release();
      }
    };
  }, []);
  useEffect(() => {
    const sound = new Sound('wrong.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.error('Failed to load the sound2', error);
        return;
      }

      setClickSoundW(sound);
    });

    return () => {
      // Release the sound when the component is unmounted
      if (clickSoundW) {
        clickSoundW.release();
      }
    };
  }, []);

  
  useEffect(() => {
    const loadGameState = async () => {
      try {
        if (reset) {
          // If reset is true, use data from route.params
          const {original, question} = sudokuGen(level);
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
            const {original, question} = sudokuGen(level);
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

  useEffect(() => {
    if (checkGameWin()) {
      setIsGameWon(true);
      setIsTimerRunning(false);
    }
  }, [board]);
  useEffect(() => {
    let interval;
  
    if (isTimerRunning) {
      interval = setInterval(() => {
        timerRef.current += 1;
        setTimer(prevTimer => prevTimer + 1); // Update the state to trigger a re-render
  
        // Check if it's time to show the ad (every 20 seconds)
        // if (timerRef.current % 10 === 0) {
        //   // Call a function to show the ad
        //   if(loaded) showInterstitialAd()
          
        // }
      }, 1000);1
    }
  
    return () => clearInterval(interval);
  }, [isTimerRunning]);


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

 

  const updateCellStyles = (row, col, style) => {
    const newStyles = cellStyles.map(rowStyles => [...rowStyles]);
    newStyles[row][col] = style;
    setCellStyles(newStyles);
  };
  const handleBackPress = () => {
    navigation.navigate('ContinueScreen');
  };
  const gotoNewGame = () => {
    navigation.navigate('SelectLevels');
  };
  useEffect(() => {
    const hardwareBackPressHandler = () => {
      // Handle hardware back press
      handleBackPress();
      return true; // Returning true prevents the default behavior (going back)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      hardwareBackPressHandler,
    );

    return () => {
      // Unsubscribe when the component is unmounted
      backHandler.remove();
    };
  }, []);
  // useEffect(() => {
    
  // }, [loaded, moves, showInterstitialAd]);
  
  const handleCellPress = (row, col) => {
    setSelectedCell({row, col});
  };

  const removeCellText = () => {
    if (selectedCell) {
      const {row, col} = selectedCell;
      const updatedBoard = [...board];

      // Check if the cell is not empty and the value is NOT equal to the solved value
      if (board[row][col] !== 0 && board[row][col] !== solved[row][col]) {
        updatedBoard[row][col] = 0;
        setBoard(updatedBoard);
        const updatedValidity = validity.map(rowValidity => [...rowValidity]);
        updatedValidity[row][col] = true;
        setValidity(updatedValidity);
        setMoves(prevMoves => prevMoves + 1);
        if (loaded && moves > 0 && moves % 10 === 0) {
          showInterstitialAd();
        }

        // Reset the style for the cleared cell
        if (darkMode) {
          updateCellStyles(row, col, styles.dark);
        } else {
          updateCellStyles(row, col, styles.text);
        }
      }
    }
  };
  

  const handleWinAlertClose = () => {
    setIsGameWon(false);
    navigation.goBack();
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
          height: 250,
        }}
        messageStyle={{
          fontSize: 16,
          fontWeight: 'bold',
          paddingVertical: 10,
        }}
      />
    );
  };
  const getMoreHints = () => {
    if (loaded) {
      showInterstitialAd();
      setHints(2);
      setShowHintAlert(!showHintAlert);
      setIsTimerRunning(!isTimerRunning);
    } else {
      setHints(2);
      setShowHintAlert(!showHintAlert);
      setIsTimerRunning(!isTimerRunning);
    }
  };
  const handleNumberPress = number => {
    if (selectedCell) {
      const {row, col} = selectedCell;
      const updatedBoard = [...board];

      // Check if the cell is empty or the value is NOT equal to the solved value
      if (board[row][col] === 0 || board[row][col] !== solved[row][col]) {
        const isValidMove = checkMoveValidity(row, col, number);
        const isCorrectMove = solved[row][col] === number;

        updatedBoard[row][col] = number;
        setBoard(updatedBoard);
        setMoves(prevMoves => prevMoves + 1);
        if (loaded && moves > 0 && moves % 10 === 0) {
          showInterstitialAd();
        }

        const updatedValidity = validity.map(rowValidity => [...rowValidity]);
        updatedValidity[row][col] = isValidMove;
        setValidity(updatedValidity);

        const style = isCorrectMove ? styles.correct : styles.wrong;
        updateCellStyles(row, col, style);

        // Increment errors if the move is incorrect
        if (!isCorrectMove) {
          setErrors(prevErrors => prevErrors + 1);
          if (clickSoundW && sound) {
            clickSoundW.play();
          }
        }

        if (clickSound && sound) {
          clickSound.play();
        }
      }
    }
  };

  // ... (other functions)
  const checkErrorsForLoss = () => {
    if (errors % 3 === 0 && errors > 0) {
      // Show the lose popup here
      setIsTimerRunning(!isTimerRunning);
      setShowErrorAlert(!showErrorAlert);
    }
  };
  const handleSound = () => {
    setSound(!sound);
  };
  const handleErrorPress = () => {
    if (loaded) {
      showInterstitialAd();
      setIsTimerRunning(!isTimerRunning);
      setShowErrorAlert(!showErrorAlert);
    } else {
      setIsTimerRunning(!isTimerRunning);
      setShowErrorAlert(!showErrorAlert);
    }
  };
  useEffect(() => {
    checkErrorsForLoss();
  }, [errors]);

  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((cell, colIndex) => {
          const isSelectedCell =
            selectedCell &&
            (selectedCell.row === rowIndex || selectedCell.col === colIndex);
          const cellStyle = cellStyles[rowIndex][colIndex];
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
                rowIndex % 3 === 0 && {borderTopWidth: 3},
                colIndex % 3 === 0 && {borderLeftWidth: 3},
                rowIndex === 8 && {borderBottomWidth: 3},
                colIndex === 8 && {borderRightWidth: 3},
                {borderColor: 'black'},
                cell === 0 && styles.emptyCell,
                isSelectedCell && {backgroundColor: '#dCFAFF'},
                selectedCell &&
                  Math.floor(selectedCell.row / 3) ===
                    Math.floor(rowIndex / 3) &&
                  Math.floor(selectedCell.col / 3) ===
                    Math.floor(colIndex / 3) && {backgroundColor: '#dCFAFF'},
                isSelectedCell &&
                  cellStyle !== styles.text && {backgroundColor: '#dCFAFF'},
                isSameValueAsSelected &&
                  isSelectedCell && {backgroundColor: '#FFCDD2'},//pink
                isMatchingCell &&
                  isSelectedCell &&
                  !isSameValueAsSelected && {backgroundColor: '#FFCDD2'},//pink
                cellStyle,
                selectedCell &&
                  selectedCell.row === rowIndex &&
                  selectedCell.col === colIndex && {
                    backgroundColor: '#AEDFF7',
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
  const handlePressHints = () => {
    if (hints > 0) {
      const emptyCells = findEmptyCells();

      if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const {row, col} = emptyCells[randomIndex];
        if (clickSound && sound) {
          clickSound.play();
        }
        const updatedBoard = [...board];
        const correctNumber = solved[row][col];

        updatedBoard[row][col] = correctNumber;
        setBoard(updatedBoard);

        setMoves(prevMoves => prevMoves + 1);
        if (loaded && moves > 0 && moves % 10 === 0) {
          showInterstitialAd();
        }

        // Update the validity state for the filled cell
        const updatedValidity = [...validity];
        updatedValidity[row][col] = true;
        setValidity(updatedValidity);

        // Update the style for the filled cell
        const style = styles.correct;
        updateCellStyles(row, col, style);

        setHints(prevHints => prevHints - 1);
        setSelectedCell({row, col}); // Auto-select the cell
      } else {
        // Show an alert when there are no empty cells
        showAlertFunction(
          'No Empty Cells',
          'There are no empty cells to fill.',
        );
      }
    } else {
      // Show an alert when there are no hints available
      setShowHintAlert(!showHintAlert);
      setIsTimerRunning(!isTimerRunning);
    }
  };

  const showAlertFunction = (title, message) => {
    // Customize this function to display alerts in your app
    alert(`${title}\n${message}`);
  };

  const findEmptyCells = () => {
    const emptyCells = [];

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === 0) {
          emptyCells.push({row: i, col: j});
        }
      }
    }

    return emptyCells;
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: darkMode ? '#2d2d30' : 'white'},
      ]}>
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
          height: 250, // Adjust height
        }}
        messageStyle={{
          fontSize: 16, // Adjust font size
          fontWeight: 'bold',
          paddingVertical: 10,
          marginVertical: 30,
        }}
      />
      <AwesomeAlert
        show={showErrorAlert}
        showProgress={false}
        title="You Lose"
        titleStyle={{
          fontSize: 20,
          textAlign: 'center',
          fontWeight: 'bold',
        }}
        message={`Moves: ${moves}   Errors:${errors}    Time:${formatTime(
          timerRef.current,
        )}`}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="New Game"
        confirmText="Second Chnace"
        confirmButtonColor="#DD6B55"
        confirmButtonTextStyle={{
          fontSize: 18,
          fontWeight: 'bold',
          borderRadius: 10,
        }}
        onCancelPressed={() => {
          gotoNewGame(); // Replace with your back button function
        }}
        onConfirmPressed={() => {
          handleErrorPress();
        }}
        overlayStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
        contentContainerStyle={{
          width: 300,
          height: 250,
        }}
        messageStyle={{
          fontSize: 16,
          fontWeight: 'bold',
          paddingVertical: 10,
          marginVertical: 30,
        }}
      />
      <AwesomeAlert
        show={showHintAlert}
        showProgress={false}
        title="Out of Hints ?"
        titleStyle={{
          fontSize: 20,
          textAlign: 'center',
          fontWeight: 'bold',
        }}
        message={`Moves: ${moves}   Errors:${errors}    Time:${formatTime(
          timerRef.current,
        )}`}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="Get More Hints"
        confirmButtonColor="#DD6B55"
        confirmButtonTextStyle={{
          fontSize: 18,
          fontWeight: 'bold',
          borderRadius: 10,
        }}
        onConfirmPressed={() => {
          getMoreHints();
        }}
        overlayStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
        contentContainerStyle={{
          width: 300,
          height: 250,
        }}
        messageStyle={{
          fontSize: 16,
          fontWeight: 'bold',
          paddingVertical: 10,
          marginVertical: 30,
        }}
      />
      <View style={styles.settingContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text onPress={handleBackPress}>
            <Ionicons
              name={'arrow-back'}
              size={40}
              color={darkMode ? 'grey' : '#25D366'}
            />
          </Text>
        </View>
        <Text onPress={handlePausePress}>
          <Ionicons
            name={isTimerRunning ? 'pause-circle' : 'play-circle'}
            size={40}
            color="green"
          />
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text onPress={toggleDarkMode}>
            <Ionicons
              name={darkMode ? 'sunny-sharp' : 'sunny-sharp'}
              size={35}
              color={darkMode ? 'lightgrey' : 'grey'}
            />
          </Text>
        </View>
      </View>

      <View style={styles.timerContainer}>
        <View style={styles.timerContainer}>
          <Text
            style={[styles.timerText, {color: darkMode ? 'white' : 'black'}]}>
            Moves:{moves}
          </Text>
          <Text style={styles.mistakesText}>Mistakes: {errors}</Text>
          <View style={[styles.timerText]}>
            <Ionicons name="alarm" size={20} color="grey" />
            <Text
              style={[styles.timerText, {color: darkMode ? 'white' : 'black'}]}>
              {formatTime(timerRef.current)}
            </Text>
          </View>
        </View>
      </View>
      {savedGameLoaded ? (
        <>
          <View style={styles.mainSudokuGrid}>{renderBoard()}</View>
        </>
      ) : (
        <ActivityIndicator
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          size="large"
        />
      )}
      <View style={styles.settingContainer}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text onPress={handleSound}>
            <Ionicons
              name={sound ? 'volume-high' : 'volume-mute'}
              size={30}
              color={darkMode ? '#25D366' : '#128C7E'}
            />
          </Text>
          <Text style={{fontSize: 10, color: '#128C7E', fontWeight: 'bold'}}>
            Sound
          </Text>
        </View>
        {/* <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:"#128C7E",
            paddingHorizontal:20
          }}>
          {level===10 && <Text style={{fontWeight:"bold", color:"white", fontSize:16}}>
            Very Easy
          </Text>}
          {level===23 && <Text style={{fontWeight:"bold", color:"white", fontSize:16}}>
            Easy
          </Text>}
          {level===38 && <Text style={{fontWeight:"bold", color:"white", fontSize:16}}>
            Medium
          </Text>}
          {level===47 && <Text style={{fontWeight:"bold", color:"white", fontSize:16}}>
            Hard
          </Text>}
          {level===56 && <Text style={{fontWeight:"bold", color:"white", fontSize:16}}>
            Very Hard
          </Text>}
          
         
        </View> */}
        <TouchableOpacity onPress={handlePressHints}>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <View style={{position: 'relative'}}>
              <Ionicons
                name="bulb"
                size={30}
                color={hints ? 'tomato' : 'grey'}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: '50%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                  {hints}
                </Text>
              </View>
            </View>
            <Text style={{fontSize: 10, color: 'tomato', fontWeight: 'bold'}}>
              Hints
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.numbers}>
        {[1, 2, 3, 4, 5].map(number => (
          <TouchableOpacity
            key={number}
            style={[
              styles.number,
              {
                width: cellWidth,
                backgroundColor: darkMode ? 'grey' : 'white',
              },
            ]}
            onPress={() => handleNumberPress(number)}>
            <Text style={[styles.text2, {color: darkMode ? 'white' : 'grey'}]}>
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
              {
                width: cellWidth,
                backgroundColor: darkMode ? 'grey' : 'white',
              },
            ]}
            onPress={() => handleNumberPress(number)}>
            <Text style={[styles.text2, {color: darkMode ? 'white' : 'grey'}]}>
              {number}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[
            styles.number,
            {
              width: cellWidth,
              backgroundColor: darkMode ? 'grey' : 'white',
            },
          ]}>
          <Text
            style={[styles.text, {color: darkMode ? 'white' : 'grey'}]}
            onPress={removeCellText}>
            <Ionicons name="backspace" size={20} color="tomato" />
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontWeight: 'bold',
              color: darkMode ? 'white' : 'tomato',
            }}>
            Erase
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default SudokuGame;