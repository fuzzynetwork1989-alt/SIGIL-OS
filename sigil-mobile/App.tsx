import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

// Screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import ChatScreen from './src/screens/ChatScreen';
import AvatarScreen from './src/screens/AvatarScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Services
import { AuthService } from './src/services/auth';
import { ApiService } from './src/services/api';

const Stack = createStackNavigator();

export default function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboarded = await SecureStore.getItemAsync('sigil-os-onboarded');
      const authenticated = await SecureStore.getItemAsync('sigil-os-authenticated');
      
      setIsOnboarded(onboarded === 'true');
      setIsAuthenticated(authenticated === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isOnboarded ? (isAuthenticated ? 'Chat' : 'Onboarding') : 'Onboarding'}
          screenOptions={{
            headerStyle: {
              backgroundColor: '#667eea',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{ title: 'SIGIL OS Chat' }}
          />
          <Stack.Screen
            name="Avatar"
            component={AvatarScreen}
            options={{ title: 'Avatar' }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'Settings' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
