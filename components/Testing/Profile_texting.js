import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from './ProfileScreen';
import EditProfileScreen from './EditProfileScreen';
import ProfileStart from './Profile_start_screen';
import ResumeViewer from './Pdf_view';
const Stack = createStackNavigator();

const Pro = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Profile Setup">
        <Stack.Screen 
          name="Profile Setup" 
          component={ProfileStart} 
          options={{ headerShown:false }} 
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'My Profile' }} 
        />
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen} 
          options={{ title: 'Edit Profile' }} 
        />
        <Stack.Screen 
          name="ResumeViewer" 
          component={ResumeViewer} 
          options={{ title: 'Resume Viewer' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Pro;
