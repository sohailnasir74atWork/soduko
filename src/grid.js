import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const AnimatedGridCell = ({ delay, color, cornerRadiusStyle }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: delay,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, delay]);

  return (
    <Animated.View
      style={[
        styles.gridCell,
        {
          opacity: fadeAnim,
          backgroundColor: color,
        },
        cornerRadiusStyle,
      ]}
    />
  );
};

const GridWithAnimation = () => {
    const colors = ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#8A2BE2', '#FFA500'];

  return (
    <View>
      {[0, 1, 2].map((rowIndex) => (
        <View key={rowIndex} style={styles.containerGrid}>
          {[0, 1, 2].map((colIndex) => (
            <AnimatedGridCell
              key={colIndex}
              delay={rowIndex * 200 + colIndex * 100}
              color={colors[(rowIndex + colIndex) % colors.length]}
              cornerRadiusStyle={getCornerRadiusStyle(rowIndex, colIndex)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const getCornerRadiusStyle = (rowIndex, colIndex) => {
    const cornerRadiusStyle = {};
  
    if (rowIndex === 0) {
      if (colIndex === 0) {
        cornerRadiusStyle.borderTopLeftRadius = 5;
      } else if (colIndex === 2) {
        cornerRadiusStyle.borderTopRightRadius = 5;
      }
    }
  
    if (rowIndex === 2) {
      if (colIndex === 0) {
        cornerRadiusStyle.borderBottomLeftRadius = 5;
      } else if (colIndex === 2) {
        cornerRadiusStyle.borderBottomRightRadius = 5;
      }
    }
  
    return cornerRadiusStyle;
  };
  
  

const styles = StyleSheet.create({
  containerGrid: {
    flexDirection: 'row',
    // justifyContent: 'center',
    marginTop: 1,
    width: '50%',
  },
  gridCell: {
    height: 20,
    width: 20,
    marginHorizontal: 1,
  },
});

export default GridWithAnimation;
