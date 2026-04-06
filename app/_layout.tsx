import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';
import { useColorScheme } from '../hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth Group */}
        <Stack.Screen name="(auth)" />
        
        {/* Main Dashboard Tabs */}
        <Stack.Screen name="(tabs)" />
        
        {/* Static Modal */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Details' }} />
        
        {/* Dynamically Created Report Screens */}
        <Stack.Screen name="enquiry-report" options={{ headerShown: false }} />
        <Stack.Screen name="crew-report" options={{ headerShown: false }} />
        <Stack.Screen name="crew-ceremony-report" options={{ headerShown: false }} />
        <Stack.Screen name="crew-event-report" options={{ headerShown: false }} />
        <Stack.Screen name="customer-report" options={{ headerShown: false }} />
        <Stack.Screen name="event-report" options={{ headerShown: false }} />
        <Stack.Screen name="profit-loss-report" options={{ headerShown: false }} />
        <Stack.Screen name="quotation-report" options={{ headerShown: false }} />
        <Stack.Screen name="add-enquiry" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
