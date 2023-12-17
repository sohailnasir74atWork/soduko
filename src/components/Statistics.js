import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  dark2_bg_color,
  dark2_text_color,
  dark_bg_color,
  dark_text_color,
  light2_bg_color,
  light2_text_color,
  light_bg_color,
  light_text_color,
} from './veriables';
import AppContext from './globleState/AppContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
const LevelStatistics = ({route}) => {
  const {loaded, showInterstitialAd, mode, toggleTheme} =
    useContext(AppContext);
  const {level, gameStats} = route.params;
  const stats = gameStats[level];
  const maxTime = Math.max(...stats.time);
  function secondsToTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }
  useEffect(() => {
    // console.log('update');
  }, [gameStats, level]);
  // Find the minimum value
  const minTime = Math.min(...stats.time);
  const averageTime =
    stats.time.reduce((acc, time) => acc + time, 0) / stats.time.length;

  // Filter out the maximum value
  // const filteredMaxTimeArray = timeArray.filter(time => time !== maxTime);

  // // Filter out the minimum value
  // const filteredMinTimeArray = timeArray.filter(time => time !== minTime);
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            mode === 'light'
              ? '#f0f0f0'
              : mode === 'light2'
              ? light2_bg_color
              : mode === 'dark'
              ? dark_bg_color
              : mode === 'dark2'
              ? dark2_bg_color
              : 'default',
        },
      ]}>
      <View
        style={[
          styles.row,
          {
            backgroundColor:
              mode === 'light'
                ? 'white'
                : mode === 'light2'
                ? 'white'
                : mode === 'dark'
                ? dark_bg_color
                : mode === 'dark2'
                ? dark2_bg_color
                : 'default',
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Ionicons
            name={'grid-outline'}
            size={30}
            color={mode ? '#1F51FF' : '#25D366'}
          />
          <Text
            style={[
              styles.label,
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
            Games Started
          </Text>
        </View>
        <Text style={[styles.value, {color:
                  mode === 'light'
                    ? light_text_color
                    : mode === 'light2'
                    ? light2_text_color
                    : mode === 'dark'
                    ? dark_text_color
                    : mode === 'dark2'
                    ? dark2_text_color
                    : 'default',}]}>{stats.playedGames}</Text>
      </View>
      <View
        style={[
          styles.row,
          {
            backgroundColor:
              mode === 'light'
                ? 'white'
                : mode === 'light2'
                ? 'white'
                : mode === 'dark'
                ? dark_bg_color
                : mode === 'dark2'
                ? dark2_bg_color
                : 'default',
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Ionicons
            name={'trophy-outline'}
            size={30}
            color={mode ? '#1F51FF' : '#25D366'}
          />
          <Text
            style={[
              styles.label,
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
            Games Won
          </Text>
        </View>

        <Text style={[styles.value, {color:
                  mode === 'light'
                    ? light_text_color
                    : mode === 'light2'
                    ? light2_text_color
                    : mode === 'dark'
                    ? dark_text_color
                    : mode === 'dark2'
                    ? dark2_text_color
                    : 'default',}]}>{stats.won}</Text>
      </View>
      <View
        style={[
          styles.row,
          {
            backgroundColor:
              mode === 'light'
                ? 'white'
                : mode === 'light2'
                ? 'white'
                : mode === 'dark'
                ? dark_bg_color
                : mode === 'dark2'
                ? dark2_bg_color
                : 'default',
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Ionicons
            name={'checkmark-done-outline'}
            size={30}
            color={mode ? '#1F51FF' : '#25D366'}
          />
          <Text
            style={[
              styles.label,
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
            Success Rate
          </Text>
        </View>
        <Text style={[styles.value, {color:
                  mode === 'light'
                    ? light_text_color
                    : mode === 'light2'
                    ? light2_text_color
                    : mode === 'dark'
                    ? dark_text_color
                    : mode === 'dark2'
                    ? dark2_text_color
                    : 'default',}]}>
          {
            stats.playedGames !== 0
              ? `${((stats.won / stats.playedGames) * 100).toFixed(0)}%`
              : '0' /* or any other value you want to display */
          }
        </Text>
      </View>

      <View
        style={[
          styles.row,
          {
            backgroundColor:
              mode === 'light'
                ? 'white'
                : mode === 'light2'
                ? 'white'
                : mode === 'dark'
                ? dark_bg_color
                : mode === 'dark2'
                ? dark2_bg_color
                : 'default',
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Ionicons
            name={'alarm-outline'}
            size={30}
            color={mode ? '#1F51FF' : '#25D366'}
          />
          <Text
            style={[
              styles.label,
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
            Max Time
          </Text>
        </View>
        <Text style={[styles.value, {color:
                  mode === 'light'
                    ? light_text_color
                    : mode === 'light2'
                    ? light2_text_color
                    : mode === 'dark'
                    ? dark_text_color
                    : mode === 'dark2'
                    ? dark2_text_color
                    : 'default',}]}>
          {isFinite(maxTime) ? secondsToTime(maxTime) : '00:00'}
        </Text>
      </View>

      <View
        style={[
          styles.row,
          {
            backgroundColor:
              mode === 'light'
                ? 'white'
                : mode === 'light2'
                ? 'white'
                : mode === 'dark'
                ? dark_bg_color
                : mode === 'dark2'
                ? dark2_bg_color
                : 'default',
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Ionicons
            name={'accessibility-outline'}
            size={30}
            color={mode ? '#1F51FF' : '#25D366'}
          />
          <Text
            style={[
              styles.label,
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
            Min Time:
          </Text>
        </View>
        <Text style={[styles.value, {color:
                  mode === 'light'
                    ? light_text_color
                    : mode === 'light2'
                    ? light2_text_color
                    : mode === 'dark'
                    ? dark_text_color
                    : mode === 'dark2'
                    ? dark2_text_color
                    : 'default',}]}>
          {isFinite(minTime) ? secondsToTime(minTime) : '00:00'}
        </Text>
      </View>

      <View
        style={[
          styles.row,
          {
            backgroundColor:
              mode === 'light'
                ? 'white'
                : mode === 'light2'
                ? 'white'
                : mode === 'dark'
                ? dark_bg_color
                : mode === 'dark2'
                ? dark2_bg_color
                : 'default',
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Ionicons
            name={'barbell-outline'}
            size={30}
            color={mode ? '#1F51FF' : '#25D366'}
          />
          <Text
            style={[
              styles.label,
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
            Average Palyed Time</Text>
        </View>
        <Text style={[styles.value, {color:
                  mode === 'light'
                    ? light_text_color
                    : mode === 'light2'
                    ? light2_text_color
                    : mode === 'dark'
                    ? dark_text_color
                    : mode === 'dark2'
                    ? dark2_text_color
                    : 'default',}]}>
          {averageTime > 0 ? secondsToTime(averageTime.toFixed(0)) : '00:00'}
        </Text>
      </View>
    </View>
  );
};

// Create a material top tab navigator
const Tab = createMaterialTopTabNavigator();

const StatisticsScreen = ({route, navigation}) => {
  const levels = ['Easy', 'Medium', 'Hard', 'Expert'];
  const levelOriginal = ['11', '23', '38', '47'];
  const {gameStats} = route.params;
  const {mode} = useContext(AppContext);

  useEffect(() => {}, [gameStats]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor:
          mode === 'light'
            ? light_text_color
            : mode === 'light2'
            ? light2_text_color
            : mode === 'dark'
            ? dark_text_color
            : mode === 'dark2'
            ? dark2_text_color
            : 'default',
        tabBarLabelStyle: {fontSize: 14, fontWeight: 'bold'},
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
      }}>
      {levelOriginal.map((level, index) => (
        <Tab.Screen
          key={levels[index]}
          name={levels[index]}
          component={LevelStatistics}
          initialParams={{level, gameStats}}
          listeners={({navigation}) => ({
            tabPress: e => {
              console.log(levels[index]);
              navigation.navigate(levels[index]);
            },
          })}
        />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 80,
    marginVertical: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    borderColor: '#FAF9F6',
    borderWidth: 0.5,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    opacity: 0.8,
    color: 'black',
    // backgroundColor: '#3498db', // Change the background color as needed
    paddingVertical: 10,
    paddingHorizontal: 20,
    // width:80,
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: 5, // Add border radius for a rounded look
  },
});

export default StatisticsScreen;