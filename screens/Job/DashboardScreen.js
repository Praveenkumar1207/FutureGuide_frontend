import React, { useState, useEffect, useRef } from 'react';

import { 

  View, 

  Text, 

  StyleSheet, 

  TouchableOpacity, 

  ScrollView,

  Image,

  SafeAreaView,

  Dimensions,

  ActivityIndicator,

  Animated,

  StatusBar,

  Platform

} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Remove LinearGradient import as we no longer need it

import Colors from '../../constants/Colors';

import { useLogin } from '../../Login_id_passing';



const screenWidth = Dimensions.get('window').width;



const DashboardScreen = ({ navigation }) => {

  const { loginId } = useLogin();

  const [loading, setLoading] = useState(true);

  const [userName, setUserName] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const translateY = useRef(new Animated.Value(20)).current;

  const insets = useSafeAreaInsets();



  console.log('DashboardScreen - LoginId from context:', loginId);

  console.log('DashboardScreen - Profile ID:', loginId?.profile_id);

  console.log('DashboardScreen - Login ID:', loginId?.login_id);



  // Simulate loading user data

  useEffect(() => {

    setTimeout(() => {

      setUserName('John');

      setLoading(false);

      

      // Start animations

      Animated.parallel([

        Animated.timing(fadeAnim, {

          toValue: 1,

          duration: 800,

          useNativeDriver: true,

        }),

        Animated.timing(translateY, {

          toValue: 0,

          duration: 800,

          useNativeDriver: true,

        })

      ]).start();

    }, 1000);

  }, []);



  const renderHeader = () => (

    <View style={[styles.header, { paddingTop: insets.top || 16 }]}>

      <View style={styles.headerContent}>

        {loading ? (

          <ActivityIndicator size="small" color="#FFFFFF" />

        ) : (

          <>

            <Text style={styles.greeting}>Hello, <Text style={styles.userName}>{userName}</Text> ?</Text>

            <Text style={styles.headerTitle}>Discover Your Dream Career</Text>

          </>

        )}

      </View>

      <TouchableOpacity 

        style={styles.profileButton}

        onPress={() => navigation.navigate('Profile')}

      >

        <Image 

          source={{ uri: 'https://randomuser.me/api/portraits/men/41.jpg' }} 

          style={styles.profileImage}

        />

        <View style={styles.statusIndicator}></View>

      </TouchableOpacity>

    </View>

  );



  return (

    <View style={styles.outerContainer}>

      <StatusBar 

        backgroundColor="transparent"

        barStyle="dark-content"

        translucent={true}

      />

      

      <SafeAreaView style={styles.safeArea}>

        {renderHeader()}

        

        <ScrollView 

          style={styles.scrollView} 

          contentContainerStyle={styles.contentContainer}

          showsVerticalScrollIndicator={false}

        >

          <Animated.View 

            style={[

              styles.cardGrid,

              {

                opacity: fadeAnim,

                transform: [{ translateY: translateY }]

              }

            ]}

          >

            <TouchableOpacity 

              style={[styles.card, styles.jobModuleCard]}

              onPress={() => navigation.navigate('JobFeed')}

            >

              <View style={styles.solidGreenCard}>

                <View style={styles.cardContent}>

                  <View style={styles.iconCircleLarge}>

                    <MaterialIcons name="work" size={32} color="#FFFFFF" />

                  </View>

                  <Text style={styles.cardTitleLight}>Explore Jobs</Text>

                  <Text style={styles.cardDescriptionLight}>

                    Discover opportunities tailored to your unique skills and experience

                  </Text>

                  <View style={styles.sparkleContainer}>

                    <MaterialIcons name="auto-awesome" size={16} color="#FFF9C4" />

                    <Text style={styles.sparkleText}>10 new jobs today</Text>

                  </View>

                  <View style={styles.cardButtonLight}>

                    <Text style={styles.cardButtonTextLight}>View Jobs</Text>

                    <MaterialIcons name="arrow-forward" size={16} color="#FFFFFF" />

                  </View>

                </View>

              </View>

            </TouchableOpacity>

            

            <TouchableOpacity 

              style={styles.card}

              onPress={() => navigation.navigate('AI Assistant', { conversation: { name: 'New Chat' } })}

            >

              <View style={styles.cardHeader}>

                <View style={[styles.iconCircle, { backgroundColor: '#4FC3F7' }]}>

                  <MaterialIcons name="psychology" size={28} color="#FFFFFF" />

                </View>

                <View style={styles.aiStatusIndicator}>

                  <View style={styles.aiStatusDot}></View>

                  <Text style={styles.aiStatusText}>AI Ready</Text>

                </View>

              </View>

              <Text style={styles.cardTitle}>Career Coach</Text>

              <Text style={styles.cardDescription}>Personalized AI guidance for your job search journey</Text>

              <TouchableOpacity 

                style={styles.saveButton}

                onPress={() => navigation.navigate('Conversations')}

              >

                <MaterialIcons name="bookmark" size={16} color={Colors.primary} />

                <Text style={styles.saveButtonText}>Past Conversations</Text>

              </TouchableOpacity>

            </TouchableOpacity>

            

            <TouchableOpacity 

              style={styles.card}

              onPress={() => navigation.navigate('Applications')}

            >

              <View style={styles.cardHeader}>

                <View style={[styles.iconCircle, { backgroundColor: '#A1887F' }]}>

                  <MaterialIcons name="fact-check" size={28} color="#FFFFFF" />

                </View>

              </View>

              <Text style={styles.cardTitle}>My Applications</Text>

              <Text style={styles.cardDescription}>Track progress and manage your job applications</Text>

              <View style={styles.applicationSummary}>

                <Text style={styles.applicationTotal}>7 Total Applications</Text>

              </View>

              <View style={styles.applicationStatus}>

                <View style={styles.statusItem}>

                  <View style={[styles.statusDot, {backgroundColor: '#4CAF50'}]}></View>

                  <Text style={styles.statusText}>5 Active</Text>

                </View>

                <View style={styles.statusItem}>

                  <View style={[styles.statusDot, {backgroundColor: '#FF9800'}]}></View>

                  <Text style={styles.statusText}>2 Interviews</Text>

                </View>

              </View>

            </TouchableOpacity>

          </Animated.View>

          

          <View style={styles.section}>

            <View style={styles.sectionHeader}>

              <Text style={styles.sectionTitle}>Recent Activity</Text>

              <TouchableOpacity style={styles.seeAllButton}>

                <Text style={styles.seeAllText}>See All</Text>

                <MaterialIcons name="chevron-right" size={16} color={Colors.primary} />

              </TouchableOpacity>

            </View>

            

            <View style={styles.activityItem}>

              <View style={[styles.activityIconContainer, { backgroundColor: '#E8F5E9' }]}>

                <MaterialIcons name="check-circle" size={20} color={Colors.primary} />

              </View>

              <View style={styles.activityContent}>

                <Text style={styles.activityText}>Applied for <Text style={styles.bold}>UX Designer</Text> at Creative Labs</Text>

                <Text style={styles.activityTime}>2 hours ago</Text>

              </View>

              <TouchableOpacity style={styles.activityAction}>

                <MaterialIcons name="more-vert" size={20} color={Colors.textMedium} />

              </TouchableOpacity>

            </View>

            

            <View style={styles.activityItem}>

              <View style={[styles.activityIconContainer, { backgroundColor: '#FFF3E0' }]}>

                <MaterialIcons name="bookmark" size={20} color="#FF9800" />

              </View>

              <View style={styles.activityContent}>

                <Text style={styles.activityText}>Saved <Text style={styles.bold}>Product Manager</Text> job at Startup Hub</Text>

                <Text style={styles.activityTime}>Yesterday</Text>

              </View>

              <TouchableOpacity style={styles.activityAction}>

                <MaterialIcons name="more-vert" size={20} color={Colors.textMedium} />

              </TouchableOpacity>

            </View>

            

            <View style={styles.activityItem}>

              <View style={[styles.activityIconContainer, { backgroundColor: '#E1F5FE' }]}>

                <MaterialIcons name="chat" size={20} color="#03A9F4" />

              </View>

              <View style={styles.activityContent}>

                <Text style={styles.activityText}>Coaching session about <Text style={styles.bold}>interview techniques</Text></Text>

                <Text style={styles.activityTime}>2 days ago</Text>

              </View>

              <TouchableOpacity style={styles.activityAction}>

                <MaterialIcons name="more-vert" size={20} color={Colors.textMedium} />

              </TouchableOpacity>

            </View>

          </View>

          

          <View style={styles.inspirationContainer}>

            <Text style={styles.quoteText}>"Choose a job you love, and you will never have to work a day in your life."</Text>

            <Text style={styles.quoteAuthor}>- Confucius</Text>

          </View>

        </ScrollView>

      </SafeAreaView>

    </View>

  );

};



const styles = StyleSheet.create({

  outerContainer: {

    flex: 1,

    backgroundColor: Colors.primary,

  },

  safeArea: {

    flex: 1,

    backgroundColor: Colors.background,

  },

  header: {

    backgroundColor: Colors.primary,

    paddingBottom: 20,

    paddingHorizontal: 20,

    elevation: 4,

    shadowColor: Colors.shadowColor,

    shadowOffset: { width: 0, height: 4 },

    shadowOpacity: 0.2,

    shadowRadius: 4,

    borderBottomLeftRadius: 24,

    borderBottomRightRadius: 24,

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    width: '100%',

  },

  solidGreenCard: {

    width: '100%',

    height: '100%',

    padding: 20,

    paddingBottom: 20,

    borderRadius: 16,

    backgroundColor: Colors.primary,

  },

  headerContent: {

    flex: 1,

    marginRight: 16,

  },

  greeting: {

    color: 'rgba(255, 255, 255, 0.95)',

    fontSize: 16,

  },

  userName: {

    fontWeight: 'bold',

  },

  headerTitle: {

    color: Colors.textLight,

    fontSize: 22,

    fontWeight: 'bold',

    marginTop: 5,

  },

  profileButton: {

    width: 44,

    height: 44,

    borderRadius: 22,

    borderWidth: 2,

    borderColor: Colors.buttonOverlay,

    overflow: 'hidden',

    elevation: 3,

    shadowColor: Colors.shadowColor,

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.2,

    shadowRadius: 2,

    position: 'relative',

  },

  profileImage: {

    width: '100%',

    height: '100%',

  },

  statusIndicator: {

    position: 'absolute',

    width: 10,

    height: 10,

    borderRadius: 5,

    backgroundColor: Colors.success,

    borderWidth: 1.5,

    borderColor: Colors.textLight,

    bottom: 0,

    right: 0,

  },

  scrollView: {

    flex: 1,

    width: '100%',

  },

  contentContainer: {

    padding: 20,

    paddingTop: 12, // Reduced from default 20 to 12

    paddingBottom: 30,

    width: '100%',

  },

  cardGrid: {

    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'space-between',

    marginTop: 0, // Reduced from 10 to 0

    marginBottom: 20,

    width: '100%',

  },

  card: {

    width: (screenWidth - 50) / 2,

    backgroundColor: Colors.surface,

    borderRadius: 16,

    padding: 16, // Increased from 14 to 16 for consistent padding

    marginBottom: 16,

    elevation: 3,

    shadowColor: Colors.cardShadow,

    shadowOffset: { width: 0, height: 4 },

    shadowOpacity: 0.1,

    shadowRadius: 8,

    borderWidth: 1,

    borderColor: Colors.divider,

    overflow: 'hidden',

    height: 220, // Maintained height

    justifyContent: 'space-between', // Added to ensure even distribution of content

  },

  jobModuleCard: {

    width: screenWidth - 40,

    marginBottom: 16,

    marginTop: 0,

    padding: 0, 

    borderWidth: 0,

    height: 260, // Increased from 240 to 260 to provide more space for the button

  },

  gradientCard: {

    width: '100%',

    height: '100%',

    padding: 20,

    paddingBottom: 20, // Increased bottom padding from 16 to 20

    borderRadius: 16,

  },

  cardContent: {

    height: '100%',

    justifyContent: 'space-between',

    position: 'relative', // Ensure positioning context for children

  },

  cardHeader: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 8, // Reduced from 10 to 8

    paddingHorizontal: 0, // Ensure no additional padding

  },

  iconCircle: {

    width: 46, // Reduced from 50

    height: 46, // Reduced from 50

    borderRadius: 23,

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 8, // Reduced from 12

  },

  iconCircleLarge: {

    width: 60,

    height: 60,

    borderRadius: 30,

    backgroundColor: 'rgba(255, 255, 255, 0.2)',

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 16,

  },

  cardTitle: {

    fontSize: 18,

    fontWeight: 'bold',

    color: Colors.textDark,

    marginBottom: 6, // Reduced from 8 to 6 for better spacing

  },

  cardTitleLight: {

    fontSize: 22,

    fontWeight: 'bold',

    color: Colors.textLight,

    marginBottom: 8,

  },

  cardDescription: {

    fontSize: 11,

    color: Colors.textDark,

    marginBottom: 8, // Increased from 5 to 8 for more consistent spacing

    lineHeight: 15,

  },

  cardDescriptionLight: {

    fontSize: 12, // Reduced from 13

    color: 'rgba(255, 255, 255, 0.9)',

    marginBottom: 4, // Reduced from 8

    lineHeight: 16, // Reduced from 18

  },

  cardButtonLight: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: Colors.buttonOverlay,

    borderRadius: 8,

    paddingVertical: 5, // Reduced from 6

    paddingHorizontal: 8, // Reduced from 10

    alignSelf: 'flex-start',

    marginTop: 2, // Reduced from 4

    marginBottom: 6, // Added explicit bottom margin

    position: 'relative', // Ensure it doesn't get pushed out

    bottom: 0, // Anchor to the bottom

  },

  cardButtonTextLight: {

    color: '#FFFFFF',

    fontWeight: 'bold',

    marginRight: 8,

  },

  sparkleContainer: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 6, // Reduced from 10

  },

  sparkleText: {

    marginLeft: 6,

    color: '#FFFFFF',

    fontWeight: '500',

    fontSize: 14,

  },

  aiStatusIndicator: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: 'rgba(79, 195, 247, 0.15)',

    paddingHorizontal: 8,

    paddingVertical: 4,

    borderRadius: 12,

  },

  aiStatusDot: {

    width: 6,

    height: 6,

    borderRadius: 3,

    backgroundColor: Colors.info,

    marginRight: 4,

  },

  aiStatusText: {

    fontSize: 10,

    color: Colors.info,

    fontWeight: '600',

  },

  badgeContainer: {

    width: 20,

    height: 20,

    borderRadius: 10,

    backgroundColor: '#FF5252',

    justifyContent: 'center',

    alignItems: 'center',

    marginLeft: 4,

  },

  badgeText: {

    color: '#FFFFFF',

    fontSize: 10,

    fontWeight: 'bold',

  },

  saveButton: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: Colors.primaryLight,

    paddingVertical: 3,

    paddingHorizontal: 3,

    borderRadius: 6,

    marginTop: 0, // Removed top margin (was 6)

    alignSelf: 'flex-start',

  },

  saveButtonText: {

    fontSize: 12,

    color: Colors.primary,

    fontWeight: '600',

    marginLeft: 4,

  },

  applicationSummary: {

    marginBottom: 4,

  },

  applicationTotal: {

    fontSize: 11,

    fontWeight: 'bold',

    color: 'black',

  },

  applicationStatus: {

    flexDirection: 'row',

    justifyContent: 'flex-start',

    marginTop: 0,

    marginBottom: 0,

    paddingVertical: 4, // Adjusted padding

    paddingHorizontal: 0, // Remove horizontal padding

    borderRadius: 0, // Remove border radius

    backgroundColor: 'transparent', // Remove background color

  },

  statusItem: {

    flexDirection: 'row',

    alignItems: 'center',

    marginRight: 10, // Reduced from 12

    padding: 2, // Add small padding

  },

  statusDot: {

    width: 6, // Reduced from 8

    height: 6, // Reduced from 8

    borderRadius: 3,

    marginRight: 3, // Reduced from 4

  },

  statusText: {

    fontSize: 10, // Reduced from 12

    color: 'black',

    fontWeight: '600',

  },

  section: {

    marginBottom: 24,

  },

  sectionHeader: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 16,

  },

  sectionTitle: {

    fontSize: 20,

    fontWeight: 'bold',

    color: 'black', // Changed from Colors.textDark

  },

  seeAllButton: {

    flexDirection: 'row',

    alignItems: 'center',

  },

  seeAllText: {

    color: Colors.primary,

    fontWeight: '500',

    fontSize: 14,

  },

  activityItem: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 16,

    backgroundColor: Colors.surface,

    borderRadius: 12,

    padding: 14,

    elevation: 2,

    shadowColor: Colors.cardShadow,

    shadowOffset: { width: 0, height: 1 },

    shadowOpacity: 0.15,

    shadowRadius: 3,

  },

  activityIconContainer: {

    width: 40,

    height: 40,

    borderRadius: 20,

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 14,

  },

  activityContent: {

    flex: 1,

  },

  activityText: {

    fontSize: 14,

    color: Colors.textDark,

    marginBottom: 6,

    lineHeight: 20,

  },

  activityTime: {

    fontSize: 12,

    color: Colors.textMedium,

  },

  activityAction: {

    padding: 4,

  },

  bold: {

    fontWeight: 'bold',

    color: Colors.textDark,

  },

  inspirationContainer: {

    backgroundColor: Colors.surface,

    borderRadius: 16,

    padding: 20,

    marginBottom: 20,

    borderLeftWidth: 4,

    borderLeftColor: Colors.primary,

  },

  quoteText: {

    fontSize: 16,

    fontStyle: 'italic',

    color: Colors.textDark,

    lineHeight: 24,

    marginBottom: 8,

  },

  quoteAuthor: {

    fontSize: 14,

    color: Colors.textMedium,

    textAlign: 'right',

  },

});



export default DashboardScreen;


