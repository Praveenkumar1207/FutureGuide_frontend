// navigation/ResumeStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ResumeHome from './ResumeHome';
import ResumeDetail from './ResumeDetail';
import ResLoader from './ResLoder';
const Stack = createNativeStackNavigator();

export default function Resume() {
    return (
        <Stack.Navigator 
            initialRouteName="ResumeHome"
            screenOptions={{
                headerShown:false,
                headerStyle: {
                    backgroundColor: '#004d40', 
                    height:20
                },
                headerTintColor: '#ffffff', 
                headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 18,
                },
            }}
        >
            <Stack.Screen name="ResumeHome" component={ResumeHome} options={{ title: 'Smart Resume Checker' }} />
            <Stack.Screen name="ResLoader" component={ResLoader} options={{ title: 'Resume Loader' }} />    
            <Stack.Screen name="ResumeDetail" component={ResumeDetail} options={{ title: 'Resume Evaluation Results' }} />
        </Stack.Navigator>
    );
}
