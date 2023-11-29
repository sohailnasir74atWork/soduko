import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ContinueScreen = ({navigation, darkMode, toggleDarkMode}) => {
//   const navigation = useNavigation();

  const handleNewGame = () => {
    // Handle logic for starting a new game
    navigation.navigate('SelectLevels', { level: "" });
  };

  const handleContinue = async () => {
    try {
      const savedState = await AsyncStorage.getItem('@SudokuGameState');

      if (savedState) {
        // Continue with the saved game state
        navigation.navigate('GameScreenClassic', { loadedGame: true });
      } else {
        // No saved game state found, prompt user to start a new game
        alert('No saved game state found. Please start a new game.');
      }
    } catch (error) {
      console.error('Error checking game state:', error);
    }
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
      <Text style={[styles.title, { color: darkMode ? 'white' : 'black' }]}>Sudoku Classic</Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#128C7E' }]}
        onPress={handleNewGame}
      >
        <Text style={styles.buttonText}>New Game</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleContinue}
      >
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

export default ContinueScreen;
