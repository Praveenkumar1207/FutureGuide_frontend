import { useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';
import ConfettiCannon from 'react-native-confetti-cannon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '../../constants/Colors';
import { useTheme } from '../../ThemeContext';
import axios from 'axios';
import { useLogin } from '../../Login_id_passing';
const toastConfig = {
  customSuccess: ({ text1 }) => (
    <View style={{ height: 60, backgroundColor: Colors.success, justifyContent: 'center', paddingHorizontal: 15, borderRadius: 8 }}>
      <Text style={{ color: Colors.textLight, fontWeight: 'bold' }}>{text1}</Text>
    </View>
  ),
};

export default function RoadmapTimeline() {
  const { theme } = useTheme();
  console.log('Theme:primary', theme.primary);
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      backgroundColor: theme.background,
    },
    timelineContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      paddingTop: 70, // space for header
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '90%',
      position: 'relative',
      left: '3.5%',
      // marginBottom: 20, // Add space between rows to accommodate text and buttons
    },
    content: {
      width: '37%',
      alignItems: 'flex-end',
    },
    emptySpace: {
      width: '37%',
    },
    centerLine: {
      width: '20%',
      alignItems: 'center',
      position: 'relative',
    },
    lineSegment: (completed) => ({
      width: 5,
      height: 35,
      backgroundColor: completed ? theme.primary : theme.border,
    }),
    circle: (completed) => ({
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: completed ? theme.primary : theme.border,
      borderWidth: 2,
      borderColor: completed ? theme.primaryDark : theme.textMuted,
    }),
    badge: (completed) => ({
      borderRadius: 20,
      position: 'absolute',
      width: '110%',
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: completed ? 'transparent' : 'transparent',
      borderWidth: 0,
    }),
    badgeText: (completed) => ({
      fontSize: 13,
      color: completed ? theme.textLight : theme.textLight,
      fontWeight: '800',
    }),
    title: {
      fontSize: 13,
      color: theme.textDark,
      textAlign: 'center',
      position: 'absolute',
      width: '100%',
      fontWeight: '600',
    },
    box: {
      backgroundColor: theme.primaryLight,
      borderRadius: 8,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
      // padding: 16,
      width: '100%',
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'visible',
      borderWidth: 1,
      borderColor: theme.border,
      position: 'relative',
      top: 20, // Adjusted to ensure text is visible
    },
    horizLineLeft: (completed) => ({
      position: 'absolute',
      left: '50%',
      top: 45,
      width: '72%',
      height: 2,
      backgroundColor: completed ? theme.primary : theme.border,
      transform: [{ translateX: -7 }],
    }),
    horizLineRight: (completed) => ({
      position: 'absolute',
      right: '50%',
      top: 45,
      width: '60%',
      height: 2,
      backgroundColor: completed ? theme.primary : theme.border,
      transform: [{ translateX: 7 }],
    }),
    headerContainer: {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: 70,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomColor: theme.border,
      borderBottomWidth: 1,
      zIndex: 1,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    headerText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.textLight,
    },
    saveButton: {
      position: 'absolute',
      top: 15,
      right: 15,
      zIndex: 2,
      backgroundColor: theme.surface,
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    milestoneContainer: {
      width: '100%',
      alignItems: 'center',
      minHeight: 80, // Ensure minimum height to accommodate text and button
    },
    youTubeButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    youTubeButtonText: {
      fontSize: 12,
      color: theme.textLight,
      fontWeight: '600',
    },
  });
  const navigation = useNavigation();
  const route = useRoute();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { roadmapData } = route.params;
  const selectedTech = roadmapData;
  const { loginId } = useLogin();
  const { profile_id } = loginId;
  const techKey = roadmapData.name + roadmapData.key;
  console.log("Tech Key:", techKey);
  const initialMilestones = selectedTech.milestones || selectedTech.initialMilestones || [];

  const [milestones, setMilestones] = useState(initialMilestones);
  const [initialMilestonesState, setInitialMilestonesState] = useState(initialMilestones);
  const [showConfetti, setShowConfetti] = useState(false);

  const scrollRef = useRef(null);
  const congratsAnim = useRef(new Animated.Value(0)).current;

  const topLineAnim = useRef(new Animated.Value(0)).current;
  const rightLineAnim = useRef(new Animated.Value(0)).current;
  const bottomLineAnim = useRef(new Animated.Value(0)).current;
  const leftLineAnim = useRef(new Animated.Value(0)).current;

  const topLoop = useRef(null);
  const rightLoop = useRef(null);
  const bottomLoop = useRef(null);
  const leftLoop = useRef(null);

  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;

  const lastScrollY = useRef(0);
  const headerVisibleTimeout = useRef(null);


  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    loadProgress();
  }, []);

  const saveProgress = async (dataToSave = milestones) => {
    try {
      await AsyncStorage.setItem(`@milestone_progress_${techKey}`, JSON.stringify(dataToSave));
      setInitialMilestonesState(dataToSave);
      Toast.show({
        type: 'success',
        text1: 'Progress saved!',
        visibilityTime: 1500,
        position: 'bottom',
        topOffset: 10,
      });
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  };

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem(`@milestone_progress_${techKey}`);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        setMilestones(parsed);
        setInitialMilestonesState(parsed);
      }
    } catch (e) {
      console.error('Failed to load progress', e);
    }
  };

  const createLoop = (anim, delay = 0) =>
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 2000, useNativeDriver: true, delay }),
        Animated.timing(anim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    );

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      const hasUnsavedChanges = JSON.stringify(milestones) !== JSON.stringify(initialMilestonesState);
      if (!hasUnsavedChanges) return;

      e.preventDefault();
      Alert.alert('Unsaved Changes', 'Are you sure you want to go back without saving your progress?', [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
      ]);
    });
    return unsubscribe;
  }, [navigation, milestones, initialMilestonesState]);

  const restartBorderAnimations = () => {
    topLoop.current?.stop();
    rightLoop.current?.stop();
    bottomLoop.current?.stop();
    leftLoop.current?.stop();

    topLineAnim.setValue(0);
    rightLineAnim.setValue(0);
    bottomLineAnim.setValue(0);
    leftLineAnim.setValue(0);

    topLoop.current = createLoop(topLineAnim, 0);
    rightLoop.current = createLoop(rightLineAnim, 500);
    bottomLoop.current = createLoop(bottomLineAnim, 1000);
    leftLoop.current = createLoop(leftLineAnim, 1500);

    topLoop.current.start();
    rightLoop.current.start();
    bottomLoop.current.start();
    leftLoop.current.start();
  };

  const triggerCongratsAnimation = () => {
    congratsAnim.setValue(0);
    Animated.sequence([
      Animated.timing(congratsAnim, { toValue: -30, duration: 600, useNativeDriver: true }),
      Animated.timing(congratsAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  };

  const toggleCompletion = (id) => {
    const index = milestones.findIndex((m) => m.id === id);
    const prevIndex = index - 1;

    if (milestones[index].completed) {
      if (milestones.slice(index + 1).some((m) => m.completed)) {
        Toast.show({ type: 'success', text1: `Can't Undo Previous Milestones!`, visibilityTime: 1500, position: 'bottom', topOffset: 20 });
        return;
      }
    } else {
      if (prevIndex >= 0 && !milestones[prevIndex].completed) {
        Toast.show({ type: 'success', text1: `Finish The Previous Goal!!`, visibilityTime: 1500, position: 'bottom', topOffset: 20 });
        return;
      }
    }

    if (!milestones[index].completed) restartBorderAnimations();

    const newMilestones = milestones.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m));
    setMilestones(newMilestones);
    saveProgress(newMilestones); // Save immediately after update

    // Show confetti when the last milestone is completed
    if (index === milestones.length - 1 && !milestones[index].completed) {
      setShowConfetti(true);
      triggerCongratsAnimation();
    } else {
      setShowConfetti(false);
    }
  };

  const onScroll = (event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    if (currentScrollY < 0) return;

    if (currentScrollY <= 20) {
      Animated.timing(headerTranslateY, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      Animated.timing(headerOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      clearTimeout(headerVisibleTimeout.current);
    } else {
      if (currentScrollY > lastScrollY.current) {
        Animated.timing(headerTranslateY, { toValue: -70, duration: 300, useNativeDriver: true }).start();
        Animated.timing(headerOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      } else {
        Animated.timing(headerTranslateY, { toValue: 0, duration: 300, useNativeDriver: true }).start();
        Animated.timing(headerOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      }
      clearTimeout(headerVisibleTimeout.current);
    }
    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    // When roadmapData changes, update milestones and load progress for the new roadmap
    const newMilestones = roadmapData.milestones || roadmapData.initialMilestones || [];
    setMilestones(newMilestones);
    setInitialMilestonesState(newMilestones);

    // Try to load progress for the new roadmap
    const loadProgressForNewRoadmap = async () => {
      try {
        const stored = await AsyncStorage.getItem(`@milestone_progress_${roadmapData.key}`);
        if (stored !== null) {
          const parsed = JSON.parse(stored);
          setMilestones(parsed);
          setInitialMilestonesState(parsed);
        }
      } catch (e) {
        console.error('Failed to load progress', e);
      }
    };
    loadProgressForNewRoadmap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params.roadmapData]);

  // Add YouTube navigation function
  const navigateToYouTubeTutorials = (milestoneTitle) => {
    // Clean the milestone title for better search results
    const cleanTitle = milestoneTitle
      .replace(/Day \d+ - Day \d+/, '') // Remove day ranges
      .replace(/YouNailedIt|Congrats!/, '') // Remove congratulations text
      .trim();

    if (cleanTitle) {
      navigation.navigate('YouTubeVideoScreen', {
        topic: cleanTitle
      });
    } else {
      Toast.show({
        type: 'success',
        text1: 'No tutorial available for this milestone',
        visibilityTime: 1500,
        position: 'bottom',
        topOffset: 20,
      });
    }
  };

  if (!Array.isArray(milestones) || milestones.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors.background }]}>
        <Animated.View style={[styles.headerContainer]}>
          <Text style={styles.headerText}>{selectedTech.name || "Roadmap"}</Text>
          <TouchableOpacity
            style={{ position: 'absolute', right: 20, top: 18 }}
            onPress={handleBookmarkToggle}
          >
            <MaterialIcons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={30}
              color={theme.textLight}
              style={{ opacity: 0.9 }}
            />
          </TouchableOpacity>
        </Animated.View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No milestones found for this roadmap.</Text>
        </View>
      </SafeAreaView>
    );
  }

  useEffect(()=>{
    axios.get(`https://futureguide-backend.onrender.com/api/wishlist/${profile_id}`)
    .then((res)=>{
      const Roadmap_data=res.data.RoadmapID;
      if(Roadmap_data.includes(roadmapData._id))
      {
        setIsBookmarked(true);
      }
    })
    .catch((err)=>{
      console.log(err)
    })
  },[roadmapData]);


  const handleBookmarkToggle = async () => {
    const exists = isBookmarked;
    setIsBookmarked(!isBookmarked);
    // console.log("hitted")
    let a = "https://futureguide-backend.onrender.com/api/wishlist/add"
    if (exists) {
      a = "https://futureguide-backend.onrender.com/api/wishlist/remove"
    }
    try {
      const response = await fetch(a,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profileId: profile_id,
            roadmapId: roadmapData._id,
          }),
        }
      );
      console.log(response.ok);
      if (!response.ok) {
        throw new Error('API error');
      }
    } catch (apiErr) {
      Toast.show({ type: 'success', text1: 'Backend error', visibilityTime: 1200, position: 'bottom', topOffset: 10 });
    }
  };
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors.background }]}>
      <Animated.View style={[styles.headerContainer, { transform: [{ translateY: headerTranslateY }], opacity: headerOpacity }]}>
        <Text style={styles.headerText}>{selectedTech.name}</Text>
        <TouchableOpacity
          style={{ position: 'absolute', right: 20, top: 18 }}
          onPress={handleBookmarkToggle}
        >
          <MaterialIcons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={30}
            color={Colors.textLight}
            style={{ opacity: 0.9 }}
          />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.container} ref={scrollRef} onScroll={onScroll} scrollEventThrottle={16}>
        <View style={styles.timelineContainer}>
          {milestones.map((m, index) => {
            const isLeft = index % 2 === 0;
            const isLast = index === milestones.length - 1;
            const nextCompleted = !isLast && milestones[index + 1].completed;
            const isCongratsMessage = m.title.includes('Congrats') || m.title.includes('YouNailedIt');

            const milestoneView = (
              <View style={styles.milestoneContainer}>
                <TouchableOpacity
                  onPress={() => toggleCompletion(m.id)}
                  style={[
                    styles.box,
                    { backgroundColor: m.completed ? Colors.primary : Colors.textMuted }
                  ]}
                  activeOpacity={0.8}
                >
                  {/* Text positioning based on index */}
                  <Text style={[
                    styles.title,
                    {
                      top: isLeft ? 50 : -70,  // Left side: text at top, Right side: text at bottom
                    }
                  ]}>
                    {m.title}
                  </Text>
                  <View style={styles.badge(m.completed)}>
                    <Text style={styles.badgeText(m.completed)}>{m.date}</Text>
                  </View>
                </TouchableOpacity>

                {/* YouTube Tutorial Button - positioned based on index */}
                {!isCongratsMessage && (
                  <TouchableOpacity
                    style={[
                      styles.youTubeButton,
                      {
                        alignSelf: isLeft ? 'flex-start' : 'flex-end',
                        marginTop: isLeft ? -45 : 8,  // Left side: move up to avoid text, Right side: normal margin
                        position: 'absolute',
                        top: isLeft ? 165 : -100,
                        left: isLeft ? 25 : 25,
                      }
                    ]}
                    onPress={() => navigateToYouTubeTutorials(m.title)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.youTubeButtonText}>Tutorials</Text>
                  </TouchableOpacity>
                )}
              </View>
            );

            return (
              <View key={m.id} style={styles.row}>
                {isLeft ? <View style={styles.content}>{milestoneView}</View> : <View style={styles.emptySpace} />}
                <View style={styles.centerLine}>
                  <View style={styles.lineSegment(m.completed)} />
                  <View style={styles.circle(m.completed)} />
                  {!isLast && <View style={styles.lineSegment(nextCompleted)} />}
                  <View style={isLeft ? styles.horizLineRight(m.completed) : styles.horizLineLeft(m.completed)} />
                </View>
                {!isLeft ? <View style={styles.content}>{milestoneView}</View> : <View style={styles.emptySpace} />}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {showConfetti && (
        <ConfettiCannon count={150} origin={{ x: 150, y: 800 }} fadeOut={true} fallSpeed={1500} onAnimationEnd={() => setShowConfetti(false)} />
      )}

      <Toast config={toastConfig} />
    </SafeAreaView>
  );
}

