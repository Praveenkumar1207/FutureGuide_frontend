import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Page1 from './Page1';
import Resume from './Resume';
import Jd from './Jd';
import Downloads from './Downloads';

const Stack = createNativeStackNavigator();

export default function First() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Page1" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Page1" component={Page1} />
                <Stack.Screen name="Resume" component={Resume} />
                <Stack.Screen name="Downloads" component={Downloads} />
                <Stack.Screen name="Jd" component={Jd} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
