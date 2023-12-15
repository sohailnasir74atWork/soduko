import React, {useEffect, useState, useContext, useRef} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './src/components/SplashScreen';
import SudokuGame from './src/components/SudokuGame';
import SelectLevels from './src/components/SelectLevel';
import ContinueScreen from './src/components/ContinueScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {STORAGE_KEY, STORAGE_KEY_STATS} from './src/components/veriables';
import {
  dark2_bg_color,
  dark_bg_color,
  light2_bg_color,
  light_bg_color,
} from './src/components/veriables';
import {MenuProvider} from 'react-native-popup-menu';
import AppContext from './src/components/globleState/AppContext';
import StatisticsScreen from './src/components/Statistics';
import Battels from './src/components/Battels';
import Guide from './src/components/tutorial';
import TabViewExample from './src/components/globleState/text';

const Stack = createNativeStackNavigator();
const screenOptions = {
  headerStyle: {
    backgroundColor: 'white',
    headerShown: false,
  },
  headerTitleStyle: {
    color: 'black',
    fontSize: 20,
  },
  headerTitleAlign: 'center',
  headerTintColor: 'black',
  headerBackTitleVisible: false,
};

const Tab = createBottomTabNavigator();

function HomeStackScreen({route}) {
  const {gameStats, setGameStats} = route.params;

  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
      }}>
      <Stack.Screen
        name="levels"
        component={SelectLevels}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="countinue"
        component={ContinueScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="game"
        component={SudokuGame}
        options={{headerShown: false, tabBarStyle: {display: 'none'}}}
        initialParams={{gameStats, setGameStats}}
      />
      <Stack.Screen
        name="guide"
        component={Guide}
        options={{headerShown: false, tabBarStyle: {display: 'none'}}}
      />
    </Stack.Navigator>
  );
}
function BattelsStackScreen({route}) {
  const {gameStats, setGameStats} = route.params;


  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
      }}>
      <Stack.Screen
        name="battelsScreen"
        component={Battels}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="game"
        component={SudokuGame}
        options={{headerShown: false}}
        initialParams={{gameStats, setGameStats}}

      />
   </Stack.Navigator>
  );
}
function App() {
  const [loading, setLoading] = useState(true);
  const {toggleTheme, mode} = useContext(AppContext);
  const [gameStats, setGameStats] = useState({
    11: {
      playedGames: 0,
      time: [],
      won: 0,
      lost: 0,
    },
    23: {
      playedGames: 0,
      time: [],
      won: 0,
      lost: 0,
    },
    38: {
      playedGames: 0,
      time: [],
      won: 0,
      lost: 0,
    },
    47: {
      playedGames: 0,
      time: [],
      won: 0,
      lost: 0,
    },
  });
  useEffect(() => {
    const loadGameState = async () => {
      try {
        // Get the current game state from local storage
        const storedGameState = await AsyncStorage.getItem(STORAGE_KEY_STATS);

        if (storedGameState) {
          const parsedGameState = JSON.parse(storedGameState);
          setGameStats(parsedGameState.gameStats);
          // console.log('initial get from local', gameStats)
        }
      } catch (error) {
        console.error('Error loading game state from storage:', error);
      }
    };

    loadGameState();
  }, []); // Empty dependency array to run the effect only once

  useEffect(() => {
    // Save the updated game stats back to local storage
    const saveGameState = async () => {
      try {
        const gameState = {
          gameStats,
        };

        await AsyncStorage.setItem(
          STORAGE_KEY_STATS,
          JSON.stringify(gameState),
        );
      } catch (error) {
        console.error('Error saving game state to storage:', error);
      }
    };

    saveGameState();
  }, [gameStats]); // Run the effect whenever gameStats changes
  setTimeout(() => {
    setLoading(false);
  }, 2000);
  return (
    <MenuProvider>
      <NavigationContainer>
        <StatusBar
          barStyle={
            mode === 'light' || mode === 'light2'
              ? 'dark-content'
              : 'light-content'
          }
          backgroundColor={
            mode === 'light'
              ? light_bg_color
              : mode === 'light2'
              ? light2_bg_color
              : mode === 'dark'
              ? dark_bg_color
              : mode === 'dark2'
              ? dark2_bg_color
              : 'default' // Default color, replace with your fallback color
          }
        />

        {loading ? (
          <SplashScreen />
        ) : (
          <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({route}) => ({
              tabBarIcon: ({focused, color, size}) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'More') {
                  iconName = focused ? 'ellipsis-vertical' : 'ellipsis-vertical-outline';
                } else if (route.name === 'Battels') {
                  iconName = focused ? 'apps' : 'apps-outline';
                } else if (route.name === 'Statistics') {
                  iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                }

                const iconColor = focused ? 'tomato' : 'grey';

                return <Ionicons name={iconName} size={20} color={iconColor} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: 'tomato',
              inactiveTintColor: 'gray',
            }}>
            <Tab.Screen
              name="Home"
              component={HomeStackScreen}
              options={{
                headerShown: false,
                tabBarStyle: {
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
              }}
              initialParams={{gameStats, setGameStats}}
            />

            
            <Tab.Screen
              name="Battels"
              component={BattelsStackScreen}
              options={{
                headerShown: false,
                tabBarStyle: {
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
              }}
              initialParams={{gameStats, setGameStats}}


            />
            <Tab.Screen
              name="Statistics"
              component={StatisticsScreen}
             options={{
                headerShown: false,
                tabBarStyle: {
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
              }}
              initialParams={{gameStats, setGameStats}}
            />
            <Tab.Screen
              name="More"
              component={TabViewExample}
             options={{
                headerShown: false,
                tabBarStyle: {
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
              }}
            />
          </Tab.Navigator>
        )}
      </NavigationContainer>
    </MenuProvider>
  );
}

export default App;
