import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, Alert, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Button } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { useLogin } from '../../Login_id_passing';
import { useTheme } from '../../ThemeContext';
import ResLoader from './ResLoder';
import { set } from 'lodash';


export default function ResumeHome({ navigation }) {
    const { loginId } = useLogin();
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const [upload, setUpload] = useState(1); // 1 = not picked, 2 = ready, 3 = failed
    const [pickedFile, setPickedFile] = useState(null);
    const [backData, uploadBackData] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const profileId = loginId?.profile_id || 'asdfgsadgf';
    const Height = Dimensions.get('window').height;
    const { theme } = useTheme();
    const [loader, setloader] = useState(false);

    const pickPDF = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: false,
            });

            if (!result.canceled) {
                const file = result.assets[0];
                if (file.size > MAX_SIZE) {
                    Alert.alert('File too large', 'Please select a PDF under 10MB.');
                    setUpload(3);
                } else {
                    setPickedFile(file);
                    setUpload(2);
                    Alert.alert('File Selected', 'Resume file is ready to submit.');
                }
            } else {
                console.log('Document picker cancelled');
                setUpload(3);
            }
        } catch (error) {
            console.error('Error picking PDF:', error);
            setUpload(3);
            Alert.alert('Error', 'Could not pick the PDF.');
        }
    };

    const handleSubmit = async () => {
        // console.log('Submit pressed. Upload:', upload, 'Picked File:', pickedFile);
        // navigation.navigate('ResLoader', { pending: true });
        setloader(true);
        if (upload === 2 && pickedFile) {

            // setIsUploading(true);

            const formData = new FormData();
            formData.append('resumeFile', {
                uri: pickedFile.uri,
                name: pickedFile.name,
                type: 'application/pdf',
            });
            formData.append('profileId', profileId);

            try {
                navigation.navigate('ResLoader', { pending: true });
                // console.log('Uploading to backend...');
                const response = await axios.post(
                    'https://futureguide-backend.onrender.com/api/resume-analysis/analyze',
                    formData,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        timeout: 60000,
                    }
                );

                const resData = response.data.data;
                console.log('Upload successful:', resData);
                uploadBackData(resData);
                setloader(false);
                // Alert.alert('Success', 'Resume uploaded and analyzed successfully!');
                navigation.navigate('ResumeDetail', { data: resData });
                // const formData = new FormData();

            } catch (error) {
                console.error('Upload error:', error);
                Alert.alert(
                    'Upload Failed',
                    error.response?.data?.message || 'Failed to analyze resume. Please try again.'
                );
            } finally {
                setIsUploading(false);
            }
        } else if (upload === 1) {
            Alert.alert('No File Picked', 'Please upload your resume PDF before submitting.');
        } else {
            Alert.alert('Upload Failed', 'Please try uploading the file again.');
        }
    };

    const styles = StyleSheet.create({
        header: {
            backgroundColor: theme.primary,
            paddingHorizontal: 20,
            paddingTop: 30,
            paddingBottom: 20,
            alignItems: "flex-start",
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
        },
        title: {
            fontSize: 24,
            color: "#fff",
            fontWeight: "700",
        },
        subtitle: {
            fontSize: 14,
            color: "#E6E6E6",
            marginTop: 4,
        },
        resoverall: {
            flex: 1,
            // paddingHorizontal: 20,
            // paddingVertical: 30,
            justifyContent: 'flex-start',
            alignItems: 'stretch',
        },
        reshead1: {
            fontSize: 24,
            fontWeight: '600',
            marginBottom: 8,
        },
        reshead2: {
            fontSize: 15,
            fontWeight: '400',
            color: 'grey',
        },
        notice: {
            textAlign: 'center',
            fontWeight: '400',
            fontSize: 16,
            marginVertical: 10,
        },
        imgtag: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        uploadBox: {
            height: Height * 0.56,
            width: 300,
            // backgroundColor: '#212121',
            // borderWidth: 2,
            // borderColor: 'red',
            // borderStyle: 'dashed',
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#e8e8e8',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 6,
            backgroundColor: '#fff',
        },
        icon: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        uploadImage: {
            width: 250,
            height: 250,
            marginBottom: 10,
        },
        text: {
            marginTop: 16,
            justifyContent: 'center',
            alignItems: 'center',
        },
        label: {
            color: 'black',
            fontWeight: '400',
            fontSize: 16,
        },
        submitButton: {
            marginTop: 30,
            padding: 5,
            backgroundColor: theme.primary,
            marginBottom: 40,
            width: "70%",
            alignSelf: "center"

        },
    });

    if (loader)
        return <ResLoader setloader={setloader} />
    return (
        <View style={styles.resoverall}>
            <View style={styles.header}>
                <Text style={styles.title}>Analysis</Text>
                <Text style={styles.subtitle}>Make your Resume Smart than Ever</Text>
            </View>

            <View style={styles.imgtag}>
                {upload === 2 ? (
                    <Text style={[styles.notice, { color: 'green' }]}>Resume selected successfully</Text>
                ) : upload === 3 ? (
                    <Text style={[styles.notice, { color: 'red' }]}>Upload failed, please try again</Text>
                ) : null}

                <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={pickPDF}
                    disabled={isUploading}
                >
                    <View style={styles.icon}>
                        {upload === 2 ? (
                            <Image
                                source={require('../../assets/filled.png')}
                                style={styles.uploadImage}
                                resizeMode="contain"
                            />
                        ) : (
                            <Image
                                source={require('../../assets/empty.png')}
                                style={[styles.uploadImage, { opacity: 0.5 }]}
                                resizeMode="contain"
                            />
                        )}
                    </View>
                    <View style={styles.text}>
                        <Text style={styles.label}>
                            {upload === 2 ? "Resume Uploaded" : "Click to upload Resume PDF"}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <Button
                mode="contained"
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={isUploading}
            >
                {isUploading ? 'SUBMITTING...' : 'SUBMIT'}
            </Button>
        </View>
    );
}

const Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    resoverall: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 30,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    reshead1: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 8,
    },
    reshead2: {
        fontSize: 15,
        fontWeight: '400',
        color: 'grey',
    },
    notice: {
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 16,
        marginVertical: 10,
    },
    imgtag: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadBox: {
        height: Height * 0.56,
        width: 300,
        backgroundColor: '#212121',
        borderWidth: 2,
        borderColor: 'red',
        borderStyle: 'dashed',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#e8e8e8',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        color: '#e8e8e8',
        fontWeight: '400',
        fontSize: 16,
    },
    submitButton: {
        marginTop: 30,
        padding: 5,
        backgroundColor: '#004d40',
    },
});