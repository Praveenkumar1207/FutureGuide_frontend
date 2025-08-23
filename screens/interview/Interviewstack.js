// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InterviewSetup from './InterviewSetup';
import QuestionsPage from './QuestionsPage';
import ResultPage from './ResultPage'

const Stack = createNativeStackNavigator();

export default function Interviewstack() {
    return (
        <NavigationContainer >
            <Stack.Navigator
                // screenOptions={{ headerShown: false }} 
                initialRouteName="Setup">
                <Stack.Screen name="Setup" component={InterviewSetup} />
                <Stack.Screen name="Questions" component={QuestionsPage} />
                <Stack.Screen name="Result" component={ResultPage} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
