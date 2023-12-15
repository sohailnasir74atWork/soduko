import React, {useState, useEffect, useContext} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { dark2_bg_color, dark2_text_color, dark_bg_color, dark_text_color, light2_bg_color, light2_text_color, light_bg_color, light_text_color } from './veriables';
import AppContext from './globleState/AppContext';

// Sample data, replace this with your actual data


// Component to display statistics for a specific level
const LevelStatistics = ({ route }) => {
  const {loaded, showInterstitialAd, mode, toggleTheme} = useContext(AppContext);

    const { level, gameStats } = route.params;
    const stats = gameStats[level];
    const maxTime = Math.max(...stats.time);
    useEffect(() => {
      // console.log('update');
    }, [gameStats, level]);
// Find the minimum value
const minTime = Math.min(...stats.time);
const averageTime = stats.time.reduce((acc, time) => acc + time, 0) / stats.time.length;

// Filter out the maximum value
// const filteredMaxTimeArray = timeArray.filter(time => time !== maxTime);

// // Filter out the minimum value
// const filteredMinTimeArray = timeArray.filter(time => time !== minTime);
    return (
      <View style={[styles.container, {backgroundColor: mode === 'light'
      ? light_bg_color
      : mode === 'light2'
      ? light2_bg_color
      : mode === 'dark'
      ? dark_bg_color
      : mode === 'dark2'
      ? dark2_bg_color
      : 'default',}]}>
         <View style={styles.row}>
          <Text style={[styles.label, {color: mode === 'light'
      ? light_text_color
      : mode === 'light2'
      ? light2_text_color
      : mode === 'dark'
      ? dark_text_color
      : mode === 'dark2'
      ? dark2_text_color
      : 'default'}]}>Total Played Games:</Text>
          <Text style={styles.value}>{stats.playedGames}</Text>
        </View>
  
        <View style={styles.row}>
          <Text style={[styles.label, {color: mode === 'light'
      ? light_text_color
      : mode === 'light2'
      ? light2_text_color
      : mode === 'dark'
      ? dark_text_color
      : mode === 'dark2'
      ? dark2_text_color
      : 'default'}]}>Max Time:</Text>
          <Text style={styles.value}>{isFinite(maxTime) ? maxTime : 0}</Text>
        </View>
  
        <View style={styles.row}>
          <Text style={[styles.label, {color: mode === 'light'
      ? light_text_color
      : mode === 'light2'
      ? light2_text_color
      : mode === 'dark'
      ? dark_text_color
      : mode === 'dark2'
      ? dark2_text_color
      : 'default'}]}>Min Time:</Text>
          <Text style={styles.value}>{isFinite(minTime) ? minTime : 0}</Text>
        </View>
  
        <View style={styles.row}>
          <Text style={[styles.label, {color: mode === 'light'
      ? light_text_color
      : mode === 'light2'
      ? light2_text_color
      : mode === 'dark'
      ? dark_text_color
      : mode === 'dark2'
      ? dark2_text_color
      : 'default'}]}>Average Palyed Game Time:</Text>
          <Text style={styles.value}>{averageTime > 0 ? averageTime.toFixed(1):0}</Text>
        </View>
  
       
        <View style={styles.row}>
          <Text style={[styles.label, {color: mode === 'light'
      ? light_text_color
      : mode === 'light2'
      ? light2_text_color
      : mode === 'dark'
      ? dark_text_color
      : mode === 'dark2'
      ? dark2_text_color
      : 'default'}]}>Won:</Text>
          <Text style={styles.value}>{stats.won}</Text>
        </View>
  
        {/* <View style={styles.row}>
          <Text style={[styles.label, {color: mode === 'light'
      ? light_text_color
      : mode === 'light2'
      ? light2_text_color
      : mode === 'dark'
      ? dark_text_color
      : mode === 'dark2'
      ? dark2_text_color
      : 'default'}]}>Lost:</Text>
          <Text style={styles.value}>{stats.lost}</Text>
        </View> */}
      </View>
    );
  };
  

// Create a material top tab navigator
const Tab = createMaterialTopTabNavigator();

const StatisticsScreen = ({ route, navigation }) => {
  const levels = ["Easy", 'Medium', 'Hard', 'Expert'];
  const levelOriginal = ['11', '23', '38', '47'];
  const { gameStats } = route.params;
  const { mode } = useContext(AppContext);

  useEffect(() => {
  }, [gameStats]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: mode === 'light'
          ? light_text_color
          : mode === 'light2'
            ? light2_text_color
            : mode === 'dark'
              ? dark_text_color
              : mode === 'dark2'
                ? dark2_text_color
                : 'default',
        tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
        tabBarStyle: {
          backgroundColor: mode === 'light'
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
    >
      {levelOriginal.map((level, index) => (
        <Tab.Screen
          key={levels[index]}
          name={levels[index]}
          component={LevelStatistics}
          initialParams={{ level, gameStats }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // console.log("Navigating to:", route.name);
              navigation.navigate(route.name);
              e.preventDefault();
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
      padding: 20,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: '#ddd', // Change the border color as needed
      minHeight: 40,
      marginVertical:2
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'black',
      paddingVertical: 10,
    },
    value: {
      fontSize: 16,
      color: 'white',
      backgroundColor: '#3498db', // Change the background color as needed
      paddingVertical: 10,
      width:80,
      justifyContent:"center",
      textAlign:"center",
      borderRadius: 5, // Add border radius for a rounded look
    },
  });
  

export default StatisticsScreen;