import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator, Animated, Easing, Dimensions, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
// import Colors from '../../constants/Colors';
import Colors from '../../constants/Colors';
// import { useLogin } from '../Login_id_passing';
import { useLogin } from '../../Login_id_passing';
const { width, height } = Dimensions.get('window');

const API_BASE_URL = 'https://futureguide-backend.onrender.com/api/auth';

class AuthAPI {
  async signup(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      // console.log(response.json());
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }
}

const authAPI = new AuthAPI();

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  
  // Animation values
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const formYPosition = useRef(new Animated.Value(height * 0.3)).current;
  const buttonScale = useRef(new Animated.Value(0.9)).current;
  const socialScale = useRef(new Animated.Value(0.8)).current;
  const backgroundOffset = useRef(new Animated.Value(0)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(1)).current;
  const inputFocusAnim = useRef(new Animated.Value(0)).current;
  const parallaxX = useRef(new Animated.Value(0)).current;
  const parallaxY = useRef(new Animated.Value(0)).current;

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
      // Logo spring
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
        delay: 100
      }),
      
      // Title fade
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        delay: 300
      }),
      
      // Form slide up
      Animated.spring(formYPosition, {
        toValue: 0,
        tension: 30,
        friction: 8,
        useNativeDriver: true,
        delay: 200
      }),
      
      // Social buttons spring
      Animated.spring(socialScale, {
        toValue: 1,
        friction: 6,
        delay: 500,
        useNativeDriver: true
      })
    ]).start();
  }, []);
  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    
    // Password validation
    if (password.length < 6) {
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
    
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setLoading(true);
    try {
      const data = await authAPI.signup(email, password);
      Alert.alert('Success', 'Account created successfully! Please verify your OTP.', [
        { text: 'OK', onPress: () => navigation.navigate('OTP', { email, from: 'signup' }) }
      ]);
    } catch (error) {
      Alert.alert('Signup Failed', error.message || 'Something went wrong');
      console.error('Signup error:', error);
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
          colors={['#6a11cb', '#2575fc', '#2bffed']}
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
        Create Account
      </Animated.Text>
      
      <Animated.View style={[styles.formContainer, {
        transform: [{ translateY: formYPosition }]
      }]}>
        {/* Email Input */}
        <Animated.View style={[styles.inputWrapper, {
          transform: [
            { scale: focusedInput === 'email' ? inputFocusScale : 1 },
            { translateY: focusedInput === 'email' ? -3 : 0 }
          ],
          elevation: focusedInput === 'email' ? inputFocusElevation : 8,
          zIndex: focusedInput === 'email' ? 2 : 1
        }]}>
          <MaterialIcons name="email" size={20} color="#6a11cb" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => handleInputFocus('email')}
            onBlur={handleInputBlur}
          />
        </Animated.View>
        
        {/* Password Input */}
        <Animated.View style={[styles.inputWrapper, {
          transform: [
            { scale: focusedInput === 'password' ? inputFocusScale : 1 },
            { translateY: focusedInput === 'password' ? -3 : 0 }
          ],
          elevation: focusedInput === 'password' ? inputFocusElevation : 8,
          zIndex: focusedInput === 'password' ? 2 : 1
        }]}>
          <MaterialIcons name="lock" size={20} color="#6a11cb" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onFocus={() => handleInputFocus('password')}
            onBlur={handleInputBlur}
          />
        </Animated.View>
        
        {/* Sign Up Button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSignup} 
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
                <Text style={styles.buttonText}>SIGN UP</Text>
              }
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Divider - Added marginBottom to create space */}
        <View style={[styles.dividerContainer, { marginBottom: height * 0.03 }]}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or sign up with</Text>
          <View style={styles.dividerLine} />
        </View>
        
        {/* Social Login Buttons - Added marginTop to create space */}
        <Animated.View style={[styles.socialContainer, {
          transform: [
            { scale: socialScale },
            { translateY: floatingY }
          ],
          marginTop: height * 0.01 // Added space above social buttons
        }]}>
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => {
              Haptics.selectionAsync();
              Alert.alert('Sign up', 'Google sign up selected');
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
              Alert.alert('Sign up', 'GitHub sign up selected');
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
              Alert.alert('Sign up', 'Microsoft sign up selected');
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
      </Animated.View>
      
      {/* Login Link */}
      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>Already have an account? </Text>
        <TouchableOpacity 
          onPress={() => {
            Haptics.selectionAsync();
            navigation.navigate('Login');
          }}
        >
          <Text style={styles.login}>Login</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: 'rgba(107, 70, 193, 0.05)', // Colors.primary with opacity
    top: height * 0.2,
    left: width * 0.1,
  },
  parallaxCircleMedium: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: 'rgba(139, 92, 246, 0.05)', // Colors.accent with opacity
    top: height * 0.6,
    left: width * 0.6,
  },
  parallaxCircleSmall: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    backgroundColor: 'rgba(124, 58, 237, 0.05)', // Colors.accentDark with opacity
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
    backgroundColor: Colors.primary,
    top: height * 0.005,
    opacity: 0.2,
    zIndex: 1,
  },
  logoGlow: {
    position: 'absolute',
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    backgroundColor: Colors.primary,
    opacity: 0.1,
    zIndex: 0,
    top: height * 0.01,
    filter: 'blur(10px)',
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: height * 0.03,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: height * 0.002 },
    textShadowRadius: width * 0.01,
  },
  formContainer: {
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: height * 0.02,
  },
  dividerLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#e8e8e8',
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
    marginBottom: height * 0.04,
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
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.02,
    position: 'absolute',
    bottom: height * 0.05,
  },
  bottomText: {
    color: '#555',
    fontSize: width * 0.038,
  },
  login: {
    color: '#6a11cb',
    fontWeight: 'bold',
    fontSize: width * 0.038,
    textDecorationLine: 'underline',
  },
});