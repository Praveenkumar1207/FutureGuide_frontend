import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import Colors from '../../constants/Colors';

const EditProfile = () => {
  const [profileImage, setProfileImage] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    gender: "Male",
    college: "",
    branch: "",
    year: "",
    course: "",
    specialization: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({});

  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleChange = (key, value) => {
    if (key === "nickname") {
      if (!/^[a-zA-Z]*$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          nickname: "Only alphabets allowed",
        }));
      } else if (value.length > 10) {
        setErrors((prev) => ({
          ...prev,
          nickname: "Maximum 10 characters allowed",
        }));
      } else {
        setErrors((prev) => ({ ...prev, nickname: null }));
      }
    }

    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log("Saved Profile:", form);
    // Add validation or API submission here
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={handleImagePick} style={styles.imageContainer}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require("../../Images/robot.png") // Change this to your fallback image path
          }
          style={styles.profileImage}
        />
        <Text style={styles.changePhoto}>Change Photo</Text>
      </TouchableOpacity>

      <InputField
        label="First Name"
        value={form.firstName}
        onChange={(text) => handleChange("firstName", text)}
      />
      <InputField
        label="Last Name"
        value={form.lastName}
        onChange={(text) => handleChange("lastName", text)}
      />
      <InputField
        label="Nickname"
        value={form.nickname}
        onChange={(text) => handleChange("nickname", text)}
        error={errors.nickname}
      />

      <Text style={styles.label}>Gender</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.gender}
          onValueChange={(value) => handleChange("gender", value)}
          style={styles.picker}
        >
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      <InputField
        label="College"
        value={form.college}
        onChange={(text) => handleChange("college", text)}
      />
      <InputField
        label="Branch"
        value={form.branch}
        onChange={(text) => handleChange("branch", text)}
      />
      <InputField
        label="Year"
        value={form.year}
        onChange={(text) => handleChange("year", text)}
      />
      <InputField
        label="Course"
        value={form.course}
        onChange={(text) => handleChange("course", text)}
      />
      <InputField
        label="Specialization"
        value={form.specialization}
        onChange={(text) => handleChange("specialization", text)}
      />
      <InputField
        label="Mobile Number"
        value={form.mobile}
        onChange={(text) => handleChange("mobile", text)}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const InputField = ({ label, value, onChange, keyboardType = "default", error }) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, error && { borderColor: "red" }]}
      value={value}
      onChangeText={onChange}
      keyboardType={keyboardType}
      placeholder={`Enter ${label}`}
      placeholderTextColor="#a0b0c0"
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: "#f5faff",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e0e0e0",
  },
  changePhoto: {
    color: Colors.primary,
    marginTop: 8,
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    color: Colors.textDark,
    marginBottom: 4,
    marginTop: 14,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: Colors.surface,
    color: Colors.textDark,
  },
  pickerContainer: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    // height:50,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: Colors.surface,
  },
  picker: {
    height: 48,
    width: "100%",
    color: Colors.textDark,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  saveText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default EditProfile;
