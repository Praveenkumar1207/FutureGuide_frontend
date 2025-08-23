import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { useTheme } from '../ThemeContext';

const CompanyLogo = ({ company }) => {
  // Generate a placeholder logo with company initial
  const initial = company.charAt(0).toUpperCase();
  const logoColors = [
    '#4285F4', '#EA4335', '#FBBC05', '#34A853',
    '#FF6D01', '#2AB04E', '#9C27B0', '#1DA1F2'
  ];

  // Use company name to consistently select a color
  const colorIndex = company.length % logoColors.length;
  const { theme } = useTheme()
  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 18,
      marginVertical: 10,
      elevation: 3,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      borderWidth: 1,
      borderColor: theme.divider,
    },
    topRow: {
      flexDirection: 'row',
      marginBottom: 14,
    },
    headerContent: {
      flex: 1,
      marginLeft: 14,
      justifyContent: 'center',
    },
    logoContainer: {
      width: 50,
      height: 50,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoText: {
      color: theme.textLight,
      fontSize: 24,
      fontWeight: 'bold',
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textDark,
      marginBottom: 4,
    },
    company: {
      fontSize: 15,
      color: theme.textMedium,
      fontWeight: '500',
    },
    detailsContainer: {
      marginBottom: 16,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    detailText: {
      fontSize: 14,
      color: theme.textMedium,
      marginLeft: 8,
      fontWeight: '400',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 6,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.divider,
    },
    tagContainer: {
      flexDirection: 'row',
    },
    tag: {
      backgroundColor: theme.primaryLight,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 25,
      marginRight: 8,
    },
    tagText: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: '600',
    },
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    timeText: {
      fontSize: 12,
      color: theme.textMedium,
      marginLeft: 4,
      fontWeight: '500',
    },
  });

  return (
    <View style={[styles.logoContainer, { backgroundColor: logoColors[colorIndex] }]}>
      <Text style={styles.logoText}>{initial}</Text>
    </View>
  );
};

const JobCard = ({ job, onPress }) => {

  // Calculate how recent the job is
  const postedDaysAgo = Math.floor(Math.random() * 7) + 1; // Mock data (1-7 days)
  const { theme } = useTheme()
  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 18,
      marginVertical: 10,
      elevation: 3,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      borderWidth: 1,
      borderColor: theme.divider,
    },
    topRow: {
      flexDirection: 'row',
      marginBottom: 14,
    },
    headerContent: {
      flex: 1,
      marginLeft: 14,
      justifyContent: 'center',
    },
    logoContainer: {
      width: 50,
      height: 50,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoText: {
      color: theme.textLight,
      fontSize: 24,
      fontWeight: 'bold',
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textDark,
      marginBottom: 4,
    },
    company: {
      fontSize: 15,
      color: theme.textMedium,
      fontWeight: '500',
    },
    detailsContainer: {
      marginBottom: 16,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    detailText: {
      fontSize: 14,
      color: theme.textMedium,
      marginLeft: 8,
      fontWeight: '400',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 6,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.divider,
    },
    tagContainer: {
      flexDirection: 'row',
    },
    tag: {
      backgroundColor: theme.primaryLight,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 25,
      marginRight: 8,
    },
    tagText: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: '600',
    },
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    timeText: {
      fontSize: 12,
      color: theme.textMedium,
      marginLeft: 4,
      fontWeight: '500',
    },
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.96}>
      <View style={styles.topRow}>
        <CompanyLogo company={job.company} />
        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={1}>{job.title}</Text>
          <Text style={styles.company}>{job.company}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <MaterialIcons name="location-on" size={16} color={theme.textMedium} />
          <Text style={styles.detailText}>{job.location}</Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialIcons name="work" size={16} color={theme.textMedium} />
          <Text style={styles.detailText}>{job.type}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.tagContainer}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>React Native</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Mobile</Text>
          </View>
        </View>

        <View style={styles.timeContainer}>
          <MaterialIcons name="access-time" size={14} color={theme.textMedium} />
          <Text style={styles.timeText}>{postedDaysAgo}d ago</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};



export default JobCard;
