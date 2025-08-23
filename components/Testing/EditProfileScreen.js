import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ScrollView,
    Image,
    Button,
    Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as DocumentPicker from 'expo-document-picker';
import { TextInput, Modal, Portal, Chip, Provider as PaperProvider } from 'react-native-paper';
import axios from 'axios';
import { eventBus } from './Event_emitter';
import {useLogin} from "../../Login_id_passing";
const EditProfileScreen = ({ route, navigation }) => {
    const { profileData } = route.params;
    const [imageFile, setImageFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);
    const [formData, setFormData] = useState({ ...profileData });
    const [isUploading, setIsUploading] = useState(false);
    const [goalModalVisible, setGoalModalVisible] = useState(false);
    const [goalType, setGoalType] = useState('primary');
    const [skillModalVisible, setSkillModalVisible] = useState(false);
    const [skillSearchQuery, setSkillSearchQuery] = useState('');
    const {loginId}=useLogin();
    const availableGoals = ['Get a Job', 'Pursue Higher Studies', 'Startup', 'Freelance', 'Get a Job', 'Pursue Higher Studies', 'Startup', 'Freelance', 'Get a Job', 'Pursue Higher Studies', 'Startup', 'Freelance', 'Get a Job', 'Pursue Higher Studies', 'Startup', 'Freelance', 'Get a Job', 'Pursue Higher Studies', 'Startup', 'Freelance', 'Get a Job', 'Pursue Higher Studies', 'Startup', 'Freelance', 'Get a Job', 'Pursue Higher Studies', 'Startup', 'Freelance'];
    const availableSkills = [
        "React Native", "React", "JavaScript", "TypeScript", "Node.js", "Express.js", "MongoDB", "SQL", "PostgreSQL",
        "Firebase", "AWS", "Google Cloud", "Azure", "HTML", "CSS", "SASS", "Tailwind CSS", "Bootstrap", "Next.js",
        "Vue.js", "Angular", "Python", "Java", "C", "C++", "C#", "Kotlin", "Swift", "Objective-C", "Dart", "Flutter",
        "Go", "Rust", "PHP", "Laravel", "Ruby", "Ruby on Rails", "Perl", "R", "MATLAB", "Pandas", "NumPy", "Scikit-learn",
        "TensorFlow", "Keras", "PyTorch", "OpenCV", "NLTK", "Matplotlib", "Seaborn", "Power BI", "Tableau", "Excel",
        "Git", "GitHub", "Bitbucket", "Docker", "Kubernetes", "Linux", "Bash", "Shell Scripting", "CI/CD", "Jenkins",
        "Agile", "Scrum", "JIRA", "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "InDesign", "Lightroom",
        "After Effects", "Premiere Pro", "Canva", "UI/UX Design", "Wireframing", "Prototyping", "REST API", "GraphQL",
        "Socket.IO", "WebSockets", "JSON", "XML", "JWT", "OAuth", "WebRTC", "Redux", "MobX", "Zustand", "Recoil",
        "Formik", "React Hook Form", "Yup", "ESLint", "Prettier", "Webpack", "Vite", "Rollup", "Babel", "Vercel",
        "Netlify", "Heroku", "Render", "Stripe", "PayPal", "Razorpay", "Machine Learning", "Deep Learning",
        "Computer Vision", "Natural Language Processing", "Data Analysis", "Data Visualization", "Big Data",
        "Data Engineering", "Data Science", "DevOps", "Backend Development", "Frontend Development", "Full Stack Development",
        "App Development", "Mobile Development", "iOS Development", "Android Development", "Security", "Cybersecurity",
        "Ethical Hacking", "Penetration Testing", "Blockchain", "Solidity", "Web3.js", "Metamask", "NFTs", "Smart Contracts",
        "DApps", "Cryptography", "SEO", "SEM", "Digital Marketing", "Content Writing", "Copywriting", "Technical Writing",
        "Blogging", "Affiliate Marketing", "Social Media Marketing", "Email Marketing", "Google Ads", "Facebook Ads",
        "LinkedIn Ads", "Market Research", "Sales", "Cold Calling", "Lead Generation", "CRM", "Customer Service",
        "Public Speaking", "Team Leadership", "Time Management", "Critical Thinking", "Problem Solving",
        "Project Management", "MS Office", "Word", "PowerPoint", "Notion", "Trello", "Slack", "Zoom", "Miro",
        "ClickUp", "Asana", "English Communication", "Hindi Communication", "Tamil Communication", "Telugu Communication",
        "Marathi Communication", "Kannada Communication", "Urdu Communication", "Punjabi Communication", "Gujarati Communication",
        "French", "German", "Spanish", "Mandarin", "Japanese", "Korean", "Arabic", "Russian", "Turkish", "Ukrainian",
        "Leadership", "Adaptability", "Creativity", "Collaboration", "Innovation", "Empathy", "Emotional Intelligence",
        "Decision Making", "Negotiation", "Conflict Resolution", "Mentoring", "Research", "Presentation Skills",
        "Financial Literacy", "Budgeting", "Investment", "Accounting", "Economics", "Law Basics", "Business Strategy",
        "Entrepreneurship", "Startup Management", "Product Management", "Game Development", "Unity", "Unreal Engine",
        "3D Modeling", "Blender", "AutoCAD", "SolidWorks", "Electronics", "IoT", "Arduino", "Raspberry Pi"
    ];
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={upload} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            ),
        });
    }, [formData]);

    const handleInputChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        });
    };
    const handleUploadImage = async () => {
        try {
            setIsUploading(true);
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*',
            });
            console.log(result);
            if (!result.canceled) {
                Alert.alert('Success', 'Image selected', [
                    {
                        text: 'OK', onPress: () => {
                            setFormData({ ...formData, Profile_image_path: result.assets[0].uri });
                            setImageFile(result.assets[0]);
                        }
                    }
                ]);
            }
        } catch (err) {
            console.error('Error uploading image:', err);
            Alert.alert('Error', 'Failed to select image');
        } finally {
            setIsUploading(false);
        }
    };
    const handleUploadResume = async () => {
        try {
            setIsUploading(true);
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
            });

            if (!result.canceled) {
                Alert.alert('Success', 'Resume selected', [
                    {
                        text: 'OK', onPress: () => {
                            setFormData({ ...formData, Resume_path: result.assets[0].uri })
                            setPdfFile(result.assets[0]);
                        }
                    }
                ]);
            }
        } catch (err) {
            console.error('Error uploading resume:', err);
            Alert.alert('Error', 'Failed to select resume');
        } finally {
            setIsUploading(false);
        }
    };
    const validateForm = () => {
        if (!formData.firstName?.trim()) return Alert.alert("Validation Error", "First name is required.");
        if (!formData.lastName?.trim()) return Alert.alert("Validation Error", "Last name is required.");
        if (!formData.nickname?.trim()) return Alert.alert("Validation Error", "Nickname is required.");
        if (!formData.mobile?.trim()) return Alert.alert("Validation Error", "Mobile number is required.");
        if (!/^\d{10}$/.test(formData.mobile)) return Alert.alert("Validation Error", "Mobile number must be 10 digits.");
        if (!formData.college?.trim()) return Alert.alert("Validation Error", "College is required.");
        if (!formData.course?.trim()) return Alert.alert("Validation Error", "Course is required.");
        if (!formData.branch?.trim()) return Alert.alert("Validation Error", "Branch is required.");
        if (!formData.year?.trim()) return Alert.alert("Validation Error", "Year is required.");
        if (isNaN(formData.year) || parseInt(formData.year) > 4) return Alert.alert("Validation Error", "Year must be a number less than or equal to 4.");
        if (!formData.primary_goal?.trim()) return Alert.alert("Validation Error", "Primary goal is required.");
        if (!formData.secondary_goal?.trim()) return Alert.alert("Validation Error", "Secondary goal is required.");
        if (!formData.skill?.length) return Alert.alert("Validation Error", "At least one skill is required.");
        if (!formData.linkedin_url?.trim()) return Alert.alert("Validation Error", "LinkedIn URL is required.");
        if (!formData.Resume_path?.trim()) return Alert.alert("Validation Error", "Resume upload is required.");
        return true;
    };

    const handleSave = () => {
        upload();
    };
    const upload = async () => {
        if (!validateForm()) return;
        const formDataTo = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                formDataTo.append(key, value.join(','));
            } else {
                formDataTo.append(key, value);
            }
        });

        // Append files
        if (imageFile) {
            formDataTo.append('Profile_image_path', {
                uri: imageFile.uri,
                name: imageFile.name || 'image.jpg',
                type: imageFile.mimeType || 'image/jpeg',
            });
        }

        if (pdfFile) {
            formDataTo.append('Resume_path', {
                uri: pdfFile.uri,
                name: pdfFile.name || 'resume.pdf',
                type: pdfFile.mimeType || 'application/pdf',
            });
        }

        try {
            const response = await axios.put(
                `https://futureguide-backend.onrender.com/api/profiles/${loginId.login_id}`,
                formDataTo,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log("Succeeded");
            eventBus.emit("profileSaved", formData);
            navigation.goBack();
        } catch (err) {
            alert("Something went wrong, please try again");
            console.log(err);
        }
    };
    const handleLinkPress = (url) => {
        Alert.alert(
            'Open Link',
            `Do you want to open ${url}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Open',
                    onPress: async () => {
                        const supported = await Linking.canOpenURL(url);
                        if (supported) {
                            Linking.openURL(url);
                        } else {
                            Alert.alert("Can't open this URL:", url);
                        }
                    },
                },
            ]
        );
    };
    return (
        <PaperProvider>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={90}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >

                    <View style={styles.imageSection}>
                        <TouchableOpacity style={styles.imageContainer} onPress={() => setIsImageModalVisible(true)}>
                            <Image
                                source={{ uri: formData.Profile_image_path }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>

                        <View style={styles.changeImageButton}>
                            <Button title="Change Image" onPress={handleUploadImage} />
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        {/* <Text style={styles.label}>First Name</Text> */}
                        <TextInput
                            mode="outlined"
                            value={formData.firstName}
                            onChangeText={(text) => handleInputChange('firstName', text)}
                            label="FirstName"
                            style={{ backgroundColor: '#fff' }}

                        />
                    </View>

                    <View style={styles.formGroup}>
                        {/* <Text style={styles.label}>Last Name</Text> */}
                        <TextInput
                            mode="outlined"
                            value={formData.lastName}
                            onChangeText={(text) => handleInputChange('lastName', text)}
                            label="LastName"
                            style={{ backgroundColor: '#fff' }}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        {/* <Text style={styles.label}>NickName</Text> */}
                        <TextInput
                            mode="outlined"
                            value={formData.nickname}
                            onChangeText={(text) => handleInputChange('nickname', text)}
                            label="NickName"
                            style={{ backgroundColor: '#fff' }}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        {/* <Text style={styles.label}>Mobile</Text> */}
                        <TextInput
                            mode="outlined"
                            value={formData.mobile}
                            onChangeText={(text) => handleInputChange('mobile', text)}
                            label="Mobile number"
                            style={{ backgroundColor: '#fff' }}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        {/* <Text style={styles.label}>College</Text> */}
                        <TextInput
                            mode="outlined"
                            value={formData.college}
                            onChangeText={(text) => handleInputChange('college', text)}
                            label="College Name"
                            style={{ backgroundColor: '#fff' }}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        {/* <Text style={styles.label}>Course</Text> */}
                        <TextInput
                            mode="outlined"
                            value={formData.course}
                            onChangeText={(text) => handleInputChange('course', text)}
                            label="Course"
                            style={{ backgroundColor: '#fff' }}
                        />
                    </View>


                    <View style={styles.formGroup}>
                        {/* <Text style={styles.label}>Branch</Text> */}
                        <TextInput
                            mode="outlined"
                            value={formData.branch}
                            onChangeText={(text) => handleInputChange('branch', text)}
                            label="Branch"
                            style={{ backgroundColor: '#fff' }}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        {/* <Text style={styles.label}>Current Year</Text> */}
                        <TextInput
                            mode="outlined"
                            value={formData.year}
                            onChangeText={(text) => handleInputChange('year', text)}
                            label="Year of Study"
                            style={{ backgroundColor: '#fff' }}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Primary Goal</Text>
                        <TouchableOpacity onPress={() => { setGoalType('primary'); setGoalModalVisible(true); }}>
                            <TextInput
                                mode="outlined"
                                value={formData.primary_goal}
                                editable={false}
                                right={<TextInput.Icon name="menu-down" />}
                                style={{ backgroundColor: '#fff' }}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Secondary Goal</Text>
                        <TouchableOpacity onPress={() => { setGoalType('secondary'); setGoalModalVisible(true); }}>
                            <TextInput
                                mode="outlined"
                                value={formData.secondary_goal}
                                editable={false}
                                right={<TextInput.Icon name="menu-down" />}
                                style={{ backgroundColor: '#fff' }}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Skills</Text>
                        <TouchableOpacity onPress={() => setSkillModalVisible(true)}>
                            <TextInput
                                mode="outlined"
                                value={formData.skill.join(', ')}
                                editable={false}
                                right={<TextInput.Icon name="menu-down" />}
                                style={{ backgroundColor: '#fff' }}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>LinkedIn URL</Text>
                        <TextInput
                            mode="outlined"
                            value={formData.linkedin_url}
                            onChangeText={(text) => handleInputChange('linkedin_url', text)}
                            placeholder="https://linkedin.com/in/username"
                            keyboardType="url"
                            style={{ backgroundColor: '#fff' }}
                        />
                    </View>


                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Resume</Text>
                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={handleUploadResume}
                            disabled={isUploading}
                        >
                            <Icon name="cloud-upload" size={20} color="#fff" style={styles.uploadIcon} />
                            <Text style={styles.uploadButtonText}>
                                {isUploading ? 'Uploading...' :
                                    formData.Resume_path ? 'Change Resume' : 'Upload Resume'}
                            </Text>
                        </TouchableOpacity>
                        {formData.resume && (
                            <Text style={styles.fileName} numberOfLines={1}>
                                {formData.resume.split('/').pop()}
                            </Text>
                        )}
                    </View>

                    {/* <TouchableOpacity style={styles.resumeContainer} onPress={() => { handleLinkPress(formData.Resume_path) }} >
                        <Text style={styles.resumeText}>View Resume</Text>
                    </TouchableOpacity> */}

                </ScrollView>

                {/* Goal Modal */}
                <Portal>
                    <Modal visible={goalModalVisible} onDismiss={() => setGoalModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select {goalType === 'primary' ? 'Primary' : 'Secondary'} Goal</Text>
                        <ScrollView style={{ maxHeight: 300 }}>
                            {availableGoals.map((goal, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.option}
                                    onPress={() => {
                                        setFormData({ ...formData, [goalType === 'primary' ? 'primary_goal' : 'secondary_goal']: goal });
                                        setGoalModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.optionText}>{goal}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Modal>
                </Portal>

                {/* Skills Modal */}
                <Portal>
                    <Modal visible={skillModalVisible} onDismiss={() => setSkillModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select Skills</Text>

                        <TextInput
                            mode="outlined"
                            placeholder="Search skills..."
                            value={skillSearchQuery}
                            onChangeText={setSkillSearchQuery}
                            style={{ marginBottom: 10 }}
                        />

                        <ScrollView style={{ maxHeight: 300 }}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {availableSkills
                                    .filter(skill => skill.toLowerCase().includes(skillSearchQuery.toLowerCase()))
                                    .map(skill => (
                                        <Chip
                                            key={skill}
                                            style={{ margin: 4 }}
                                            selected={formData.skill.includes(skill)}
                                            onPress={() => {
                                                const updatedSkills = formData.skill.includes(skill)
                                                    ? formData.skill.filter(s => s !== skill)
                                                    : [...formData.skill, skill];
                                                setFormData({ ...formData, skill: updatedSkills });
                                            }}
                                        >
                                            {skill}
                                        </Chip>
                                    ))
                                }
                            </View>
                        </ScrollView>

                        <Button title="Done" onPress={() => setSkillModalVisible(false)} style={{ marginTop: 16 }} />
                    </Modal>

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
                                    source={{ uri: formData.Profile_image_path }}
                                    style={styles.modalImage}
                                    resizeMode="contain"
                                />
                            </View>
                        </TouchableOpacity>
                    </Modal>


                </Portal>

            </KeyboardAvoidingView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    saveButton: {
        marginRight: 15,
        padding: 8,
    },
    saveButtonText: {
        color: '#4a90e2',
        fontWeight: 'bold',
        fontSize: 16,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
        color: '#333',
        fontWeight: '500',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4a90e2',
        padding: 12,
        borderRadius: 6,
    },
    uploadIcon: {
        marginRight: 8,
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    fileName: {
        marginTop: 8,
        fontSize: 14,
        color: '#666',
        paddingLeft: 5,
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    option: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    imageSection: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },

    imageContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        overflow: 'hidden',
        backgroundColor: '#eee',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },

    image: {
        width: '100%',
        height: '100%',
    },
    changeImageButton: {
        marginTop: 12,
        width: 160,
    },
    resumeContainer: {
        backgroundColor: '#4a90e2',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        elevation: 3, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    resumeText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
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
        width:'90%',
        height:'90%',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor:"red"
    },
    modalImage: {
       width: 250,
        height: 250,
        borderRadius:125,
        overflow: 'hidden',
        backgroundColor: '#eee',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },


});

export default EditProfileScreen;
