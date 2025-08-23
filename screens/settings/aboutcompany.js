import React, { useEffect, useRef } from 'react';

import { 

  View, 

  Text, 

  ScrollView, 

  StyleSheet, 

  SafeAreaView, 

  Dimensions, 

  Animated,

  Platform

} from 'react-native';



const AboutCompany = () => {

  const headerAnim = useRef(new Animated.Value(0)).current;

  const contentAnim = useRef(new Animated.Value(0)).current;



  useEffect(() => {

    Animated.parallel([

      Animated.spring(headerAnim, {

        toValue: 1,

        friction: 5,

        tension: 100,

        useNativeDriver: true,

      }),

      Animated.spring(contentAnim, {

        toValue: 1,

        friction: 8,

        tension: 120,

        delay: 300,

        useNativeDriver: true,

      })

    ]).start();

  }, []);



  const headerTransform = {

    transform: [

      { perspective: 1000 },

      { 

        rotateX: headerAnim.interpolate({

          inputRange: [0, 1],

          outputRange: ['90deg', '0deg']

        })

      },

      {

        scale: headerAnim.interpolate({

          inputRange: [0, 1],

          outputRange: [0.75, 1]

        })

      }

    ],

    opacity: headerAnim

  };



  const contentTransform = {

    transform: [

      { perspective: 1000 },

      {

        translateY: contentAnim.interpolate({

          inputRange: [0, 1],

          outputRange: [50, 0]

        })

      }

    ],

    opacity: contentAnim

  };



  return (

    <SafeAreaView style={styles.container}>

      <Animated.View style={[styles.header, headerTransform]}>

        <Text style={styles.headerText}>Future Guide: Empowering Tomorrow, Today</Text>

      </Animated.View>

      

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Animated.View style={[styles.content, contentTransform]}>

          <Text style={styles.bodyText}>

            Future Guide is a visionary company committed to shaping the future by guiding individuals and organizations toward growth, innovation, and excellence. We specialize in providing cutting-edge solutions in technology, education, and digital transformation, tailored to meet the evolving needs of the modern world.

          </Text>

          

          <Text style={[styles.bodyText, styles.section]}>

            Our mission is to empower students, professionals, and businesses with the tools, knowledge, and skills required to thrive in an ever-changing global landscape. Through our diverse range of services—including tech training, career mentorship, software development, and strategic consulting—we aim to bridge the gap between potential and achievement.

          </Text>

          

          <Text style={[styles.bodyText, styles.section]}>

            At Future Guide, we believe in delivering impact-driven results through integrity, creativity, and continuous innovation. Our dedicated team of experts works closely with clients to understand their goals, unlocking pathways to success and shaping a smarter, more sustainable future.

          </Text>

          

          <View style={styles.visionMission}>

            <Text style={styles.subHeader}>Vision:</Text>

            <Text style={styles.bodyText}>

              To be a global leader in empowering future-ready talent and technology-driven solutions.

            </Text>

            

            <Text style={[styles.subHeader, styles.section]}>Mission:</Text>

            <Text style={styles.bodyText}>

              To guide individuals and enterprises towards innovation, skill development, and impactful growth.

            </Text>

          </View>

        </Animated.View>

      </ScrollView>

    </SafeAreaView>

  );

};



const { width, height } = Dimensions.get('window');

const isSmallScreen = width < 375;



const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: '#FFFFFF'

  },

  header: {

    backgroundColor: '#6B46C1',

    paddingVertical: height * 0.025,

    paddingHorizontal: width * 0.05,

    marginLeft:'15',

    marginRight:'15',

    marginBottom:'10',

    borderRadius:20,

    alignSelf: 'center',

    ...Platform.select({

      ios: {

        shadowColor: '#000',

        shadowOffset: { width: 0, height: 10 },

        shadowOpacity: 0.3,

        shadowRadius: 15,

      },

      android: {

        elevation: 20,

      },

    }),

  },

  headerText: {

    color: 'white',

    fontSize: width < 400 ? 20 : width * 0.06,

    fontWeight: '800',

    textAlign: 'center',

    letterSpacing: 0.8,

    textShadowColor: 'rgba(0,0,0,0.15)',

    textShadowOffset: { width: 1, height: 1 },

    textShadowRadius: 3,

    maxWidth: width * 0.95,

    alignSelf: 'center',

  },

  scrollContainer: {

    flexGrow: 1,

    paddingBottom: 40,

  },

  content: {

    padding: width * 0.04,

    backgroundColor: '#FFFFFF',

    borderRadius: 20,

    margin: width * 0.04,

    marginTop: -height * 0.01,

    ...Platform.select({

      ios: {

        shadowColor: '#6B46C1',

        shadowOffset: { width: 0, height: 6 },

        shadowOpacity: 0.15,

        shadowRadius: 12,

      },

      android: {

        elevation: 10,

        borderColor: '#F5F3FF',

        borderWidth: 1,

      },

    }),

  },

  bodyText: {

    color: '#4A5568',

    fontSize: width < 400 ? 15 : 17,

    lineHeight: 26,

    textAlign: 'justify',

    marginBottom: 15,

  },

  subHeader: {

    color: '#6B46C1',

    fontSize: width < 400 ? 18 : 21,

    fontWeight: '700',

    marginTop: 10,

    marginBottom: 8,

  },

  section: {

    marginTop: 10,

  },

  visionMission: {

    marginTop: 15,

    borderTopWidth: 2,

    borderTopColor: '#EDE9FE',

    paddingTop: 15,

  },

});



export default AboutCompany;

