import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function ComunicacoesScreen() {
  const { colors, fontSizes } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: fontSizes['2xl'] }]}>
        Comunicações
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 60,
  },
});