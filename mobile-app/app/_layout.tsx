import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { useAuthStore } from '../src/store/authStore';
import { useSettingsStore } from '../src/store/settingsStore';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const { token, loadAuth } = useAuthStore();
  const { darkMode, loadSettings } = useSettingsStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initializeApp() {
      await loadAuth();
      await loadSettings();
      setIsReady(true);
      SplashScreen.hideAsync();
    }
    initializeApp();
  }, [loadAuth, loadSettings]);

  useEffect(() => {
    // Only attempt routing if the app is ready AND the navigation tree has fully mounted
    if (!isReady || !rootNavigationState?.key) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (!token && inAuthGroup) {
      router.replace('/login');
    } else if (token && !inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [token, segments, isReady, rootNavigationState?.key, router]);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider value={darkMode ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: darkMode ? '#111827' : '#ffffff' } }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
