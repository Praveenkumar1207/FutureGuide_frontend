// AnimatedLoader.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { Easing, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import Colors from '../../constants/Colors';
import { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../../ThemeContext';

const { width } = Dimensions.get('window');
const CIRCLE_RADIUS = 70;

export default function RoadmapLoader({ route, navigation }) {
    const { theme } = useTheme();
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            justifyContent: 'center',
            alignItems: 'center',
        },
        orbitContainer: {
            position: 'absolute',
            width: CIRCLE_RADIUS * 2 + 40,
            height: CIRCLE_RADIUS * 2 + 40,
            justifyContent: 'center',
            alignItems: 'center',
        },
        logoWrap: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.primaryLight,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
        },
        logo: {
            width: 60,
            height: 60,
            resizeMode: 'contain',
        },
        dot: {
            position: 'absolute',
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: theme.primary,
            top: '15%',
        },
        text: {
            marginTop: 80,
            fontSize: 18,
            color: theme.primary,
            fontWeight: '600',
        },
    });
    const { techKey, targetScreen, targetParams, roadmapFormData } = route.params || {};

    function transformDockerToAwsFormat(dockerData, profileId, loginId) {
        const currentTime = new Date().toISOString();

        return {
            _id: profileId,
            key: profileId,
            profileId: profileId,
            name: dockerData.name,
            title: dockerData.name,
            icon: dockerData.icon,
            careerInterest: "DevOps & Containerization",
            duration: 90,
            goals: {
                primary: "Job",
                secondary: "Internship"
            },
            milestones: dockerData.initialMilestones,
            progress: {
                completedMilestones: 0,
                percentageComplete: 0,
                totalMilestones: dockerData.initialMilestones.length
            },
            createdAt: currentTime,
            updatedAt: currentTime,
            __v: 0
        };
    }

    useEffect(() => {
        if (roadmapFormData) {
            // Handle API call for roadmap generation from form
            axios.post("https://futureguide-backend.onrender.com/api/roadmaps/generate", roadmapFormData)
                .then((res) => {
                    console.log("Roadmap generated successfully:", res.data);
                    const transformedData = transformDockerToAwsFormat(
                        res.data,
                        roadmapFormData.profileId,
                        roadmapFormData.login_id
                    );
                    console.log("Transformed Roadmap Data:", transformedData);

                    // Navigate to RoadmapTimeline with generated data
                    setTimeout(() => {
                        navigation.replace('RoadmapTimeline', { roadmapData: transformedData });
                    }, 1500);
                })
                .catch((err) => {
                    console.error("Error generating roadmap:", err.message);
                    // Navigate back to form on error
                    setTimeout(() => {
                        navigation.goBack();
                    }, 1500);
                });
        } else {
            // Original functionality for other cases
            const timer = setTimeout(() => {
                if (targetScreen) {
                    if (targetParams) {
                        navigation.replace(targetScreen, targetParams);
                    } else {
                        navigation.replace(targetScreen);
                    }
                } else if (techKey) {
                    navigation.replace('RoadmapTimeline', { techKey });
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [techKey, targetScreen, targetParams, roadmapFormData, navigation]);

    const orbit = useSharedValue(0);
    const pulse = useSharedValue(1);

    useEffect(() => {
        orbit.value = withRepeat(
            withTiming(2 * Math.PI, {
                duration: 3000,
                easing: Easing.linear,
            }),
            -1,
            false
        );

        pulse.value = withRepeat(
            withTiming(1.2, { duration: 500, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const animatedDotStyle = (angleOffset) =>
        useAnimatedStyle(() => {
            const angle = orbit.value + angleOffset;
            const x = Math.cos(angle) * CIRCLE_RADIUS;
            const y = Math.sin(angle) * CIRCLE_RADIUS;
            return {
                transform: [
                    { translateX: x },
                    { translateY: y },
                ],
            };
        });

    const pulseStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: pulse.value }],
        };
    });
    const motivationalQuotes = [
        "Great careers begin with small steps.",
        "Every expert was once a beginner.",
        "Your dream job is just one plan away.",
        "Keep pushing forward – success is near.",
        "Believe in your journey, not just the destination.",
        "Your roadmap is your power – trust it.",
    ];
    // const [quote, setQuote] = useState('');
    useEffect(() => {
        // Pick a random quote
        const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
        setQuote(motivationalQuotes[randomIndex]);
    }, []);

    const [quote, setQuote] = useState('');


    return (

        <View style={styles.container}>
            {/* Pulsating AI Logo */}
            <Animated.View style={[styles.logoWrap, pulseStyle]}>
                <Image source={require('../../Images/robot.png')} style={styles.logo} />
            </Animated.View>

            {/* Orbiting Dots */}
            <View style={styles.orbitContainer}>
                {[0, Math.PI * 0.66, Math.PI * 1.33].map((angleOffset, i) => (
                    <Animated.View
                        key={i}
                        style={[styles.dot, animatedDotStyle(angleOffset)]}
                    />
                ))}
            </View>

            <Text style={styles.text}>{quote}</Text>

        </View>
    );
}


