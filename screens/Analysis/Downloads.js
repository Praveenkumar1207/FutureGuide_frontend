import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Downloadslist from './Downloadslist';
const Stack = createNativeStackNavigator();

export default function Downloads() {
    return (
        <Stack.Navigator screenOptions={{
            headerShown:false,
            headerStyle: {
                backgroundColor: '#004d40',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
                fontWeight: '600',
                fontSize: 18,
            },
        }}>
            <Stack.Screen name="Downloadslist" component={Downloadslist} options={{ title: 'Downloaded Items' }} />
        </Stack.Navigator>
    );
}
