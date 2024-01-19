import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  ActivityIndicator,
  Image,
} from 'react-native';
import Sound from 'react-native-sound';
import AppContext from './globleState/AppContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  STORAGE_KEY_First_Play,
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
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Tooltip from './helper/ToolTip';
import {FlatList} from 'react-native-gesture-handler';
Sound.setCategory('Playback');
const Guide = ({navigation}) => {
  const [clickSound, setClickSound] = useState(null);
  const [sound, setSound] = useState(true);
  const [clickSoundW, setClickSoundW] = useState(null);
  const [board, setBoard] = useState([]);
  const [solved, setSolved] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [centerCell, setCenterCell] = useState({row: 4, col: 4});
  const [errors, setErrors] = useState(0);
  const [moves, setMoves] = useState(0);
  const [dotColor, setDotColor] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showImage, setShowImage] = useState(true);

  const {loaded, showInterstitialAd, mode, redirect, setreDirect} =
    useContext(AppContext);
  const [guide, setGuide] = useState();
  const [validity, setValidity] = useState(
    Array.from({length: 9}, () => Array(9).fill(true)),
  );
  const [cellStyles, setCellStyles] = useState(
    Array.from({length: 9}, () => Array(9).fill(styles.text)),
  );
  const [initialGuide, setInitialGuide] = useState(true);
  const [guide2, setGuide2] = useState(false);
  const [guide3, setGuide3] = useState(false);
  const [guide4, setGuide4] = useState(false);
  const [disable, setdisable] = useState(false);
  const [tooltipHistory, setTooltipHistory] = useState([]); // Maintain a history of tooltip states
  const numDots = 5; // You can change this to the desired number of dots
  const padding = Dimensions.get('window').height * 0.04;
  useEffect(() => {
    // Save the updated game stats back to local storage
    const saveGameState = async () => {
      try {
        const gameState = {
          guide,
        };

        await AsyncStorage.setItem(
          STORAGE_KEY_First_Play,
          JSON.stringify(gameState),
        );
      } catch (error) {
        console.error('Error saving game state to storage:', error);
      }
    };

    saveGameState();
  }, [guide]); // Run the effect whenever gameStats changes
  useEffect(() => {
    // Save the current tooltip states to the history whenever they change
    setTooltipHistory(prevTooltipHistory => [
      ...prevTooltipHistory,
      {guide2, guide3, guide4, disable},
    ]);
  }, [guide2, guide3, guide4, disable]);
  const handleUndoTooltip = () => {
    if (tooltipHistory.length > 1) {
      // Don't go back beyond the initial state
      const previousTooltipState = tooltipHistory.slice(0, -1); // Get the previous tooltip state
      setTooltipHistory(previousTooltipState); // Update the tooltip history
      const lastTooltipState =
        previousTooltipState[previousTooltipState.length - 1];
      setGuide2(lastTooltipState.guide2);
      setGuide3(lastTooltipState.guide3);
      setGuide4(lastTooltipState.guide4);
      setdisable(lastTooltipState.disable);
    }
  };
  const handelClose = () => {
    setreDirect(false);
    setGuide(false);
    navigation.navigate('levels');
  };
  const loadGameState = async () => {
    try {
      // Hardcoded unsolved game
      const unsolvedGame = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
      ];

      // Hardcoded solved game
      const solvedGame = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
      ];

      setBoard(unsolvedGame);
      setSolved(solvedGame);
    } catch (error) {
      console.error('Error loading game state:', error);
    }
  };
  useEffect(() => {
    loadGameState();
  }, []);

  useEffect(() => {
    const sound = new Sound('sound.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.error('Failed to load the sound', error);
        return;
      }

      setClickSound(sound);
    });

    return () => {
      if (clickSound) {
        clickSound.release();
      }
    };
  }, []);
  const handleContinue = () => {
    setShowImage(!showImage);
  };
  const handleContinue2 = () => {
    if (guide3) {
      setGuide3(false);
      setGuide4(true);
      setDotColor(dotColor + 1);
    }
  };
  const handleRestart = () => {
    setBoard([]);
    setSolved([]);
    setSelectedCell(null);
    setCenterCell({row: 4, col: 4});
    setErrors(0);
    setMoves(0);
    setDotColor(1);
    setValidity(Array.from({length: 9}, () => Array(9).fill(true)));
    setCellStyles(Array.from({length: 9}, () => Array(9).fill(styles.text)));
    setInitialGuide(true);
    setGuide2(false);
    setGuide3(false);
    setGuide4(false);
    setdisable(false);
    setTooltipHistory([]); // Clear the tooltip history
    loadGameState(); // Load the initial game state
  };

  // ...
  //
  useEffect(() => {
    const sound = new Sound('wrong.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.error('Failed to load the sound2', error);
        return;
      }

      setClickSoundW(sound);
    });

    return () => {
      if (clickSoundW) {
        clickSoundW.release();
      }
    };
  }, []);
  useEffect(() => {
    loadGameState().then(() => {
      setIsLoading(false);
    });
  }, []);
  const updateCellStyles = (row, col, style) => {
    const newStyles = cellStyles.map(rowStyles => [...rowStyles]);
    newStyles[row][col] = style;
    setCellStyles(newStyles);
  };

  const handleCellPress = (row, col) => {
    if (disable) return;
    if (initialGuide) {
      setInitialGuide(false);
      setGuide2(true);
      setDotColor(dotColor + 1);
    }
    if (guide3) {
      setGuide3(false);
      setGuide4(true);
      setDotColor(dotColor + 1);
    }

    // Only allow selection if the clicked cell is the centered cell
    if (row === centerCell.row && col === centerCell.col) {
      setSelectedCell({row, col});
    }
  };

  const handleNumberPress = number => {
    if (selectedCell) {
      setGuide2(false);
      setGuide3(true);
      setDotColor(dotColor + 1);
      if (guide4) {
        setGuide3(false);
        setInitialGuide(true);
        setdisable(true);
      }

      const {row, col} = selectedCell;
      const updatedBoard = [...board];

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

  const renderBoard = () => {
    if (isLoading || !board.length) {
      return (
        <View style={{alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
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

          const isCenterCell =
            centerCell.row === rowIndex && centerCell.col === colIndex;
          const isCenterCol = centerCell.row === 0 && centerCell.col === 4;

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
                isMatchingCell && isSelectedCell && {backgroundColor: 'pink'}, // Change the color for matching row
                isMatchingCell && isSelectedCell && {backgroundColor: 'pink'}, // Change the color for matching column
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
              {cell === 0 && <Text style={[styles.text]}></Text>}
              {isCenterCell && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0, // Adjust this value to position the tooltip above the cell
                  }}>
                  <Tooltip
                    message={disable ? 'This is correct' : 'Select this Cell'}
                    isVisible={initialGuide}
                    color={'green'}
                  />
                </View>
              )}
              {isCenterCell && guide3 && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '-155%',
                  }}>
                  <Tooltip
                    message={"There is another '4' here"}
                    isVisible={guide3}
                    left={true}
                    color={'#FF6F6F'}
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    ));
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

  const screenWidth = Dimensions.get('window').width;
  const cellWidth = screenWidth / 9 - 1;
  useContext(() => {}, [guide2, guide3, guide4, initialGuide]);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          width: '97%',
        }}>
        <Text>
          {' '}
          <Ionicons
            name="close"
            size={35}
            color={'black'}
            style={{alignSelf: 'flex-end'}}
            onPress={handelClose}
          />
        </Text>
      </View>

      <View
        style={{
          backgroundColor: 'grey',
          width: '97%',
          margin: 10,
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
        }}>
        <Ionicons name="settings" size={35} color={'white'} />
        <Text
          style={{
            marginLeft: 10,
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
          }}>
          How to play
        </Text>
      </View>
      {showImage && (
        <View style={{backgroundColor: 'white'}}>
          <View style={{justifyContent: 'flex-start', alignItems: 'center'}}>
            <View
              style={{
                height: Dimensions.get('window').height * 0.5,
                width: Dimensions.get('window').height * 0.5,
              }}>
              <Image
                source={require('../../assets/image.jpeg')}
                style={{height: '100%', width: '100%'}}
              />
            </View>
          </View>
          <View style={{paddingHorizontal: 30}}>
            <Text
              style={[
                styles.spacer,
                {
                  textAlign: 'justify',
                  marginBottom: 10,
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
              Classic Sudoku is a puzzle made up of nine 3 x 3 square grids.
            </Text>
            <Text
              style={[
                styles.spacer,
                {
                  textAlign: 'justify',
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
              To finish the puzzle, you will have to place a number from one to
              nine in each box.
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
              marginBottom: 20,
              marginRight: 20,
            }}>
            <TouchableOpacity
              onPress={handleContinue}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: '#FF6F6F',
                borderRadius: 5,
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!showImage && (
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
          <View style={[styles.mainSudokuGrid, {paddingBottom: padding}]}>
            {renderBoard()}
          </View>

          {!initialGuide && !guide3 && (
            <View style={styles.numbers}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
                <TouchableOpacity
                  key={number}
                  style={[
                    styles.number,
                    {
                      width: cellWidth,
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
                  ]}
                  onPress={() =>
                    number === 4 || number === 5
                      ? handleNumberPress(number)
                      : null
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
                  {number === 4 && guide2 && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 0, // Adjust this value to position the tooltip above the number 4
                      }}>
                      <Tooltip
                        message={"Select '4'"}
                        isVisible={guide2}
                        color={'green'}
                      />
                    </View>
                  )}
                  {number === 5 && guide4 && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 0, // Adjust this value to position the tooltip above the number 4
                      }}>
                      <Tooltip
                        message={"Select '5'"}
                        isVisible={guide4}
                        color={'green'}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
          {guide3 && (
            <View style={{paddingHorizontal: 20}}>
              <Text
                style={[
                  styles.spacer,
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
                Number '4' is incorrect because there is another '4' on the same
                row.
              </Text>
              <Text
                style={[
                  styles.spacer,
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
                The same number cannot be on the same row, column or squre.
              </Text>
            </View>
          )}
          {guide4 && (
            <View style={{paddingHorizontal: 20}}>
              <Text
                style={[
                  styles.spacer,
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
                Fill all the squares to solve the game.
              </Text>
            </View>
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              width: '80%',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Ionicons
                name="arrow-back-circle"
                size={35}
                color={'black'}
                style={{alignSelf: 'flex-end'}}
                onPress={handleContinue}
              />
              <TouchableOpacity
                onPress={handleRestart}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 7,
                  backgroundColor: '#FF6F6F',
                  borderRadius: 5,
                  marginLeft: 10, // Added margin to the Restart button
                }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  Restart
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row'}}>
              {[...Array(numDots)].map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor:
                      index === dotColor - 1 ? '#3498db' : 'grey',
                    borderRadius: 1,
                    marginHorizontal: 3,
                    marginVertical: 12,
                  }}></View>
              ))}
            </View>
            <View>
              <TouchableOpacity
                onPress={
                  guide3 ? handleContinue2 : disable ? handelClose : null
                }
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  backgroundColor: 'green',
                  borderRadius: 5,
                  marginRight: 10,
                }}>
                {guide3 && (
                  <Text style={{color: 'white', fontWeight: 'bold'}}>Next</Text>
                )}
                {disable && (
                  <Text style={{color: 'white', fontWeight: 'bold'}}>
                    Finish
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    // height: '100%',
    minHeight: '100%',
    width: '100%',
  },
  mainSudokuGrid: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  mainGridCell: {
    height: Dimensions.get('window').height * 0.05,
    width: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
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

  mistakesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  infoText: {
    fontSize: 16,
  },

  numbers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 5,
    paddingBottom: Dimensions.get('window').height * 0.02,
  },

  number: {
    borderRadius: 8,
    backgroundColor: 'white',
    color: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    cursor: 'pointer',
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
    fontSize: 26,
    lineHeight: 30,
    margin: 0,
    padding: 0,
  },
  text2: {
    color: 'grey',
    fontSize: 26,
    lineHeight: 26,
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
    fontSize: 20,
  },
  correct: {
    color: '#25D366',
    fontSize: 20,
  },
  spacer: {
    color: 'black',
    fontSize: 14,
    textAlign: 'justify',
    marginBottom: 10,
  },
});
export default Guide;
