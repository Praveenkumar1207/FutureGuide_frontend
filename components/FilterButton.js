import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const FilterButton = ({ title, active, onPress, icon }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button,
        active && styles.activeButton
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon && (
        <MaterialIcons 
          name={icon} 
          size={16} 
          color={active ? Colors.accent : Colors.textMedium} 
          style={styles.icon}
        />
      )}
      <Text style={[
        styles.buttonText,
        active && styles.activeButtonText
      ]}>
        {title}
      </Text>
      {active && (
        <View style={styles.activeDot} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  activeButton: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  buttonText: {
    color: Colors.textMedium,
    fontWeight: '600',
    fontSize: 14,
  },
  activeButtonText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  icon: {
    marginRight: 6,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
    position: 'absolute',
    top: -2,
    right: -2,
  }
});

export default FilterButton;
