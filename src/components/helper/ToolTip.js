import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Tooltip = ({ message, isVisible, left, color }) => {
    return (
      <View style={[styles.tooltipContainer]}>
        {isVisible && (
          <View style={[styles.tooltipTextContainer, color ? { backgroundColor: color } : {}]}>
            <Text style={styles.tooltipText}>{message}</Text>
            <View style={[styles.arrowTip, { borderBottomColor: color || 'red' }, left ? { left: '0%' } : {} ]} />

          </View>
        )}
      </View>
    );
  };
  

const styles = StyleSheet.create({
  tooltipContainer: {
    alignItems: 'center',
    justifyContent:'center',
    width:'100%'
  },
  tooltip: {
    position: 'relative',
    borderBottomWidth: 1,
    // borderBottomColor: 'black',
    padding: 20,
  },
  tooltipTextContainer: {
    position: 'absolute',
    backgroundColor: '#555',
    color: '#fff',
    textAlign: 'center',
    borderRadius: 6,
    padding: 10,
    zIndex: 1,
    bottom: '125%',
},
  tooltipText: {
    color: '#fff',
    fontSize:16
    // padding:20
  },
  arrowTip: {
    position: 'absolute',
    bottom: -5,
    left: '50%',
    marginLeft: 5,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'red', // Default color
  },
  
});

export default Tooltip;
