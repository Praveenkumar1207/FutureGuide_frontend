import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator, Animated, Easing, Dimensions, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

const API_BASE_URL = 'https://futureguide-backend.onrender.com/api/auth';

class AuthAPI {
  async resetPassword(email, otp, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
}

const authAPI = new AuthAPI();

export default function ResetPasswordScreen({ navigation, route }) {
  const { email, otp } = route.params || {};
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  
  // Animation values
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const inputYPosition = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(0.9)).current;
  const backgroundOffset = useRef(new Animated.Value(0)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(1)).current;
  const inputFocusAnim = useRef(new Animated.Value(0)).current;
  const parallaxX = useRef(new Animated.Value(0)).current;
  const parallaxY = useRef(new Animated.Value(0)).current;

  // PanResponder for parallax effect
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        parallaxX.setValue(gestureState.moveX / width * 10 - 5);
        parallaxY.setValue(gestureState.moveY / height * 10 - 5);
      },
      onPanResponderRelease: () => {
        Animated.spring(parallaxX, {
          toValue: 0,
          friction: 5,
          useNativeDriver: true
        }).start();
        
        Animated.spring(parallaxY, {
          toValue: 0,
          friction: 5,
          useNativeDriver: true
        }).start();
      }
    })
  ).current;

  useEffect(() => {
    // Continuous background rotation
    Animated.loop(
      Animated.timing(backgroundOffset, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    ).start();

    // Entrance animations
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
        delay: 100
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        delay: 300
      }),
      Animated.spring(inputYPosition, {
        toValue: 0,
        tension: 30,
        friction: 8,
        useNativeDriver: true,
        delay: 200
      })
    ]).start();
  }, []);
  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long');
      return;
    }
    
    // Ripple effect animation
    rippleScale.setValue(0);
    rippleOpacity.setValue(1);
    
    Animated.parallel([
      Animated.timing(rippleScale, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(rippleOpacity, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }),
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true
        })
      ])
    ]).start();
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setLoading(true);
    try {
      const data = await authAPI.resetPassword(email, otp, newPassword);
      Alert.alert('Success', 'Password reset successful! You can now login with your new password.', [
        { text: 'OK', onPress: () => navigation.replace('Login') },
      ]);
    } catch (error) {
      Alert.alert('Failed', error.message || 'Something went wrong');
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputFocus = (inputName) => {
    setFocusedInput(inputName);
    Animated.spring(inputFocusAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true
    }).start();
    Haptics.selectionAsync();
  };

  const handleInputBlur = () => {
    setFocusedInput(null);
    Animated.spring(inputFocusAnim, {
      toValue: 0,
      friction: 5,
      useNativeDriver: true
    }).start();
  };

  // Interpolated values
  const interpolatedBackground = backgroundOffset.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  const floatingY = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15]
  });
  
  const inputFocusScale = inputFocusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02]
  });
  
  const inputFocusElevation = inputFocusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 15]
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Animated Gradient Background */}
      <Animated.View style={[styles.background, {
        transform: [{ rotate: interpolatedBackground }]
      }]}>
        <LinearGradient
          colors={[Colors.primary, Colors.accent, Colors.accentDark]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      
      {/* Parallax Layers */}
      <Animated.View style={[styles.parallaxLayer, {
        transform: [
          { translateX: parallaxX.interpolate({ inputRange: [-5, 5], outputRange: [-10, 10] }) },
          { translateY: parallaxY.interpolate({ inputRange: [-5, 5], outputRange: [-10, 10] }) }
        ]
      }]}>
        <View style={styles.parallaxCircleLarge} />
      </Animated.View>
      
      <Animated.View style={[styles.parallaxLayer, {
        transform: [
          { translateX: parallaxX.interpolate({ inputRange: [-5, 5], outputRange: [15, -15] }) },
          { translateY: parallaxY.interpolate({ inputRange: [-5, 5], outputRange: [15, -15] }) }
        ]
      }]}>
        <View style={styles.parallaxCircleMedium} />
      </Animated.View>
      
      <Animated.View style={[styles.parallaxLayer, {
        transform: [
          { translateX: parallaxX.interpolate({ inputRange: [-5, 5], outputRange: [-20, 20] }) },
          { translateY: parallaxY.interpolate({ inputRange: [-5, 5], outputRange: [20, -20] }) }
        ]
      }]}>
        <View style={styles.parallaxCircleSmall} />
      </Animated.View>
      
      {/* Logo with floating animation */}
      <Animated.View style={[styles.logoContainer, {
        transform: [
          { scale: logoScale },
          { translateY: floatingY }
        ]
      }]}>
        <LinearGradient
          colors={['#6a11cb', '#2575fc']}
          style={styles.logoGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Image 
            source={require('../../assets/Hii.jpg')} 
            style={styles.logo} 
          />
        </LinearGradient>
        <View style={styles.logoShadow} />
        <View style={styles.logoGlow} />
      </Animated.View>
      
      {/* Title with fade animation */}
      <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
        Reset Password
      </Animated.Text>
      
      <Animated.View style={[styles.inputContainer, {
        transform: [{ translateY: inputYPosition }]
      }]}>
        {/* New Password Input */}
        <Animated.View style={[styles.inputWrapper, {
          transform: [
            { scale: focusedInput === 'newPassword' ? inputFocusScale : 1 },
            { translateY: focusedInput === 'newPassword' ? -3 : 0 }
          ],
          elevation: focusedInput === 'newPassword' ? inputFocusElevation : 8,
          zIndex: focusedInput === 'newPassword' ? 2 : 1
        }]}>
          <MaterialIcons name="lock" size={20} color="#6a11cb" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#999"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            onFocus={() => handleInputFocus('newPassword')}
            onBlur={handleInputBlur}
          />
        </Animated.View>
        
        {/* Confirm Password Input */}
        <Animated.View style={[styles.inputWrapper, {
          transform: [
            { scale: focusedInput === 'confirmPassword' ? inputFocusScale : 1 },
            { translateY: focusedInput === 'confirmPassword' ? -3 : 0 }
          ],
          elevation: focusedInput === 'confirmPassword' ? inputFocusElevation : 8,
          zIndex: focusedInput === 'confirmPassword' ? 2 : 1
        }]}>
          <MaterialIcons name="lock-outline" size={20} color="#6a11cb" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            onFocus={() => handleInputFocus('confirmPassword')}
            onBlur={handleInputBlur}
          />
        </Animated.View>
        
        {/* Reset Button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleReset} 
            disabled={loading}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#6a11cb', '#2575fc']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {/* Ripple Effect */}
              <Animated.View style={[styles.ripple, {
                transform: [{ scale: rippleScale }],
                opacity: rippleOpacity,
              }]} />
              
              {loading ? 
                <ActivityIndicator color="#fff" /> : 
                <Text style={styles.buttonText}>RESET PASSWORD</Text>
              }
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
      
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => {
          Haptics.selectionAsync();
          navigation.goBack();
        }}
      >
        <Text style={styles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.06,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    width: width * 2.5,
    height: width * 2.5,
    top: -width * 0.7,
    left: -width * 0.7,
  },
  gradient: {
    flex: 1,
    opacity: 0.1,
  },
  parallaxLayer: {
    position: 'absolute',
    zIndex: -1,
  },
  parallaxCircleLarge: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: 'rgba(106, 17, 203, 0.05)',
    top: height * 0.2,
    left: width * 0.1,
  },
  parallaxCircleMedium: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: 'rgba(37, 117, 252, 0.05)',
    top: height * 0.6,
    left: width * 0.6,
  },
  parallaxCircleSmall: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    backgroundColor: 'rgba(43, 255, 237, 0.05)',
    top: height * 0.3,
    left: width * 0.4,
  },
  logoContainer: {
    marginBottom: height * 0.03,
    position: 'relative',
  },
  logoGradient: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 15,
    zIndex: 2,
    shadowColor: '#6a11cb',
    shadowOffset: { width: 0, height: height * 0.01 },
    shadowOpacity: 0.3,
    shadowRadius: width * 0.05,
  },
  logo: {
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: width * 0.04,
  },
  logoShadow: {
    position: 'absolute',
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.06,
    backgroundColor: '#6a11cb',
    top: height * 0.005,
    opacity: 0.2,
    zIndex: 1,
  },
  logoGlow: {
    position: 'absolute',
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    backgroundColor: '#6a11cb',
    opacity: 0.1,
    zIndex: 0,
    top: height * 0.01,
    filter: 'blur(10px)',
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: '700',
    color: '#333',
    marginBottom: height * 0.03,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: height * 0.002 },
    textShadowRadius: width * 0.01,
  },
  inputContainer: {
    width: '100%',
    marginBottom: height * 0.03,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: width * 0.04,
    marginBottom: height * 0.02,
    elevation: 8,
    shadowColor: '#6a11cb',
    shadowOffset: { width: 0, height: height * 0.005 },
    shadowOpacity: 0.15,
    shadowRadius: width * 0.03,
  },
  inputIcon: {
    marginLeft: width * 0.04,
  },
  input: {
    flex: 1,
    height: height * 0.065,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.04,
    color: '#333',
    fontWeight: '500',
  },
  button: {
    borderRadius: width * 0.04,
    overflow: 'hidden',
    marginTop: height * 0.01,
    marginBottom: height * 0.015,
    elevation: 10,
    shadowColor: '#6a11cb',
    shadowOffset: { width: 0, height: height * 0.01 },
    shadowOpacity: 0.4,
    shadowRadius: width * 0.04,
  },
  buttonGradient: {
    width: '100%',
    height: height * 0.065,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ripple: {
    position: 'absolute',
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
    letterSpacing: 1,
  },
  backButton: {
    marginTop: height * 0.01,
    padding: width * 0.02,
  },
  backButtonText: {
    color: '#6a11cb',
    fontWeight: 'bold',
    fontSize: width * 0.038,
    textDecorationLine: 'underline',
  },
});