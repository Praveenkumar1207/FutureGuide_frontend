import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import * as Progress from 'react-native-progress';

export default function Abcdemo({ score1, score2, score3 }) {
    const animated1 = useRef(new Animated.Value(0)).current;
    const animated2 = useRef(new Animated.Value(0)).current;
    const animated3 = useRef(new Animated.Value(0)).current;

    const [progress1, setProgress1] = useState(0);
    const [progress2, setProgress2] = useState(0);
    const [progress3, setProgress3] = useState(0);

    useEffect(() => {
        Animated.timing(animated1, {
            toValue: score1 / 100,
            duration: 1000,
            useNativeDriver: false,
        }).start();

        Animated.timing(animated2, {
            toValue: score2 / 100,
            duration: 1000,
            useNativeDriver: false,
        }).start();

        Animated.timing(animated3, {
            toValue: score3 / 100,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    }, [score1, score2, score3]);

    useEffect(() => {
        const id1 = animated1.addListener(({ value }) => setProgress1(value));
        const id2 = animated2.addListener(({ value }) => setProgress2(value));
        const id3 = animated3.addListener(({ value }) => setProgress3(value));

        return () => {
            animated1.removeListener(id1);
            animated2.removeListener(id2);
            animated3.removeListener(id3);
        };
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="grey" barStyle="light-content" hidden={false} />
            <View style={styles.outercircles}>
                <View>
                    <Progress.Circle
                        size={85}
                        progress={progress1}
                        showsText={true}
                        color={score1 >= 75 ? 'green' : score1 >= 50 ? 'orange' : 'red'}
                        formatText={() => `${score1}/100`}
                        thickness={5}
                        borderWidth={0}
                        unfilledColor="#ddd"
                        textStyle={{ fontWeight: '700', fontSize: 14, color: '#4F4F4F' }}
                    />
                    <Text style={styles.feedback}>Grammar</Text>
                </View>

                <View>
                    <Progress.Circle
                        size={85}
                        progress={progress2}
                        showsText={true}
                        color={score2 >= 75 ? 'green' : score2 >= 50 ? 'orange' : 'red'}
                        formatText={() => `${score2}/100`}
                        thickness={5}
                        borderWidth={0}
                        unfilledColor="#ddd"
                        textStyle={{ fontWeight: '700', fontSize: 14, color: '#4F4F4F' }}
                    />
                    <Text style={styles.feedback}>Content</Text>
                </View>

                <View>
                    <Progress.Circle
                        size={85}
                        progress={progress3}
                        showsText={true}
                        color={score3 >= 75 ? 'green' : score3 >= 50 ? 'orange' : 'red'}
                        formatText={() => `${score3}/100`}
                        thickness={5}
                        borderWidth={0}
                        unfilledColor="#ddd"
                        textStyle={{ fontWeight: '700', fontSize: 14, color: '#4F4F4F' }}
                    />
                    <Text style={styles.feedback}>Clarity</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 20,
    },
    outercircles: {
        flex: 3,
        flexDirection: 'row',
        gap: 23,
        justifyContent: 'space-evenly',
    },
    feedback: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '300',
        color: '#444',
        textAlign: "center",
    },
});

