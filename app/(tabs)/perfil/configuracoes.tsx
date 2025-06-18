import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Sun, Moon, Smartphone, Type } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

type ThemeOption = 'light' | 'dark' | 'system';
type FontSize = 'small' | 'medium' | 'large';

export default function ConfiguracoesScreen() {
  const router = useRouter();
  const { theme, setTheme, fontSize, setFontSize, colors, fontSizes } = useTheme();

  const themeOptions: { value: ThemeOption; label: string; icon: any }[] = [
    { value: 'light', label: 'Claro', icon: Sun },
    { value: 'dark', label: 'Escuro', icon: Moon },
    { value: 'system', label: 'Automático', icon: Smartphone },
  ];

  const fontSizeOptions: { value: FontSize; label: string }[] = [
    { value: 'small', label: 'Pequeno' },
    { value: 'medium', label: 'Médio' },
    { value: 'large', label: 'Grande' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSizes.lg }]}>
          Configurações
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSizes.md }]}>
          Tema
        </Text>
        <View style={styles.optionsContainer}>
          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.themeOption,
                { backgroundColor: colors.background },
                theme === option.value && { backgroundColor: colors.primary },
              ]}
              onPress={() => setTheme(option.value)}>
              <option.icon
                size={24}
                color={theme === option.value ? '#FFFFFF' : colors.text}
              />
              <Text
                style={[
                  styles.optionText,
                  { color: theme === option.value ? '#FFFFFF' : colors.text },
                  { fontSize: fontSizes.sm },
                ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSizes.md }]}>
          Tamanho da Fonte
        </Text>
        <View style={styles.fontOptionsContainer}>
          {fontSizeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.fontOption,
                { backgroundColor: colors.background },
                fontSize === option.value && { backgroundColor: colors.primary },
              ]}
              onPress={() => setFontSize(option.value)}>
              <Type
                size={option.value === 'small' ? 16 : option.value === 'medium' ? 20 : 24}
                color={fontSize === option.value ? '#FFFFFF' : colors.text}
              />
              <Text
                style={[
                  styles.optionText,
                  { color: fontSize === option.value ? '#FFFFFF' : colors.text },
                  { fontSize: fontSizes.sm },
                ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
    padding: 20,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  fontOptionsContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  fontOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  optionText: {
    marginLeft: 8,
  },
});