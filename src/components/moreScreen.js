import React, { useContext, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Linking, Share, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppContext from './globleState/AppContext';
import { dark2_bg_color, dark2_text_color, dark_bg_color, dark_text_color, light2_bg_color, light2_text_color, light_bg_color, light_text_color } from './veriables';

function MoreScreen({ route, navigation }) {
    const {mode} = useContext(AppContext);

  const size = 20;
  const color =  
  mode === 'light'
    ? light_text_color
    : mode === 'light2'
    ? light2_text_color
    : mode === 'dark'
    ? dark_text_color
    : mode === 'dark2'
    ? dark2_text_color
    : 'default'

    const bg = mode === 'light'
    ? 'white'
    : mode === 'light2'
    ? light2_bg_color
    : mode === 'dark'
    ? dark_bg_color
    : mode === 'dark2'
    ? dark2_bg_color
    : 'default'
  const openIcon = 'open-outline';
  const shareIcon = 'share-social-outline';
  const privacyLink =
    'https://www.freeprivacypolicy.com/live/12fb9e08-7f44-432b-aca1-19bd27910324';
  const storeLink =
    'https://play.google.com/store/apps/details?id=com.thinktech_sudoku';
  const contactEmail = 'sohailnasir74@gmail.com';

  const shareAppLink = async () => {
    try {
      await Share.share({
        message: `Make Friends, Promote Business, get job, and much more:\n${storeLink}`,
        url: storeLink,
      });
    } catch (error) {
      console.error('Error sharing app link:', error);
    }
  };

  const openLink = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error(`Error opening link ${url}:`, error);
    }
  };

  return (
    <View style={[styles.moreScreenContainer, {backgroundColor:bg}]}>
      <Text style={[styles.moreHeader, {color:color}]}>More</Text>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => openLink(storeLink)}>
        <Text style={[[styles.moreText, {color:color}]]}>Rate Us</Text>
        <Ionicons name={openIcon} size={size} color={color} style={styles.moreIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.moreButton, {color:color}]} onPress={shareAppLink}>
        <Text style={[styles.moreText, {color:color}]}>Share App</Text>
        <Ionicons name={shareIcon} size={size} color={color} style={styles.moreIcon} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => Linking.openURL(`mailto:${contactEmail}`)}>
        <Text style={[styles.moreText, {color:color}]}>Contact Us</Text>
        <Ionicons name={openIcon} size={size} color={color} style={styles.moreIcon} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => openLink(privacyLink)}>
        <Text style={[styles.moreText, {color:color}]}>Privacy Policy</Text>
        <Ionicons name={openIcon} size={size} color={color} style={styles.moreIcon} />
      </TouchableOpacity>
      <View>
        <Text style={[styles.importantText, {color:color}]}>IMPORTANT</Text>
        <Text style={[styles.infoText, {color:color}]}>
          If you have any ideas or suggestions to help us improve, please feel free to contact us. Your feedback is valuable to us, and we appreciate any input you can provide.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    moreScreenContainer: {
      flex: 1,
      padding: 20,
    //   backgroundColor: '#333', // Adjust the background color as needed
    },
    moreHeader: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    moreButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      paddingVertical:20,
      borderBottomWidth: 1,
      borderBottomColor: '#555', // Adjust the border color as needed
      fontWeight: 'bold',

    },
    moreText: {
      fontSize: 16,
      color: '#fff',
      fontWeight: 'bold',

    },
    moreIcon: {
      marginLeft: 10,
    },
    importantText: {
      padding: 10,
      color: 'lightgreen',
      fontSize: 16,
      lineHeight: 30,
      textAlign: 'center',
      fontWeight: 'bold',
      
    },
    infoText: {
      padding: 10,
      color: 'white',
      fontSize: 12,
      lineHeight: 30,
      textAlign: 'justify',
    },
  });
export default MoreScreen;