import React,{useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, Linking, Share} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {styles} from '../components/styles';
function MoreScreen({route, navigation}) {
  const size = 16;
  const color = '#fff';
  const openIcon = 'open-outline';
  const shareIcon = 'share-social-outline';
  const privacyLink = 'https://www.freeprivacypolicy.com/live/3672524d-566c-4888-a79d-9480c369e906';
  const contactEmail = 'sohailnasir74@gmail.com';
  const storeLink = 'https://play.google.com/store/apps/details?id=com.sudokubyfarhat&referrer=utm_source%3Dshare'
  const shareAppLink = async () => {
    try {
      await Share.share({
        message: `SIM data, SIM OWNER Details Pakistan: 
${storeLink}`,
        url: storeLink,
      });
    } catch (error) {
      console.error('Error sharing app link:', error);
    }
  };

  return (
    <View style={styles.moreScreenContainer}>
      <Text style={styles.moreHeader}>More</Text>
       <TouchableOpacity style={styles.moreButton} onPress={shareAppLink}>
        <Text style={styles.moreText}>Share App</Text>
        <Ionicons
          name={shareIcon}
          size={size}
          color={color}
          style={styles.moreIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity
  style={styles.moreButton}
  onPress={() => Linking.openURL(`mailto:${contactEmail}`)}
>
  <Text style={styles.moreText}>Contact Us</Text>
  <Ionicons
    name={openIcon}
    size={size}
    color={color}
    style={styles.moreIcon}/>
</TouchableOpacity>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => Linking.openURL(privacyLink)}
        // onPress={insertRecordsIntoFirebase}
                // onPress={updateViewProperty}

        >
        <Text style={styles.moreText}>Privacy Policy</Text>
        <Ionicons
          name={openIcon}
          size={size}
          color={color}
          style={styles.moreIcon}
        />
      </TouchableOpacity>
      <View>
        <Text style={{padding:10, color:"lightgreen", fontSize:16, lineHeight:30, textAlign:"center", fontWeight:900}}>
          IMPORTANT
        </Text >
        <Text style={{padding:10, color:"white", fontSize:12, lineHeight:30, textAlign:"justify"}}>
        If you have any ideas or suggestions to help us improve, please feel free to contact us. Your feedback is valuable to us, and we appreciate any input you can provide.
        </Text>
      </View>
    </View>
  );
}

export default MoreScreen;