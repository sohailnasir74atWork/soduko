import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GridWithAnimation from '../grid';
import AppContext from './globleState/AppContext';
import SettingContainer from './helper/SettingContainer';
import { dark2_bg_color, dark2_text_color, dark_bg_color, dark_text_color, light2_bg_color, light2_text_color, light_bg_color, light_text_color } from './veriables';

const ContinueScreen = ({navigation, route}) => {
  const {loaded, showInterstitialAd, mode, toggleTheme} = useContext(AppContext);
  const {level } = route.params;
  // console.log(level)
  //   const navigation = useNavigation();

  const handleNewGame = () => {
    // Handle logic for starting a new game
    if(loaded){showInterstitialAd()}

    navigation.navigate('levels', {level: ''});
  };

  const handleContinue = async () => {
    if(loaded){showInterstitialAd()}
    try {
      const savedState = await AsyncStorage.getItem('@SudokuGameState');

      if (savedState) {
        // Continue with the saved game state
        navigation.navigate('game', {loadedGame: true, level:level});
      } else {
        // No saved game state found, prompt user to start a new game
        alert('No saved game state found. Please start a new game.');
      }
    } catch (error) {
      console.error('Error checking game state:', error);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: mode === 'light'
        ? light_bg_color
        : mode === 'light2'
        ? light2_bg_color
        : mode === 'dark'
        ? dark_bg_color
        : mode === 'dark2'
        ? dark2_bg_color
        : 'default'},
      ]}>
     
      <SettingContainer mode={mode} toggleTheme={toggleTheme} countinue/>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 30,
          width: '50%',
          marginTop: 100,
        }}>
        <View style={{marginRight: 10}}>{<GridWithAnimation />}</View>
        <View>
          <Text style={[styles.title, {color: mode === 'light'
                ? light_text_color
                : mode === 'light2'
                ? light2_text_color
                : mode === 'dark'
                ? dark_text_color
                : mode === 'dark2'
                ? dark2_text_color
                : 'default' // Default color, replace with your fallback color
            }]}>
            Classic Sudoku
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.button, {backgroundColor: '#128C7E'}]}
        onPress={handleNewGame}>
        <Text style={styles.buttonText}>New Game</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
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
  // settingContainer: {
  //   justifyContent: 'center',
  //   width: '100%',
  //   alignItems: 'flex-end',
  //   marginTop: 30,
  //   marginRight: 50,
  // },
});

export default ContinueScreen;