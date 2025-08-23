import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Button,
  KeyboardAvoidingView,
  Platform,
  Alert, // Import Alert for better user feedback
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from "expo-document-picker";
import Svg, { Circle } from "react-native-svg";
import Icons from "react-native-vector-icons/Ionicons";
import Right from "react-native-vector-icons/FontAwesome";
import Colors from '../../constants/Colors';

// --- (Rest of your existing constants and GOAL_OPTIONS, SKILL_OPTIONS remain the same) ---
const PROFILE_COMPLETION = 80;

const GOAL_OPTIONS = [
  "Fitness",
  "Career Growth",
  "Financial Stability",
  "Learning New Skills",
  "Travel",
  "Build a Startup",
  "Work-Life Balance",
  "Improve Relationships",
  "Personal Development",
];

const SKILL_OPTIONS = [
  "JavaScript",
  "React",
  "React Native",
  "Node.js",
  "Python",
  "Django",
  "Machine Learning",
  "UI/UX Design",
  "Data Analysis",
  "Public Speaking",
];

function Profile() {
  // SVG circle config
  const radius = 75;
  const strokeWidth = 6;
  const size = radius * 2 + strokeWidth;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (PROFILE_COMPLETION / 100) * circumference;

  // Modal & edit states
  const [modalVisible, setModalVisible] = useState(false);
  const [editingField, setEditingField] = useState(null); // 'primary', 'secondary', 'skills', 'resume', 'linkedin'

  // Profile data states
  const [goals, setGoals] = useState({ primary: "", secondary: "" });
  const [skills, setSkills] = useState([]);

  // Resume state (file info object)
  const [resume, setResume] = useState(null);

  // LinkedIn URL state
  const [linkedInUrl, setLinkedInUrl] = useState("");

  // Temp input and filtered options for modal
  const [tempInput, setTempInput] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  // Open modal for specific field
  const openModal = (field) => {
    setEditingField(field);
    if (field === "primary" || field === "secondary") {
      setTempInput(goals[field]);
      filterOptions(goals[field] || "", field);
    } else if (field === "skills") {
      setTempInput("");
      filterOptions("", "skills");
    } else if (field === "linkedin") {
      setTempInput(linkedInUrl);
    }
    setModalVisible(true);
  };

  // Filter options (for goals & skills)
  const filterOptions = (input, field = editingField) => {
    const lowerInput = input.toLowerCase();
    if (field === "primary" || field === "secondary") {
      const otherGoal = field === "primary" ? goals.secondary : goals.primary;
      const filtered = GOAL_OPTIONS.filter(
        (option) => option.toLowerCase().includes(lowerInput) && option !== otherGoal
      );
      setFilteredOptions(filtered);
    } else if (field === "skills") {
      const filtered = SKILL_OPTIONS.filter(
        (option) => option.toLowerCase().includes(lowerInput) && !skills.includes(option)
      );
      setFilteredOptions(filtered);
    }
  };

  // Save single goal
  const saveGoal = () => {
    if (tempInput.trim() === "") {
      Alert.alert("Error", "Please select a valid goal."); // Use Alert for better UX
      return;
    }
    setGoals((prev) => ({
      ...prev,
      [editingField]: tempInput,
    }));
    setModalVisible(false);
  };

  // Add skill
  const addSkill = (skill) => {
    if (!skill.trim()) return;
    if (skills.includes(skill)) return;
    setSkills((prev) => [...prev, skill]);
    setTempInput("");
    filterOptions("", "skills");
  };

  // Done adding skills
  const doneAddingSkills = () => {
    const skillToAdd = tempInput.trim();
    if (skillToAdd && !skills.includes(skillToAdd)) {
      addSkill(skillToAdd);
    }
    setModalVisible(false);
  };

  // Remove skill
  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  // Handle input changes
  const handleInputChange = (text) => {
    setTempInput(text);
    filterOptions(text);
  };

  // Select a goal option
  const selectGoal = (goal) => {
    setTempInput(goal);
    filterOptions(goal); // Re-filter to highlight selected goal
  };

  // Save LinkedIn URL
  const saveLinkedInUrl = () => {
    const url = tempInput.trim();
    // Basic validation for URL format
    if (url && !url.match(/^https?:\/\/(www\.)?linkedin\.com(\/.*)?$/i)) {
      Alert.alert("Invalid URL", "Please enter a valid LinkedIn URL starting with https://linkedin.com.");
      return;
    }
    setLinkedInUrl(url);
    setModalVisible(false);
  };

  const pickResume = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ], // PDF and Word docs
        copyToCacheDirectory: true, // Copy file to app's cache directory
        multiple: false, // Only allow single file selection
      });

      if (result.canceled) { // Check if the user cancelled the picker
        console.log("Document picking cancelled.");
        return;
      }

      // If document picking was successful
      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0]; // Get the first selected file
        console.log("Selected file:", file);

        // **Simulate API Call for Resume Upload**
        // In a real application, replace this with your actual backend API endpoint and authentication.
        const uploadUrl = "YOUR_BACKEND_UPLOAD_ENDPOINT"; // <--- REPLACE THIS
        const formData = new FormData();
        formData.append("resume", { // 'resume' should match the field name your backend expects
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "application/octet-stream", // Use mimeType or a generic type
        });

        try {
          // You would typically send some kind of authentication token here as well
          const response = await fetch(uploadUrl, {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
              // Add your authentication token, e.g., 'Authorization': 'Bearer YOUR_TOKEN'
            },
            body: formData,
          });

          if (response.ok) {
            const responseData = await response.json(); // Parse response if your API returns JSON
            console.log("Resume upload successful:", responseData);
            setResume(file); // Update state with the selected file info
            Alert.alert("Success", "Resume uploaded successfully!");
          } else {
            const errorText = await response.text(); // Get error message from backend
            console.error("Resume upload failed:", response.status, errorText);
            Alert.alert("Upload Failed", `Failed to upload resume. Server responded with: ${response.status} ${errorText}`);
            setResume(null); // Clear resume state on failure
          }
        } catch (apiError) {
          console.error("Network or API error during resume upload:", apiError);
          Alert.alert("Upload Error", "Could not connect to the upload server. Please try again.");
          setResume(null); // Clear resume state on failure
        }
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Picking Error", "Failed to pick resume file. Please ensure you have granted file access permissions.");
    } finally {
      setModalVisible(false); // Close modal regardless of success or failure
    }
  };

  // Open modal for resume - but instead directly open file picker here
  const openResumePicker = () => {
    pickResume();
  };
  const navigation = useNavigation();
  return (
    <ScrollView style={style.profile}>
      {/* Profile header */}
      <View style={style.profile_view}>
        <View
          style={{
            width: size,
            height: size,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 15,
          }}
        >
          <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
            <Circle stroke="#E0E0E0" cx={center} cy={center} r={radius} strokeWidth={strokeWidth} />
            <Circle
              stroke="#1658FF"
              cx={center}
              cy={center}
            //   cy={center}
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference}, ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${center}, ${center}`}
            />
          </Svg>
          <Image
            source={{
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQodkH9JbPRbeqUMD0bUtvBWJW9txC401kCxw&s",
            }}
            style={{
              width: radius * 2,
              height: radius * 2,
              borderRadius: radius,
            }}
          />
        </View>
        <View style={style.Profile_content}>
          <Text style={style.name}>Uday Jaya Santhosh</Text>
          <View style={style.row}>
            <Icons name="school" size={16} color="#555" />
            <Text style={style.text}> Aditya University</Text>
          </View>
          <TouchableOpacity style={style.editButton} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={style.editText}>Edit Profile</Text>
            <Right name="arrow-right" size={16} color="#1658FF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Goals section */}
      <View style={style.goalsContainer}>
        {/* Primary Goal Block */}
        <TouchableOpacity style={style.goalCard} onPress={() => openModal("primary")}>
          <Text style={style.goalLabel}>Primary Goal</Text>
          {goals.primary ? (
            <Text style={style.goalValue}>{goals.primary}</Text>
          ) : (
            <Text style={style.goalPlaceholder}>Tap to choose primary goal</Text>
          )}
        </TouchableOpacity>

        {/* Secondary Goal Block */}
        <TouchableOpacity style={style.goalCard} onPress={() => openModal("secondary")}>
          <Text style={style.goalLabel}>Secondary Goal</Text>
          {goals.secondary ? (
            <Text style={style.goalValue}>{goals.secondary}</Text>
          ) : (
            <Text style={style.goalPlaceholder}>Tap to choose secondary goal</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Skills Section */}
      <View style={style.skillsContainer}>
        <Text style={style.skillsLabel}>Skills</Text>
        <View style={style.skillsPreviewContainer}>
          {skills.length === 0 && <Text style={style.goalPlaceholder}>Tap below to add your skills</Text>}
          {skills.map((skill) => (
            <View key={skill} style={style.skillBadge}>
              <Text style={style.skillText}>{skill}</Text>
              <TouchableOpacity onPress={() => removeSkill(skill)}>
                <Text style={style.removeSkill}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TouchableOpacity style={style.editSkillsButton} onPress={() => openModal("skills")}>
          <Text style={style.editText}>Edit Skills</Text>
          <Right name="arrow-right" size={16} color="#1658FF" />
        </TouchableOpacity>
      </View>

      {/* Resume Section */}
      <View style={style.resumeContainer}>
        <Text style={style.skillsLabel}>Resume</Text>
        {resume ? (
          <View style={style.resumePreview}>
            <Text numberOfLines={1} style={{ flex: 1 }}>
              {resume.name}
            </Text>
            <TouchableOpacity onPress={() => setResume(null)}>
              <Text style={[style.removeSkill, { fontSize: 24 }]}>×</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={style.goalPlaceholder}>No resume uploaded</Text>
        )}
        <TouchableOpacity style={style.editSkillsButton} onPress={openResumePicker}>
          <Text style={style.editText}>{resume ? "Change Resume" : "Upload Resume"}</Text>
          <Right name="arrow-right" size={16} color="#1658FF" />
        </TouchableOpacity>
      </View>

      {/* LinkedIn URL Section */}
      <View style={style.linkedinContainer}>
        <Text style={style.skillsLabel}>LinkedIn URL</Text>
        {linkedInUrl ? (
          <Text style={[style.goalValue, { marginBottom: 10 }]} numberOfLines={1}>
            {linkedInUrl}
          </Text>
        ) : (
          <Text style={style.goalPlaceholder}>No LinkedIn URL added</Text>
        )}
        <TouchableOpacity style={style.editSkillsButton} onPress={() => openModal("linkedin")}>
          <Text style={style.editText}>{linkedInUrl ? "Edit LinkedIn URL" : "Add LinkedIn URL"}</Text>
          <Right name="arrow-right" size={16} color="#1658FF" />
        </TouchableOpacity>
      </View>

      {/* Modal for selecting goals, skills, LinkedIn URL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={style.modalContainer}
        >
          <View style={style.modalContent}>
            <Text style={style.modalHeader}>
              {editingField === "primary" && "Choose Primary Goal"}
              {editingField === "secondary" && "Choose Secondary Goal"}
              {editingField === "skills" && "Add Skills"}
              {editingField === "linkedin" && "Add LinkedIn URL"}
            </Text>

            {(editingField === "primary" || editingField === "secondary" || editingField === "skills") && (
              <>
                <TextInput
                  placeholder={
                    editingField === "skills" ? "Type to add skills..." : "Type to filter goals..."
                  }
                  value={tempInput}
                  onChangeText={handleInputChange}
                  style={style.input}
                  autoFocus
                />

                <FlatList
                  data={filteredOptions}
                  keyExtractor={(item) => item}
                  keyboardShouldPersistTaps="handled"
                  style={{ maxHeight: 150, marginTop: 10 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        if (editingField === "skills") {
                          addSkill(item);
                        } else {
                          selectGoal(item);
                        }
                      }}
                      style={[
                        style.suggestionItem,
                        editingField !== "skills" && item === tempInput ? style.suggestionSelected : null,
                      ]}
                    >
                      <Text style={style.suggestionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={<Text style={style.noSuggestionsText}>No matching items found</Text>}
                />
              </>
            )}

            {editingField === "linkedin" && (
              <TextInput
                placeholder="Enter your LinkedIn profile URL"
                value={tempInput}
                onChangeText={setTempInput}
                style={style.input}
                autoFocus
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}

            <View style={style.buttonRow}>
              <Button title="Cancel" color="#aaa" onPress={() => setModalVisible(false)} />
              {editingField !== "skills" && editingField !== "linkedin" && (
                <Button title="Save" color="#1658FF" onPress={saveGoal} />
              )}
              {editingField === "skills" && (
                <Button
                  title="Done"
                  color="#1658FF"
                  onPress={doneAddingSkills}
                  disabled={!tempInput.trim() || skills.includes(tempInput.trim())}
                />
              )}
              {editingField === "linkedin" && (
                <Button
                  title="Save"
                  color="#1658FF"
                  onPress={saveLinkedInUrl}
                  disabled={tempInput.trim() === ""}
                />
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  profile: {
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
  },
  profile_view: {
    width: "100%",
    height: 220,
    flexDirection: "row",
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  Profile_content: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: "#444",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  editButton: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editText: {
    color: Colors.primary,
    fontSize: 16,
    marginRight: 8,
    fontWeight: "600",
  },

  goalsContainer: {
    marginTop: 20,
    paddingHorizontal: 5,
  },
  goalCard: {
    backgroundColor: Colors.primaryLight,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  goalLabel: {
    fontSize: 14,
    color: Colors.textMedium,
    fontWeight: "600",
    marginBottom: 8,
  },
  goalValue: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: "700",
  },
  goalPlaceholder: {
    fontSize: 16,
    color: Colors.textMuted,
    fontStyle: "italic",
  },

  skillsContainer: {
    marginTop: 20,
    paddingHorizontal: 5,
  },
  skillsLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: Colors.primary,
  },
  skillsPreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  skillBadge: {
    flexDirection: "row",
    backgroundColor: Colors.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    color: "#1658FF",
    fontWeight: "600",
    marginRight: 8,
  },
  removeSkill: {
    fontSize: 18,
    color: "#1658FF",
    fontWeight: "bold",
  },
  editSkillsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DDEBFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  resumeContainer: {
    marginTop: 20,
    paddingHorizontal: 5,
  },
  resumePreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F8FF",
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },

  linkedinContainer: {
    marginTop: 20,
    paddingHorizontal: 5,
    marginBottom:50
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  suggestionSelected: {
    backgroundColor: "#DDEBFF",
  },
  suggestionText: {
    fontSize: 16,
    color: "#1658FF",
  },
  noSuggestionsText: {
    textAlign: "center",
    color: "#999",
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default Profile;