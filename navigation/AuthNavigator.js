import React from 'react';
import { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login/LoginScreen';
import SignupScreen from '../screens/Login/SignupScreen';
import OTPScreen from '../screens/Login/OTPScreen';
import ForgotPasswordScreen from '../screens/Login/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/Login/ResetPasswordScreen';
import MainTabNavigator from './MainTabNavigator';
import AppliedJobsScreen from '../screens/Job/AppliedJobsScreen';
import RoadmapLoader from '../screens/Roadmap/RoadmapLoader'
import TechnologiesScreen from '../screens/Roadmap/Technologiespage';
import RoadmapTimeline from '../screens/Roadmap/RoadmapScreen';
import RoadmapForm from '../screens/Roadmap/RoadmapForm';
import DashboardScreen from '../screens/Job/DashboardScreen';
import JobFeedScreen from '../screens/Job/JobFeedScreen';
import SavedConversationsScreen from '../screens/Job/SavedConversationsScreen';
import Profile from '../screens/Home/profile';
import ChatbotScreen from '../screens/Job/ChatbotScreen';
import SettingsScreen from '../screens/Home/SettingsScreen';
import EditProfileScreen from '../components/Testing/EditProfileScreen';
import ProfileScreen from '../components/Testing/ProfileScreen';
import StartScreen from '../components/Testing/Profile_start_screen';
import * as expoStorage from 'expo-secure-store';
import { useLogin } from '../Login_id_passing';
import JobDetailScreen from '../screens/Job/JobDetailScreen';
import AnalysisHome from '../screens/Analysis/AnalysisHome';
import Resume from '../screens/Analysis/Resume';
import Jd from '../screens/Analysis/Jd';
import Downloads from '../screens/Analysis/Downloads'
import Not from '../screens/Home/Notification';
import AboutCompany from '../screens/settings/aboutcompany';
import PrivacyPolicy from '../screens/settings/privacypolicy';
import InterviewSetup from '../screens/interview/InterviewSetup';
import QuestionsPage from '../screens/interview/QuestionsPage';
import ResultPage from '../screens/interview/ResultPage';
import YouTubeVideoScreen from '../screens/Roadmap/youtubeVIdeoscreen';
import Job_form from '../screens/Job/Job_form';
const Stack = createNativeStackNavigator();


export default function AuthNavigator() {
    const [route, setRoute] = useState(null);
    const { loginId, setLoginId } = useLogin();
    useEffect(() => {
        async function Checking() {
            try {
                const data = await expoStorage.getItemAsync("user");
                console.log("Stored user data:", data);
                if (data != null) {
                    const user = JSON.parse(data);
                    setLoginId(user);
                    setRoute(true)
                }
                else {
                    setRoute(false);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setRoute(false);
            }
        }
        Checking();
    }, []);
    if (route == null) return null;
    return (
        <Stack.Navigator
            initialRouteName={route ? "Main" : "Login"}
            // initialRouteName={"Main"}
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="Profile Setup" component={StartScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: true }} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="analysis" component={AnalysisHome} />
            <Stack.Screen name="Resume" component={Resume} />
            <Stack.Screen name="Jd" component={Jd} />
            <Stack.Screen name="Downloads" component={Downloads} />
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="Applications" component={AppliedJobsScreen} />
            <Stack.Screen name="RoadmapLoader" component={RoadmapLoader} />
            <Stack.Screen name="RoadmapForm" component={RoadmapForm} />
            <Stack.Screen name="TechnologiesScreen" component={TechnologiesScreen} />
            <Stack.Screen name="RoadmapTimeline" component={RoadmapTimeline} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Jobs" component={JobFeedScreen} />
            <Stack.Screen name="History" component={SavedConversationsScreen} />
            <Stack.Screen name="Profile_page" component={Profile} />
            <Stack.Screen name="AI Assistant" component={ChatbotScreen} />
            <Stack.Screen name="settings" component={SettingsScreen} />
            <Stack.Screen name="JobDetail" component={JobDetailScreen} />
            <Stack.Screen name="notification" component={Not} />
            <Stack.Screen name="AboutCompany" component={AboutCompany} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
            <Stack.Screen name="interviewSetup" component={InterviewSetup} />
            <Stack.Screen name="Questions" component={QuestionsPage} />
            <Stack.Screen name="Result" component={ResultPage} />
            <Stack.Screen name="YouTubeVideoScreen" component={YouTubeVideoScreen} />
            <Stack.Screen name="JobForm" component={Job_form}/>
        </Stack.Navigator>
    );
}
