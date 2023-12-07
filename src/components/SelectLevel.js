import React, { useEffect, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GridWithAnimation from '../grid';
import AppContext from './globleState/AppContext';

const SelectLevels = ({ navigation, darkMode, toggleDarkMode }) => {
  // const {loaded, showInterstitialAd} = useContext(AppContext);
  const animations = [0, 1, 2, 3, 4, 5].map(() => new Animated.Value(0)); // Adjusted to 6 rows


  const CONSTANT = {
    UNASSIGNED: 0,
    GRID_SIZE: 9,
    BOX_SIZE: 3,
    NUMBERS: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    LEVEL_NAME: ['Very Easy', 'Easy', 'Medium', 'Hard', 'Very hard', 'Insane'],
    LEVEL: [11, 23, 38, 47, 56, 65], // Make sure this array has the same length as LEVEL_NAME
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

    navigation.navigate('GameScreenClassic', {
      level: CONSTANT.LEVEL[CONSTANT.LEVEL_NAME.indexOf(level)],
      reset: true,
    });
    // if(loaded){showInterstitialAd()}

  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#2d2d30' : 'white' }]}>
      <View style={styles.settingContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text onPress={toggleDarkMode}>
          <Ionicons
              name={darkMode ? 'sunny-sharp' : 'sunny-sharp'}
              size={35}
              color={darkMode ? 'lightgrey' : 'grey'}
            />
          </Text>
        </View>
      </View>
      <View style={{flexDirection:"row", justifyContent:"center", alignItems:"center", marginVertical:30, width:"50%"}}>  
      <View style={{marginRight:10}}>{<GridWithAnimation/>}</View>
      <View><Text style={[styles.title, {color : darkMode? "white": "black"}]}>Classic Sudoku</Text></View>
      </View>

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
          <TouchableOpacity onPress={() => handleLevelSelect(CONSTANT.LEVEL_NAME[index])} >
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
  containerGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 1,
    width:"50%",
  },
  
  rowGrid: {
    flex: 1,
    backgroundColor: 'red',
    marginBottom: 8,
    borderColor: 'black',
    borderWidth: 1, // Add this line to make the borders visible
  },
  
  
});

export default SelectLevels;
