import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator, Animated, Easing, Dimensions, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
// import Colors from '../constants/Colors';
import Colors from '../../constants/Colors';
const { width, height } = Dimensions.get('window');
// import { useLogin } from '../Login_id_passing';
import { useLogin } from '../../Login_id_passing';

const API_BASE_URL = 'https://futureguide-backend.onrender.com/api/auth';

class AuthAPI {
  async verifyOTP(email, otp) {
    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp
        })
      });
      // console.log(response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'OTP verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  }

  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset email');
      }

      return await response.json();
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }
}

const authAPI = new AuthAPI();

export default function OTPScreen({ navigation, route }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [activeInput, setActiveInput] = useState(0);
  const { email } = route.params || {};
  const from = route.params?.from;
  const {setLoginId}=useLogin();
  // Animation refs
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const inputYPosition = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(0.9)).current;
  const socialScale = useRef(new Animated.Value(0.8)).current;
  const backgroundOffset = useRef(new Animated.Value(0)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(1)).current;
  const parallaxX = useRef(new Animated.Value(0)).current;
  const parallaxY = useRef(new Animated.Value(0)).current;
  
  // Refs for OTP inputs
  const inputRefs = Array(6).fill(0).map(() => useRef());
  
  // Create pan responders for parallax effect
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
      }),
      Animated.spring(socialScale, {
        toValue: 1,
        friction: 6,
        delay: 500,
        useNativeDriver: true
      })
    ]).start();
  }, []);
  const handleSubmit = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a 6-digit OTP.');
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
    
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // If from forgot password flow, navigate to reset password
    if (from === 'forgot') {
      navigation.replace('ResetPassword', { email, otp: otpString });
      return;
    }
    
    setLoading(true);
    try {
      const data = await authAPI.verifyOTP(email, otpString);
      Alert.alert('Success', 'OTP verified successfully! Welcome!', [
        { text: 'OK', onPress: () => {handling(data)} }
      ]);
    } catch (error) {
      Alert.alert('OTP Verification Failed', error.message || 'Something went wrong');
      console.error('OTP verification error:', error);
    } finally {
      setLoading(false);
    }
  };
  async function handling(data)
  {
      try {
            navigation.replace('Profile Setup')
            const object = { login_id: data.user._id, profile_id:"" };
            // console.log(object);
            setLoginId(object);
          }
          catch (err) {
            console.log(err);
          }
  }

  const handleResendOTP = async () => {
    try {
      if (from === 'signup') {
        Alert.alert('Resend OTP', 'Please go back to signup and register again to resend OTP.');
        return;
      } else if (from === 'forgot') {
        await authAPI.forgotPassword(email);
      }
      Alert.alert('Success', 'New OTP sent to your email!');
      setOtp(['', '', '', '', '', '']);
      setActiveInput(0);
      inputRefs[0].current?.focus();
    } catch (error) {
      Alert.alert('Resend Failed', error.message || 'Failed to resend OTP');
      console.error('Resend OTP error:', error);
    }
  };

  const handleInputChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    
    if (text && index < 5) {
      inputRefs[index + 1].current.focus();
      setActiveInput(index + 1);
    }
    
    if (!text && index > 0) {
      inputRefs[index - 1].current.focus();
      setActiveInput(index - 1);
    }
  };

  const handleInputFocus = (index) => {
    setActiveInput(index);
    Haptics.selectionAsync();
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
      
      {/* Logo with 3D effect and floating animation */}
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
        Enter OTP
      </Animated.Text>
      
      <Animated.Text style={[styles.subtitle, { opacity: titleOpacity }]}>
        We sent a code to {email || 'your email'}
      </Animated.Text>
      
      <Animated.View style={[styles.inputContainer, {
        transform: [{ translateY: inputYPosition }]
      }]}>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <Animated.View 
              key={index} 
              style={[
                styles.otpInputWrapper,
                activeInput === index && styles.otpInputWrapperFocused,
                {
                  transform: [{ translateY: floatingY }]
                }
              ]}
            >
              <TextInput
                ref={inputRefs[index]}
                style={styles.otpInput}
                value={digit}
                onChangeText={(text) => handleInputChange(text, index)}
                keyboardType="numeric"
                maxLength={1}
                onFocus={() => handleInputFocus(index)}
                textAlign="center"
                selectionColor="#ff3366"
              />
            </Animated.View>
          ))}
        </View>
        
        {/* Submit Button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit} 
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
                <Text style={styles.buttonText}>VERIFY OTP</Text>
              }
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Resend OTP */}
        <TouchableOpacity 
          onPress={handleResendOTP}
          style={styles.resendButton}
        >
          <Text style={styles.resendText}>Didn't receive code? <Text style={styles.resendLink}>Resend</Text></Text>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or verify with</Text>
        <View style={styles.dividerLine} />
      </View>
      
      {/* Social Login Buttons with floating animation */}
      <Animated.View style={[styles.socialContainer, {
        transform: [
          { scale: socialScale },
          { translateY: floatingY }
        ]
      }]}>
        <TouchableOpacity 
          style={styles.socialButton}
          onPress={() => {
            Haptics.selectionAsync();
            Alert.alert('Google Login', 'Google sign-in selected');
          }}
        >
          <LinearGradient
            colors={['#fff', '#f5f5f5']}
            style={styles.socialGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <FontAwesome5 name="google" size={24} color="#EA4335" />
          </LinearGradient>
          <View style={styles.socialButtonGlow} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.socialButton}
          onPress={() => {
            Haptics.selectionAsync();
            Alert.alert('GitHub Login', 'GitHub sign-in selected');
          }}
        >
          <LinearGradient
            colors={['#fff', '#f5f5f5']}
            style={styles.socialGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <FontAwesome5 name="github" size={24} color="#333" />
          </LinearGradient>
          <View style={styles.socialButtonGlow} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.socialButton}
          onPress={() => {
            Haptics.selectionAsync();
            Alert.alert('Microsoft Login', 'Microsoft sign-in selected');
          }}
        >
          <LinearGradient
            colors={['#fff', '#f5f5f5']}
            style={styles.socialGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <FontAwesome5 name="microsoft" size={24} color="#0078D7" />
          </LinearGradient>
          <View style={styles.socialButtonGlow} />
        </TouchableOpacity>
      </Animated.View>
      
      {/* Back button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>&larr; Back to Login</Text>
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
    marginBottom: height * 0.02,
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
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: '800',
    color: '#333',
    marginBottom: height * 0.01,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: height * 0.002 },
    textShadowRadius: width * 0.01,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#666',
    marginBottom: height * 0.04,
    textAlign: 'center',
    paddingHorizontal: width * 0.1,
  },
  inputContainer: {
    width: '100%',
    marginBottom: height * 0.03,
    alignItems: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: height * 0.04,
  },
  otpInputWrapper: {
    width: width * 0.12,
    height: width * 0.15,
    backgroundColor: '#fff',
    borderRadius: width * 0.03,
    borderWidth: 2,
    borderColor: '#6a11cb',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#6a11cb',
    shadowOffset: { width: 0, height: height * 0.005 },
    shadowOpacity: 0.2,
    shadowRadius: width * 0.01,
  },
  otpInputWrapperFocused: {
    borderColor: '#ff3366',
    elevation: 20,
    zIndex: 10,
    transform: [{ scale: 1.15 }, { translateY: -5 }],
  },
  otpInput: {
    width: '100%',
    height: '100%',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  button: {
    width: width * 0.8,
    borderRadius: width * 0.04,
    overflow: 'hidden',
    marginBottom: height * 0.02,
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
    position: 'relative',
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
  resendButton: {
    marginTop: height * 0.01,
  },
  resendText: {
    color: '#666',
    fontSize: width * 0.035,
  },
  resendLink: {
    color: '#6a11cb',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: height * 0.03,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    paddingHorizontal: width * 0.02,
    color: '#777',
    fontWeight: '600',
    fontSize: width * 0.035,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: height * 0.02,
  },
  socialButton: {
    marginHorizontal: width * 0.03,
    borderRadius: width * 0.04,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.005 },
    shadowOpacity: 0.1,
    shadowRadius: width * 0.03,
    position: 'relative',
  },
  socialGradient: {
    width: width * 0.15,
    height: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.04,
  },
  socialButtonGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: width * 0.04,
    borderWidth: 1,
    borderColor: 'rgba(106, 17, 203, 0.1)',
    zIndex: -1,
    top: 0,
    left: 0,
  },
  backButton: {
    marginTop: height * 0.02,
    padding: width * 0.03,
    position: 'absolute',
    bottom: height * 0.05,
  },
  backButtonText: {
    color: '#6a11cb',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
});