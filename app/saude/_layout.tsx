import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function SaudeLayout() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 200,
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="campanhas" />
        <Stack.Screen name="cartao-vacinas" />
        <Stack.Screen name="unidades" />
        <Stack.Screen name="unidades/[id]" />
        <Stack.Screen name="agendar" />
        <Stack.Screen name="minhas-consultas" />
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