import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import Colors from '../../constants/Colors';
import { useLogin } from '../../Login_id_passing';
import axios from 'axios';

export default function RoadmapForm({ navigation }) {
    const [title, setTitle] = useState('');
    const [careerInterest, setCareerInterest] = useState('');
    const [primaryGoal, setPrimaryGoal] = useState('');
    const [secondaryGoal, setSecondaryGoal] = useState('');
    const [duration, setDuration] = useState('');
    const { loginId } = useLogin();

    const handleSubmit = () => {
        if (!title || !careerInterest || !primaryGoal) {
            Alert.alert('Missing Fields', 'Please fill all required fields.');
            return;
        }
        if (duration < 90) {
            Alert.alert('Required', 'Duration should be at least 90 days.');
            return;
        }

        const roadmapData = {
            title,
            careerInterest,
            primaryGoal,
            secondaryGoal,
            duration,
            profileId: loginId.profile_id,
            login_id: loginId.login_id,
        };

        // Navigate to loader with form data for API call
        navigation.navigate('RoadmapLoader', {
            targetScreen: 'RoadmapTimeline',
            roadmapFormData: roadmapData
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>{'< Back'}</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Create New Roadmap</Text>
            <TextInput
                style={styles.input}
                placeholder="Title*"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor={Colors.gray}
            />
            <TextInput
                style={styles.input}
                placeholder="Career Interest*"
                value={careerInterest}
                onChangeText={setCareerInterest}
                placeholderTextColor={Colors.gray}
            />
            <TextInput
                style={styles.input}
                placeholder="Primary Goal*"
                value={primaryGoal}
                onChangeText={setPrimaryGoal}
                placeholderTextColor={Colors.gray}
            />
            <TextInput
                style={styles.input}
                placeholder="Secondary Goal"
                value={secondaryGoal}
                onChangeText={setSecondaryGoal}
                placeholderTextColor={Colors.gray}
            />
            <TextInput
                style={styles.input}
                placeholder="Duration (days)"
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
                placeholderTextColor={Colors.gray}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: Colors.background,
        flexGrow: 1,
    },
    backBtn: {
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        color: Colors.textDark,
        backgroundColor: Colors.primaryLight,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: Colors.textLight,
        fontWeight: 'bold',
        fontSize: 18,
    },
});
       