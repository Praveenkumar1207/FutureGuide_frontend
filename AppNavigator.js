// AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TechnologiesScreen from './screens/Technologiespage';
import RoadmapForm from './screens/RoadmapForm';
import RoadmapLoader from './screens/RoadmapLoader';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
       
            <Stack.Navigator initialRouteName="Technologies">
                <Stack.Screen
                    name="Technologies"
                    component={TechnologiesScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="RoadmapForm"
                    component={RoadmapForm}
                    options={{ title: 'Create Roadmap' }}
                />
                <Stack.Screen
                    name="RoadmapLoader"
                    component={RoadmapLoader}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
    );
}