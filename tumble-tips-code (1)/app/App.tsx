import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Figtree_400Regular, Figtree_700Bold } from '@expo-google-fonts/figtree';
import { BricolageGrotesque_600SemiBold, BricolageGrotesque_800ExtraBold } from '@expo-google-fonts/bricolage-grotesque';
import { ThemeProvider, useColors } from './src/ThemeContext';
import ChallengeScreen from './src/screens/ChallengeScreen';
import SkillsScreen from './src/screens/SkillsScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import { OwnedProvider } from './src/OwnedContext';
import { AuthProvider } from './src/AuthContext';
import AccountScreen from './src/screens/AccountScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import { fonts } from './src/theme';

const Tab = createBottomTabNavigator();

function Tabs() {
  const c = useColors();
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Challenge" screenOptions={{
        headerShown: false, tabBarActiveTintColor: c.pink, tabBarInactiveTintColor: c.ink2,
        tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.line },
        tabBarLabelStyle: { fontFamily: fonts.bodyBold, fontSize: 10.5 },
      }}>
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Skills" component={SkillsScreen} />
        <Tab.Screen name="Challenge" component={ChallengeScreen} />
        <Tab.Screen name="Library" component={LibraryScreen} />
        <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [loaded] = useFonts({ Figtree_400Regular, Figtree_700Bold, BricolageGrotesque_600SemiBold, BricolageGrotesque_800ExtraBold });
  if (!loaded) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <OwnedProvider>
            <Tabs />
          </OwnedProvider>
        </AuthProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
