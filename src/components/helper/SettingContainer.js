import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {styles} from '../styles';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {
  dark2_bg_color,
  dark_bg_color,
  light2_bg_color,
  light_bg_color,
} from '../veriables';

const SettingContainer = ({
  mode,
  isTimerRunning,
  handleBackPress,
  handlePausePress,
  toggleTheme,
  countinue,
  select,
  navigateToGuide,
}) => {
  const menuWidth = 150; // Adjust the width as needed
  // console.log(toggleTheme)
  const iconSizeCu = Dimensions.get('window').height * 0.04;

  return (
    <View style={styles.settingContainer}>
      <View style={styles.settingInnerContainer}>
        <Text onPress={select ? navigateToGuide : handleBackPress}>
          {!countinue && (
            <Ionicons
              name={select ? 'information-circle' : 'arrow-back'}
              size={iconSizeCu}
              color={mode ? 'grey' : '#25D366'}
            />
          )}
        </Text>
      </View>
      <Text onPress={handlePausePress}>
        {!countinue && !select && (
          <Ionicons
            name={isTimerRunning ? 'pause-circle' : 'play-circle'}
            size={iconSizeCu}
            color="green"
          />
        )}
      </Text>

      <Menu>
        <MenuTrigger>
          <View>
            <Ionicons
              name={mode ? 'color-palette-outline' : 'color-palette-outline'}
              size={iconSizeCu}
              color={mode ? 'red' : 'tomato'}
            />
          </View>
        </MenuTrigger>
        <MenuOptions
          customStyles={{
            optionsContainer: {
              justifyContent: 'center',
              marginTop: 40,
              backgroundColor: '#aaf0b5',
            },
          }}>
          <View style={{flexDirection: 'row'}}>
            <MenuOption onSelect={() => toggleTheme('light')}>
              <Ionicons
                name="ellipse"
                size={iconSizeCu}
                color={light_bg_color}
              />
            </MenuOption>
            <MenuOption onSelect={() => toggleTheme('light2')}>
              <Ionicons
                name="ellipse"
                size={iconSizeCu}
                color={light2_bg_color}
              />
            </MenuOption>
            <MenuOption onSelect={() => toggleTheme('dark')}>
              <Ionicons
                name="ellipse"
                size={iconSizeCu}
                color={dark_bg_color}
              />
            </MenuOption>
            <MenuOption onSelect={() => toggleTheme('dark2')}>
              <Ionicons
                name="ellipse"
                size={iconSizeCu}
                color={dark2_bg_color}
              />
            </MenuOption>
          </View>
        </MenuOptions>
      </Menu>
    </View>
  );
};

export default SettingContainer;
