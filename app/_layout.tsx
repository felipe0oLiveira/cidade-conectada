import React, { useEffect } from 'react';
import { Stack, useSegments, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

function InitialLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { colors } = useTheme();
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // @ts-expect-error
      router.replace('onboarding');
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!onboardingChecked || loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    if (!session && !inAuthGroup && !inOnboarding) {
      router.replace('/(auth)/login');
    } else if (session && (inAuthGroup || inOnboarding)) {
      router.replace('/(tabs)');
    }
  }, [session, segments, loading, onboardingChecked]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 200,
          presentation: 'transparentModal',
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <AuthProvider>
        <InitialLayout />
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});