import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import Home_page from '../screens/Home/home_page';
import TechnologiesScreen from '../screens/Roadmap/Technologiespage';
import JobFeedScreen from '../screens/Job/JobFeedScreen';
import JobDetailScreen from '../screens/Job/JobDetailScreen';
import RoadmapForm from '../screens/Roadmap/RoadmapForm';
import RoadmapLoader from '../screens/Roadmap/RoadmapLoader';
import RoadmapTimeline from '../screens/Roadmap/RoadmapScreen';
import Profile from '../screens/Home/profile';
import EditProfile from '../screens/Home/edit_profile';
import DashboardScreen from '../screens/Job/DashboardScreen';
import ChatbotScreen from '../screens/Job/ChatbotScreen';
import AppliedJobsScreen from '../screens/Job/AppliedJobsScreen';
import SavedConversationsScreen from '../screens/Job/SavedConversationsScreen';
import Not from '../screens/Home/Notification';
import AnalysisHome from '../screens/Analysis/AnalysisHome';
import Resume from '../screens/Analysis/Resume';
import Downloads from '../screens/Analysis/Downloads';
import Jd from '../screens/Analysis/Jd';
import ProfileScreen from '../components/Testing/ProfileScreen';
import Colors from '../constants/Colors';
import { useTheme } from '../ThemeContext';



const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


// Home Stack
function HomeStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeScreen" component={Home_page} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Profile_page" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="notificaion" component={Not} />
            <Stack.Screen name="AI Assistant" component={ChatbotScreen} />
            <Stack.Screen name="History" component={SavedConversationsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
    );
}

// Roadmap Stack
function RoadmapStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TechnologiesScreen" component={TechnologiesScreen} />
            <Stack.Screen name="RoadmapForm" component={RoadmapForm} />
            <Stack.Screen name="RoadmapLoader" component={RoadmapLoader} />
            <Stack.Screen name="RoadmapTimeline" component={RoadmapTimeline} />
        </Stack.Navigator>
    );
}

// Jobs Stack
function JobsStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="JobFeedScreen" component={JobFeedScreen} />
            <Stack.Screen name="JobDetail" component={JobDetailScreen} />
            <Stack.Screen name="Applications" component={JobDetailScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}


// Analysis Stack
function AnalysisStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="analysis" component={AnalysisHome} />
            <Stack.Screen name="Resume" component={Resume} />
            <Stack.Screen name="Downloads" component={Downloads} />
            <Stack.Screen name="Jd" component={Jd} />
        </Stack.Navigator>
    );
}


export default function MainTabNavigator() {
    const { theme } = useTheme();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginBottom: 4,
                },
                tabBarStyle: {
                    height: 55,
                    // backgroundColor: '#fff',
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    borderTopWidth: 0,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowOffset: { width: 0, height: -3 },
                    shadowRadius: 10,
                },
                tabBarIcon: ({ focused, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Roadmap') {
                        iconName = focused ? 'map' : 'map-outline'; // Cart-like icon
                    } else if (route.name === 'Analysis') {
                        iconName = focused ? 'document' : 'document-outline'; // Document-like icon
                    }
                    else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline'; // Orders-like icon
                    }

                    return (
                        
                        <Icon
                            name={iconName}
                            size={26}
                            color={focused ? theme.primaryDark : theme.primary}
                        />
                    );
                },
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.primaryDark,
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{ tabBarLabel: 'Home' }}
            />
            <Tab.Screen
                name="Roadmap"
                component={RoadmapStack}
                options={{ tabBarLabel: 'Roadmap' }}
            />
            {/* <Tab.Screen
                name="Analysis"
                component={AnalysisStack}
                options={{ tabBarLabel: 'Analysis' }}
            /> */}

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ tabBarLabel: 'Profile' }}
            />
        </Tab.Navigator>
    );
}
