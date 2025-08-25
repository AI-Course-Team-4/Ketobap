import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0284c7',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Ketobap',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="preferences" 
          options={{ 
            title: '선호도 설정',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="recommendations" 
          options={{ 
            title: '오늘의 추천 식단'
          }} 
        />
        <Stack.Screen 
          name="restaurants" 
          options={{ 
            title: '강남 키토 맛집'
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
