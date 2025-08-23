import React, { useState } from "react";
import { Dimensions, View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/Colors';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';


const screenHeight = Dimensions.get('window').height;
const adjustedHeight = screenHeight - 70;

function Not() {
    const [a, seta] = useState([
        {
            heading: "Interview Scheduled",
            subject: "Your interview with XYZ Corp is scheduled for tomorrow at 10:00 AM.",
            time: "1m ago"
        },
        {
            heading: "Application Received",
            subject: "We have received your application for the Frontend Developer role.",
            time: "5m ago"
        },
        {
            heading: "Job Offer",
            subject: "Congratulations! You've received an offer from ABC Tech.",
            time: "10 Hrs ago"
        },
        {
            heading: "Profile Shortlisted",
            subject: "Your profile has been shortlisted for the position of UI/UX Designer.",
            time: "15 Hrs ago"
        },
        {
            heading: "New Job Alert",
            subject: "New job openings matching your profile have been posted.",
            time: "1d ago"
        },
        {
            heading: "Interview Feedback",
            subject: "Feedback for your recent interview with QRS Innovations is now available.",
            time: "2d ago"
        },
        {
            heading: "Resume Viewed",
            subject: "Your resume was viewed by hiring managers from DEF Pvt Ltd.",
            time: "3d ago"
        },
        {
            heading: "New Skill Recommendation",
            subject: "Learn React Native to increase your job opportunities in mobile development.",
            time: "4d ago"
        }
    ]);

    const deleteNotification = (index) => {
        seta(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <View style={style.headerContainer}>
                <Text style={style.header}>Notification</Text>
                <TouchableOpacity onPress={() => seta([])}>
                    <Text style={style.clearAll}>Clear All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={style.Scrolling}>
                {a.length > 0 ? (
                    a.map((item, index) => (
                        <View key={index} style={style.notificationCard}>
                            <View style={style.iconWrapper}>
                                <MIcon name="badge-account-outline" size={28}  style={style.redCircle} />
                                {/* <View style={style.redCircle} /> */}
                            </View>
                            <View style={style.textWrapper}>
                                <Text style={style.heading}>{item.heading}</Text>
                                <Text style={style.subject}>{item.subject}</Text>
                                <Text style={style.time}>{item.time}</Text>
                            </View>
                            <TouchableOpacity onPress={() => deleteNotification(index)}>
                                <Icon name="delete" size={22} color={Colors.primaryDark} />
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <View style={{ width: "100%", height: adjustedHeight, alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontWeight: '900', fontSize: 25, color: Colors.textDark }}>No Notifications Found</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const style = StyleSheet.create({
    Scrolling: {
        width: "100%",
        padding: 10,
        maxHeight: adjustedHeight
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 10
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.primaryDark
    },
    clearAll: {
        color: Colors.textSubtles,
        fontWeight: '600',
        fontSize: 14
    },
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.cardBackground,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
        marginHorizontal: 10,
    },
    iconWrapper: {
        marginRight: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    redCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primaryLight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 6,
        paddingTop: 4,

    },
    textWrapper: {
        flex: 1
    },
    heading: {
        fontWeight: "bold",
        fontSize: 16,
        color: Colors.primaryDark,
    },
    subject: {
        fontSize: 14,
        color: Colors.textMedium,
        marginVertical: 4
    },
    time: {
        fontSize: 12,
        color: Colors.textSubtle
    },
});

export default Not;
