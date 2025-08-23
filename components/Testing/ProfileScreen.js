import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, Dimensions, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Svg, Circle } from 'react-native-svg';
import axios from 'axios';
import { eventBus } from './Event_emitter';
const { width } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.4;
const STROKE_WIDTH = 8;
const RING_PADDING = 10;
import { PaperProvider, Portal, Modal } from 'react-native-paper';
// import { useLogin } from './Login_passing';
import { useLogin } from "../../Login_id_passing";
import { useTheme } from '../../ThemeContext';
const ProfileScreen = () => {
    const { theme } = useTheme();
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f5f5f5',
        },
        scrollContent: {
            paddingBottom: 30,
        },
        header: {
            alignItems: 'center',
            padding: 20,
            backgroundColor: '#fff',
            marginBottom: 10,
            paddingTop: 40,
            marginTop: 10,
            marginLeft: 5,
            marginRight: 5,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
        },
        editButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.primaryLight,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            alignSelf: 'flex-start',
            marginBottom: 10,
        },
        editProfileText: {
            color: theme.text,
            fontSize: 16,
            marginRight: 6,
            fontWeight: '600',
        },
        profileContainer: {
            flexDirection: "row",
            gap: 20,
            alignItems: 'center',
            width: '100%',
        },
        progressRingContainer: {
            position: 'relative',
            width: IMAGE_SIZE + (RING_PADDING * 2),
            height: IMAGE_SIZE + (RING_PADDING * 2),
            marginBottom: 20,
            // backgroundColor:theme.primaryLight
        },
        profileImage: {
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            borderRadius: IMAGE_SIZE / 2,
            borderWidth: 3,
            borderColor: '#fff',
        },
        name: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.textDark,
            marginBottom: 5,
            marginTop: 10,
        },
        email: {
            fontSize: 16,
            color: theme.textDark,
            marginBottom: 5,
        },
        percentageText: {
            fontSize: 14,
            color: theme.textDark,
            fontWeight: '500',
            marginBottom: 15,
        },
        section: {
            backgroundColor: '#fff',
            padding: 15,
            marginBottom: 10,
            marginHorizontal: 8,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,

        },
        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 15,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
            marginLeft: 8,
        },
        educationItem: {
            flexDirection: 'row',
            marginBottom: 10,
        },
        collegeIcon: {
            marginRight: 15,
            marginTop: 2,
        },
        educationInfo: {
            flex: 1,
        },
        collegeName: {
            fontSize: 16,
            fontWeight: '600',
            color: '#333',
            marginBottom: 3,
        },
        degree: {
            fontSize: 14,
            color: '#666',
            marginBottom: 2,
        },
        year: {
            fontSize: 13,
            color: '#999',
        },
        goalItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        goalIcon: {
            marginRight: 8,
        },
        goalLabel: {
            fontWeight: 'bold',
            color: '#555',
        },
        goalValue: {
            flex: 1,
            color: '#333',
            fontSize: 15,
        },
        skillsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        skillTag: {
            backgroundColor: theme.primaryLight,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 15,
            marginRight: 8,
            marginBottom: 8,
        },
        skillText: {
            color: theme.text,
            fontSize: 14,
        },
        emptyText: {
            color: '#999',
            fontStyle: 'italic',
        },
        documentItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
        },
        documentIcon: {
            marginRight: 15,
        },
        linkText: {
            color: theme.primary,
            fontSize: 16,
        },
        linkTextDisabled: {
            color: theme.primaryDark,
            fontSize: 16,
        },
        modalOverlay: {
            // flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContent: {
            width: '90%',
            height: '90%',
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor:"red"
        },
        modalImage: {
            width: 250,
            height: 250,
            borderRadius: 125,
            overflow: 'hidden',
            backgroundColor: '#eee',
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
        },
    });
    const navigation = useNavigation();
    const { loginId } = useLogin();
    const [completionPercentage, setcompletionPrecentage] = useState(0);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        nickname: '',
        gender: '',
        email: '',
        college: '',
        skill: [],
        "branch": "",
        "year": "",
        "course": "",
        "specialization": "",
        "mobile": "",
        "Profile_image_path": "",
        "Resume_path": "",
        "primary_goal": "",
        "secondary_goal": "",
        "linkedin_url": "",
    });
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);
    useEffect(() => {
        axios.get(`https://futureguide-backend.onrender.com/api/profiles/${loginId.login_id}`)
            .then((response) => {
                console.log(response.data);
                setProfileData({ ...response.data })

            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    const calculateCompletion = () => {
        let filledFields = 0;
        const totalFields = 12;
        if (profileData.firstName) filledFields++;
        if (profileData.lastName) filledFields++;
        if (profileData.nickname) filledFields++;
        if (profileData.mobile) filledFields++;
        if (profileData.college) filledFields++;
        if (profileData.primary_goal) filledFields++;
        if (profileData.secondary_goal) filledFields++;
        if (profileData.skill && profileData.skill.length > 0) filledFields++;
        if (profileData.Resume_path) filledFields++;
        if (profileData.linkedin_url) filledFields++;
        if (profileData.Profile_image_path) filledFields++;
        if (profileData.gender) filledFields++;
        // if (profileData.specialization) filledFields++;
        console.log(filledFields)
        const percentage = Math.round((filledFields / totalFields) * 100);
        setcompletionPrecentage(percentage);
    };

    useEffect(() => {
        calculateCompletion();
    }, [profileData]);

    const radius = (IMAGE_SIZE / 2) - (STROKE_WIDTH / 2) + RING_PADDING;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

    const navigateToEditProfile = () => {
        navigation.navigate('EditProfile', {
            profileData,
        });
        eventBus.once('profileSaved', (updatedData) => {
            setProfileData(updatedData);
            calculateCompletion();
        });
    };

    const handleLinkPress = async (url, name) => {
        if (!url) {
            Alert.alert("Error", "Invalid or missing URL");
            return;
        }

        if (name === "linkedin") {
            const normalizedUrl = url;
            Alert.alert(
                'Open Link',
                `Do you want to open ${normalizedUrl}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Open',
                        onPress: async () => {
                            const supported = await Linking.canOpenURL(normalizedUrl);
                            if (supported) {
                                Linking.openURL(normalizedUrl);
                            } else {
                                Alert.alert("Can't open this URL:", normalizedUrl);
                            }
                        },
                    },
                ]
            );
        } else if (name === "resume") {
            navigation.navigate('ResumeViewer', {
                fileUrl: url,
            });
        }
    };


    return (
        <PaperProvider>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>

                    <View style={styles.profileContainer}>
                        <TouchableOpacity style={styles.progressRingContainer} onPress={() => setIsImageModalVisible(true)}>
                            <Svg height={IMAGE_SIZE + (RING_PADDING * 2)} width={IMAGE_SIZE + (RING_PADDING * 2)}>
                                {/* Background Ring */}
                                <Circle
                                    cx={(IMAGE_SIZE + (RING_PADDING * 2)) / 2}
                                    cy={(IMAGE_SIZE + (RING_PADDING * 2)) / 2}
                                    r={radius}
                                    stroke={theme.primaryLight}
                                    strokeWidth={STROKE_WIDTH}
                                    fill="transparent"
                                />
                                {/* Progress Ring */}
                                <Circle
                                    cx={(IMAGE_SIZE + (RING_PADDING * 2)) / 2}
                                    cy={(IMAGE_SIZE + (RING_PADDING * 2)) / 2}
                                    r={radius}
                                    stroke={theme.primaryDark}
                                    strokeWidth={STROKE_WIDTH}
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    fill="transparent"
                                    transform={`rotate(-90, ${(IMAGE_SIZE + (RING_PADDING * 2)) / 2}, ${(IMAGE_SIZE + (RING_PADDING * 2)) / 2})`}
                                />
                            </Svg>
                            <Image
                                source={{ uri: profileData.Profile_image_path }}
                                style={[
                                    styles.profileImage,
                                    {
                                        position: 'absolute',
                                        top: RING_PADDING,
                                        left: RING_PADDING,
                                    }
                                ]}
                            />
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.name}>{profileData.nickname}</Text>
                            <Text style={styles.email}>{profileData.mobile}</Text>
                            <Text style={styles.percentageText}>{completionPercentage}% Profile Complete</Text>
                            <TouchableOpacity onPress={navigateToEditProfile} style={styles.editButton}>
                                <Text style={styles.editProfileText}>Edit Profile </Text>
                                <Icon name="edit" size={20} color={theme.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Education Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Icon name="school" size={20} color={theme.primary}/>
                        <Text style={styles.sectionTitle}>Education</Text>
                    </View>
                    <View style={styles.educationItem}>
                        <Icon name="apartment" size={24} color="#666" style={styles.collegeIcon} />
                        <View style={styles.educationInfo}>
                            <Text style={styles.collegeName}>{profileData.college || 'Not specified'}</Text>
                            <Text style={styles.degree}>{`${profileData.course} (${profileData.branch})`}</Text>
                            <Text style={styles.year}>Current Year : {profileData.year}</Text>
                        </View>
                    </View>
                </View>

                {/* Goals Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Icon name="flag" size={20} color={theme.primary} />
                        <Text style={styles.sectionTitle}>Goals</Text>
                    </View>
                    <View style={styles.goalItem}>
                        <Icon name="star" size={18} color="#FFA000" style={styles.goalIcon} />
                        <Text style={styles.goalValue}>
                            <Text style={styles.goalLabel}>Primary:</Text> {profileData.primary_goal || 'Not set'}
                        </Text>
                    </View>
                    <View style={styles.goalItem}>
                        <Icon name="star-outline" size={18} color="#FFA000" style={styles.goalIcon} />
                        <Text style={styles.goalValue}>
                            <Text style={styles.goalLabel}>Secondary:</Text> {profileData.secondary_goal || 'Not set'}
                        </Text>
                    </View>
                </View>

                {/* Skills Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Icon name="code" size={20} color={theme.primary} />
                        <Text style={styles.sectionTitle}>Skills</Text>
                    </View>
                    <View style={styles.skillsContainer}>
                        {profileData.skill && profileData.skill.length > 0 ? (
                            profileData.skill.map((skills, index) => (
                                <View key={index} style={styles.skillTag}>
                                    <Text style={styles.skillText}>{skills}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.emptyText}>No skills added yet</Text>
                        )}
                    </View>
                </View>

                {/* Documents Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Icon name="description" size={20} color={theme.primary} />
                        <Text style={styles.sectionTitle}>Documents</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.documentItem}
                        onPress={() => profileData.Resume_path && handleLinkPress(profileData.Resume_path, "resume")}
                    >
                        <Icon
                            name="description"
                            size={24}
                            color={profileData.Resume_path ? theme.primary: theme.primaryLight}
                            style={styles.documentIcon}
                        />
                        <Text style={profileData.Resume_path ? styles.linkText : styles.linkTextDisabled}>
                            {profileData.Resume_path ? 'View Resume' : 'Resume not uploaded'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Connect Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Icon name="public" size={20} color={theme.primary} />
                        <Text style={styles.sectionTitle}>Connect</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.documentItem}
                        onPress={() => profileData.linkedin_url && handleLinkPress(profileData.linkedin_url, "linkedin")}
                    >
                        <Icon
                            name="linked-camera"
                            size={24}
                            color={profileData.linkedin_url ? theme.primary : theme.primaryLight}
                            style={styles.documentIcon}
                        />
                        <Text style={profileData.linkedin_url ? styles.linkText : styles.linkTextDisabled}>
                            {profileData.linkedin_url ? 'LinkedIn Profile' : 'LinkedIn not connected'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Portal>
                <Modal
                    visible={isImageModalVisible}
                    transparent
                    onRequestClose={() => setIsImageModalVisible(false)}
                    onPress={() => setIsImageModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPressOut={() => setIsImageModalVisible(false)}
                    >
                        <View style={styles.modalContent}>
                            <Image
                                source={{ uri: profileData.Profile_image_path }}
                                style={styles.modalImage}
                                resizeMode="contain"
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </Portal>
        </PaperProvider>
    );
};



export default ProfileScreen;
