import React from 'react';
import AppNavigator from './navigator/AppNavigator';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RoadmapLoader from './screens/RoadmapLoader';
import RoadmapTimeline from './screens/RoadmapScreen';
import FirstNavigator from './screens/FirstNavigator';
import Home_page from './screens/home_page';
import HomeNavigation from './screens/HomeNavigation';


export default function App() {
  return (
    // <Home_page />
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} />
        <HomeNavigation />
       {/* <FirstNavigator /> */}

      
      
    </SafeAreaView>
  );
}

// In your navigator file (e.g., AppNavigator.js), make sure to include the new screens in your stack navigator
{/* <NavigationContainer>
  <Stack.Navigator> */}
    {/* ...other screens... */}
    // <Stack.Screen name="TechnologiesScreen" component={TechnologiesScreen} />
    // <Stack.Screen name="RoadmapForm" component={RoadmapForm} />
    // <Stack.Screen name="RoadmapLoader" component={RoadmapLoader} options={{ headerShown: false }} />
    // <Stack.Screen name="RoadmapTimeline" component={RoadmapTimeline} options={{ headerShown: false }} />
    {/* ...other screens... */}
//   </Stack.Navigator>
// </NavigationContainer>
