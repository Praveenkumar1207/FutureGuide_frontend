import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    Pressable,
    Alert,
    Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useTheme } from '../../ThemeContext.js';
function Job_form({navigation}) {
    const [jobform, setjobform] = useState({
        jobTitle: "",
        companyName: "",
        location: "",
        jobDescription: "",
        jobType: "",
        salaryRange: "",
        requirements: [],
        benefits: [],
        applicationDeadline: "",
        expirationDate: "",
        contactEmail: "",
        contactPhone: "",
        applicationlink: ""
    });

    const { theme } = useTheme();

    const [requirementModalVisible, setRequirementModalVisible] = useState(false);
    const [benefitModalVisible, setBenefitModalVisible] = useState(false);
    const [requirementSearch, setRequirementSearch] = useState('');
    const [benefitSearch, setBenefitSearch] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            setjobform({
                ...jobform,
                applicationDeadline: formattedDate,
                expirationDate: formattedDate
            });
        }
    };

    const [availableRequirements, setAvailableRequirements] = useState([
        'Bachelor’s Degree',
        '3+ years experience',
        'JavaScript',
        'React Native',
        'Communication Skills',
        'Leadership',
    ]);

    const [availableBenefits, setAvailableBenefits] = useState([
        'Health Insurance',
        'Remote Work',
        '401(k)',
        'Flexible Hours',
        'Stock Options',
        'Gym Membership',
    ]);

    const handleRequirementToggle = (req) => {
        if (jobform.requirements.includes(req)) {
            setjobform({
                ...jobform,
                requirements: jobform.requirements.filter(item => item !== req)
            });
        } else {
            setjobform({
                ...jobform,
                requirements: [...jobform.requirements, req]
            });
        }
    };

    const handleBenefitToggle = (b) => {
        if (jobform.benefits.includes(b)) {
            setjobform({
                ...jobform,
                benefits: jobform.benefits.filter(item => item !== b)
            });
        } else {
            setjobform({
                ...jobform,
                benefits: [...jobform.benefits, b]
            });
        }
    };
    const validateForm = () => {
        const missingFields = [];

        if (!jobform.jobTitle.trim()) missingFields.push("Job Title");
        if (!jobform.companyName.trim()) missingFields.push("Company Name");
        if (!jobform.location.trim()) missingFields.push("Location");
        if (!jobform.jobDescription.trim()) missingFields.push("Job Description");
        if (!jobform.jobType.trim()) missingFields.push("Job Type");
        if (!jobform.salaryRange.trim()) missingFields.push("Salary");
        if (!jobform.contactEmail.trim()) {
            missingFields.push("Contact Email");
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(jobform.contactEmail)) {
                missingFields.push("Valid Contact Email");
            }
        }

        if (!jobform.contactPhone.trim()) {
            missingFields.push("Contact Phone");
        } else {
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(jobform.contactPhone)) {
                missingFields.push("Valid 10-digit Contact Phone");
            }
        }
        if (!jobform.applicationDeadline.trim()) missingFields.push("Application Deadline");
        if (!jobform.applicationlink.trim()) missingFields.push("Application Link");

        if (missingFields.length > 0) {
            Alert.alert(
                "Missing Required Fields",
                `Please fill out the following:\n\n${missingFields.join('\n')}`,
                [{ text: "OK" }]
            );
            return false;
        }
        return true;
    };

    async function Submit() {
        if (validateForm()) {
            console.log("Form submitted:", jobform);

            
            console.log(jobform);

            axios.post("https://futureguide-backend.onrender.com/api/jobs",jobform)
            .then((res)=>{
                console.log(res.data);
                navigation.goBack();
                Alert.alert("Success", "Form submitted successfully!");
            })
            .catch((err)=>{
                console.log(err);
                Alert.alert("warn","something went wrong")
            })
        }
        else {
            console.log("Form submission failed due to missing fields.");
        }
    }

    const styles = StyleSheet.create({
        container: {
            padding: 24,
            backgroundColor: theme.background,
            flexGrow: 1,
        },
        header: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.primary,
            marginBottom: 24,
            textAlign: 'center',
        },
        input: {
            borderWidth: 1,
            borderColor: theme.primary,
            borderRadius: 10,
            padding: 12,
            marginBottom: 16,
            fontSize: 16,
            color: theme.textDark,
            backgroundColor: theme.primaryLight,
        },
        submitButton: {
            backgroundColor: theme.primary,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 10,
        },
        submitButtonText: {
            color: theme.textLight,
            fontWeight: 'bold',
            fontSize: 18,
        },
        modalBackground: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            padding: 20,
        },
        modalContent: {
            backgroundColor: theme.primaryLight,
            padding: 20,
            borderRadius: 12,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 10,
            color: theme.primary,
            textAlign: 'center',
        },
        chip: {
            borderWidth: 1,
            borderColor: theme.primary,
            borderRadius: 16,
            paddingVertical: 6,
            paddingHorizontal: 12,
            margin: 4,
            color: theme.textDark,
            backgroundColor: theme.primaryLight,
        },
        chipSelected: {
            backgroundColor: theme.primary,
            color: theme.textLight,
        },
        selectedListContainer: {
            marginTop: 10,
            marginBottom: 16,
            paddingHorizontal: 8,
        },
        selectedTitle: {
            fontWeight: '600',
            fontSize: 16,
            color: "grey",
            marginBottom: 4,
        },
        selectedList: {
            flexDirection: 'column',
            flexWrap: 'wrap',
        },
        selectedItem: {
            backgroundColor: theme.primaryLight,
            color: theme.textDark,
            borderRadius: 8,
            paddingVertical: 4,
            paddingHorizontal: 8,
            marginVertical: 2,
            fontSize: 14,
        },
        addNewButton: {
            backgroundColor: theme.primary,
            borderRadius: 12,
            paddingVertical: 8,
            paddingHorizontal: 14,
            alignSelf: 'flex-end',
            marginTop: 8,
            marginHorizontal: 4,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,

        },

        addNewButtonText: {
            color: 'white',
            fontWeight: '600',
            fontSize: 14,
        },

    });
    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Create New Job</Text>
                <Text>Job Title</Text>
                <TextInput
                    style={styles.input}
                    // placeholder="Job Title"
                    value={jobform.jobTitle}
                    onChangeText={(text) => setjobform({ ...jobform, jobTitle: text })}
                    placeholderTextColor={theme.gray}
                />
                <Text>Company Name</Text>
                <TextInput
                    style={styles.input}
                    // placeholder="Company Name"
                    value={jobform.companyName}
                    onChangeText={(text) => setjobform({ ...jobform, companyName: text })}
                    placeholderTextColor={theme.gray}
                />
                <Text>Location</Text>
                <TextInput
                    style={styles.input}
                    // placeholder="Location"
                    value={jobform.location}
                    onChangeText={(text) => setjobform({ ...jobform, location: text })}
                    placeholderTextColor={theme.gray}
                />
                <Text>Job Description</Text>
                <TextInput
                    style={styles.input}
                    // placeholder="Job Description"
                    value={jobform.jobDescription}
                    onChangeText={(text) => setjobform({ ...jobform, jobDescription: text })}
                    placeholderTextColor={theme.gray}
                />
                <Text>Salary</Text>
                <TextInput
                    style={styles.input}
                    // placeholder="Salary"
                    value={jobform.salaryRange}
                    onChangeText={(text) => setjobform({ ...jobform, salaryRange: text })}
                    placeholderTextColor={theme.gray}
                    keyboardType='numeric'
                />
                <Text>Contact Email</Text>
                <TextInput
                    style={styles.input}
                    // placeholder="Contact Email"
                    value={jobform.contactEmail}
                    onChangeText={(text) => setjobform({ ...jobform, contactEmail: text })}
                    placeholderTextColor={theme.gray}
                />
                <Text>Contact Phone</Text>
                <TextInput
                    style={styles.input}
                    // placeholder="Contact Phone"
                    value={jobform.contactPhone}
                    onChangeText={(text) => setjobform({ ...jobform, contactPhone: text })}
                    placeholderTextColor={theme.gray}
                    keyboardType='numeric'
                />
                <Text>Application Deadline</Text>
                <View>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <TextInput
                            style={styles.input}
                            // placeholder="Application Deadline"
                            value={jobform.applicationDeadline}
                            editable={false}
                            placeholderTextColor="gray"
                        />
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                            minimumDate={new Date()}
                        />
                    )}
                </View>
                <Text>Application Link</Text>
                <TextInput
                    style={styles.input}
                    // placeholder="Application Link"
                    value={jobform.applicationlink}
                    onChangeText={(text) => setjobform({ ...jobform, applicationlink: text })}
                    placeholderTextColor={theme.gray}
                />
                <Text>Job Type</Text>
                <View style={[styles.input, { marginBottom: 16, padding: 0 }]}>
                    <Picker
                        selectedValue={jobform.jobType}
                        onValueChange={(text) => setjobform({ ...jobform, jobType: text })}
                        style={{ height: 60 }}
                    >
                        <Picker.Item label="Select Job Type" value="" />
                        <Picker.Item label="Full-time" value="Full-time" />
                        <Picker.Item label="Part-time" value="Part-time" />
                        <Picker.Item label="Contract" value="Contract" />
                        <Picker.Item label="Internship" value="Internship" />
                        <Picker.Item label="Remote" value="Remote" />
                    </Picker>
                </View>

                {/* Requirements */}
                <TouchableOpacity style={styles.input} onPress={() => setRequirementModalVisible(true)}>
                    <Text style={styles.selectedTitle}>Selected Requirements:</Text>
                    {jobform.requirements.length > 0 && (
                        <View style={styles.selectedListContainer}>
                            <View style={styles.selectedList}>
                                {jobform.requirements.map((item, index) => (
                                    <Text key={index} style={styles.selectedItem}>• {item}</Text>
                                ))}
                            </View>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Benefits */}
                <TouchableOpacity style={styles.input} onPress={() => setBenefitModalVisible(true)}>
                    <Text style={styles.selectedTitle}>Selected Benefits:</Text>
                    {jobform.benefits.length > 0 && (
                        <View style={styles.selectedListContainer}>
                            <View style={styles.selectedList}>
                                {jobform.benefits.map((item, index) => (
                                    <Text key={index} style={styles.selectedItem}>• {item}</Text>
                                ))}
                            </View>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitButton} onPress={() => { Submit() }}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Requirements Modal */}
            <Modal visible={requirementModalVisible} transparent animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Requirements</Text>
                        <TextInput
                            placeholder="Search or add requirement..."
                            value={requirementSearch}
                            onChangeText={setRequirementSearch}
                            style={[styles.input, { marginBottom: 10 }]}
                            placeholderTextColor={theme.gray}
                        />
                        <ScrollView style={{ maxHeight: 300 }}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {availableRequirements
                                    .filter(req => req.toLowerCase().includes(requirementSearch.toLowerCase()))
                                    .map((req, index) => (
                                        <TouchableOpacity key={index} onPress={() => handleRequirementToggle(req)}>
                                            <Text style={[
                                                styles.chip,
                                                jobform.requirements.includes(req) && styles.chipSelected
                                            ]}>
                                                {req}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                            </View>
                            {requirementSearch.trim().length > 0 &&
                                !availableRequirements.some(req =>
                                    req.toLowerCase() === requirementSearch.toLowerCase()
                                ) && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            const newReq = requirementSearch.trim();
                                            setAvailableRequirements([...availableRequirements, newReq]);
                                            setjobform({
                                                ...jobform,
                                                requirements: [...jobform.requirements, newReq]
                                            });
                                            setRequirementSearch('');
                                        }}
                                        style={styles.addNewButton}
                                    >
                                        <Text style={styles.addNewButtonText}>+ Add "{requirementSearch}"</Text>
                                    </TouchableOpacity>
                                )}
                        </ScrollView>
                        <TouchableOpacity onPress={() => setRequirementModalVisible(false)} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Benefits Modal */}
            <Modal visible={benefitModalVisible} transparent animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Benefits</Text>
                        <TextInput
                            placeholder="Search or add benefit..."
                            value={benefitSearch}
                            onChangeText={setBenefitSearch}
                            style={[styles.input, { marginBottom: 10 }]}
                            placeholderTextColor={theme.gray}
                        />
                        <ScrollView style={{ maxHeight: 300 }}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {availableBenefits
                                    .filter(b => b.toLowerCase().includes(benefitSearch.toLowerCase()))
                                    .map((b, index) => (
                                        <TouchableOpacity key={index} onPress={() => handleBenefitToggle(b)}>
                                            <Text style={[
                                                styles.chip,
                                                jobform.benefits.includes(b) && styles.chipSelected
                                            ]}>
                                                {b}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                            </View>
                            {benefitSearch.trim().length > 0 &&
                                !availableBenefits.some(b =>
                                    b.toLowerCase() === benefitSearch.toLowerCase()
                                ) && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            const newBenefit = benefitSearch.trim();
                                            setAvailableBenefits([...availableBenefits, newBenefit]);
                                            setjobform({
                                                ...jobform,
                                                benefits: [...jobform.benefits, newBenefit]
                                            });
                                            setBenefitSearch('');
                                        }}
                                        style={styles.addNewButton}
                                    >
                                        <Text style={styles.addNewButtonText}>+ Add "{benefitSearch}"</Text>
                                    </TouchableOpacity>
                                )}
                        </ScrollView>
                        <TouchableOpacity onPress={() => setBenefitModalVisible(false)} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}



export default Job_form;
