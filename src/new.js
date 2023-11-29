import React, { useEffect, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MoreScreen from './src/components/MoreScreen';
import SplashScreen from './src/components/SplashScreen';
import SudokuGame from './src/components/SudokuGame';
import SelectLevels from './src/components/SelectLevel';
import ContinueScreen from './src/components/ContinueScreen'; // Import your ContinueScreen component
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: 'white',
  },
  headerTitleStyle: {
    color: 'white',
    fontSize: 20,
  },
  headerTitleAlign: 'center',
  headerTintColor: 'white',
  headerBackTitleVisible: false,
};

function CarStackScreen({ darkMode, toggleDarkMode }) {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        ...screenOptions,
        headerStyle: {
          backgroundColor: darkMode ? '#2d2d30' : 'white',
        },
        headerTitleStyle: {
          color: darkMode ? 'white' : '#2d2d30',
          fontSize: 20,
        },
      }}>
      <Stack.Screen
        name="SelectLevels"
        options={{ headerShown: false }}
      >
        {(props) => (
          <SelectLevels
            {...props}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="GameScreenClassic"
        options={{ headerShown: false }}
      >
        {(props) => (
          <SudokuGame
            {...props}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage for saved game
    const checkSavedGame = async () => {
      // Replace 'YourStorageKey' with the actual key you are using to store the game state
      const savedGameState = await AsyncStorage.getItem('@SudokuGameState');
      console.log("dcdscsdcdsvcdsvcdcvdsvdsvf", savedGameState)

      if (savedGameState) {
        // Saved game found, navigate to ContinueScreen
        navigation.navigate('ContinueScreen');
      } else {
        // No saved game found, navigate to SelectLevels
        navigation.navigate('SelectLevels');
      }
    };

    setTimeout(() => {
      setIsLoading(false);
      checkSavedGame();
    }, 2500);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={darkMode ? '#2d2d30' : 'white'}
      />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Free') {
              iconName = focused ? 'car-sport' : 'car-sport-outline';
            } else if (route.name === 'More') {
              iconName = focused
                ? 'ellipsis-horizontal'
                : 'ellipsis-horizontal-outline';
            } else if (route.name === 'Paid') {
              iconName = focused ? 'newspaper' : 'newspaper-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            // backgroundColor: '#5d6374', // Set your desired background color
          },
        })}
      >
        <Tab.Screen
          name="Free"
          children={() => <CarStackScreen darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Paid"
          children={() => <CarStackScreen darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
