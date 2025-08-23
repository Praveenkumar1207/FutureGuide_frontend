import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
  Alert,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useTheme } from '../../ThemeContext';

export default function QuestionsPage({ route, navigation }) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      padding: 24,
      flex: 1,
      backgroundColor: '#fafafa',
    },
    userInfo: {
      borderRadius: 10,
      marginBottom: 10,
    },
    infoText: {
      fontSize: 20,
      color: '#333',
      marginBottom: 4,
      textAlign: 'center',
      fontWeight: '600',
    },
    infoText1: {
      fontSize: 19,
      color: '#333',
      marginBottom: 4,
      textAlign: 'right',
      fontWeight: 'bold', // Fixed: was '1000'
    },
    timer: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: "right"
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 20,
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      marginBottom: 20,
    },
    questionHeader: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 10,
      color: theme.primary,
    },
    questionText: {
      fontSize: 17,
      color: '#444',
      lineHeight: 24,
      marginBottom: 16,
    },
    input: {
      backgroundColor: '#fff',
      fontSize: 16,
      borderRadius: 10,
      paddingTop: 16,
      paddingBottom: 16,
      textAlignVertical: 'top',
      marginBottom: 20,
    },
    button: {
      borderRadius: 10,
      backgroundColor: theme.primary,
    },
    micContainer: { // Fixed: renamed from centered to avoid conflict
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 80,
    },
    micWrapper: {
      marginHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    micButton: {
      backgroundColor: theme.primary,
      padding: 18,
      borderRadius: 50,
      elevation: 4,
      position: 'relative',
    },
    glowCircle: {
      position: 'absolute',
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: theme.primary,
      zIndex: -1,
    },
    linesContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: 30,
    },
    line: {
      width: 4,
      backgroundColor: theme.primary,
      borderRadius: 2,
      marginHorizontal: 3,
    },
  });
  const { selectedTechs, level, question, description, interviewType } = route.params;
  const profileId = "685a974c5d0224c11838f09a"; // Use consistent profileId
  const micScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const lines = Array.from({ length: 5 });
  const animations = useRef(lines.map(() => new Animated.Value(1))).current;

  const [isRecording, setIsRecording] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState([]); // Fixed: was allAnswers
  const [timeLeft, setTimeLeft] = useState(question * 60);
  const [interviewId, setInterviewId] = useState(null); // Store interview ID
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const payload = {
          profileId: profileId,
          interviewType: interviewType,
          topics: selectedTechs,
          description: description,
          noofQuestions: question,
          domainKnowledge: level,
          englishProficiency: "Intermediate" // Added missing field
        };

        // console.log('Payload:', payload);

        const response = await axios.post(
          'https://futureguide-backend.onrender.com/api/interview-prep/generate',
          payload
        );

        // console.log('Response:', response.data);

        // Store the interview ID for later use
        setInterviewId(response.data.id);

        // Set questions from response
        const rawQuestions = response.data.data.questions;
        setQuestions(rawQuestions);
        setCurrentIndex(0);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
        Alert.alert("Error", "Failed to load questions. Please try again.");
        setQuestions([]);
        setLoading(false);
      }
    };

    fetchQuestions();

    // Timer logic
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          onFinish(); // Finish when time reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  const isDanger = timeLeft <= 2 * 60;

  const onFinish = async () => {
    // Auto-submit when time runs out
    if (answers.length > 0) {
      await handleFinalSubmission(answers);
    } else {
      Alert.alert("Time's Up!", "Interview time has ended.");
      navigation.goBack();
    }
  };

  const animateMic = () => {
    Animated.sequence([
      Animated.timing(micScale, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(micScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateGlow = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, { // Fixed: was micScale
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, { // Fixed: was micScale
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopGlow = () => {
    glowOpacity.stopAnimation();
    glowOpacity.setValue(0);
  };

  const animateLines = () => {
    const animationsList = animations.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.6,
            duration: 300 + i * 50,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 0.4,
            duration: 300 + i * 50,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ])
      )
    );
    Animated.parallel(animationsList).start();
  };

  const stopLines = () => {
    animations.forEach(anim => anim.stopAnimation());
    animations.forEach(anim => anim.setValue(1));
  };

  const handleMicPress = () => {
    animateMic();
    if (!isRecording) {
      setIsRecording(true);
      animateLines();
      animateGlow();
    } else {
      setIsRecording(false);
      stopLines();
      stopGlow();
    }
  };

  const handleSendAnswer = async () => {
    if (!answer.trim()) {
      Alert.alert("Error", "Please provide an answer before proceeding.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create current answer object
      const currentAnswer = {
        questionIndex: currentIndex,
        answer: answer.trim(),
      };

      // Stop recording animations
      stopLines();
      stopGlow();
      setIsRecording(false);

      // If it's the last question, submit all answers
      if (currentIndex === questions.length - 1) {
        const finalAnswers = [...answers, currentAnswer];
        await handleFinalSubmission(finalAnswers);
      } else {
        // Add to answers array and move to next question
        setAnswers(prev => [...prev, currentAnswer]);
        setCurrentIndex(currentIndex + 1);
        setAnswer('');
      }
    } catch (err) {
      // console.error("Error saving answer:", err);
      Alert.alert("Error", "Failed to save answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmission = async (finalAnswers) => {
    if (!interviewId) {
      Alert.alert("Error", "Interview ID not found. Please restart the interview.");
      return;
    }

    try {
      const payload = {
        answers: finalAnswers,
      };

      // console.log(payload);

      const response = await axios.post(
        `https://futureguide-backend.onrender.com/api/interview-prep/${interviewId}/analyze`,
        payload
      );
      if (navigation) {
        navigation.navigate('Result', {
          analysis: response.data.analysis,
          answeredQuestions: response.data.answeredQuestions,
          totalQuestions: response.data.totalQuestions,
        });
      }
      // console.log(response.data);
      Alert.alert("Success", "Answers submitted successfully!");

      // Navigate to results screen

    } catch (err) {
      // console.error("❌ Submission failed:", err);
      Alert.alert("Error", "Failed to submit answers. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={{ marginTop: 16, fontSize: 16 }}>
          Fetching questions... Preparing for interview...
        </Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontSize: 18, color: '#666' }}>
          No questions available. Please try again.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={{ marginTop: 20 }}
        >
          Go Back
        </Button>
      </View>
    );
  }

  const renderLines = (reverse = false) => (
    <View style={styles.linesContainer}>
      {lines.map((_, i) => {
        const index = reverse ? lines.length - 1 - i : i;
        const heightAnim = animations[index].interpolate({
          inputRange: [0, 1.6],
          outputRange: [5, 24],
        });

        return (
          <Animated.View
            key={i}
            style={[styles.line, { height: heightAnim }]}
          />
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        {selectedTechs.length > 0 ? (
          <Text style={styles.infoText}>{selectedTechs.join(', ')}</Text>
        ) : (
          <Text style={styles.infoText}>{interviewType}</Text>
        )}
        <Text style={[styles.timer, { color: isDanger ? 'red' : 'green' }]}>
          {formatTime(timeLeft)}
        </Text>
      </View>

      <View style={styles.card}>
        {selectedTechs.length > 0 && (
          <Text style={styles.infoText1}>{'\u2022'}{level}</Text>
        )}

        <Text style={styles.questionHeader}>
          Question {currentIndex + 1} of {questions.length}
        </Text>
        <Text style={styles.questionText}>
          {questions[currentIndex]?.question}
        </Text>

        {/* Answer Input */}
        <TextInput
          label="Your Answer"
          value={answer}
          onChangeText={setAnswer}
          multiline
          numberOfLines={5}
          mode="outlined"
          style={styles.input}
          theme={{ roundness: 8 }}
        />
        <Button
          mode="contained"
          onPress={handleSendAnswer}
          loading={isSubmitting}
          disabled={!answer.trim() || isSubmitting}
          style={styles.button}
          contentStyle={{ paddingVertical: 10 }}
          labelStyle={{ fontSize: 16 , color: theme.textLight }}
        >
          {currentIndex < questions.length - 1 ? 'Next' : 'Finish'}
        </Button>
      </View>

      <View style={styles.micContainer}>
        {renderLines()}
        <View style={styles.micWrapper}>
          <Animated.View
            style={[
              styles.glowCircle,
              { opacity: glowOpacity, transform: [{ scale: micScale }] },
            ]}
          />
          <TouchableOpacity onPress={handleMicPress} activeOpacity={0.8}>
            <View style={styles.micButton}>
              <Icon name="mic" size={32} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
        {renderLines(true)}
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

