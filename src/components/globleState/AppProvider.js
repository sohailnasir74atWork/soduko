import React, {useEffect, useState, useCallback} from 'react';
import AppContext from './AppContext';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  STORAGE_KEY,
  STORAGE_KEY_Battels,
  STORAGE_KEY_First_Play,
  STORAGE_KEY_STATS,
} from '../veriables';

// Real Ad Unit ID
// const adUnitId = "ca-app-pub-1340655056171083/4343021379";
// Test Ad Unit ID
const adUnitId = TestIds.INTERSTITIAL;

// const adUnitId = '123'; // Placeholder Ad Unit ID for testing

const createAndLoadInterstitial = () => {
  const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['insurance', 'finance', 'health', 'legal', 'technology'],
  });
  interstitial.load();
  return interstitial;
};

const AppProvider = ({children}) => {
  const [loaded, setLoaded] = useState(false);
  const [interstitial, setInterstitial] = useState(null);
  const [adClosed, setAdClosed] = useState(false);
  const [mode, setMode] = useState('light');
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirect, setreDirect] = useState(true);
  const [globelLevel, setGlobelLevel] = useState();
  const [activeCell, setActiveCell] = useState(1);
  const [activeCells, setActiveCells] = useState([]);

  useEffect(() => {
    const loadGameState = async () => {
      try {
        // Get the current game state from local storage
        const storedGameState = await AsyncStorage.getItem(
          STORAGE_KEY_First_Play,
        );

        if (storedGameState) {
          setreDirect(false);
        }
      } catch (error) {
        console.error('Error loading game state from storage:', error);
      }
    };
    loadGameState();
  }, []);
  useEffect(() => {
    const loadGameState = async () => {
      try {
        // Get the current game state from local storage
        const storedGameState = await AsyncStorage.getItem(STORAGE_KEY_Battels);
        // console.log('first', storedGameState);
        if (storedGameState) {
          const parsedGameState = JSON.parse(storedGameState);
          setActiveCell(parsedGameState.activeCell);
          setActiveCells(parsedGameState.activeCells);
        }
      } catch (error) {
        console.error('Error loading game state from storage:', error);
      }
    };

    loadGameState();
  }, []);

  useEffect(() => {
    // Save the updated game stats back to local storage
    const saveGameState = async () => {
      try {
        const gameState = {
          activeCell,
          activeCells,
        };

        await AsyncStorage.setItem(
          STORAGE_KEY_Battels,
          JSON.stringify(gameState),
        );
      } catch (error) {
        console.error('Error saving game state to storage:', error);
      }
    };

    saveGameState();
  }, [activeCell, activeCells]); // Run the effect whenever gameStats changes

  // console.log(activeCells)
  const toggleTheme = color => {
    setMode(color);
  };

  useEffect(() => {
    setInterstitial(createAndLoadInterstitial());

    return () => {
      if (interstitial) {
        interstitial.removeAllListeners();
      }
    };
  }, []);
  useEffect(() => {
    const loadGameState = async () => {
      try {
        const storedGameState = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedGameState !== null) {
          const gameStateObject = JSON.parse(storedGameState);
          setGlobelLevel(gameStateObject['level']);
          setShouldRedirect(true);
        }
      } catch (error) {
        console.error('Error loading game state from storage:', error);
      }
    };

    loadGameState();
  }, []);

  useEffect(() => {
    const unsubscribeInterstitial = interstitial?.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );

    const unsubscribeAdClosed = interstitial?.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setAdClosed(true);
        setInterstitial(createAndLoadInterstitial);
      },
    );

    return () => {
      unsubscribeInterstitial?.();
      unsubscribeAdClosed?.();
    };
  }, [interstitial]);

  const showInterstitialAd = useCallback(() => {
    if (interstitial && loaded) {
      interstitial.show();
      setAdClosed(false);
    } else {
      console.error('Interstitial ad not loaded.');
    }
  }, [interstitial, loaded]);

  return (
    <AppContext.Provider
      value={{
        loaded,
        showInterstitialAd,
        mode,
        toggleTheme,
        shouldRedirect,
        globelLevel,
        setShouldRedirect,
        redirect,
        setreDirect,
        setActiveCell,
        activeCell,
        setActiveCells,
        activeCells,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
