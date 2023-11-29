import React, { useEffect, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SelectLevels = ({ navigation, darkMode, toggleDarkMode }) => {
  const animations = [0, 1, 2, 3, 4].map(() => new Animated.Value(0));

  const CONSTANT = {
    UNASSIGNED: 0,
    GRID_SIZE: 9,
    BOX_SIZE: 3,
    NUMBERS: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    LEVEL_NAME: ['Easy', 'Medium', 'Hard', 'Very hard', 'Insane'],
    LEVEL: [10, 38, 47, 56, 65], // Make sure this array has the same length as LEVEL_NAME
  };
  

  useEffect(() => {
    // Run this effect only once when the component mounts
    const staggeredAnimations = animations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
    );

    Animated.stagger(200, staggeredAnimations).start();
  }, []); 

  const handleLevelSelect = (level) => {
    // console.log('LEVEL:', CONSTANT.LEVEL);
    // console.log('LEVEL_NAME:', CONSTANT.LEVEL_NAME);
  
    navigation.navigate('GameScreenClassic', {
      level: CONSTANT.LEVEL[CONSTANT.LEVEL_NAME.indexOf(level)],
      reset: true
    });
  };
  

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#2d2d30' : 'white' }]}>
      <View style={styles.settingContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ marginRight: 10 }} onPress={toggleDarkMode}>
            <Ionicons name={'contrast'} size={30} color="grey" />
          </Text>
          <Ionicons name={'settings'} size={30} color="tomato" />
        </View>
      </View>
      <Text style={[styles.title, { color: darkMode ? 'white' : 'black' }]}>Classic Sudoku</Text>
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.button,
            {
              opacity: anim,
              transform: [
                {
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}>
          <TouchableOpacity onPress={() => handleLevelSelect(CONSTANT.LEVEL_NAME[index])}>
            <Text style={styles.buttonText}>{CONSTANT.LEVEL_NAME[index]}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 100,
  },
  button: {
    backgroundColor: '#128C7E',
    padding: 20,
    margin: 5,
    borderRadius: 8,
    minWidth: 200,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  settingContainer: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 30,
    marginRight: 50,
  },
});

export default SelectLevels;
