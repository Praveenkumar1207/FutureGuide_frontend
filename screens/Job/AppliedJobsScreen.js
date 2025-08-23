import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "../../constants/Colors";

import { useLogin } from "../../Login_id_passing";
import { useTheme } from "../../ThemeContext";
const AppliedJobItem = ({ job, onPress }) => {
  // Format the date to a more readable format

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      year: "numeric",

      month: "short",

      day: "numeric",

      hour: "2-digit",

      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return theme.warning;

      case "interview":
        return theme.info;

      case "accepted":
        return theme.success;

      case "rejected":
        return theme.error;

      default:
        return theme.secondary;
    }
  };
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
      backgroundColor: 'red',

      paddingBottom: 20,

      paddingHorizontal: 20,

      elevation: 4,

      shadowColor: theme.shadowColor,

      shadowOffset: { width: 0, height: 4 },

      shadowOpacity: 0.2,

      shadowRadius: 4,

      borderBottomLeftRadius: 24,

      borderBottomRightRadius: 24,

      flexDirection: "row",

      justifyContent: "space-between",

      alignItems: "center",
    },

    backButton: {
      width: 40,

      height: 40,

      justifyContent: "center",

      alignItems: "center",

      borderRadius: 20,

      backgroundColor: theme.buttonOverlay,
    },

    headerTitle: {
      color: theme.textLight,

      fontSize: 20,

      fontWeight: "bold",

      flex: 1,

      textAlign: "center",
    },

    headerRight: {
      width: 40,

      alignItems: "flex-end",
    },

    refreshButton: {
      width: 40,

      height: 40,

      justifyContent: "center",

      alignItems: "center",

      borderRadius: 20,

      backgroundColor: theme.buttonOverlay,
    },

    list: {
      flex: 1,

      backgroundColor: theme.background,
    },

    listContent: {
      padding: 16,
    },

    emptyListContent: {
      flex: 1,

      justifyContent: "center",
    },

    jobItem: {
      backgroundColor: theme.surface,

      borderRadius: 12,

      padding: 16,

      marginBottom: 12,

      elevation: 2,

      shadowColor: theme.cardShadow,

      shadowOffset: { width: 0, height: 2 },

      shadowOpacity: 0.1,

      shadowRadius: 3,

      borderWidth: 1,

      borderColor: theme.divider,
    },

    jobItemHeader: {
      flexDirection: "row",

      justifyContent: "space-between",

      alignItems: "flex-start",

      marginBottom: 12,
    },

    jobInfo: {
      flex: 1,

      marginRight: 12,
    },

    jobTitle: {
      fontSize: 16,

      fontWeight: "bold",

      color: theme.textDark,

      marginBottom: 4,
    },

    companyName: {
      fontSize: 14,

      color: theme.secondary,

      marginBottom: 6,
    },

    jobDetails: {
      flexDirection: "row",

      alignItems: "center",
    },

    locationText: {
      fontSize: 14,

      color: theme.textDark,

      marginLeft: 4,
    },

    statusContainer: {
      alignItems: "flex-end",
    },

    statusBadge: {
      paddingHorizontal: 8,

      paddingVertical: 4,

      borderRadius: 12,
    },

    statusText: {
      fontSize: 14,

      fontWeight: "600",

      color: theme.textDark,

      textTransform: "uppercase",
    },

    jobItemFooter: {
      flexDirection: "row",

      justifyContent: "space-between",

      alignItems: "center",

      paddingTop: 12,

      borderTopWidth: 1,

      borderTopColor: theme.divider,
    },

    dateContainer: {
      flexDirection: "row",

      alignItems: "center",

      flex: 1,
    },

    appliedTime: {
      fontSize: 12,

      color: theme.textDark,

      marginLeft: 4,

      margin: 10,
    },

    viewButton: {
      flexDirection: "row",

      alignItems: "center",

      paddingHorizontal: 8,

      paddingVertical: 4,
    },

    viewButtonText: {
      fontSize: 12,

      color: theme.primary,

      fontWeight: "600",

      marginRight: 4,
    },

    loadingContainer: {
      flex: 1,

      justifyContent: "center",

      alignItems: "center",

      padding: 20,
    },

    loadingText: {
      marginTop: 16,

      fontSize: 16,

      color: theme.textMedium,

      textAlign: "center",
    },

    emptyState: {
      flex: 1,

      justifyContent: "center",

      alignItems: "center",

      padding: 40,
    },

    emptyStateText: {
      fontSize: 18,

      fontWeight: "bold",

      color: theme.textDark,

      textAlign: "center",

      marginTop: 16,

      marginBottom: 8,
    },

    emptyStateSubText: {
      fontSize: 14,

      color: theme.textMedium,

      textAlign: "center",

      marginBottom: 24,
    },

    exploreButton: {
      backgroundColor: theme.primary,

      paddingHorizontal: 24,

      paddingVertical: 12,

      borderRadius: 8,
    },

    exploreButtonText: {
      color: theme.textLight,

      fontSize: 16,

      fontWeight: "bold",
    },

    errorState: {
      flex: 1,

      justifyContent: "center",

      alignItems: "center",

      padding: 40,
    },

    errorText: {
      fontSize: 16,

      color: theme.textDark,

      textAlign: "center",

      marginTop: 16,

      marginBottom: 20,
    },

    retryButton: {
      backgroundColor: theme.primary,

      paddingHorizontal: 24,

      paddingVertical: 12,

      borderRadius: 8,
    },

    retryButtonText: {
      color: theme.textLight,

      fontSize: 16,

      fontWeight: "bold",
    },
  });

  return (
    <TouchableOpacity style={styles.jobItem} onPress={onPress}>
      <View style={styles.jobItemHeader}>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle} numberOfLines={1}>
            {job.jobTitle || "Unknown Position"}
          </Text>

          <Text style={styles.companyName} numberOfLines={1}>
            {job.companyName || "Unknown Company"}
          </Text>

          <View style={styles.jobDetails}>
            <MaterialIcons
              name="location-on"
              size={14}
              color={theme.textDark}
            />

            <Text style={styles.locationText}>{job.location || "Remote"}</Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(job.status) },
            ]}
          >
            <Text style={styles.statusText}>{job.status || "Applied"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.jobItemFooter}>
        <View style={styles.dateContainer}>
          <MaterialIcons name="schedule" size={14} color={theme.textDark} />

          <Text style={styles.appliedTime}>
            Applied: {formatDate(job.applicationDate || job.createdAt)}
          </Text>
        </View>

        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}> View Details</Text>

          <MaterialIcons
            name="chevron-right"
            size={16}
            color={theme.primary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const AppliedJobsScreen = ({ navigation, route }) => {
  const { loginId } = useLogin();

  const insets = useSafeAreaInsets();

  const [appliedJobs, setAppliedJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  // Get profile ID from context, with route params as secondary fallback, then hardcoded as final fallback

  const profileId =
    loginId?.profile_id ||
    route?.params?.profileId ||
    "685930d384b4ad17b6cd5e35";

  console.log("AppliedJobsScreen - LoginId from context:", loginId);

  console.log("AppliedJobsScreen - Route params:", route?.params);

  console.log("AppliedJobsScreen - Using profileId:", profileId);

  useEffect(() => {
    if (profileId) fetchAppliedJobs();
  }, [profileId]);

  const fetchAppliedJobs = async () => {
    try {
      setLoading(true);

      setError(null);

      console.log(
        "AppliedJobsScreen - Fetching applied jobs for profileId:",
        profileId
      );

      const response = await fetch(
        `https://futureguide-backend.onrender.com/api/applications/profile/${profileId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log("AppliedJobsScreen - Raw applied jobs response:", data);

      console.log(
        "AppliedJobsScreen - Total applied jobs fetched:",
        data.length
      );

      // Log each applied job details and check for duplicates

      const seenKeys = new Set();

      data.forEach((job, index) => {
        const potentialKey = job.jobId || job._id;

        if (seenKeys.has(potentialKey)) {
          console.warn(
            `AppliedJobsScreen - Duplicate key detected: ${potentialKey} at index ${index}`
          );
        }

        seenKeys.add(potentialKey);

        console.log(`AppliedJobsScreen - Applied Job ${index + 1}:`, {
          id: job._id,

          jobId: job.jobId,

          jobTitle: job.jobTitle,

          companyName: job.companyName,

          status: job.status,

          applicationDate: job.applicationDate || job.createdAt,

          uniqueKey: `${job.jobId || job._id}-${index}`,
        });
      });

      // Add unique IDs to each job for FlatList keyExtractor with guaranteed uniqueness

      const jobsWithIds = data.map((job, index) => ({
        ...job,

        id: `${job.jobId || job._id || "unknown"}-${index}-${Date.now()}`, // Ensure uniqueness with timestamp

        uniqueKey: `applied-job-${index}-${job._id || job.jobId || Date.now()}`, // Additional unique key

        status: job.status || "Applied",
      }));

      // Final check for duplicate keys

      const finalKeys = jobsWithIds.map((job) => job.id);

      const duplicateKeys = finalKeys.filter(
        (key, index) => finalKeys.indexOf(key) !== index
      );

      if (duplicateKeys.length > 0) {
        console.error(
          "AppliedJobsScreen - Still have duplicate keys after processing:",
          duplicateKeys
        );
      }

      console.log(
        "AppliedJobsScreen - Processed applied jobs count:",
        jobsWithIds.length
      );

      setAppliedJobs(jobsWithIds);
    } catch (err) {
      console.error("AppliedJobsScreen - Error fetching applied jobs:", err);

      setError("Failed to load applied jobs. Please try again.");

      Alert.alert(
        "Error",

        "Failed to load applied jobs. Please check your internet connection and try again.",

        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJobPress = (job) => {
    console.log("AppliedJobsScreen - Applied job clicked:", {
      jobId: job.jobId || job._id,

      jobTitle: job.jobTitle,

      companyName: job.companyName,

      profileId: profileId,
    });

    navigation.navigate("JobDetail", {
      jobId: job.jobId || job._id,

      profileId: profileId,
    });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcons name="work-off" size={64} color={theme.textMuted} />

      <Text style={styles.emptyStateText}>No Applied Jobs Found</Text>

      <Text style={styles.emptyStateSubText}>
        Start applying to jobs to see them here
      </Text>

      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate("Jobs")}
      >
        <Text style={styles.exploreButtonText}>Explore Jobs</Text>
      </TouchableOpacity>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorState}>
      <MaterialIcons name="error-outline" size={64} color={theme.error} />

      <Text style={styles.errorText}>{error}</Text>

      <TouchableOpacity style={styles.retryButton} onPress={fetchAppliedJobs}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
  const theme = useTheme().theme;
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

      flexDirection: "row",

      justifyContent: "space-between",

      alignItems: "center",
    },

    backButton: {
      width: 40,

      height: 40,

      justifyContent: "center",

      alignItems: "center",

      borderRadius: 20,

      backgroundColor: theme.buttonOverlay,
    },

    headerTitle: {
      color: theme.textLight,

      fontSize: 20,

      fontWeight: "bold",

      flex: 1,

      textAlign: "center",
    },

    headerRight: {
      width: 40,

      alignItems: "flex-end",
    },

    refreshButton: {
      width: 40,

      height: 40,

      justifyContent: "center",

      alignItems: "center",

      borderRadius: 20,

      backgroundColor: theme.buttonOverlay,
    },

    list: {
      flex: 1,

      backgroundColor: theme.background,
    },

    listContent: {
      padding: 16,
    },

    emptyListContent: {
      flex: 1,

      justifyContent: "center",
    },

    jobItem: {
      backgroundColor: theme.surface,

      borderRadius: 12,

      padding: 16,

      marginBottom: 12,

      elevation: 2,

      shadowColor: theme.cardShadow,

      shadowOffset: { width: 0, height: 2 },

      shadowOpacity: 0.1,

      shadowRadius: 3,

      borderWidth: 1,

      borderColor: theme.divider,
    },

    jobItemHeader: {
      flexDirection: "row",

      justifyContent: "space-between",

      alignItems: "flex-start",

      marginBottom: 12,
    },

    jobInfo: {
      flex: 1,

      marginRight: 12,
    },

    jobTitle: {
      fontSize: 16,

      fontWeight: "bold",

      color: theme.textDark,

      marginBottom: 4,
    },

    companyName: {
      fontSize: 14,

      color: theme.secondary,

      marginBottom: 6,
    },

    jobDetails: {
      flexDirection: "row",

      alignItems: "center",
    },

    locationText: {
      fontSize: 14,

      color: theme.textDark,

      marginLeft: 4,
    },

    statusContainer: {
      alignItems: "flex-end",
    },

    statusBadge: {
      paddingHorizontal: 8,

      paddingVertical: 4,

      borderRadius: 12,
    },

    statusText: {
      fontSize: 14,

      fontWeight: "600",

      color: theme.textDark,

      textTransform: "uppercase",
    },

    jobItemFooter: {
      flexDirection: "row",

      justifyContent: "space-between",

      alignItems: "center",

      paddingTop: 12,

      borderTopWidth: 1,

      borderTopColor: theme.divider,
    },

    dateContainer: {
      flexDirection: "row",

      alignItems: "center",

      flex: 1,
    },

    appliedTime: {
      fontSize: 12,

      color: theme.textDark,

      marginLeft: 4,

      margin: 10,
    },

    viewButton: {
      flexDirection: "row",

      alignItems: "center",

      paddingHorizontal: 8,

      paddingVertical: 4,
    },

    viewButtonText: {
      fontSize: 12,

      color: theme.primary,

      fontWeight: "600",

      marginRight: 4,
    },

    loadingContainer: {
      flex: 1,

      justifyContent: "center",

      alignItems: "center",

      padding: 20,
    },

    loadingText: {
      marginTop: 16,

      fontSize: 16,

      color: theme.textMedium,

      textAlign: "center",
    },

    emptyState: {
      flex: 1,

      justifyContent: "center",

      alignItems: "center",

      padding: 40,
    },

    emptyStateText: {
      fontSize: 18,

      fontWeight: "bold",

      color: theme.textDark,

      textAlign: "center",

      marginTop: 16,

      marginBottom: 8,
    },

    emptyStateSubText: {
      fontSize: 14,

      color: theme.textMedium,

      textAlign: "center",

      marginBottom: 24,
    },

    exploreButton: {
      backgroundColor: theme.primary,

      paddingHorizontal: 24,

      paddingVertical: 12,

      borderRadius: 8,
    },

    exploreButtonText: {
      color: theme.textLight,

      fontSize: 16,

      fontWeight: "bold",
    },

    errorState: {
      flex: 1,

      justifyContent: "center",

      alignItems: "center",

      padding: 40,
    },

    errorText: {
      fontSize: 16,

      color: theme.textDark,

      textAlign: "center",

      marginTop: 16,

      marginBottom: 20,
    },

    retryButton: {
      backgroundColor: theme.primary,

      paddingHorizontal: 24,

      paddingVertical: 12,

      borderRadius: 8,
    },

    retryButtonText: {
      color: theme.textLight,

      fontSize: 16,

      fontWeight: "bold",
    },
  });


  return (
    <View style={styles.outerContainer}>
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent={true}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { paddingTop: insets.top || 16 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={theme.textLight}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Applied Jobs</Text>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={fetchAppliedJobs}
            >
              <MaterialIcons
                name="refresh"
                size={24}
                color={theme.textLight}
              />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />

            <Text style={styles.loadingText}>Loading applied jobs...</Text>
          </View>
        ) : error ? (
          renderError()
        ) : (
          <FlatList
            data={appliedJobs}
            keyExtractor={(item, index) => {
              // Use multiple fallbacks to ensure uniqueness

              const key =
                item.id || item.uniqueKey || `fallback-${index}-${Date.now()}`;

              console.log(
                `AppliedJobsScreen - Using key for item ${index}:`,
                key
              );

              return key;
            }}
            renderItem={({ item }) => (
              <AppliedJobItem job={item} onPress={() => handleJobPress(item)} />
            )}
            contentContainerStyle={[
              styles.listContent,

              appliedJobs.length === 0 && styles.emptyListContent,
            ]}
            style={styles.list}
            ListEmptyComponent={renderEmptyState}
            refreshing={loading}
            onRefresh={fetchAppliedJobs}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            windowSize={10}
          />
        )}
      </SafeAreaView>
    </View>
  );
};


export default AppliedJobsScreen;
