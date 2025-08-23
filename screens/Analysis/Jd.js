import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JdHome from './JdHome';
import JdDetail from './JdDetail';
import Jdloader from './Jdloader';
const Stack = createNativeStackNavigator();

export default function Jd() {
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
            <Stack.Screen name="JdHome" component={JdHome} options={{ title: 'Check Job Match' }} />
            <Stack.Screen name="JdDetail" component={JdDetail} options={{ title: 'Application Relevance Overview' }} />
            <Stack.Screen name="Jdloader" component={Jdloader} options={{ title: 'Application Relevance Overview' }} />
        </Stack.Navigator>
    );
}
