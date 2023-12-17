import React, {useState, useEffect, useRef, useContext, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AwesomeAlert from 'react-native-awesome-alerts';
import {useNavigation} from '@react-navigation/native';
import { sudokuGen} from './generateGame';
import Sound from 'react-native-sound';
import AppContext from './globleState/AppContext';
import {styles} from './styles';
import SettingContainer from './helper/SettingContainer';
import {
  STORAGE_KEY,
  STORAGE_KEY_Battels_Uncompleted,
  dark2_bg_color,
  dark2_text_color,
  dark_bg_color,
  dark_text_color,
  light2_bg_color,
  light2_text_color,
  light_bg_color,
  light_text_color,
  selected_cell_color,
  selected_rows_color,
} from './veriables';
import FacebookContent from './globleState/text';
Sound.setCategory('Playback');

// const correctSound = new Sound('sound.mp3', Sound.MAIN_BUNDLE, error => {
//   if (error) {
//     console.error('Failed to load correct sound', error);
//   }
// });
const SudokuGame = ({route}) => {
  const navigation = useNavigation();

  const {level, reset, gameStats, setGameStats, battels} =
    route.params;

  const [clickSound, setClickSound] = useState(null);
  const [name, setName] = useState('');
  const [playedTime, setPlayedTime] = useState(0);
  const [playedGames, setPlayedGames] = useState(0);
  const [winGamesCount, setWinGameCount] = useState(0);
  const [loseGameCount, setLoseGameCount] = useState(0);
  const [sound, setSound] = useState(true);
  const [clickSoundW, setClickSoundW] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [board, setBoard] = useState([]);
  const initialPuzzleRef = useRef([]);
  const [timer, setTimer] = useState(0);
  const [solved, setSolved] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGamelose, setIsGamelose] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [errors, setErrors] = useState(0);
  const [moves, setMoves] = useState(0);
  const [prevSelectedCell, setPrevSelectedCell] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [notes, setNotes] = useState(
    Array.from({length: 9}, () => Array(9).fill([])),
  );
  const [penOn, setPenOn] = useState(false);
  const [showHintAlert, setShowHintAlert] = useState(false);
  const {
    loaded,
    showInterstitialAd,
    mode,
    toggleTheme,
    activeCell,
    setActiveCell,
    activeCells,
    setActiveCells,
    setShouldRedirect
  } = useContext(AppContext);
  // console.log('active3', activeCell)
  // console.log('asd'. setActiveCell)
  const [hints, setHints] = useState(2);
  const [validity, setValidity] = useState(
    Array.from({length: 9}, () => Array(9).fill(true)),
  );
  const [cellStyles, setCellStyles] = useState(
    Array.from({length: 9}, () => Array(9).fill(styles.text)),
  );
  const timerRef = useRef(0);
  const [savedGameLoaded, setSavedGameLoaded] = useState(false);
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
    if (level === 11) {
      setName('Easy');
    } else if (level === 23) {
      setName('Medium');
    } else if (level === 38) {
      setName('Hard');
    } else if (level === 47) {
      setName('Expert');
    }
  }, [level]);  useEffect(() => {
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
  const handlePen = () => {
    setPenOn(!penOn);
  };
  const handleNotePress = note => {
    const updatedNotes = [...notes];
    if (selectedCell) {
      const {row, col} = selectedCell;
      const currentNotes = updatedNotes[row][col];

      // Check if the note is already present
      const isNotePresent = currentNotes.includes(note);

      // Update the notes for the selected cell
      if (isNotePresent) {
        const filteredNotes = currentNotes.filter(
          existingNote => existingNote !== note,
        );
        updatedNotes[row][col] = filteredNotes;
      } else {
        updatedNotes[row][col] = [...currentNotes, note];
      }
    }

    setNotes(updatedNotes);
  };

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
          const savedStateHome = await AsyncStorage.getItem(STORAGE_KEY);
  const savedStateHomeBattels = await AsyncStorage.getItem(STORAGE_KEY_Battels_Uncompleted);

  if (!battels && savedStateHome) {
    const parsedState = JSON.parse(savedStateHome);
    applyParsedState(parsedState);
  } else if (battels && savedStateHomeBattels) {
    const parsedState = JSON.parse(savedStateHomeBattels);
    applyParsedState(parsedState);
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
  function applyParsedState(parsedState) {
    setBoard(parsedState.board);
    setTimer(parsedState.timer);
    setSolved(parsedState.solved);
    setIsGameWon(parsedState.isGameWon);
    setSelectedCell(parsedState.selectedCell);
    setIsTimerRunning(parsedState.isTimerRunning);
    timerRef.current = parsedState.timer; // Set the timer reference
    setErrors(parsedState.errors);
    setMoves(parsedState.moves);
    setPrevSelectedCell(parsedState.prevSelectedCell);
    setShowAlert(parsedState.showAlert);
    setValidity(parsedState.validity);
    setCellStyles(parsedState.cellStyles);
    setSavedGameLoaded(true);
  }
  useEffect(() => {
    const saveGameState = async () => {
      try {
        const gameState = isGameWon
          ? null
          : {
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
              validity,
              cellStyles,
              level,
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
    validity,
    cellStyles,
    savedGameLoaded,
    level,
  ]);
  useEffect(() => {
   if(battels){ const saveGameState = async () => {
      try {
        const gameState = isGameWon
          ? null
          : {
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
              validity,
              cellStyles,
              level,
            };

        await AsyncStorage.setItem(STORAGE_KEY_Battels_Uncompleted, JSON.stringify(gameState));
      } catch (error) {
        console.error('Error saving game state to storage:', error);
      }
    }

    if (savedGameLoaded) {
      saveGameState();
    };}
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
    validity,
    cellStyles,
    savedGameLoaded,
    level,
  ]);
  const updatedPlayedGames = useMemo(() => {
    // Your logic for updating playedGames
    return gameStats && level ? gameStats[level].playedGames + 1 : 0;
  }, [gameStats, level]); // Include gameStats and level as dependencies

  useEffect(() => {
    // Check if gameStats is available and level is a valid key
    if (gameStats && level) {
      // console.log(gameStats);
      setGameStats(prevGameStats => {
        const updatedGameStats = {...prevGameStats};
        updatedGameStats[level].time = [
          ...new Set([...updatedGameStats[level].time, playedTime]),
        ].filter(time => time !== 0);

        updatedGameStats[level].playedGames = updatedPlayedGames;

        if (checkGameWin()) {
          updatedGameStats[level].won += 1;
        }

        

        return updatedGameStats;
      });
    } else {
      console.warn('Invalid level:', level);
    }
  }, [isTimerRunning, playedTime, gameStats, level, updatedPlayedGames]);
  useEffect(() => {
    if (checkGameWin() && battels) {
      setActiveCell(prevActiveCell => prevActiveCell + 1);

      // Assuming playedTime is a variable containing the time you want to record
      setActiveCells(prevActiveCells => [
        ...prevActiveCells,
        {time: playedTime},
      ]);
    }
  }, [isTimerRunning, level, playedTime]);
  
  useEffect(() => {
    if (checkGameWin()) {
      setIsGameWon(true);
      () => {
        setShouldRedirect(false);
      };
      setPlayedTime(timer);
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
      }, 1000);
      1;
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
const handleRefresh = ()=>{
  const {original, question} = sudokuGen(level);
          setBoard(question);
          initialPuzzleRef.current = question;
          setSolved(original);
          setSavedGameLoaded(true);
          setSelectedCell(null)
          setCellStyles(Array.from({length: 9}, () => Array(9).fill(styles.text)))
          setMoves(0)
          setErrors(0)
          timerRef.current = 0
          }
  const updateCellStyles = (row, col, style) => {
    const newStyles = cellStyles.map(rowStyles => [...rowStyles]);
    newStyles[row][col] = style;
    setCellStyles(newStyles);
  };
  
  const handleBackPress = () => {
    setPlayedTime(timer);
    // console.log(timer);
    setIsTimerRunning(!isTimerRunning);
    // setPlayedTime(false)

    if (battels) {
      navigation.navigate('battelsScreen');
    } else {
      // console.log(level);
      navigation.navigate('countinue', {level: level});
    }
  };

  const gotoNewGame = () => {
    setPlayedTime(timer);
    setIsTimerRunning(!isTimerRunning);
    navigation.navigate('levels');
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
  }, [timer]);
  // useEffect(() => {

  // }, [loaded, moves, showInterstitialAd]);

  const handleCellPress = (row, col) => {
    setIsTimerRunning(true);
    setSelectedCell({row, col});
  };

  const removeCellText = () => {
    if (selectedCell) {
      const {row, col} = selectedCell;
      const updatedBoard = [...board];
      const updatedNotes = [...notes];
      updatedNotes[row][col] = Array(9).fill(0);
    setNotes(updatedNotes);

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
        if (mode) {
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
        closeOnTouchOutside={false}
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
        contentContainerStyle={
          {
            // width: 300,
            // height: 250,
          }
        }
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
      setHints(12);
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
      setIsGamelose(true);
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
  useEffect(() => {
    setIsLoading(false);
  }, []);
  const isNoteMatching = (note, rowIndex, colIndex) => {
    // Check if the note already exists in the same row
    const isNoteInRow = board[rowIndex].includes(note);

    // Check if the note already exists in the same column
    const isNoteInColumn = board.some(row => row[colIndex] === note);

    // Check if the note already exists in the same 3x3 box
    const boxStartRow = Math.floor(rowIndex / 3) * 3;
    const boxStartCol = Math.floor(colIndex / 3) * 3;
    const isNoteInBox = board
      .slice(boxStartRow, boxStartRow + 3)
      .some(row => row.slice(boxStartCol, boxStartCol + 3).includes(note));

    return isNoteInRow || isNoteInColumn || isNoteInBox;
  };

  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((cell, colIndex) => {
          const isBoxSelected =
            selectedCell &&
            Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
            Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3) &&
            cell !== 0 &&
            cell === board[selectedCell.row][selectedCell.col];

          const isSelectedCell =
            selectedCell &&
            (selectedCell.row === rowIndex ||
              selectedCell.col === colIndex ||
              isBoxSelected);
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
          return (
            <TouchableOpacity
              key={colIndex}
              style={[
                styles.mainGridCell,
                {
                  backgroundColor:
                    mode === 'light'
                      ? light_bg_color
                      : mode === 'light2'
                      ? light2_bg_color
                      : mode === 'dark'
                      ? dark_bg_color
                      : mode === 'dark2'
                      ? dark2_bg_color
                      : 'default',
                },
                {width: cellWidth},
                rowIndex % 3 === 0 && {borderTopWidth: 3},
                colIndex % 3 === 0 && {borderLeftWidth: 3},
                rowIndex === 8 && {borderBottomWidth: 3},
                colIndex === 8 && {borderRightWidth: 3},
                {borderColor: 'black'},
                cell === 0 && styles.emptyCell,
                isSelectedCell && {
                  backgroundColor:
                    mode === 'dark' || mode === 'dark2'
                      ? selected_rows_color
                      : '#dCFAFF',
                },
                selectedCell &&
                  Math.floor(selectedCell.row / 3) ===
                    Math.floor(rowIndex / 3) &&
                  Math.floor(selectedCell.col / 3) ===
                    Math.floor(colIndex / 3) && {
                    backgroundColor:
                      mode === 'dark' || mode === 'dark2'
                        ? selected_rows_color
                        : '#dCFAFF',
                  },
                isSelectedCell &&
                  cellStyle !== styles.text && {
                    backgroundColor:
                      mode === 'dark' || mode === 'dark2'
                        ? selected_rows_color
                        : '#dCFAFF',
                  },
                isSameValueAsSelected &&
                  isSelectedCell && {backgroundColor: '#FFCDD2'},
                isMatchingCell &&
                  !isSelectedCell && {backgroundColor: '#98fb98'},
                isMatchingCell && isSelectedCell && {backgroundColor: 'pink'},
                cellStyle,
                selectedCell &&
                  selectedCell.row === rowIndex &&
                  selectedCell.col === colIndex && {
                    backgroundColor:
                      mode === 'dark' || mode === 'dark2'
                        ? dark_bg_color
                        : '#AEDFF7',
                  },
              ]}
              onPress={() => handleCellPress(rowIndex, colIndex)}>
              {cell !== 0 && <Text style={[, cellStyle]}>{cell}</Text>}
              {cell === 0 && (
                <>
                  <View style={styles.noteGrid}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(note => (
                      <View key={note} style={styles.noteCell}>
                        <Text
                          style={[
                            styles.noteText,
                            {
                              color: isNoteMatching(note, rowIndex, colIndex)
                                ? 'red'
                                : 'blue',
                            },
                          ]}>
                          {notes[rowIndex][colIndex].includes(note)
                            ? note
                            : ' '}
                        </Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
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
    // if(checkGameWin()) return
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
      }
    } else {
      // Show an alert when there are no hints available
      setShowHintAlert(!showHintAlert);
      setIsTimerRunning(!isTimerRunning);
    }
  };

  // const showAlertFunction = (title, message) => {
  //   // Customize this function to display alerts in your app
  //   alert(`${title}\n${message}`);
  // };

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
        {
          backgroundColor:
            mode === 'light'
              ? light_bg_color
              : mode === 'light2'
              ? light2_bg_color
              : mode === 'dark'
              ? dark_bg_color
              : mode === 'dark2'
              ? dark2_bg_color
              : 'default',
        },
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
        closeOnTouchOutside={false}
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
        contentContainerStyle={
          {
            // width: 300, // Adjust width
            // height: 250, // Adjust height
          }
        }
        messageStyle={{
          fontSize: 16, // Adjust font size
          fontWeight: 'bold',
          // paddingVertical: 10,
          // marginVertical: 30,
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
        closeOnTouchOutside={false}
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
        onCancelPressed={handleBackPress}
        onConfirmPressed={() => {
          handleErrorPress();
        }}
        overlayStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
        contentContainerStyle={
          {
            // width: 300,
            // height: 250,
          }
        }
        messageStyle={{
          fontSize: 16,
          fontWeight: 'bold',
          // paddingVertical: 10,
          // marginVertical: 30,
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
        closeOnTouchOutside={false}
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
        contentContainerStyle={
          {
            // width: 300,
            // height: 250,
          }
        }
        messageStyle={{
          fontSize: 16,
          fontWeight: 'bold',
          // paddingVertical: 10,
          // marginVertical: 30,
        }}
      />

      <SettingContainer
        mode={mode}
        isTimerRunning={isTimerRunning}
        handleBackPress={handleBackPress}
        handlePausePress={handlePausePress}
        toggleTheme={toggleTheme}
      />

      <View style={styles.timerContainer}>
        <View style={styles.timerContainer}>
          <Text
            style={[
              styles.timerText,
              {
                color:
                  mode === 'light'
                    ? light_text_color
                    : mode === 'light2'
                    ? light2_text_color
                    : mode === 'dark'
                    ? dark_text_color
                    : mode === 'dark2'
                    ? dark2_text_color
                    : 'default',
              },
            ]}>
            Moves:{moves}
          </Text>
          <Text style={styles.mistakesText}>Mistakes: {errors}</Text>
          <View style={[styles.timerText]}>
            <Ionicons name="alarm" size={20} color="grey" />
            <Text
              style={[
                styles.timerText,
                {
                  color:
                    mode === 'light'
                      ? light_text_color
                      : mode === 'light2'
                      ? light2_text_color
                      : mode === 'dark'
                      ? dark_text_color
                      : mode === 'dark2'
                      ? dark2_text_color
                      : 'default',
                },
              ]}>{formatTime(timerRef.current)}</Text>
          </View>
        </View>
      </View>
      {savedGameLoaded ? (
        <>
          <View style={styles.mainSudokuGrid}>{renderBoard()}</View>
        </>
      ) : (
        <FacebookContent />
      )}
      <View style={styles.settingContainer}>
        <View style={{flexDirection:'row'}}>
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
              color={mode ? '#25D366' : '#128C7E'}
            />
          </Text>
          {/* <Text style={{fontSize: 10, color: '#128C7E', fontWeight: 'bold'}}>
            Sound
          </Text> */}
        </View>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 15
          }}>
          <Text onPress={handleRefresh}>
            <Ionicons
              name={'refresh-circle'}
              size={30}
              color={'tomato'}
            />
          </Text>
          {/* <Text style={{fontSize: 10, color: 'red', fontWeight: 'bold'}}>
            Restart
          </Text> */}
        </View>
        </View>
        <View style={{justifyContent: 'center', color: 'black'}}>
          <Text style={{fontWeight:'bold', color:"lightblue"}}>{name}</Text></View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={handlePen}>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <View style={{position: 'relative', marginRight: 15}}>
                <Ionicons
                  name="create"
                  size={30}
                  color={penOn ? 'tomato' : 'grey'}
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
                 
                </View>
              </View>
              {/* <Text
                style={{
                  fontSize: 10,
                  color: penOn ? 'tomato' : 'grey',
                  fontWeight: 'bold',
                  marginRight: 17,
                }}>
                {penOn ? 'On' : 'Off'}
              </Text> */}
            </View>
          </TouchableOpacity>
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
              {/* <Text style={{fontSize: 10, color: 'tomato', fontWeight: 'bold'}}>
                Hints
              </Text> */}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.numbers}>
        {[1, 2, 3, 4, 5].map(number => (
          <TouchableOpacity
            key={number}
            style={[
              styles.number,
              {
                width: cellWidth,
                backgroundColor:
                  mode === 'light'
                    ? 'white'
                    : mode === 'light2'
                    ? 'white'
                    : mode === 'dark'
                    ? dark_bg_color
                    : mode === 'dark2'
                    ? dark2_bg_color
                    : 'default',
              },
            ]}
            onPress={() =>
              penOn ? handleNotePress(number) : handleNumberPress(number)
            }>
            <Text
              style={[
                styles.text2,
                {
                  color:
                    mode === 'light'
                      ? light_text_color
                      : mode === 'light2'
                      ? light2_text_color
                      : mode === 'dark'
                      ? dark_text_color
                      : mode === 'dark2'
                      ? dark2_text_color
                      : 'default',
                },
              ]}>
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
                backgroundColor:
                  mode === 'light'
                    ? 'white'
                    : mode === 'light2'
                    ? 'white'
                    : mode === 'dark'
                    ? dark_bg_color
                    : mode === 'dark2'
                    ? dark2_bg_color
                    : 'default',
              },
            ]}
            onPress={() =>
              penOn ? handleNotePress(number) : handleNumberPress(number)
            }>
            <Text
              style={[
                styles.text2,
                {
                  color:
                    mode === 'light'
                      ? light_text_color
                      : mode === 'light2'
                      ? light2_text_color
                      : mode === 'dark'
                      ? dark_text_color
                      : mode === 'dark2'
                      ? dark2_text_color
                      : 'default',
                },
              ]}>
              {number}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={removeCellText}
          style={[
            styles.number,

            {
              width: cellWidth,
              backgroundColor:
                mode === 'light'
                  ? 'white'
                  : mode === 'light2'
                  ? 'white'
                  : mode === 'dark'
                  ? dark_bg_color
                  : mode === 'dark2'
                  ? dark2_bg_color
                  : 'default',
            },
          ]}>
          <Text
            style={[
              styles.text,
              {
                color:
                  mode === 'light'
                    ? light_text_color
                    : mode === 'light2'
                    ? light2_text_color
                    : mode === 'dark'
                    ? dark_text_color
                    : mode === 'dark2'
                    ? dark2_text_color
                    : 'default',
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <Ionicons name="backspace" size={20} color="tomato" />
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontWeight: 'bold',
              color:
                mode === 'light'
                  ? light_text_color
                  : mode === 'light2'
                  ? light2_text_color
                  : mode === 'dark'
                  ? dark_text_color
                  : mode === 'dark2'
                  ? dark2_text_color
                  : 'default',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            Erase
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SudokuGame;
