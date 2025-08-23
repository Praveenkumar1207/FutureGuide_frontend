



import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Animated,
    Easing,
} from 'react-native';

const filledStar = require('../../assets/filled_star.png');
const emptyStar = require('../../assets/empty_star.png');

const ResultScreen = ({ route }) => {
    const { analysis, answeredQuestions, totalQuestions } = route?.params || {};

    // Fallback if required data is missing
    if (!analysis || typeof analysis.overallScore !== 'number') {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'red', textAlign: 'center', marginTop: 50 }}>
                    Oops! Analysis data is missing or invalid. Please go back and try again.
                </Text>
            </View>
        );
    }

    const animations = useRef([...Array(5)].map(() => new Animated.Value(0))).current;

    const getStars = (score) => {
        if (score < 20) return 1;
        if (score < 40) return 2;
        if (score < 60) return 3;
        if (score < 80) return 4;
        return 5;
    };

    const getSkillColor = (level) => {
        if (level === 'Good') return '#4CAF50';
        if (level === 'Average') return '#FF9800';
        return '#F44336'; // Basic
    };

    const starCount = getStars(analysis.overallScore);

    const barData = [
        { value: totalQuestions, label: 'Total', color: '#4B9CD3' },
        { value: answeredQuestions, label: 'Answered', color: '#4CAF50' },
        {
            value: totalQuestions - answeredQuestions,
            label: 'Not Attempted',
            color: '#F44336',
        },
    ];

    const maxBarHeight = 200;
    const maxBarValue = Math.max(...barData.map(d => d.value), 1);
    const barHeights = useRef(barData.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        animations.forEach((anim, index) => {
            Animated.timing(anim, {
                toValue: 1,
                duration: 600,
                delay: index * 300,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }).start();
        });

        barHeights.forEach((anim, index) => {
            Animated.timing(anim, {
                toValue: barData[index].value,
                duration: 800,
                delay: index * 200,
                useNativeDriver: false,
                easing: Easing.out(Easing.ease),
            }).start();
        });
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>HR Interview Analytics</Text>

            <Text style={styles.sectionLabel}>Your Performance</Text>
            <View style={styles.starContainer}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <Image
                        key={`empty-${index}`}
                        source={emptyStar}
                        style={[styles.starImage, { left: index * 48, position: 'absolute' }]}
                        resizeMode="contain"
                    />
                ))}

                {animations.map((anim, index) => {
                    if (index >= starCount) return null;
                    return (
                        <Animated.Image
                            key={`filled-${index}`}
                            source={filledStar}
                            style={[
                                styles.starImage,
                                {
                                    position: 'absolute',
                                    left: index * 48,
                                    transform: [
                                        {
                                            translateY: anim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [-50, 0],
                                            }),
                                        },
                                        {
                                            scale: anim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.5, 1],
                                            }),
                                        },
                                    ],
                                    opacity: anim,
                                },
                            ]}
                            resizeMode="contain"
                        />
                    );
                })}
            </View>

            <Text style={styles.sectionLabel}>Interview Result Analysis</Text>

            <View style={styles.barChartContainer}>
                {barData.map((bar, index) => {
                    const height = barHeights[index].interpolate({
                        inputRange: [0, maxBarValue],
                        outputRange: [0, maxBarHeight],
                        extrapolate: 'clamp',
                    });

                    return (
                        <View key={index} style={styles.barItem}>
                            <Animated.View
                                style={[
                                    styles.bar,
                                    {
                                        backgroundColor: bar.color,
                                        height,
                                    },
                                ]}
                            />
                            <Text style={styles.barLabel}>{bar.label}</Text>
                        </View>
                    );
                })}
            </View>

            <View style={styles.skillSection}>
                <Text style={styles.skillLabel}>
                    English Proficiency:{' '}
                    <Text style={[styles.skillValue, { color: getSkillColor(analysis.englishProficiency) }]}>
                        {analysis.englishProficiency}
                    </Text>
                </Text>

                <Text style={styles.skillLabel}>
                    Domain Knowledge:{' '}
                    <Text style={[styles.skillValue, { color: getSkillColor(analysis.domainKnowledge) }]}>
                        {analysis.domainKnowledge}
                    </Text>
                </Text>
            </View>

            <View style={styles.feedbackBox}>
                <Text style={styles.feedbackTitle}>Feedback</Text>
                <Text style={styles.feedbackText}>{analysis.feedback}</Text>
            </View>

            <Text style={styles.sectionLabel}>Areas for Improvement</Text>
            {(analysis.areasForImprovement || []).map((point, index) => (
                <View key={index} style={styles.bulletItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{point}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#F4F6F8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#222',
    },
    sectionLabel: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10,
        color: '#2C3E50',
    },
    starContainer: {
        width: 260,
        height: 60,
        alignSelf: 'center',
        position: 'relative',
    },
    starImage: {
        width: 40,
        height: 40,
    },
    barChartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 220,
        paddingHorizontal: 10,
    },
    barItem: {
        alignItems: 'center',
    },
    bar: {
        width: 40,
        borderRadius: 6,
    },
    barLabel: {
        fontSize: 14,
        color: '#333',
    },
    skillSection: {
        marginTop: 10,
        marginBottom: 10,
    },
    skillLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 6,
        fontWeight: '600',
    },
    skillValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    feedbackBox: {
        backgroundColor: '#FFF3CD',
        padding: 14,
        borderRadius: 8,
        borderLeftWidth: 5,
        borderLeftColor: '#FFA000',
    },
    feedbackTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#7A5C00',
    },
    feedbackText: {
        fontSize: 14,
        color: '#5A4A00',
        lineHeight: 20,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    bullet: {
        fontSize: 16,
        color: '#333',
        marginRight: 6,
        lineHeight: 20,
    },
    bulletText: {
        flex: 1,
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
    },
});

export default ResultScreen;

