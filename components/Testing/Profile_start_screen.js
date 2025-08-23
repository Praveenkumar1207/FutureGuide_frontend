import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ScrollView,
  Dimensions
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { TextInput, Modal, Portal, Chip, Provider as PaperProvider, Button } from 'react-native-paper';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import {useLogin} from "../../Login_id_passing";
const screenWidth = Dimensions.get('window').width;
import { setItemAsync } from 'expo-secure-store';

const imageSources = {
  "Hello! To get started, could you please tell me your name?": require('../../assets/Animation - 1742450464050.json'),
  "That's Great !! Now, Could you please provide your contact information": require('../../assets/Animation - 1750615998865.json'),
  "Let's dream big! What are your top goals you'd like to achieve?": require('../../assets/Animation - 1750618046354.json'),
  "Let's stay connected! Would you like to share any of your social media profiles with us?": require('../../assets/Animation - 1750617700948.json'),
};

const EditProfileScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', nickname: '', gender: '',
    college: '', branch: '', year: '', course: '', specialization: '',
    mobile: '', Profile_image_path: '', Resume_path: '',
    primary_goal: '', secondary_goal: '', linkedin_url: '', skill: [],
    login_id:''
  });
 const { loginId, setLoginId } = useLogin();
  useEffect(()=>{
    // setlogin_id(loginId.login_id);
    // console.log(loginId.login_id);
    setFormData({...formData,login_id:loginId.login_id})
  },[])
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [goalType, setGoalType] = useState('primary');
  const [skillModalVisible, setSkillModalVisible] = useState(false);
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [genderModalVisible, setGenderModalVisible] = useState(false);

  const availableGoals = [
    'Get a Job', 'Pursue Higher Studies', 'Startup', 'Freelance',
    // "Build First Website",
    // "Create Portfolio App",
    "Contribute to GitHub",
    "Learn JavaScript Core",
    "Publish Android App",
    "Win College Hackathon",
    // "Master HTML and CSS",
    // "Deploy Project Online",
    // "Build Resume Website",
    "Crack Internship Test",

  ]
  const availableSkills = [
    "React Native", "React", "JavaScript", "TypeScript", "Node.js", "Express.js",
    "MongoDB", "SQL", "PostgreSQL", "Firebase", "AWS", "Google Cloud", "Azure",
    "HTML", "CSS", "SASS", "Tailwind CSS", "Bootstrap", "Next.js", "Vue.js",
    "Angular", "Python", "Java", "C", "C++", "C#", "Kotlin", "Swift", "Objective-C",
    "Dart", "Flutter", "Go", "Rust", "PHP", "Laravel", "Ruby", "Ruby on Rails",
    "Perl", "R", "MATLAB", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "Keras",
    "PyTorch", "OpenCV", "NLTK", "Matplotlib", "Seaborn", "Power BI", "Tableau",
    "Excel", "Git", "GitHub", "Bitbucket", "Docker", "Kubernetes", "Linux",
    "Bash", "Shell Scripting", "CI/CD", "Jenkins", "Figma", "Adobe XD", "Sketch",
    "Photoshop", "Illustrator", "InDesign", "After Effects", "Premiere Pro",
    "REST API", "GraphQL", "Socket.IO", "WebSockets", "JSON", "XML", "JWT",
    "OAuth", "WebRTC", "Redux", "MobX", "Zustand", "Recoil", "Formik",
    "React Hook Form", "Yup", "ESLint", "Prettier", "Webpack", "Vite", "Rollup",
    "Babel", "Vercel", "Netlify", "Heroku", "Render", "Stripe", "PayPal", "Razorpay",
    "Machine Learning", "Deep Learning", "Computer Vision",
    "Natural Language Processing", "Data Analysis", "Data Visualization", "Big Data",
    "Data Engineering", "Data Science", "DevOps", "Backend Development",
    "Frontend Development", "Full Stack Development", "App Development",
    "Mobile Development", "iOS Development", "Android Development",
    "Security", "Cybersecurity", "Ethical Hacking", "Penetration Testing",
    "Blockchain", "Solidity", "Web3.js", "Metamask", "NFTs", "Smart Contracts",
    "DApps", "Cryptography", "Game Development", "Unity", "Unreal Engine",
    "3D Modeling", "Blender", "AutoCAD", "SolidWorks", "Electronics", "IoT",
    "Arduino", "Raspberry Pi"
  ];


  const blocks = [
    { title: "Hello! To get started, could you please tell me your name?", fields: ["firstName", "lastName", "nickname", "gender",] },
    { title: "That's Great !! Now, Could you please provide your contact information", fields: ["mobile", "college","course", "branch", "year"] },
    { title: "Let's dream big! What are your top goals you'd like to achieve?", fields: ["primary_goal", "secondary_goal", "skill"] },
    { title: "Let's stay connected! Would you like to share any of your social media profiles with us?", fields: ["linkedin_url", "Profile_image_path", "Resume_path"] }
  ];

  const handleInputChange = (field, value) => setFormData({ ...formData, [field]: value });

  const handleNextBlock = () => {
    if (validateCurrentBlock() && currentBlock < blocks.length - 1) setCurrentBlock(currentBlock + 1);
  };

  const handlePreviousBlock = () => {
    if (currentBlock > 0) setCurrentBlock(currentBlock - 1);
  };

  const validateCurrentBlock = () => {
    for (const field of blocks[currentBlock].fields) {
      const value = formData[field];
      if (!value) {
        Alert.alert('Validation Error', `${field.replace(/_/g, ' ')} is required.`);
        return false;
      }
      if (field === 'mobile' && (!/^[0-9]{10}$/.test(value))) {
        Alert.alert('Validation Error', 'Mobile number must be 10 digits.');
        return false;
      }
      if (field === 'year' && value > 4) {
        Alert.alert('Validation Error', 'Enter a valid graduation year.');
        return false;
      }
    }
    return true;
  };

  const handleUploadImage = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'image/*' });
    if (!result.canceled) {
      setFormData({ ...formData, Profile_image_path: result.assets[0].uri });
      setImageFile(result.assets[0]);
    }
  };

  const handleUploadResume = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (!result.canceled) {
      setFormData({ ...formData, Resume_path: result.assets[0].uri });
      setPdfFile(result.assets[0]);
    }
  };

  const handleGoalSelect = (goal) => {
    setFormData({ ...formData, [goalType === 'primary' ? 'primary_goal' : 'secondary_goal']: goal });
    setGoalModalVisible(false);
  };

  const handleSkillSelect = (skill) => {
    const updated = formData.skill.includes(skill)
      ? formData.skill.filter(s => s !== skill)
      : [...formData.skill, skill];
    setFormData({ ...formData, skill: updated });
  };
  const upload = async () => {
    const formDataTo = new FormData();

    console.log("Form Data:", formData);
    // Append text fields
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
      const response = await axios.post(
        "https://futureguide-backend.onrender.com/api/profiles/",
        formDataTo,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const data=response.data;
      console.log(data._id);
      console.log("Succeeded");
      const object = { login_id:loginId.login_id, profile_id: data._id};
      setLoginId(object);
      await setItemAsync("user",JSON.stringify(object));
      navigation.replace('Main');
    } catch (err) {
      alert("Something went wrong, please try again");
      console.log(err);
    }
  };
  const renderBlock = () => {
    const block = blocks[currentBlock];
    return (
      <View style={{ width: '100%', alignItems: 'center' }}>
        {block.fields.map((field) => {
          const isNumeric = ['mobile', 'year'].includes(field);
          const keyboardType = isNumeric ? 'numeric' : 'default';

          if (field === 'gender') {
            return (
              <TouchableOpacity key={field} onPress={() => setGenderModalVisible(true)}>
                <TextInput
                  mode="outlined"
                  label="Gender"
                  value={formData.gender}
                  editable={false}
                  style={styles.input_2}
                />
              </TouchableOpacity>
            );
          }

          if (field === "primary_goal" || field === "secondary_goal") {
            return (
              <TouchableOpacity key={field} onPress={() => { setGoalType(field === 'primary_goal' ? 'primary' : 'secondary'); setGoalModalVisible(true); }}>
                <TextInput mode="outlined" label={field.replace(/_/g, ' ')} value={formData[field]} editable={false} style={styles.input_2} />
              </TouchableOpacity>
            );
          }

          if (field === "skill") {
            return (
              <TouchableOpacity key={field} onPress={() => setSkillModalVisible(true)}>
                <TextInput mode="outlined" label="Skills" value={formData.skill.join(', ')} editable={false} style={styles.input_2} />
              </TouchableOpacity>
            );
          }

          if (field === "linkedin_url") {
            return (
              <TextInput key={field} mode="outlined" label="LinkedIn URL" value={formData.linkedin_url} onChangeText={(text) => handleInputChange('linkedin_url', text)} style={styles.input} />
            );
          }

          if (field === "Profile_image_path") {
            return (
              <TouchableOpacity key={field} onPress={handleUploadImage} style={styles.customBox}>
                <Text style={styles.customBoxText}>{formData.Profile_image_path ? imageFile?.name || 'Selected' : 'No image selected'}</Text>
              </TouchableOpacity>
            );
          }

          if (field === "Resume_path") {
            return (
              <TouchableOpacity key={field} onPress={handleUploadResume} style={styles.customBox}>
                <Text style={styles.customBoxText}>{pdfFile?.name || (formData.Resume_path ? 'Resume.pdf' : 'No resume selected')}</Text>
              </TouchableOpacity>
            );
          }

          return (
            <TextInput key={field} mode="outlined" label={field.replace(/_/g, ' ')} value={formData[field]} onChangeText={(text) => handleInputChange(field, text)} keyboardType={keyboardType} style={styles.input} />
          );
        })}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <PaperProvider>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <LottieView source={imageSources[blocks[currentBlock].title]} autoPlay loop style={[styles.image, (currentBlock === 1 || currentBlock === 0) && { width: 300, height: 225 }]} />
            <Text style={styles.screenTitle}>{blocks[currentBlock].title}</Text>
            {renderBlock()}
            <View style={styles.footer}>
              {currentBlock > 0 && (
                <Button onPress={handlePreviousBlock} style={styles.footerButton} textColor="#fff" buttonColor="#6A0DAD">Previous</Button>
              )}
              {currentBlock < blocks.length - 1 ? (
                <Button onPress={handleNextBlock} style={styles.footerButton} textColor="#fff" buttonColor="#6A0DAD">Next</Button>
              ) : (
                <Button onPress={upload} style={styles.footerButton} textColor="#fff" buttonColor="#6A0DAD">Submit</Button>
              )}
            </View>
          </ScrollView>

          <Portal>
            <Modal visible={goalModalVisible} onDismiss={() => setGoalModalVisible(false)} contentContainerStyle={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select {goalType === 'primary' ? 'Primary' : 'Secondary'} Goal</Text>
              <ScrollView>
                {availableGoals.map((goal, index) => (
                  <TouchableOpacity key={index} style={styles.option} onPress={() => handleGoalSelect(goal)}>
                    <Text style={styles.optionText}>{goal}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Modal>

            <Modal visible={skillModalVisible} onDismiss={() => setSkillModalVisible(false)} contentContainerStyle={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Skills</Text>
              <TextInput mode="outlined" placeholder="Search skills..." value={skillSearchQuery} onChangeText={setSkillSearchQuery} style={{ marginBottom: 10 }} />
              <ScrollView style={{ maxHeight: 300 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {availableSkills.filter(skill => skill.toLowerCase().includes(skillSearchQuery.toLowerCase())).map(skill => (
                    <Chip key={skill} style={{ margin: 4 }} selected={formData.skill.includes(skill)} onPress={() => handleSkillSelect(skill)}>{skill}</Chip>
                  ))}
                </View>
              </ScrollView>
              <Button mode="contained" onPress={() => setSkillModalVisible(false)} style={styles.button}>Done</Button>
            </Modal>

            <Modal visible={genderModalVisible} onDismiss={() => setGenderModalVisible(false)} contentContainerStyle={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              <ScrollView>
                {['Male', 'Female', 'Other'].map((option, index) => (
                  <TouchableOpacity key={index} style={styles.option} onPress={() => {
                    setFormData({ ...formData, gender: option });
                    setGenderModalVisible(false);
                  }}>
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Modal>
          </Portal>
        </KeyboardAvoidingView>
      </PaperProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 60, alignItems: 'center' },
  image: { width: screenWidth * 0.8, height: screenWidth * 0.8, resizeMode: 'contain', marginBottom: 10, borderRadius: 10 },
  screenTitle: { fontSize: 22, fontWeight: 'bold', color: '#000', marginBottom: 14, textAlign: 'center' },
  input: { width: '100%', marginBottom: 10, backgroundColor: '#fff' },
  input_2: { width: '100%', marginBottom: 14, backgroundColor: '#fff' },
  footer: { padding: 20, flexDirection: 'row', justifyContent: 'space-between' },
  footerButton: { flex: 1, marginHorizontal: 6, borderRadius: 30 },
  label: { fontWeight: '500', fontSize: 16, marginBottom: 4 },
  customBox: { width: '100%', borderWidth: 1, borderColor: '#555', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 14, backgroundColor: '#fff', justifyContent: 'center' },
  customBoxText: { fontSize: 14, color: '#555' },
  modalContainer: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  option: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  optionText: { fontSize: 16 },
  button: { marginTop: 8 },
});

export default EditProfileScreen;
