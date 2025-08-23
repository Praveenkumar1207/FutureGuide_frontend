import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ScrollView,
    Dimensions,
    SafeAreaView,
    Animated,
} from 'react-native';
import {
    TextInput,
    Modal,
    Portal,
    Chip,
    Provider as PaperProvider,
    Button,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/Colors';
import { useTheme } from '../../ThemeContext';

const { width, height } = Dimensions.get('window');

export default function InterviewSetup({ navigation }) {
    const { theme } = useTheme();
    const styles = StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: '#f7fafc',
        },
        keyboardView: {
            flex: 1,
        },
        header: {
            backgroundColor: theme.primary,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 30,
            position: 'relative',
            overflow: 'hidden',
        },
        headerContent: {
            zIndex: 2,
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: 'bold',
            color: theme.textLight,
            marginBottom: 4,
        },
        headerSubtitle: {
            fontSize: 16,
            color: 'rgba(255,255,255,0.8)',
        },
        headerDecoration: {
            position: 'absolute',
            right: -30,
            top: -30,
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: 'rgba(245, 242, 242, 0.1)',
        },
        scrollView: {
            flex: 1,
        },
        scrollContainer: {
            paddingBottom: 30,
        },
        container: {
            padding: 20,
        },
        section: {
            marginBottom: 28,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: '600',
            color: theme.textDark,
            marginBottom: 16,
        },
        typeGrid: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 12,
        },
        typeCardContainer: {
            flex: 1,
        },
        typeCard: {
            padding: 20,
            borderRadius: 16,
            alignItems: 'center',
            backgroundColor: '#ffffff',
            shadowColor: '#000',
            // shadowOffset: { width: 0, height: 2 },
            // shadowOpacity: 0.1,
            // shadowRadius: 8,
            // elevation: 3,
            position: 'relative',
            minHeight: 100,
            justifyContent: 'center',
        },
        selectedTypeCard: {
            backgroundColor: theme.primary,
            // shadowColor: '#667eea',
            // shadowOpacity: 0.3,
            // shadowRadius: 12,
            // elevation: 8,
        },
        iconContainer: {
            width: 50,
            height: 50,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
        },
        typeCardTitle: {
            fontSize: 14,
            fontWeight: '600',
            textAlign: 'center',
        },
        checkIcon: {
            position: 'absolute',
            top: 8,
            right: 8,
        },
        technicalSection: {
            marginBottom: 0,
        },
        skillsSelector: {
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: 16,
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.05,
            // shadowRadius: 4,
            // elevation: 2,
        },
        skillsSelectorContent: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // backgroundColor: 'red',
        },
        skillsLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        skillsText: {
            fontSize: 16,
            color: theme.textDark,
            marginLeft: 12,
        },
        selectedSkillsPreview: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginTop: 12,
            // backgroundColor: 'red',

        },
        previewChip: {
            backgroundColor: theme.primaryLight,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.primary,
            // backgroundColor: 'red',

        },
        previewChipText: {
            fontSize: 12,
            color: theme.primary,
            fontWeight: '500',
            // backgroundColor: 'red',

        },
        moreChip: {
            backgroundColor: theme.bgLight,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.borderLight,
            // backgroundColor: 'red',

        },
        moreChipText: {
            fontSize: 12,
            color: theme.textMuted,
            fontWeight: '500',
        },
        levelGrid: {
            gap: 12,
        },
        questionGrid: {
            flexDirection: 'row',
            gap: 12,
        },
        optionContainer: {
            flex: 1,
        },
        optionCard: {
            backgroundColor: '#ffffff',
            padding: 16,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
            borderWidth: 2,
            borderColor: 'transparent',
        },
        selectedOptionCard: {
            backgroundColor: theme.primary,
            // borderColor: Colors.primary,
            // shadowColor: Colors.primary,
            // shadowOpacity: 0.2,
            // shadowRadius: 8,
            // elevation: 4,
        },
        optionIcon: {
            width: 24,
            height: 24,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9ff',
        },
        selectedOptionIcon: {
            backgroundColor: 'rgba(255,255,255,0.2)',
        },
        optionText: {
            fontSize: 16,
            fontWeight: '500',
            color: theme.textDark,
        },
        selectedOptionText: {
            color: '#ffffff',
            fontWeight: '600',
        },
        inputContainer: {
            backgroundColor: '#ffffff',
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
            // height: 500,
        },
        descriptionInput: {
            backgroundColor: '#ffffff',
            fontSize: 16,
            borderRadius: 12,
        },
        startButtonContainer: {
            marginTop: 20,
            // backgroundColor: 'red',
        },
        startButton: {
            // backgroundColor: '#667eea',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 18,
            borderRadius: 16,
            shadowColor: '#667eea',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
            gap: 8,
            backgroundColor: theme.primary,
        },
        startButtonText: {
            fontSize: 18,
            fontWeight: '600',
            color: '#ffffff',
        },
        modalContainer: {
            backgroundColor: '#ffffff',
            margin: 20,
            borderRadius: 20,
            maxHeight: height * 0.8,
            overflow: 'hidden',
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            // borderBottomColor: 'red',
            backgroundColor: '#ffffff',
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.textDark,
            // backgroundColor:'red'
        },
        closeButton: {
            padding: 4,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.primaryLight,
            margin: 16,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 12,
        },
        searchIcon: {
            marginRight: 12,
        },
        searchInput: {
            flex: 1,
            fontSize: 16,
            color: theme.textDark,
            padding: 0,
            backgroundColor: 'transparent',
        },
        modalScrollView: {
            maxHeight: 300,
            paddingHorizontal: 16,
        },
        chipContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            paddingBottom: 16,
        },
        skillChip: {
            backgroundColor: theme.primary,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            borderWidth: 1,
            borderColor: '#e2e8f0',
            // color: 'white',
        },
        selectedSkillChip: {
            backgroundColor: theme.primaryDark,
            borderColor: '#667eea',
        },
        skillChipText: {
            fontSize: 14,
            color: 'white',
            fontWeight: '500',
        },
        selectedSkillChipText: {
            color: '#ffffff',
        },
        chipCheckIcon: {
            marginLeft: 4,
        },
        modalDoneButton: {
            backgroundColor: theme.primaryDark,
            margin: 16,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
        },
        modalDoneText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#ffffff',
        },
    });
    const [interviewType, setInterviewType] = useState('');
    const [selectedTechs, setSelectedTechs] = useState([]);
    const [level, setLevel] = useState('');
    const [question, setquestion] = useState('');
    const [description, setDescription] = useState('');
    const [skillModalVisible, setSkillModalVisible] = useState(false);
    const [skillSearchQuery, setSkillSearchQuery] = useState('');
    const [fadeAnim] = useState(new Animated.Value(0));


    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const availableSkills = [
        "React Native", "React", "JavaScript", "TypeScript", "Node.js", "Express.js",
        "MongoDB", "SQL", "PostgreSQL", "Firebase", "AWS", "Google Cloud", "Azure",
        "HTML", "CSS", "SASS", "Tailwind CSS", "Bootstrap", "Next.js", "Vue.js",
        "Angular", "Python", "Java", "C", "C++", "C#", "Kotlin", "Swift", "Objective-C",
        "Dart", "Flutter", "Go", "Rust", "PHP", "Laravel", "Ruby", "Ruby on Rails",
        "Machine Learning", "Deep Learning", "Computer Vision", "Data Science",
        "DevOps", "Backend Development", "Frontend Development", "Full Stack Development",
        "Mobile Development", "iOS Development", "Android Development", "Security",
        "Cybersecurity", "Blockchain", "Game Development", "Unity", "IoT", "Arduino"
    ];

    const startInterview = () => {
        if (interviewType && question && description.trim()) {
            navigation.navigate('Questions', {
                selectedTechs,
                level,
                question,
                description,
                interviewType,
            });

            setInterviewType('');
            setSelectedTechs([]);
            setLevel('');
            setquestion('');
            setDescription('');
        } else {
            alert('Please fill all the fields before starting the interview.');
        }
    };

    const handleSkillSelect = (skill) => {
        const updated = selectedTechs.includes(skill)
            ? selectedTechs.filter(s => s !== skill)
            : [...selectedTechs, skill];
        setSelectedTechs(updated);
    };

    const InterviewTypeCard = ({ type, icon, gradient, isSelected, onPress }) => (
        <TouchableOpacity onPress={onPress} style={styles.typeCardContainer}>
            <View style={[
                styles.typeCard,
                isSelected && styles.selectedTypeCard,
                { backgroundColor: isSelected ? gradient : '#ffffff' }
            ]}>
                <View style={[styles.iconContainer, { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : theme.primaryLight }]}>
                    <Icon name={icon} size={28} color={isSelected ? theme.textLight : theme.primary} />
                </View>
                <Text style={[styles.typeCardTitle, { color: isSelected ? theme.textLight : theme.textDark }]}>{type}</Text>
                {isSelected && <Icon name="check-circle" size={20} color={theme.textLight} style={styles.checkIcon} />}
            </View>
        </TouchableOpacity>
    );

    const CustomOption = ({ label, isSelected, onPress, icon }) => (
        <TouchableOpacity onPress={onPress} style={styles.optionContainer}>
            <View style={[styles.optionCard, isSelected && styles.selectedOptionCard]}>
                {icon && (
                    <View style={[styles.optionIcon, isSelected && styles.selectedOptionIcon]}>
                        <Icon name={icon} size={16} color={isSelected ? theme.textLight : theme.primary} />
                    </View>
                )}
                <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>{label}</Text>
                {isSelected && <Icon name="check" size={16} color={theme.textLight} />}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                <PaperProvider>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerContent}>
                            <Text style={styles.headerTitle}>Q&A Prep</Text>
                            <Text style={styles.headerSubtitle}>Let's customize your experience</Text>
                        </View>
                        <View style={styles.headerDecoration} />
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                        bounces={true}
                    >
                        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

                            {/* Interview Type */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Choose Interview Type</Text>
                                <View style={styles.typeGrid}>
                                    <InterviewTypeCard
                                        type="Technical"
                                        icon="code"
                                        colors="red"
                                        gradient={theme.primaryDark}
                                        isSelected={interviewType === 'Technical'}
                                        onPress={() => setInterviewType('Technical')}
                                    />
                                    <InterviewTypeCard
                                        type="Behavioral"
                                        icon="psychology"
                                        gradient={theme.primaryDark}
                                        isSelected={interviewType === 'Behavioral'}
                                        onPress={() => setInterviewType('Behavioral')}
                                    />
                                    <InterviewTypeCard
                                        type="HR"
                                        icon="people"
                                        color="red" // <-- Add this
                                        gradient={theme.primaryDark}
                                        isSelected={interviewType === 'HR'}
                                        onPress={() => setInterviewType('HR')}
                                    />
                                </View>
                            </View>

                            {/* Technical Skills */}
                            {interviewType === "Technical" && (
                                <Animated.View style={styles.technicalSection}>
                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>Select Technologies</Text>
                                        <TouchableOpacity onPress={() => setSkillModalVisible(true)} style={styles.skillsSelector}>
                                            <View style={styles.skillsSelectorContent}>
                                                <View style={styles.skillsLeft}>
                                                    <Icon name="build" size={20} color={theme.primary} />
                                                    <Text style={styles.skillsText}>
                                                        {selectedTechs.length > 0 ? `${selectedTechs.length} skills selected` : 'Tap to select skills'}
                                                    </Text>
                                                </View>
                                                <Icon name="arrow-forward-ios" size={16} color={theme.textMuted} />
                                            </View>
                                        </TouchableOpacity>

                                        {selectedTechs.length > 0 && (
                                            <View style={styles.selectedSkillsPreview}>
                                                {selectedTechs.slice(0, 4).map((skill, index) => (
                                                    <View key={index} style={styles.previewChip}>
                                                        <Text style={styles.previewChipText}>{skill}</Text>
                                                    </View>
                                                ))}
                                                {selectedTechs.length > 4 && (
                                                    <View style={styles.moreChip}>
                                                        <Text style={styles.moreChipText}>+{selectedTechs.length - 4}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>Proficiency Level</Text>
                                        <View style={styles.levelGrid}>
                                            <CustomOption
                                                label="Beginner"
                                                icon="trending-up"
                                                isSelected={level === 'Beginner'}
                                                onPress={() => setLevel('Beginner')}
                                            />
                                            <CustomOption
                                                label="Intermediate"
                                                icon="show-chart"
                                                isSelected={level === 'Intermediate'}
                                                onPress={() => setLevel('Intermediate')}
                                            />
                                            <CustomOption
                                                label="Advanced"
                                                icon="rocket-launch"
                                                isSelected={level === 'Advanced'}
                                                onPress={() => setLevel('Advanced')}
                                            />
                                        </View>
                                    </View>
                                </Animated.View>
                            )}

                            {/* Questions Count */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Number of Questions</Text>
                                <View style={styles.questionGrid}>
                                    {['5', '10', '15', '20'].map((num) => (
                                        <CustomOption
                                            key={num}
                                            label={num}
                                            isSelected={question === num}
                                            onPress={() => setquestion(num)}
                                        />
                                    ))}
                                </View>
                            </View>

                            {/* Description */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Focus Areas</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        mode="outlined"
                                        placeholder="What would you like to focus on? (e.g., React hooks, algorithms, problem solving...)"
                                        value={description}
                                        onChangeText={setDescription}
                                        multiline
                                        numberOfLines={4}
                                        style={styles.descriptionInput}
                                        outlineColor="transparent"
                                        activeOutlineColor={theme.primary}
                                        
                                        // theme={{
                                        //     colors: {
                                        //         primary: '#667eea',
                                        //         background: '#ffffff'
                                        //     }
                                        // }}
                                    />
                                </View>
                            </View>

                            {/* Start Button */}
                            <TouchableOpacity onPress={startInterview} style={styles.startButtonContainer}>
                                <View style={styles.startButton}>
                                    <Icon name="play-arrow" size={24} color={theme.textLight} />
                                    <Text style={styles.startButtonText}>Start Interview</Text>
                                </View>
                            </TouchableOpacity>

                        </Animated.View>
                    </ScrollView>

                    {/* Skills Modal */}
                    <Portal>
                        <Modal
                            visible={skillModalVisible}
                            onDismiss={() => setSkillModalVisible(false)}
                            contentContainerStyle={styles.modalContainer}
                        >
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Skills</Text>
                                <TouchableOpacity onPress={() => setSkillModalVisible(false)} style={styles.closeButton}>
                                    <Icon name="close" size={24} color={theme.textDark} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.searchContainer}>
                                <Icon name="search" size={20} color={theme.textMuted} style={styles.searchIcon} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search skills..."
                                    value={skillSearchQuery}
                                    onChangeText={setSkillSearchQuery}
                                    placeholderTextColor={theme.textMuted}
                                />
                            </View>

                            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                                <View style={styles.chipContainer}>
                                    {availableSkills
                                        .filter(skill => skill.toLowerCase().includes(skillSearchQuery.toLowerCase()))
                                        .map(skill => (
                                            <TouchableOpacity
                                                key={skill}
                                                onPress={() => handleSkillSelect(skill)}
                                                style={[
                                                    styles.skillChip,
                                                    selectedTechs.includes(skill) && styles.selectedSkillChip
                                                ]}
                                            >
                                                <Text style={[
                                                    styles.skillChipText,
                                                    selectedTechs.includes(skill) && styles.selectedSkillChipText
                                                ]}>
                                                    {skill}
                                                </Text>
                                                {selectedTechs.includes(skill) && (
                                                    <Icon name="check" size={16} color={theme.textLight} style={styles.chipCheckIcon} />
                                                )}
                                            </TouchableOpacity>
                                        ))}
                                </View>
                            </ScrollView>

                            <TouchableOpacity onPress={() => setSkillModalVisible(false)} style={styles.modalDoneButton}>
                                <Text style={styles.modalDoneText}>Done ({selectedTechs.length} selected)</Text>
                            </TouchableOpacity>
                        </Modal>
                    </Portal>
                </PaperProvider>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

