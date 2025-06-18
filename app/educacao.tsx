import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function EducacaoScreen() {
  const router = useRouter();
  const { colors, fontSizes } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSizes.lg }]}>
          Educação
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={[styles.icon, { backgroundColor: colors.primary }]} />
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.card }]}>
          <Text style={[styles.buttonText, { color: colors.text, fontSize: fontSizes.md }]}>
            Matrículas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.card }]}>
          <Text style={[styles.buttonText, { color: colors.text, fontSize: fontSizes.md }]}>
            Calendário Escolar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.card }]}>
          <Text style={[styles.buttonText, { color: colors.text, fontSize: fontSizes.md }]}>
            Rede de Ensino
          </Text>
        </TouchableOpacity>
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
  content: {
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginVertical: 40,
  },
  icon: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  buttonText: {
    fontWeight: '600',
  },
});