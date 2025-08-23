import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return Colors.statusAccepted;
      case 'rejected':
        return Colors.statusRejected;
      case 'pending':
      default:
        return Colors.statusPending;
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getStatusColor() }]}>
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: Colors.textLight,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});

export default StatusBadge;
