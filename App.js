import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './navigation/AuthNavigator';
import { LoginProvider } from './Login_id_passing';
import { ThemeProvider } from './ThemeContext';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 3}}>
      <ThemeProvider>
        <LoginProvider>
        <NavigationContainer>
          <AuthNavigator />
        </NavigationContainer>
      </LoginProvider>
      </ThemeProvider>
    </SafeAreaView>
  );
}

// In your navigator file (e.g., AppNavigator.js), make sure to include the new screens in your stack navigator
{/* <NavigationContainer>
  <Stack.Navigator> */}
{/* ...other screens... */ }
// <Stack.Screen name="TechnologiesScreen" component={TechnologiesScreen} />
// <Stack.Screen name="RoadmapForm" component={RoadmapForm} />
// <Stack.Screen name="RoadmapLoader" component={RoadmapLoader} options={{ headerShown: false }} />
// <Stack.Screen name="RoadmapTimeline" component={RoadmapTimeline} options={{ headerShown: false }} />
{/* ...other screens... */ }
//   </Stack.Navigator>
// </NavigationContainer>
// <Stack.Screen name="RoadmapLoader" component={RoadmapLoader} options={{ headerShown: false }} />
// <Stack.Screen name="RoadmapTimeline" component={RoadmapTimeline} options={{ headerShown: false }} />
{/* ...other screens... */ }
//   </Stack.Navigator>
// </NavigationContainer>
