import React, { useState, useEffect } from 'react';

import {

  View,

  Text,

  StyleSheet,

  FlatList,

  SafeAreaView,

  ScrollView,

  TextInput,

  TouchableOpacity,

  ActivityIndicator,

  StatusBar,

  Platform,

} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';

import JobCard from '../../components/JobCard';

import Colors from '../../constants/Colors';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLogin } from '../../Login_id_passing';
import { useTheme } from '../../ThemeContext';



import AsyncStorage from '@react-native-async-storage/async-storage';

import { getProfileId } from './DashboardScreen';



// Use Backend_URL from .env

const BACKEND_URL = process.env.Backend_URL || 'http://localhost:5000';



const JobFeedScreen = ({ navigation }) => {

  const { loginId } = useLogin();

  const [jobs, setJobs] = useState([]);

  const [filteredJobs, setFilteredJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');

  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const styles = StyleSheet.create({

    outerContainer: {

      flex: 1,

      backgroundColor: theme.primary,

    },

    safeArea: {

      flex: 1,

      backgroundColor: theme.background,

    },

    header: {

      backgroundColor: theme.primary,

      paddingBottom: 20,

      paddingHorizontal: 20,

      elevation: 4,

      shadowColor: theme.shadowColor,

      shadowOffset: { width: 0, height: 4 },

      shadowOpacity: 0.2,

      shadowRadius: 4,

      borderBottomLeftRadius: 24,

      borderBottomRightRadius: 24,

      flexDirection: 'row',

      justifyContent: 'space-between',

      alignItems: 'center',

    },

    headerTitle: {

      color: theme.textLight,

      fontSize: 24,

      fontWeight: 'bold',

      marginBottom: 5,

    },

    headerSubtitle: {

      color: 'rgba(255, 255, 255, 0.85)',

      fontSize: 15,

    },

    notificationButton: {

      width: 42,

      height: 42,

      borderRadius: 21,

      backgroundColor: 'rgba(255, 255, 255, 0.2)',

      justifyContent: 'center',

      alignItems: 'center',

    },

    notificationBadge: {

      position: 'absolute',

      top: 8,

      right: 8,

      width: 8,

      height: 8,

      borderRadius: 4,

      backgroundColor: theme.accent,

      borderWidth: 1.5,

      borderColor: theme.primary,

    },

    searchContainer: {

      paddingHorizontal: 20,

      paddingVertical: 16,

      backgroundColor: theme.background,

    },

    searchInputContainer: {

      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor: theme.surface,

      borderRadius: 12,

      paddingHorizontal: 12,

      height: 50,

      elevation: 2,

      shadowColor: theme.cardShadow,

      shadowOffset: { width: 0, height: 2 },

      shadowOpacity: 0.1,

      shadowRadius: 3,

      borderWidth: 1,

      borderColor: theme.divider,

    },

    searchIcon: {

      marginRight: 8,

    },

    searchInput: {

      flex: 1,

      fontSize: 16,

      color: theme.textDark,

      height: '100%',

    },

    resultsHeader: {

      flexDirection: 'column',

      justifyContent: 'space-between',

      // alignItems: 'center',

      paddingHorizontal: 20,

      paddingVertical: 10,

      marginTop: 5,

    },

    resultsText: {

      fontSize: 16,

      fontWeight: 'bold',

      color: theme.textDark,

    },

    sortButton: {

      flexDirection: 'row',

      alignItems: 'center',

      paddingVertical: 6,

      paddingHorizontal: 12,

      backgroundColor: theme.surface,

      borderRadius: 16,

      borderWidth: 1,

      borderColor: theme.border,

    },

    sortText: {

      marginLeft: 4,

      color: theme.textMedium,

      fontSize: 14,

      fontWeight: '500',

    },

    listContent: {

      paddingHorizontal: 20,

      paddingBottom: 20,

    },

    loaderContainer: {

      flex: 1,

      justifyContent: 'center',

      alignItems: 'center',

      backgroundColor: theme.background,

    },

    loadingText: {

      marginTop: 16,

      fontSize: 16,

      color: theme.textMedium,

    },

    emptyContainer: {

      flex: 1,

      justifyContent: 'center',

      alignItems: 'center',

      paddingHorizontal: 40,

    },

    emptyTitle: {

      fontSize: 20,

      fontWeight: 'bold',

      color: theme.textDark,

      marginTop: 16,

      marginBottom: 8,

    },

    emptySubtitle: {

      fontSize: 16,

      color: theme.textMedium,

      textAlign: 'center',

      lineHeight: 22,

    },

  });



  // Get profile ID from context, fallback to hardcoded value

  const profileId = loginId?.profile_id || '6851040cd76f99883f82f90c';



  // console.log('JobFeedScreen - LoginId from context:', loginId);

  // console.log('JobFeedScreen - Using profileId:', profileId);



  useEffect(() => {

    setLoading(true);

    fetch(`https://futureguide-backend.onrender.com/api/jobs`)

      .then(res => res.json())

      .then(data => {

        console.log('JobFeedScreen - Raw API Response:', data);

        console.log('JobFeedScreen - Total jobs fetched:', data.length);



        // Log each job details

        data.data.forEach((job, index) => {

          console.log(`JobFeedScreen - Job ${index + 1}:`, 
            {

            id: job._id,

            title: job.jobTitle,

            company: job.companyName,

            location: job.location,

            type: job.jobType,

            isActive: job.isActive

          });

        });



        // Map API data to JobCard format

        const mappedJobs = data.data.map(job => ({

          id: job._id,

          jobId: job._id,

          title: job.jobTitle,

          company: job.companyName,

          location: job.location,

          type: job.jobType,

          salary: job.salaryRange,

          description: job.jobDescription,

          requirements: job.requirements || [],

          benefits: job.benefits || [],

          applicationDeadline: job.applicationDeadline,

          expirationDate: job.expirationDate,

          isActive: job.isActive,

          contactEmail: job.contactEmail,

          contactPhone: job.contactPhone,

          applicationlink: job.applicationlink,

          postedDate: job.postedDate,

        }));



        // console.log('JobFeedScreen - Mapped Jobs count:', mappedJobs.length);

        setJobs(mappedJobs);

        setFilteredJobs(mappedJobs);

        setLoading(false);

      })

      .catch(error => {

        console.error('JobFeedScreen - Error fetching jobs:', error);

        setLoading(false);

      });

  }, []);



  // Handle search functionality

  useEffect(() => {

    if (searchQuery.trim() === '') {

      setFilteredJobs(jobs);

    } else {

      const filtered = jobs.filter(job =>

        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||

        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||

        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||

        job.type.toLowerCase().includes(searchQuery.toLowerCase())

      );

      setFilteredJobs(filtered);

    }

  }, [searchQuery, jobs]);



  const handleJobPress = (job) => {

    console.log('JobFeedScreen - Job clicked:', {

      jobId: job.jobId,

      title: job.title,

      company: job.company,

      profileId: profileId

    });



    navigation.navigate('JobDetail', {

      jobId: job.jobId,

      profileId: profileId

    });

  };



  // console.log('Current jobs state:', jobs);

  // console.log('Current filteredJobs state:', filteredJobs);



  return (

    <View style={styles.outerContainer}>

      <StatusBar

        backgroundColor="transparent"

        barStyle="dark-content"

        translucent={true}

      />

      <SafeAreaView style={styles.safeArea}>

        {loading ? (

          <View style={styles.loaderContainer}>

            <ActivityIndicator size="large" color={theme.primary} />

            <Text style={styles.loadingText}>Loading jobs...</Text>

          </View>

        ) : (

          <>

            <View style={[styles.header, { paddingTop: insets.top || 16 }]}>

              <View>

                <Text style={styles.headerTitle}>Job Feed</Text>

                <Text style={styles.headerSubtitle}>Find your dream job</Text>

              </View>

              <TouchableOpacity style={styles.notificationButton}>

                <MaterialIcons name="notifications" size={24} color={theme.textLight} />

                <View style={styles.notificationBadge}></View>

              </TouchableOpacity>

            </View>



            <View style={styles.searchContainer}>

              <View style={styles.searchInputContainer}>

                <MaterialIcons name="search" size={22} color={theme.textMedium} style={styles.searchIcon} />

                <TextInput

                  style={styles.searchInput}

                  placeholder="Search jobs, companies..."

                  value={searchQuery}

                  onChangeText={setSearchQuery}

                  placeholderTextColor="#AAA"

                />

                {searchQuery.length > 0 && (

                  <TouchableOpacity onPress={() => setSearchQuery('')}>

                    <MaterialIcons name="clear" size={20} color={theme.textMedium} />

                  </TouchableOpacity>

                )}

              </View>

            </View>



            <View style={styles.resultsHeader}>

              <TouchableOpacity style={{ backgroundColor: theme.primary, display: "flex", flexDirection: "row", padding: 8, borderRadius: 10, gap: 5, width: 100, alignSelf: "flex-end" }}
                onPress={() => {
                  navigation.navigate("JobForm")
                }}
              >
                <Entypo name="circle-with-plus" size={24} color="white" />
                <Text style={{ color: theme.primaryLight }}>add jobs</Text>
              </TouchableOpacity>


              <View style={{
                display: "flex", flexDirection: "row", justifyContent: "space-between",
                alignItems: "center",
                padding: 10
              }}>


                <Text style={styles.resultsText}>

                  {filteredJobs.length} Result{filteredJobs.length !== 1 ? 's' : ''}

                </Text>
                <TouchableOpacity style={styles.sortButton}>

                  <MaterialIcons name="sort" size={18} color={theme.textMedium} />

                  <Text style={styles.sortText}>Sort</Text>

                </TouchableOpacity>
              </View>
            </View>



            {filteredJobs.length === 0 ? (

              <View style={styles.emptyContainer}>

                <MaterialIcons name="work-off" size={64} color={theme.textMedium} />

                <Text style={styles.emptyTitle}>No jobs found</Text>

                <Text style={styles.emptySubtitle}>

                  {searchQuery ? 'Try adjusting your search terms' : 'No jobs available at the moment'}

                </Text>

              </View>

            ) : (

              <FlatList

                data={filteredJobs}

                keyExtractor={(item) => item.id}

                renderItem={({ item }) => (

                  <JobCard

                    job={item}

                    onPress={() => handleJobPress(item)}

                  />

                )}

                contentContainerStyle={styles.listContent}

                showsVerticalScrollIndicator={false}

                removeClippedSubviews={false}

                initialNumToRender={10}

                maxToRenderPerBatch={10}

              />

            )}

          </>

        )}

      </SafeAreaView>

    </View>

  );

};
export default JobFeedScreen;

