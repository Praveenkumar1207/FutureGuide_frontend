import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Animated, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
export default function Jdloader() {
    const navigation = useNavigation();
    const shimmerTranslate = useRef(new Animated.Value(-1)).current;
    const animationRef = useRef(null);
    const route = useRoute();
    // useEffect(() => {
    //     animationRef.current?.play();
    //     shimmerTranslate.setValue(-1);
    //     Animated.loop(
    //         Animated.timing(shimmerTranslate, {
    //             toValue: 1,
    //             duration: 1200,
    //             useNativeDriver: true,
    //         })
    //     ).start();
    // }, []);

    useEffect(() => {
        animationRef.current?.play();
        shimmerTranslate.setValue(-1);
        Animated.loop(
            Animated.timing(shimmerTranslate, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            })
        ).start();

    }, []);


    const translateX = shimmerTranslate.interpolate({
        inputRange: [-1, 1],
        outputRange: [-screenWidth, screenWidth],
    });
    return (
        <View style={[styles.loaderoverall]}>
            <ScrollView style={[styles.linkscroll]}>
                <Text style={styles.heading}>Loading Magic..</Text>
                <View style={[styles.loader, { height: 273 }]}>
                    <View style={styles.wrapper}>
                        <View style={[styles.line1, { height: 10, width: 143 }]} />
                        <View style={[styles.line2, { top: 34, borderRadius: 12 }]} />
                        <View style={[styles.line1, { top: 54, height: 10, width: 143 }]} />
                        <View style={[styles.line2, { top: 74, borderRadius: 12 }]} />
                        <View style={[styles.line1, { top: 94, height: 10, width: 143 }]} />
                        <View style={[styles.line2, { top: 114, borderRadius: 12 }]} />
                        <View style={[styles.line2, { top: 134, borderRadius: 12 }]} />
                        <View style={[styles.line1, { top: 154, height: 10, width: 143 }]} />
                        <View style={[styles.line2, { top: 174, borderRadius: 12 }]} />
                        <View style={[styles.line1, { top: 194, height: 10, width: 143 }]} />
                        <View style={[styles.line2, { top: 214, borderRadius: 12 }]} />
                    </View>
                    <Animated.View
                        style={[
                            styles.shimmerOverlay,
                            {
                                transform: [{ translateX }, { rotate: '20deg' }],
                            },
                        ]}
                    >
                        <LinearGradient
                            colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={StyleSheet.absoluteFill}
                        />
                    </Animated.View>
                </View>
                <View style={styles.loader}>
                    <View style={styles.wrapper}>
                        <View style={styles.line1} />
                        <View style={[styles.line2, { top: 34 }]} />
                        <View style={[styles.line2, { top: 54 }]} />
                        <View style={[styles.line2, { top: 74 }]} />
                        <View style={[styles.line2, { top: 94 }]} />
                    </View>
                    <Animated.View
                        style={[
                            styles.shimmerOverlay,
                            {
                                transform: [{ translateX }, { rotate: '20deg' }],
                            },
                        ]}
                    >
                        <LinearGradient
                            colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={StyleSheet.absoluteFill}
                        />
                    </Animated.View>
                </View>
                {/* <View style={styles.loader}>
                    <View style={styles.wrapper}>
                        <View style={styles.line1} />
                        <View style={[styles.line2, { top: 34 }]} />
                        <View style={[styles.line2, { top: 54 }]} />
                        <View style={[styles.line2, { top: 74 }]} />
                        <View style={[styles.line2, { top: 94 }]} />
                    </View>
                    <Animated.View
                        style={[
                            styles.shimmerOverlay,
                            {
                                transform: [{ translateX }, { rotate: '20deg' }],
                            },
                        ]}
                    >
                        <LinearGradient
                            colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={StyleSheet.absoluteFill}
                        />
                    </Animated.View>
                </View> */}


            </ScrollView>
        </View>
    )
}
const screenWidth = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
const styles = StyleSheet.create({
    loaderoverall:
    {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 33
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
    linkscroll: {
        flex: 1,

    },
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

});