import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, Dimensions, Alert } from 'react-native';
import Abcdemo from './Abcdemo';
import Meter from './Meter';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function ResumeDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  let data = route.params.data;
  console.log('ResumeDetail data:', data);
  // console.log(data.resumeEvaluation)
  data = data.resumeEvaluation;
  // Add error handling for missing data
  if (!data) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No resume data found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  // Safely handle categories data
  const categories = data.categories || {};
  const cards = Object.entries(categories);

  // Initialize animations based on actual cards length
  const animations = useRef(cards.map(() => new Animated.Value(-width))).current;

  useEffect(() => {
    if (cards.length > 0) {
      const animationsSequence = animations.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 0,
          duration: 500,
          delay: index * 10,
          useNativeDriver: true,
        })
      );
      Animated.stagger(200, animationsSequence).start();
    }
  }, [animations, cards.length]);

  // Safely handle overall scores with defaults
  const overallScores = data.overallScores || {};
  const resumeScore = overallScores.resumeScore || 0;
  const grammarScore = overallScores.grammarScore || 0;
  const contentScore = overallScores.contentScore || 0;
  const clarityScore = overallScores.clarityScore || 0;

  const handleDownload = () => {
    // Add your download functionality here
    Alert.alert('Download', 'Download functionality will be implemented here');
  };

  return (
    <View style={styles.detailsoverall}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.titlex}>Resume Score</Text>

        <Meter value={resumeScore} />

        <Abcdemo
          score1={grammarScore}
          score2={contentScore}
          score3={clarityScore}
        />

        {cards.map(([title, categoryData], index) => {
          // Safely handle category data
          const score = categoryData?.score || 0;
          const text = categoryData?.text || 'No description available';

          return (
            <Animated.View
              key={`${title}-${index}`} // Better key for React
              style={[
                styles.card,
                { transform: [{ translateX: animations[index] || new Animated.Value(0) }] }
              ]}
            >
              <View style={styles.heading}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.score}>{score}/100</Text>
              </View>
              <View style={styles.descriptionBox}>
                <Text style={styles.description}>{text}</Text>
              </View>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          icon="download"
          style={styles.submitButton}
          onPress={handleDownload}
        >
          Download Report
        </Button>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  detailsoverall: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  titlex: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  card: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  score: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004d40',
  },
  descriptionBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#004d40',
    paddingVertical: 8,
    borderRadius: 8,
  },
});