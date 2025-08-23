import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Animated, Dimensions } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';



export default function JdDetail() {
  const route = useRoute();
  const analysisResult = route.params?.data?.data;

  const resumeAnim = useRef(new Animated.Value(0)).current;
  const linkedinAnim = useRef(new Animated.Value(0)).current;
  const overallAnim = useRef(new Animated.Value(0)).current;
  const eduAnime = useRef(new Animated.Value(0)).current;
  const domAnime = useRef(new Animated.Value(0)).current;
  const softAnime = useRef(new Animated.Value(0)).current;
  const gowAnime = useRef(new Animated.Value(0)).current;



  const getScore = (label) => {
    // console.log(analysisResult);
    const item = analysisResult.analysis.find(line => line.startsWith(label));
    return item ? parseInt(item.split(':')[1].split('/')[0].trim()) : 0;
  };

  const technicalSkillsScore = getScore("Technical Skills");
  const experienceScore = getScore("Experience");
  const educationScore = getScore("Education");
  const domainFitScore = getScore("Domain Fit");
  const softSkillsScore = getScore("Soft Skills");
  const growthPotentialScore = getScore("Growth Potential");

  const overallScore = analysisResult?.score || 0;
  const suggestions = analysisResult?.suggestions || [];



  useEffect(() => {
    Animated.timing(resumeAnim, {
      toValue: technicalSkillsScore / 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    Animated.timing(linkedinAnim, {
      toValue: experienceScore / 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    Animated.timing(overallAnim, {
      toValue: overallScore / 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    Animated.timing(eduAnime, {
      toValue: educationScore / 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    Animated.timing(domAnime, {
      toValue: domainFitScore / 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    Animated.timing(softAnime, {
      toValue: softSkillsScore / 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    Animated.timing(gowAnime, {
      toValue: growthPotentialScore / 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  // const renderImprovementList = (list) =>
  //   list.map((point, index) => (
  //     <Text key={index} style={styles.bullet}>• {point}</Text>
  //   ));

  const renderImprovementList = (suggestionsArray) => {
    const sentences = suggestionsArray
      .join(' ')
      .split('.')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    return sentences.map((sentence, index) => (
      <View key={index} style={{ flexDirection: 'row', marginBottom: 6 }}>
        <Text style={{ fontSize: 16, color: '#444' }}>{'\u2022'} </Text>
        <Text style={{ fontSize: 16, color: '#444', flex: 1 }}>{sentence}.</Text>
      </View>
    ));
  };

  return (
    <View style={styles.jdoveraall}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Resume & LinkedIn vs Job Description</Text>

        <Card style={styles.resultCard}>
          <Text style={styles.resultLabel}>
            Technicalskills Match: {technicalSkillsScore}%
          </Text>
          <Animated.View style={[styles.progress, {
            width: resumeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%']
            }), backgroundColor: '#00796b'
          }]} />



          <Text style={styles.resultLabel}>
            Experience Match: {experienceScore}%
          </Text>
          <Animated.View style={[styles.progress, {
            width: linkedinAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%']
            }), backgroundColor: '#0288d1'
          }]} />

          <Text style={styles.resultLabel}>
            Growth Potential Score: {growthPotentialScore}%
          </Text>
          <Animated.View style={[styles.progress, {
            width: overallAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%']
            }), backgroundColor: '#004d40'
          }]} />



          <Text style={styles.resultLabel}>
            Education Match: {educationScore}%
          </Text>
          <Animated.View style={[styles.progress, {
            width: eduAnime.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%']
            }), backgroundColor: '#00796b'
          }]} />

          <Text style={styles.resultLabel}>
            SoftSkillsScore: {softSkillsScore}%
          </Text>
          <Animated.View style={[styles.progress, {
            width: softAnime.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%']
            }), backgroundColor: '#0288d1'
          }]} />

          <Text style={styles.resultLabel}>
            Domain Fit: {domainFitScore}%
          </Text>
          <Animated.View style={[styles.progress, {
            width: domAnime.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%']
            }), backgroundColor: '#004d40'
          }]} />

          <Text style={styles.resultLabel}>
            <Text style={styles.resultLabeloverall}>Overall Match : </Text>
            (
            <Text style={styles.feedbackText}>
              {overallScore > 75 ? 'Good' : overallScore > 50 ? 'Average' : 'Bad'}
            </Text>
            )
          </Text>
          <View style={styles.circleContainer}>
            <Text style={styles.overallScore}>{overallScore}%</Text>
          </View>




        </Card>


        <Card style={styles.card}>
          <Card.Title
            title="Suggestions"
            titleStyle={styles.subheading}
          />
          <Card.Content>
            {renderImprovementList(suggestions)}
          </Card.Content>
        </Card>


      </ScrollView>

      {/* <Button
        mode="contained"
        icon="download"
        style={styles.submitButton}
      >
        Download
      </Button> */}
    </View>

  );
}
const screenWidth = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  jdoveraall:
  {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    // backgroundColor: '#e0f7fa',
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
    color: '#004d40',
  },
  subheading: {
    fontSize: 18,
    color: '#00796b',
  },
  resultCard: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginBottom: 20,
    elevation: 3,
  },
  resultLabel: {
    fontWeight: '600',
    marginVertical: 10,
    color: '#333',
  },
  progress: {
    height: 10,
    borderRadius: 5,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  bullet: {
    fontSize: 15,
    marginBottom: 6,
    color: '#444',
    lineHeight: 20,
  },
  // linkscroll: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center'
  // },
  loader: {
    width: screenWidth - 35,
    height: 150,
    marginBottom: 10,
    padding: 15,
    // backgroundColor: '#e3e3e3',s
    borderWidth: 2,
    borderColor: '#d3d3d3',
    overflow: 'hidden',
  },
  wrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
    alignItems: 'start',
    justifyContent: "start"
  },
  line1: {
    position: 'absolute',
    top: 11,
    // left: 58,
    width: 110,
    height: 14,
    backgroundColor: '#cacaca',
  },
  line2: {
    position: 'absolute',
    // top: 34,
    left: 8,
    width: 270,
    height: 10,
    backgroundColor: '#cacaca',
  },
  shimmerOverlay: {
    position: 'absolute',
    width: screenWidth * 1.5,
    height: '200%',
    top: 0,
    left: 0,
    opacity: 1,
    zIndex: 1,
  },

  submitButton: {
    marginTop: 30,
    padding: 5,
    backgroundColor: '#004d40',
    // backgroundColor:'skyblue',
  },

  circleContainer: {
    width: 80,
    height: 80,
    borderRadius: 60,
    backgroundColor: '#004d40',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 6, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  overallScore: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  feedbackText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#00796b',
    marginTop: 5,
    fontWeight: '600',
  },
  resultLabeloverall: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    // textAlign: 'center', 
  },
});
