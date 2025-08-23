import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
} from 'react-native';
import Animated, {FadeInUp,useSharedValue, withTiming,useAnimatedStyle,withRepeat,Easing,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const features = [
    {
        title: 'Resume Analyzer',
        icon: 'file-document-edit-outline',
        color: '#87CEEB',
        screen: 'ResumeScreen',
    },
    {
        title: 'JD Check',
        icon: 'briefcase-search-outline',
        color: '#00B894',
        screen: 'JDCheckScreen',
    },
    {
        title: 'Downloads',
        icon: 'download-box-outline',
        color: '#F39C12',
        screen: 'DownloadsScreen',
    },
];

export default function HomeScreen({ navigation }) {
    const scale1 = useSharedValue(1);
    const scale2 = useSharedValue(1);

    useEffect(() => {
        scale1.value = withRepeat(
            withTiming(1.6, { duration: 1800, easing: Easing.out(Easing.ease) }),
            -1,
            true
        );
        scale2.value = withRepeat(
            withTiming(2.0, { duration: 2500, easing: Easing.out(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const animatedStyle1 = useAnimatedStyle(() => ({
        transform: [{ scale: scale1.value }],
        opacity: 1 - (scale1.value - 1) / 0.6,
    }));

    const animatedStyle2 = useAnimatedStyle(() => ({
        transform: [{ scale: scale2.value }],
        opacity: 1 - (scale2.value - 1) / 1,
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Career Toolkit</Text>

            {features.map((feature, index) => (
                <Animated.View
                    key={index}
                    entering={FadeInUp.delay(index * 100).springify()}
                    style={[styles.card, { backgroundColor: `${feature.color}20` }]}
                >
                    <TouchableOpacity
                        style={styles.innerCard}
                        onPress={() => navigation.navigate(feature.screen)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: feature.color }]}>
                            <MaterialCommunityIcons
                                name={feature.icon}
                                size={26}
                                color="white"
                            />
                        </View>
                        <Text style={styles.cardText}>{feature.title}</Text>
                    </TouchableOpacity>
                </Animated.View>
            ))}

            {/* Chatbot Floating Button */}
            <View style={styles.chatContainer}>
                <Animated.View style={[styles.pulseCircle, animatedStyle2]} />
                <Animated.View style={[styles.pulseCircle, animatedStyle1]} />
                <TouchableOpacity style={styles.chatButton} activeOpacity={0.8}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4712/4712106.png' }}
                        style={styles.botImage}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 120,
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        alignSelf: 'center',
        marginBottom: 30,
    },
    card: {
        width: width - 40,
        borderRadius: 20,
        padding: 18,
        marginVertical: 12,
    },
    innerCard: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    cardText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    chatContainer: {
        position: 'absolute',
        bottom: 90,
        right: 30,
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pulseCircle: {
        position: 'absolute',
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#87CEEB',
        opacity: 0.3,
    },
    chatButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#87CEEB',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#87CEEB',
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    botImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
});
