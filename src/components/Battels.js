import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  STORAGE_KEY_Battels,
  dark2_bg_color,
  dark2_text_color,
  dark_bg_color,
  dark_text_color,
  light2_bg_color,
  light2_text_color,
  light_bg_color,
  light_text_color,
} from './veriables';
import {ScrollView} from 'react-native-gesture-handler';
import SettingContainer from './helper/SettingContainer';
import AppContext from './globleState/AppContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Battels = ({navigation}) => {
  const {mode, toggleTheme, activeCell, activeCells} = useContext(AppContext);

  const CONSTANT = {
    UNASSIGNED: 0,
    GRID_SIZE: 9,
    BOX_SIZE: 3,
    NUMBERS: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    LEVEL_NAME: ['Easy', 'Medium', 'Hard', 'Expert'],
    LEVEL: [11, 23, 38, 47], // Make sure this array has the same length as LEVEL_NAME
  };
  const handleCellPress = (cellIndex, levelName) => {
    navigation.navigate('game', {
      level: CONSTANT.LEVEL[CONSTANT.LEVEL_NAME.indexOf(levelName)],
      battels: true,
      index: cellIndex,
    });
    // setActiveCell(cellIndex + 1);
    // console.log('Cell Index:', cellIndex);
    // console.log('Active cell:', activeCell);
  };

  const isCellDisabled = cellIndex => {
    const currentLevelStartIndex = Math.floor((cellIndex - 1) / 10) * 10 + 1;
    return (
      cellIndex > activeCell ||
      cellIndex !== currentLevelStartIndex + activeCell - 1
    );
  };

  const getLevelName = cellIndex => {
    const levelIndex = Math.floor((cellIndex - 1) / 25);
    const levels = ['Easy', 'Medium', 'Hard', 'Expert'];
    return levels[levelIndex];
  };

  // Generate 40 cells
  const cells = Array.from({length: 100}, (_, index) => index + 1);

  const renderItem = ({item}) => {
    const levelName = getLevelName(item);
    let levelStyle = styles.value; // Default style

    // Apply specific styles based on the level
    if (levelName === 'Easy') {
      levelStyle = styles.easy;
    } else if (levelName === 'Medium') {
      levelStyle = styles.medium;
    } else if (levelName === 'Hard') {
      levelStyle = styles.hard;
    } else if (levelName === 'Expert') {
      levelStyle = styles.extreme;
    }
    // console.log('sohail', activeCells[item - 1])
    return (
      <TouchableOpacity
        disabled={isCellDisabled(item)}
        style={[
          styles.row,
          {backgroundColor: mode === 'light'
          ? 'white'
          : mode === 'light2'
          ? 'white'
          : mode === 'dark'
          ? dark_bg_color
          : mode === 'dark2'
          ? dark2_bg_color
          : 'default'},
          item > activeCell
            ? styles.disabled
            : item === activeCell
            ? styles.process
            : item <= activeCell
            ? styles.active
            : null,
        ]}
        onPress={() => handleCellPress(item, levelName)}>
        <Text style={item === activeCell ? styles.processText :(item <= activeCell ? styles.active : levelStyle)}>{item}</Text>
        <Text style={item === activeCell ? styles.processText :(item <= activeCell ? styles.active : levelStyle)}>{levelName}</Text>

        <Text style={styles.duration}>
          {item > activeCell ? (
            <Ionicons name={'lock-closed'} size={20} color={'grey'} />
          ) : item === activeCell ? (
            <Ionicons name={'play-circle'} size={20} color={'white'} />
          ) : item <= activeCell ? (
            <Text style={styles.duration}>{`${
              activeCells[item - 1].time
            } sec`}</Text>
          ) : null}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            mode === 'light'
              ? null
              : mode === 'light2'
              ? light2_bg_color
              : mode === 'dark'
              ? dark_bg_color
              : mode === 'dark2'
              ? dark2_bg_color
              : 'default',
        },
      ]}>
      {<SettingContainer mode={mode} toggleTheme={toggleTheme} countinue />}

      <View>
        <Text
          style={[
            styles.tittle,
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
          Win to Unlock More
        </Text>
      </View>
      <FlatList
        data={cells}
        keyExtractor={item => item.toString()}
        renderItem={renderItem}
        numColumns={5}
        showsVerticalScrollIndicator={false} // Set to false to hide vertical scrollbar
        showsHorizontalScrollIndicator={false} // Set to false to hide horizontal scrollbar
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    // flexDirection: 'column',
    // flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  row: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    minHeight: 50,
    padding: 5,
    margin: 5,
    // backgroundColor: 'red',
    borderRadius: 7,
    shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.19,
      shadowRadius: 5.62,
      elevation: 2,
  },
  value: {
    fontSize: 12,
    color: 'red',
    fontWeight: 'bold',
  },
  active: {
    backgroundColor: 'green',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,


  },
  disabled: {
    // backgroundColor: '#CFB08D',
    // opacity: 0.5,
    color: 'black',
    fontWeight: 'bold',
    borderColor:'white',
    borderWidth:1

  },
  process: {
    backgroundColor: '#4a154b',
    


  },
  processText: {
   
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,


  },
  levelName: {
    fontSize: 12,
    color: 'black',
    textAlign: 'center',
  },
  tittle: {
    fontSize: 24,
    color: 'black',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  easy: {
    fontSize: 12,
    color: 'grey',
    fontWeight: 'bold',
  },
  medium: {
    fontSize: 12,
    color: '#C0C0C0',
    fontWeight: 'bold',
  },
  hard: {
    fontSize: 12,
    color: 'tomato',
    fontWeight: 'bold',
  },
  extreme: {
    fontSize: 12,
    color: 'green',
    fontWeight: 'bold',
  },
  duration: {
    fontSize: 12,
    color: 'yellow',
    fontWeight: 'bold',
  },
});

export default Battels;