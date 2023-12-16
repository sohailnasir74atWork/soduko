import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import { View, Animated } from 'react-native';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const FacebookContent = () => {
  // Handle animation
  const avatarRef1 = React.useRef();
  const avatarRef2 = React.useRef();
  const avatarRef3 = React.useRef();
  const avatarRef4 = React.useRef();
  const avatarRef5 = React.useRef();


  React.useEffect(() => {
    const facebookAnimated = Animated.stagger(
      400,
      [
        avatarRef1.current.getAnimated(),
        avatarRef2.current.getAnimated(),
        avatarRef3.current.getAnimated(),
        avatarRef4.current.getAnimated(),
        avatarRef5.current.getAnimated(),

      ]
    );
    Animated.loop(facebookAnimated).start();
  }, []);

  return (
    <View>
      <View style={{ justifyContent: 'center', flexDirection: 'row', marginBottom: 10,  }}>
        <ShimmerPlaceholder
          ref={avatarRef1}
          stopAutoRun
          style={{ height: 30, width: '90%' }}
          />
      </View>
      <View style={{ justifyContent: 'center', flexDirection: 'row', marginBottom: 10 }}>
        <ShimmerPlaceholder
          ref={avatarRef2}
          stopAutoRun
          style={{ height: 60, width: '90%' }} // Set the height here
        />
      </View>
      <View style={{ justifyContent: 'center', flexDirection: 'row', marginBottom: 10 }}>
        <ShimmerPlaceholder
          ref={avatarRef3}
          stopAutoRun
          style={{ height: 90, width: '90%' }} // Set the height here
        />
      </View>
      <View style={{ justifyContent: 'center', flexDirection: 'row', marginBottom: 10 }}>
        <ShimmerPlaceholder
          ref={avatarRef4}
          stopAutoRun
          style={{ height: 90, width: '90%'}}
        />
      </View>
      <View style={{ justifyContent: 'center', flexDirection: 'row', marginBottom: 10 }}>
        <ShimmerPlaceholder
          ref={avatarRef5}
          stopAutoRun
          style={{ height: 40, width: '90%'}}
        />
      </View>
    </View>
  );
}

export default FacebookContent;
