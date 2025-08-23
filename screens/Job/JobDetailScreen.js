import React, { useState, useEffect } from 'react';

import {

  View,

  Text,

  StyleSheet,

  ScrollView,

  TouchableOpacity,

  SafeAreaView,

  StatusBar,

  ActivityIndicator,

  Alert,

  Linking

} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '../../constants/Colors';
import { useTheme } from '../../ThemeContext';

// Using custom checkbox implementation instead of external package



const BACKEND_URL = 'https://futureguide-backend.onrender.com';



const JobDetailScreen = ({ route, navigation }) => {
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

      paddingBottom: 16,

      paddingHorizontal: 20,

      flexDirection: 'row',

      alignItems: 'center',

      borderBottomLeftRadius: 24,

      borderBottomRightRadius: 24,

      elevation: 4,

      shadowColor: theme.shadowColor,

      shadowOffset: { width: 0, height: 4 },

      shadowOpacity: 0.2,

      shadowRadius: 4,

    },

    backButton: {

      marginRight: 12,

    },

    headerTitle: {

      color: theme.textLight,

      fontSize: 20,

      fontWeight: 'bold',

      flex: 1,

    },

    container: {

      flex: 1,

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

    errorContainer: {

      flex: 1,

      justifyContent: 'center',

      alignItems: 'center',

      paddingHorizontal: 40,

    },

    errorTitle: {

      fontSize: 20,

      fontWeight: 'bold',

      color: theme.textDark,

      marginTop: 16,

      marginBottom: 8,

    },

    errorMessage: {

      fontSize: 16,

      color: theme.textMedium,

      textAlign: 'center',

      lineHeight: 22,

      marginBottom: 24,

    },

    retryButton: {

      backgroundColor: theme.primary,

      paddingVertical: 12,

      paddingHorizontal: 24,

      borderRadius: 8,

    },

    retryButtonText: {

      color: '#fff',

      fontSize: 16,

      fontWeight: '600',

    },

    statusBanner: {

      backgroundColor: '#f44336',

      flexDirection: 'row',

      alignItems: 'center',

      paddingVertical: 12,

      paddingHorizontal: 16,

      marginHorizontal: 16,

      marginTop: 16,

      borderRadius: 8,

    },

    statusBannerText: {

      color: '#fff',

      fontSize: 14,

      fontWeight: '600',

      marginLeft: 8,

      flex: 1,

    },

    infoCard: {

      backgroundColor: theme.surface,

      borderRadius: 12,

      padding: 20,

      margin: 16,

      elevation: 2,

      shadowColor: theme.cardShadow,

      shadowOffset: { width: 0, height: 2 },

      shadowOpacity: 0.1,

      shadowRadius: 3,

    },

    sectionCard: {

      backgroundColor: theme.surface,

      borderRadius: 12,

      padding: 20,

      marginHorizontal: 16,

      marginBottom: 16,

      elevation: 2,

      shadowColor: theme.cardShadow,

      shadowOffset: { width: 0, height: 2 },

      shadowOpacity: 0.1,

      shadowRadius: 3,

    },

    title: {

      fontSize: 24,

      fontWeight: 'bold',

      color: theme.textDark,

      marginBottom: 16,

    },

    detailRow: {

      flexDirection: 'row',

      alignItems: 'center',

      marginBottom: 12,

    },

    detailText: {

      fontSize: 16,

      color: theme.textDark,

      marginLeft: 12,

      flex: 1,

    },

    sectionTitle: {

      fontSize: 18,

      fontWeight: 'bold',

      color: theme.textDark,

      marginBottom: 16,

    },

    description: {

      fontSize: 15,

      lineHeight: 22,

      color: theme.textDark,

    },

    listItem: {

      flexDirection: 'row',

      alignItems: 'flex-start',

      marginBottom: 8,

    },

    listItemText: {

      fontSize: 15,

      color: theme.textDark,

      marginLeft: 8,

      flex: 1,

      lineHeight: 20,

    },

    dateRow: {

      flexDirection: 'row',

      alignItems: 'center',

      marginBottom: 12,

    },

    dateInfo: {

      marginLeft: 12,

      flex: 1,

    },

    dateLabel: {

      fontSize: 14,

      color: theme.textMedium,

      marginBottom: 2,

    },

    dateValue: {

      fontSize: 15,

      color: theme.textDark,

      fontWeight: '500',

    },

    expiredDate: {

      color: '#f44336',

    },

    contactRow: {

      flexDirection: 'row',

      alignItems: 'center',

      marginBottom: 12,

      paddingVertical: 4,

    },

    contactText: {

      fontSize: 15,

      color: theme.textDark,

      marginLeft: 12,

    },

    linkText: {

      color: theme.primary,

      textDecorationLine: 'underline',

    },

    bottomSpacing: {

      height: 20,

    },

    footer: {

      padding: 16,

      backgroundColor: theme.surface,

      borderTopWidth: 1,

      borderTopColor: theme.divider,

      elevation: 8,

      shadowColor: theme.shadowColor,

      shadowOffset: { width: 0, height: -2 },

      shadowOpacity: 0.1,

      shadowRadius: 4,

    },

    checkboxContainer: {

      marginBottom: 12,

      alignItems: 'flex-start',

    },

    checkboxRow: {

      flexDirection: 'row',

      alignItems: 'center',

      paddingVertical: 8,

    },

    checkbox: {

      width: 20,

      height: 20,

      borderWidth: 2,

      borderColor: theme.primary,

      borderRadius: 4,

      marginRight: 12,

      alignItems: 'center',

      justifyContent: 'center',

      backgroundColor: 'transparent',

    },

    checkboxChecked: {

      backgroundColor: theme.primary,

    },

    checkboxText: {

      fontSize: 16,

      color: theme.textDark,

      flex: 1,

    },

    saveButton: {

      backgroundColor: theme.accent,

      borderRadius: 8,

      paddingVertical: 8,

      paddingHorizontal: 16,

      flexDirection: 'row',

      alignItems: 'center',

      marginTop: 8,

      alignSelf: 'flex-start',

    },

    saveButtonText: {

      color: '#fff',

      fontSize: 14,

      fontWeight: '600',

      marginLeft: 4,

    },

    applyButton: {

      backgroundColor: theme.primary,

      borderRadius: 12,

      paddingVertical: 16,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent: 'center',

      elevation: 2,

      shadowColor: theme.primary,

      shadowOffset: { width: 0, height: 2 },

      shadowOpacity: 0.3,

      shadowRadius: 4,

    },

    disabledButton: {

      backgroundColor: theme.textMedium,

      elevation: 0,

      shadowOpacity: 0,

    },

    buttonIcon: {

      marginRight: 8,

    },

    applyButtonText: {

      color: '#fff',

      fontSize: 18,

      fontWeight: 'bold',

    },

  });

  const { jobId, profileId: routeProfileId } = route.params;



  // Use local state for profileId with fallback

  const [profileId] = useState(routeProfileId || "685aeb6a19f894868af4fe22");



  console.log('JobDetailScreen - Received parameters:', {

    jobId: jobId,

    routeProfileId: routeProfileId,

    finalProfileId: profileId

  });



  const [jobDetails, setJobDetails] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [isChecked, setIsChecked] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const insets = useSafeAreaInsets();



  useEffect(() => {

    fetchJobDetails();

  }, [jobId]);



  const fetchJobDetails = async () => {

    try {

      setLoading(true);

      setError(null);



      console.log('JobDetailScreen - Fetching job details for ID:', jobId);

      console.log('JobDetailScreen - Using profile ID:', profileId);



      const response = await fetch(`${BACKEND_URL}/api/jobs/${jobId}`);



      if (!response.ok) {

        throw new Error(`HTTP error! status: ${response.status}`);

      }



      const data = await response.json();

      console.log('JobDetailScreen - Job details fetched:', {

        jobId: data._id,

        title: data.jobTitle,

        company: data.companyName,

        isActive: data.isActive,

        fullData: data

      });

      // console.log(data.data.isActive);
      setJobDetails(data.data);

    } catch (error) {

      console.error('JobDetailScreen - Error fetching job details:', error);

      setError(error.message);

    } finally {

      setLoading(false);

    }

  };



  const saveJobToProfile = async () => {

    if (!isChecked) {

      Alert.alert('Error', 'Please check the save job checkbox first');

      return;

    }



    try {

      setIsSaving(true);



      const requestBody = {

        jobId: jobId,

        profileId: profileId

      };



      console.log('Saving job to profile:', requestBody);



      const response = await fetch(`${BACKEND_URL}/api/applications`, {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

        },

        body: JSON.stringify(requestBody)

      });



      if (!response.ok) {

        const errorData = await response.json();

        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);

      }



      const result = await response.json();

      console.log('Job saved successfully:', result);



      Alert.alert(

        'Success',

        'Job has been saved to your profile!',

        [{ text: 'OK', onPress: () => console.log('Job saved confirmation') }]

      );



    } catch (error) {

      console.error('Error saving job:', error);

      Alert.alert('Error', `Failed to save job: ${error.message}`);

    } finally {

      setIsSaving(false);

    }

  };



  const formatDate = (dateString) => {

    if (!dateString) return 'Not specified';

    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {

      year: 'numeric',

      month: 'long',

      day: 'numeric'

    });

  };



  const getDaysUntilDeadline = (dateString) => {

    if (!dateString) return null;

    const deadline = new Date(dateString);

    const today = new Date();

    const timeDiff = deadline.getTime() - today.getTime();

    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysDiff;

  };



  const handleApplyNow = () => {

    if (jobDetails?.applicationlink) {

      Linking.openURL(jobDetails.applicationlink).catch(() => {

        Alert.alert('Error', 'Unable to open application link');

      });

    } else if (jobDetails?.contactEmail) {

      const emailUrl = `mailto:${jobDetails.contactEmail}?subject=Application for ${jobDetails.jobTitle}`;

      Linking.openURL(emailUrl).catch(() => {

        Alert.alert('Error', 'Unable to open email client');

      });

    } else {

      Alert.alert('Contact Information', 'No application method available for this job.');

    }

  };



  const handleContactPhone = () => {

    if (jobDetails?.contactPhone) {

      const phoneUrl = `tel:${jobDetails.contactPhone}`;

      Linking.openURL(phoneUrl).catch(() => {

        Alert.alert('Error', 'Unable to make phone call');

      });

    }

  };



  if (loading) {

    return (

      <View style={styles.outerContainer}>

        <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} />

        <SafeAreaView style={styles.safeArea}>

          <View style={[styles.header, { paddingTop: insets.top || 16 }]}>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>

              <MaterialIcons name="arrow-back" size={24} color="red" />

            </TouchableOpacity>

            <Text style={styles.headerTitle}>Job Details</Text>

          </View>

          <View style={styles.loaderContainer}>

            <ActivityIndicator size="large" color={theme.primary} />

            <Text style={styles.loadingText}>Loading job details...</Text>

          </View>

        </SafeAreaView>

      </View>

    );

  }



  if (error) {

    return (

      <View style={styles.outerContainer}>

        <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} />

        <SafeAreaView style={styles.safeArea}>

          <View style={[styles.header, { paddingTop: insets.top || 16 }]}>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>

              <MaterialIcons name="arrow-back" size={24} color={theme.textLight} />

            </TouchableOpacity>

            <Text style={styles.headerTitle}>Job Details</Text>

          </View>

          <View style={styles.errorContainer}>

            <MaterialIcons name="error-outline" size={64} color={theme.textMedium} />

            <Text style={styles.errorTitle}>Failed to load job details</Text>

            <Text style={styles.errorMessage}>{error}</Text>

            <TouchableOpacity style={styles.retryButton} onPress={fetchJobDetails}>

              <Text style={styles.retryButtonText}>Retry</Text>

            </TouchableOpacity>

          </View>

        </SafeAreaView>

      </View>

    );

  }



  if (!jobDetails) {

    return (

      <View style={styles.outerContainer}>

        <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} />

        <SafeAreaView style={styles.safeArea}>

          <View style={[styles.header, { paddingTop: insets.top || 16 }]}>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>

              <MaterialIcons name="arrow-back" size={24} color={theme.textLight} />

            </TouchableOpacity>

            <Text style={styles.headerTitle}>Job Details</Text>

          </View>

          <View style={styles.errorContainer}>

            <MaterialIcons name="work-off" size={64} color={theme.textMedium} />

            <Text style={styles.errorTitle}>Job not found</Text>

            <Text style={styles.errorMessage}>This job may have been removed or expired.</Text>

          </View>

        </SafeAreaView>

      </View>

    );

  }



  const daysUntilDeadline = getDaysUntilDeadline(jobDetails.applicationDeadline);

  const isExpiringSoon = daysUntilDeadline !== null && daysUntilDeadline <= 7 && daysUntilDeadline > 0;

  const isExpired = daysUntilDeadline !== null && daysUntilDeadline < 0;



  return (

    <View style={styles.outerContainer}>

      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} />

      <SafeAreaView style={styles.safeArea}>

        <View style={[styles.header, { paddingTop: insets.top || 16 }]}>

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>

            <MaterialIcons name="arrow-back" size={24} color={theme.textLight} />

          </TouchableOpacity>

          <Text style={styles.headerTitle} numberOfLines={1}>

            {jobDetails.jobTitle}

          </Text>

        </View>



        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          {/* Job Status Banner */}

          {!jobDetails.isActive && (

            <View style={styles.statusBanner}>

              <MaterialIcons name="warning" size={20} color="#fff" />

              <Text style={styles.statusBannerText}>This job is no longer active</Text>

            </View>

          )}



          {isExpiringSoon && (

            <View style={[styles.statusBanner, { backgroundColor: '#ff9800' }]}>

              <MaterialIcons name="schedule" size={20} color="#fff" />

              <Text style={styles.statusBannerText}>

                Application deadline in {daysUntilDeadline} day{daysUntilDeadline !== 1 ? 's' : ''}

              </Text>

            </View>

          )}



          {isExpired && (

            <View style={[styles.statusBanner, { backgroundColor: '#f44336' }]}>

              <MaterialIcons name="event-busy" size={20} color="#fff" />

              <Text style={styles.statusBannerText}>Application deadline has passed</Text>

            </View>

          )}



          {/* Main Job Info Card */}

          <View style={styles.infoCard}>

            <Text style={styles.title}>{jobDetails.jobTitle}</Text>



            <View style={styles.detailRow}>

              <MaterialIcons name="business" size={18} color={theme.primary} />

              <Text style={styles.detailText}>{jobDetails.companyName}</Text>

            </View>



            <View style={styles.detailRow}>

              <MaterialIcons name="location-on" size={18} color={theme.primary} />

              <Text style={styles.detailText}>{jobDetails.location}</Text>

            </View>



            <View style={styles.detailRow}>

              <MaterialIcons name="work" size={18} color={theme.primary} />

              <Text style={styles.detailText}>{jobDetails.jobType}</Text>

            </View>



            <View style={styles.detailRow}>

              <MaterialIcons name="attach-money" size={18} color={theme.primary} />

              <Text style={styles.detailText}>{jobDetails.salaryRange}</Text>

            </View>

          </View>



          {/* Job Description */}

          <View style={styles.sectionCard}>

            <Text style={styles.sectionTitle}>Job Description</Text>

            <Text style={styles.description}>{jobDetails.jobDescription}</Text>

          </View>



          {/* Requirements */}

          {jobDetails.requirements && jobDetails.requirements.length > 0 && (

            <View style={styles.sectionCard}>

              <Text style={styles.sectionTitle}>Requirements</Text>

              {jobDetails.requirements.map((requirement, index) => (

                <View key={index} style={styles.listItem}>

                  <MaterialIcons name="check-circle" size={16} color={theme.primary} />

                  <Text style={styles.listItemText}>{requirement}</Text>

                </View>

              ))}

            </View>

          )}



          {/* Benefits */}

          {jobDetails.benefits && jobDetails.benefits.length > 0 && (

            <View style={styles.sectionCard}>

              <Text style={styles.sectionTitle}>Benefits</Text>

              {jobDetails.benefits.map((benefit, index) => (

                <View key={index} style={styles.listItem}>

                  <MaterialIcons name="star" size={16} color={theme.accent} />

                  <Text style={styles.listItemText}>{benefit}</Text>

                </View>

              ))}

            </View>

          )}



          {/* Important Dates */}

          <View style={styles.sectionCard}>

            <Text style={styles.sectionTitle}>Important Dates</Text>



            <View style={styles.dateRow}>

              <MaterialIcons name="event" size={18} color={theme.textMedium} />

              <View style={styles.dateInfo}>

                <Text style={styles.dateLabel}>Posted Date</Text>

                <Text style={styles.dateValue}>{formatDate(jobDetails.postedDate)}</Text>

              </View>

            </View>



            <View style={styles.dateRow}>

              <MaterialIcons name="event-available" size={18} color={theme.textMedium} />

              <View style={styles.dateInfo}>

                <Text style={styles.dateLabel}>Application Deadline</Text>

                <Text style={[styles.dateValue, isExpired && styles.expiredDate]}>

                  {formatDate(jobDetails.applicationDeadline)}

                </Text>

              </View>

            </View>



            <View style={styles.dateRow}>

              <MaterialIcons name="event-busy" size={18} color={theme.textMedium} />

              <View style={styles.dateInfo}>

                <Text style={styles.dateLabel}>Job Expiration</Text>

                <Text style={styles.dateValue}>{formatDate(jobDetails.expirationDate)}</Text>

              </View>

            </View>

          </View>



          {/* Contact Information */}

          <View style={styles.sectionCard}>

            <Text style={styles.sectionTitle}>Contact Information</Text>



            {jobDetails.contactEmail && (

              <TouchableOpacity

                style={styles.contactRow}

                onPress={() => Linking.openURL(`mailto:${jobDetails.contactEmail}`)}

              >

                <MaterialIcons name="email" size={18} color={theme.primary} />

                <Text style={[styles.contactText, styles.linkText]}>{jobDetails.contactEmail}</Text>

              </TouchableOpacity>

            )}



            {jobDetails.contactPhone && (

              <TouchableOpacity style={styles.contactRow} onPress={handleContactPhone}>

                <MaterialIcons name="phone" size={18} color={theme.primary} />

                <Text style={[styles.contactText, styles.linkText]}>{jobDetails.contactPhone}</Text>

              </TouchableOpacity>

            )}

          </View>



          <View style={styles.bottomSpacing} />

        </ScrollView>



        {/* Apply Button Footer */}

        <View style={styles.footer}>

          {/* Save Job Checkbox */}

          <View style={styles.checkboxContainer}>

            <TouchableOpacity

              style={styles.checkboxRow}

              onPress={() => setIsChecked(!isChecked)}

              activeOpacity={0.7}

            >

              <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>

                {isChecked && (

                  <MaterialIcons name="check" size={16} color="#fff" />

                )}

              </View>

              <Text style={styles.checkboxText}>Save this job to my profile</Text>

            </TouchableOpacity>



            {isChecked && (

              <TouchableOpacity

                style={styles.saveButton}

                onPress={saveJobToProfile}

                disabled={isSaving}

              >

                {isSaving ? (

                  <ActivityIndicator size="small" color="#fff" />

                ) : (

                  <>

                    <MaterialIcons name="bookmark" size={16} color="#fff" />

                    <Text style={styles.saveButtonText}>Save Job</Text>

                  </>

                )}

              </TouchableOpacity>

            )}

          </View>



          <TouchableOpacity

            style={[

              styles.applyButton,

              (isExpired || !jobDetails.isActive) && styles.disabledButton

            ]}

            onPress={handleApplyNow}

            disabled={isExpired || !jobDetails.isActive}

          >

            <MaterialIcons

              name={jobDetails.applicationlink ? "launch" : "email"}

              size={20}

              color="#fff"

              style={styles.buttonIcon}

            />

            <Text style={styles.applyButtonText}>

              {isExpired ? 'Application Closed' :

                !jobDetails.isActive ? 'Job Inactive' : 'Apply Now'}

            </Text>

          </TouchableOpacity>

        </View>

      </SafeAreaView>

    </View>

  );

};







export default JobDetailScreen;

