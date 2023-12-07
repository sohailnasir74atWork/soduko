import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/components/SplashScreen';
import SudokuGame from './src/components/SudokuGame';
import SelectLevels from './src/components/SelectLevel';
import ContinueScreen from './src/components/ContinueScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppProvider from './src/components/globleState/AppProvider';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: 'white',
  },
  headerTitleStyle: {
    color: 'black', // Set default header text color
    fontSize: 20,
  },
  headerTitleAlign: 'center',
  headerTintColor: 'black', // Set default header icon color
  headerBackTitleVisible: false,
};

function App() {
  const [loading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    const checkSavedGame = async () => {
      try {
        // Simulate a 2-second delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const gameState = await AsyncStorage.getItem('@SudokuGameState');
        // console.log(gameState);
        setShouldRedirect(!!gameState); // Set shouldRedirect to true if gameState exists
      } catch (error) {
        console.error('Error checking saved game:', error);
      } finally {
        setLoading(false); // Set loading to false regardless of the outcome
      }
    };

    checkSavedGame();
  }, []);

  // if (loading) {
  //   return <SplashScreen />;
  // }

  return (
    <NavigationContainer>
      <AppProvider>
        <StatusBar
          barStyle={darkMode ? 'light-content' : 'dark-content'}
          backgroundColor={darkMode ? '#2d2d30' : 'white'}
        />
        {loading && <SplashScreen/>}
       {!loading &&  <Stack.Navigator
          initialRouteName={shouldRedirect ? 'ContinueScreen' : 'SelectLevels'}
          screenOptions={screenOptions}
        >
          <Stack.Screen
            name="SelectLevels"
            options={{ headerShown: false }}
          >
            {(props) => (
              <SelectLevels {...props} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="ContinueScreen"
            options={{ headerShown: false }}
          >
            {(props) => (
              <ContinueScreen {...props} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="GameScreenClassic"
            options={{ headerShown: false }}
          >
            {(props) => (
              <SudokuGame {...props} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            )}
          </Stack.Screen>
        </Stack.Navigator>}
      </AppProvider>
    </NavigationContainer>
  );
}

export default App;