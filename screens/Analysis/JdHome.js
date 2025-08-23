import React, { useState } from 'react';
import axios from 'axios';
import { View, StyleSheet, Alert, Text, ToastAndroid , TouchableOpacity} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { TextInput, Button, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useLogin } from '../../Login_id_passing';
// import { useTheme } from 'react-native-paper';\
import { useTheme } from '../../ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '../../constants/Colors';
export default function JdHome() {
    const navigation = useNavigation();
    const { loginId } = useLogin();
    const [resumePDF, setresumePDF] = useState(null);
    const [jobDescriptionPDF, setjobDescriptionPDF] = useState(null);
    const [linkedinPDF, setlinkedinPDF] = useState(null);
    const profileId = loginId.profile_id;
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    // console.log(theme);
    const pickDocument = async (setter) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const file = result.assets[0];
            if (file.size > 10 * 1024 * 1024) {
                Alert.alert('File too large', 'Max allowed size is 10MB');
                return;
            }

            setter(file);
        } catch (error) {
            Alert.alert('Error', 'Failed to pick document');
        }
    };

    const handleSubmit = async () => {
        if ((!resumePDF || !linkedinPDF) || !jobDescriptionPDF) {
            Alert.alert('Missing Fields', 'Please complete all fields');
            return;
        }
        const formData = new FormData();
        formData.append('profileId', profileId);

        formData.append('linkedinPDF',
            {
                uri: linkedinPDF.uri,
                name: linkedinPDF.name || 'linkedinPDF.pdf',
                type: 'application/pdf',
            });

        formData.append('resumePDF', {
            uri: resumePDF.uri,
            name: resumePDF.name || 'resumePDF.pdf',
            type: 'application/pdf',
        });

        formData.append('jobDescriptionPDF', {
            uri: jobDescriptionPDF.uri,
            name: jobDescriptionPDF.name || 'jobDescriptionPDF.pdf',
            type: 'application/pdf',
        });

        try {
            // console.log(formData);
            navigation.navigate('Jdloader', { pending: true });
            const response = await axios.post('https://futureguide-backend.onrender.com/api/analyses', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigation.replace('JdDetail', { data: response.data });

        } catch (error) {
            // Enhanced error logging for axios
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error('Axios error response:', error.response.data);
                console.error('Status:', error.response.status);
                console.error('Headers:', error.response.headers);
                Alert.alert('Upload Error', `Server error: ${error.response.data?.message || error.response.status}`);
            } else if (error.request) {
                // Request was made but no response received
                console.error('Axios error request:', error.request);
                Alert.alert('Upload Error', 'No response from server. Please check your network.');
            } else {
                // Something else happened
                console.error('Axios error message:', error.message);
                Alert.alert('Upload Error', error.message);
            }
        }
        // navigation.navigate('JdDetail', { data: jddetdata });
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            // backgroundColor: '#e0f7fa',
            // padding: 20,
        },
        outerContainer: {
            flex: 1,
            backgroundColor: theme.primary,
          },
          safeArea: {
            flex: 1,
            backgroundColor: theme.background,
          },
          header: {
            backgroundColor: theme.primary,
            paddingBottom: 10,
            paddingHorizontal: 20,
            elevation: 4,
            shadowColor: theme.shadowColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            gap:10,
            alignItems: 'center',
          },
          headerTitle: {
            color: theme.textLight,
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 5,
          },
          headerSubtitle: {
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: 15,
          },
          searchContainer1:{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 20,
            backgroundColor: theme.background,
        
          },
        heading: {
            fontSize: 24,
            fontWeight: '700',
            color:theme.primaryDark,
            marginBottom: 20,
            alignSelf: 'center',
        },
        subheading: {
            fontSize: 16,
            fontWeight: '500',
            color: '#555',
            marginBottom: 6,
            textAlign: 'center',
            paddingHorizontal: 10,
        },
        card: {
            marginVertical: 10,
            backgroundColor: '#ffffff',
            borderRadius: 10,
            elevation: 3,
        },
        uploadButton: {
            backgroundColor:theme.primary,
            marginTop: 10,
        },
        input: {
            marginTop: 10,
        },
        submitButton: {
            marginTop: 30,
            padding: 5,
            backgroundColor: theme.primaryDark,
        },
    });
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} />

        <SafeAreaView style={styles.safeArea}>

          <View style={[styles.header, { paddingTop: insets.top || 16 }]}>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>

              <MaterialIcons name="arrow-back" size={24} color={theme.textLight} />

            </TouchableOpacity>

            <Text style={styles.headerTitle}>Check Job Match</Text>

          </View>
          <View style={styles.searchContainer1}>
            <Text style={styles.heading}>Job Application Form</Text>
            <Text style={styles.subheading}>
                Upload your documents to get actionable insights on how to improve your fit.
            </Text>
            <Card style={styles.card}>
                <Card.Title title="Upload Resume" />
                <Card.Content>
                    <Button
                        mode="contained"
                        onPress={() => pickDocument(setresumePDF)}
                        icon="upload"
                        style={styles.uploadButton}
                    >
                        {resumePDF ? resumePDF.name : 'Select PDF'}
                    </Button>
                </Card.Content>
            </Card>
            <Card style={styles.card}>
                <Card.Title title="LinkedIn Pdf" />
                <Card.Content>
                    <Button
                        mode="contained"
                        onPress={() => pickDocument(setlinkedinPDF)}
                        icon="upload"
                        style={styles.uploadButton}
                    >
                        {linkedinPDF ? linkedinPDF.name : 'Upload PDF'}
                    </Button>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Title title="Upload Job Description" />
                <Card.Content>
                    <Button
                        mode="contained"
                        onPress={() => pickDocument(setjobDescriptionPDF)}
                        icon="upload"
                        style={styles.uploadButton}
                    >
                        {jobDescriptionPDF ? jobDescriptionPDF.name : 'Select PDF'}
                    </Button>
                </Card.Content>
            </Card>


            <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
            >
                Submit Application
            </Button>
            </View>
        </SafeAreaView>
        </View>
    );
}