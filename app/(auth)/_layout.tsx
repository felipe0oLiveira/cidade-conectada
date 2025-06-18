import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function AuthLayout() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 200,
          presentation: 'transparentModal',
        }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});