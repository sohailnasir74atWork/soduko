import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const SplashScreen = () => {
   return (
    <View style={styles.container}>
      {/* Your image from assets */}
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Set background color as needed
  },
  logo: {
    width: 200, // Adjust width as needed
    height: 200, // Adjust height as needed
    borderRadius: 20, // Set border radius to 20px
  }, 
});

export default SplashScreen;
