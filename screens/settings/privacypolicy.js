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



const PrivacyPolicy = () => {

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

        <Text style={styles.headerText}>Privacy Policy</Text>

      </Animated.View>

      

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Animated.View style={[styles.content, contentTransform]}>

          <Text style={styles.effectiveDate}>Effective Date: 22 June 2025</Text>

          

          <Text style={styles.bodyText}>

            At Future Guide, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our website, use our services, or interact with us.

          </Text>

          

          <View style={styles.section}>

            <Text style={styles.sectionTitle}>1. Information We Collect</Text>

            <Text style={styles.bodyText}>

              We may collect the following types of information:

            </Text>

            <View style={styles.bulletPoint}>

              <Text style={styles.bullet}>•</Text>

              <Text style={styles.bodyText}>Personal Information: Name, email address, phone number, postal address, etc.</Text>

            </View>

            <View style={styles.bulletPoint}>

              <Text style={styles.bullet}>•</Text>

              <Text style={styles.bodyText}>Usage Data: Pages visited, time spent, browser type, device information, and IP address.</Text>

            </View>

            <View style={styles.bulletPoint}>

              <Text style={styles.bullet}>•</Text>

              <Text style={styles.bodyText}>Cookies and Tracking Technologies: For analytics, preferences, and performance improvement.</Text>

            </View>

          </View>

          

          <View style={styles.section}>

            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>

            <Text style={styles.bodyText}>

              We use your information to:

            </Text>

            <View style={styles.bulletPoint}>

              <Text style={styles.bullet}>•</Text>

              <Text style={styles.bodyText}>Provide and manage our services</Text>

            </View>

            <View style={styles.bulletPoint}>

              <Text style={styles.bullet}>•</Text>

              <Text style={styles.bodyText}>Personalize your experience with Future Guide</Text>

            </View>

            <View style={styles.bulletPoint}>

              <Text style={styles.bullet}>•</Text>

              <Text style={styles.bodyText}>Respond to your inquiries or requests</Text>

            </View>

            <View style={styles.bulletPoint}>

              <Text style={styles.bullet}>•</Text>

              <Text style={styles.bodyText}>Send updates, newsletters, and promotional materials (with your consent)</Text>

            </View>

            <View style={styles.bulletPoint}>

              <Text style={styles.bullet}>•</Text>

              <Text style={styles.bodyText}>Improve our website, services, and customer experience</Text>

            </View>

            <View style={styles.bulletPoint}>

              <Text style={styles.bullet}>•</Text>

              <Text style={styles.bodyText}>Ensure security and prevent fraud</Text>

            </View>

          </View>

          

          <View style={styles.section}>

            <Text style={styles.sectionTitle}>3. Sharing of Information</Text>

            <Text style={styles.bodyText}>

              We do not sell or rent your personal information. We may share your data with:

            </Text>

            <View style={styles.bulletPoint}>

              <Text style={styles.bullet}>•</Text>

              <Text style={styles.bodyText}>Trusted third-party service providers (e.g., hosting, payment processing)</Text>

            </View>

            <View style={styles.bulletPoint}>

              <Text style={styles.bullet}>•</Text>

              <Text style={styles.bodyText}>Legal authorities if required by law</Text>

            </View>

            <View style={styles.bulletPoint}>

              <Text style={styles.bullet}>•</Text>

              <Text style={styles.bodyText}>Partners for joint offerings, only with your consent</Text>

            </View>

          </View>

          

          <View style={styles.section}>

            <Text style={styles.sectionTitle}>4. Data Security</Text>

            <Text style={styles.bodyText}>

              We implement industry-standard security measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet is 100% secure.

            </Text>

          </View>

          

          <View style={styles.section}>

            <Text style={styles.sectionTitle}>5. Your Choices</Text>

            <Text style={styles.bodyText}>

              You have the right to:

            </Text>

            <View style={styles.bulletPoint}>

              <Text style={styles.bullet}>•</Text>

              <Text style={styles.bodyText}>Access, update, or delete your personal data</Text>

            </View>

            <View style={styles.bulletPoint}>

              <Text style={styles.bullet}>•</Text>

              <Text style={styles.bodyText}>Opt-out of marketing communications at any time</Text>

            </View>

            <View style={styles.bulletPoint}>

              <Text style={styles.bullet}>•</Text>

              <Text style={styles.bodyText}>Disable cookies through your browser settings</Text>

            </View>

          </View>

          

          <View style={styles.section}>

            <Text style={styles.sectionTitle}>6. Third-Party Links</Text>

            <Text style={styles.bodyText}>

              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites.

            </Text>

          </View>

          

          <View style={styles.section}>

            <Text style={styles.sectionTitle}>7. Children’s Privacy</Text>

            <Text style={styles.bodyText}>

              We do not knowingly collect information from children under the age of 13. If we become aware of such data, we will delete it promptly.

            </Text>

          </View>

          

          <View style={styles.section}>

            <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>

            <Text style={styles.bodyText}>

              We may update this Privacy Policy from time to time. The revised policy will be posted on this page with a new effective date.

            </Text>

          </View>

          

          <View style={styles.section}>

            <Text style={styles.sectionTitle}>9. Contact Us</Text>

            <Text style={styles.bodyText}>

              If you have any questions or concerns about this Privacy Policy, please contact us at:

            </Text>

            <View style={styles.contactInfo}>

              <Text style={styles.bodyText}>? Email: support@futureguide.com</Text>

              <Text style={styles.bodyText}>? Address: Rajahmundry</Text>

            </View>

          </View>

        </Animated.View>

      </ScrollView>

    </SafeAreaView>

  );

};



const { width, height } = Dimensions.get('window');



const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: '#FFFFFF'

  },

  header: {

    backgroundColor: '#6B46C1',

    paddingVertical: height * 0.025,

    paddingHorizontal: width * 0.05,

    width: '90%',

    borderRadius: 20,

    alignSelf: 'center',

    marginVertical: 15,

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

    fontSize: width < 400 ? 22 : 26,

    fontWeight: '800',

    textAlign: 'center',

    letterSpacing: 0.8,

    textShadowColor: 'rgba(0,0,0,0.15)',

    textShadowOffset: { width: 1, height: 1 },

    textShadowRadius: 3,

  },

  scrollContainer: {

    flexGrow: 1,

    paddingBottom: 40,

    

  },

  content: {

    padding: width * 0.04,

    backgroundColor: '#FFFFFF',

    borderRadius: 20,

    marginHorizontal: width * 0.04,

    

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

  effectiveDate: {

    color: '#6B46C1',

    fontSize: width < 400 ? 14 : 16,

    fontWeight: '600',

    textAlign: 'center',

    marginBottom: 20,

    fontStyle: 'italic',

  },

  bodyText: {

    color: '#4A5568',

    fontSize: width < 400 ? 15 : 16,

    lineHeight: 24,

    textAlign: 'justify',

    marginBottom: 10,

    marginRight:'10',

  },

  section: {

    marginTop: 15,

    paddingBottom: 5,

  },

  sectionTitle: {

    color: '#6B46C1',

    fontSize: width < 400 ? 18 : 20,

    fontWeight: '700',

    marginBottom: 10,

  },

  bulletPoint: {

    flexDirection: 'row',

    marginLeft: 10,

    marginBottom: 5,

  },

  bullet: {

    color: '#6B46C1',

    fontWeight: 'bold',

    marginRight: 8,

    fontSize: 16,

  },

  contactInfo: {

    marginTop: 10,

    paddingLeft: 5,

  },

});



export default PrivacyPolicy;

