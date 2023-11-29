import React, {useEffect, useState, useCallback} from 'react';
import AppContext from './AppContext';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
// real ids
// export  const adUnitIdBanner = 'ca-app-pub-7757740348878509/1353783611';
// export  const adUnitId = "ca-app-pub-7757740348878509/5604057807"
const appid = 'ca-app-pub-7757740348878509~3273407932';
const appidTest = 'ca-app-pub-3940256099942544~3347511713';
// test ids
export const adUnitId = TestIds.INTERSTITIAL;
export const adUnitIdBanner = TestIds.BANNER;
// export const adUnitId = "123";
// export const adUnitIdBanner = "123";

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
  const [myArray, setMyArray] = useState({});
  const [categoryNames, setCategoryNames] = useState([]);
  const [adClosed, setAdClosed] = useState(false); // State to track ad closed event

  
  useEffect(() => {
    // Create and load the interstitial ad only once when the component mounts
    setInterstitial(createAndLoadInterstitial());
    // Create and load the open app ad only once when the component mounts
    // Clean up the interstitial ad when the component unmounts
    return () => {
      if (interstitial) {
        interstitial.removeAllListeners();
      }
    };
  }, []); // Empty dependency array ensures this effect runs once

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
        // console.log('Nice', adClosed);
        setAdClosed(true); // You can set adClosed to true if you want to track that the ad was closed.
        setInterstitial(createAndLoadInterstitial); // Load a new ad when the current ad is closed.
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
      // Optionally, you can display a message or take another action when the ad is not loaded.
      console.error('Interstitial ad not loaded.');
    }
  }, [interstitial, loaded]);
  
  ////////////////////////////////data logiv///////////////
  return (
    <AppContext.Provider
      value={{
        loaded,
        showInterstitialAd,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
