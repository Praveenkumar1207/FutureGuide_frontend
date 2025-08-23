import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

export default function LoaderShimmer() {
  const shimmerTranslate = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    shimmerTranslate.setValue(-1);
    Animated.loop(
      Animated.timing(shimmerTranslate, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerTranslate.interpolate({
    inputRange: [-1, 1],
    outputRange: [-screenWidth, screenWidth],
  });

  return (
    <View style={styles.loader}>
      <View style={styles.wrapper}>
        <View style={styles.circle} />
        <View style={styles.line1} />
        <View style={styles.line2} />
      </View>
      <Animated.View
        style={[
          styles.shimmerOverlay,
          {
            transform: [{ translateX }, { rotate: '20deg' }],
          },
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  loader: {
    width: screenWidth - 15,
    height: 80,
    marginBottom: 10,
    padding: 15,
    // backgroundColor: '#e3e3e3',s
    borderBottomWidth: 3,
    borderBottomColor: '#d3d3d3',
    overflow: 'hidden',
  },
  wrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#cacaca',
  },
  line1: {
    position: 'absolute',
    top: 11,
    left: 58,
    width: 100,
    height: 10,
    backgroundColor: '#cacaca',
  },
  line2: {
    position: 'absolute',
    top: 34,
    left: 58,
    width: 150,
    height: 10,
    backgroundColor: '#cacaca',
  },
  line3: {
    position: 'absolute',
    top: 57,
    left: 0,
    width: '100%',
    height: 10,
    backgroundColor: '#cacaca',
  },
  line4: {
    position: 'absolute',
    top: 80,
    left: 0,
    width: '92%',
    height: 10,
    backgroundColor: '#cacaca',
  },
  shimmerOverlay: {
    position: 'absolute',
    width: screenWidth * 1.5, // wide enough to shimmer diagonally
    height: '200%',
    top: 0,
    left: 0,
    opacity: 1,
    zIndex: 1,
  },
});
