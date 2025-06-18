import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Briefcase, GraduationCap, Compass } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function EmpregosScreen() {
  const router = useRouter();
  const { colors, fontSizes } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSizes.lg }]}>
          Empregos
        </Text>
      </View>

      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1920&auto=format&fit=crop' }}
        style={styles.bannerImage}
      />

      <View style={styles.content}>
        <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]}>
          <Briefcase size={24} color="#4CAF50" />
          <View style={styles.cardText}>
            <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSizes.md }]}>
              Oportunidades de Emprego
            </Text>
            <Text style={[styles.cardDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
              Vagas disponíveis na região
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]}>
          <GraduationCap size={24} color="#FF9800" />
          <View style={styles.cardText}>
            <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSizes.md }]}>
              Programa de Estágio
            </Text>
            <Text style={[styles.cardDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
              Vagas para estudantes
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]}>
          <Compass size={24} color="#2196F3" />
          <View style={styles.cardText}>
            <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSizes.md }]}>
              Orientação Profissional
            </Text>
            <Text style={[styles.cardDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
              Consultoria e direcionamento de carreira
            </Text>
          </View>
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
  bannerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardText: {
    marginLeft: 16,
    flex: 1,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    opacity: 0.8,
  },
});