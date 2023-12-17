import React, {useEffect, useRef, useContext, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated, Clipboard} from 'react-native';
import GridWithAnimation from '../grid';
import AppContext from './globleState/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';

import {
  STORAGE_KEY,
  STORAGE_KEY_First_Play,
  dark2_bg_color,
  dark2_text_color,
  dark_bg_color,
  dark_text_color,
  light2_bg_color,
  light2_text_color,
  light_bg_color,
  light_text_color,
} from './veriables';
import SettingContainer from './helper/SettingContainer';

const SelectLevels = ({navigation}) => {
  const {toggleTheme, mode, shouldRedirect, globelLevel, redirect, setreDirect, setShouldRedirect} = useContext(AppContext);
  const [guide, setGuide] = useState()
  useEffect(() => {
    // Save the updated game stats back to local storage
    const saveGameState = async () => {
      try {
        const gameState = {
         guide
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
  console.log('saved_state',redirect)
  const animations = [0, 1, 2, 3].map(() => new Animated.Value(0)); // Adjusted to 6 rows
  const CONSTANT = {
    UNASSIGNED: 0,
    GRID_SIZE: 9,
    BOX_SIZE: 3,
    NUMBERS: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    LEVEL_NAME: ['Easy', 'Medium', 'Hard', 'Expert'],
    LEVEL: [11, 23, 38, 47], // Make sure this array has the same length as LEVEL_NAME
  };
const navigateToGame = ()=>{
  navigation.navigate('game', {level: globelLevel});
}
const navigateToGuide = ()=>{
  navigation.navigate('guide', {level: globelLevel});
}

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

  const handleLevelSelect = level => {
    navigation.navigate('game', {
      level: CONSTANT.LEVEL[CONSTANT.LEVEL_NAME.indexOf(level)],
      reset: true,
    });
  };
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            mode === 'light'
              ? 'white'
              : mode === 'light2'
              ? light2_bg_color
              : mode === 'dark'
              ? dark_bg_color
              : mode === 'dark2'
              ? dark2_bg_color
              : 'default',
        },
      ]}>
          <AwesomeAlert
        show={redirect}
        showProgress={false}
        title="Lets Begin!"
        titleStyle={{
          fontSize: 20,
          textAlign: 'center',
          fontWeight: 'bold',
        }}
        message={`Have you played Sudoku before ?`}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        confirmText="NO"
        cancelText='Yes'
        confirmButtonColor="#DD6B55"
        confirmButtonTextStyle={{
          fontSize: 18,
          fontWeight: 'bold',
          borderRadius: 10,
        }}
        cancelButtonStyle={
          {
            
         backgroundColor:'green'}
        }
        cancelButtonTextStyle={
          {
            
         fontWeight:'bold'}
        }
        onCancelPressed={()=>{setreDirect(false); setGuide(false)}}
        onConfirmPressed={navigateToGuide}
        overlayStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        contentContainerStyle={{
        }}
        messageStyle={{
          fontSize: 16,
          fontWeight: 'bold',
          paddingVertical: 10,
        }}
      />
      <SettingContainer mode={mode} toggleTheme={toggleTheme} select navigateToGuide={navigateToGuide}/>
    
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 30,
          width: '50%',
        }}>
        <View style={{marginRight: 10}}>{<GridWithAnimation />}</View>
        <View>
          <Text
            style={[
              styles.title,
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
            Classic Sudoku
          </Text>
        </View>
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
          <TouchableOpacity
            onPress={() => handleLevelSelect(CONSTANT.LEVEL_NAME[index])}>
            <Text style={styles.buttonText}>{CONSTANT.LEVEL_NAME[index]}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
      {shouldRedirect && <TouchableOpacity style={styles.button2} onPress={navigateToGame}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
       }
       {/* {!shouldRedirect && <TouchableOpacity style={styles.button2} onPress={navigateToGuide}>
            <Text style={styles.buttonText}>How to Play</Text>
          </TouchableOpacity>
       } */}
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
  button2: {
    marginTop: 30,
    backgroundColor: '#FF6F6F', // Canva official color
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
    width: '50%',
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