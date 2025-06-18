import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, GraduationCap, Calendar, Building2 } from 'lucide-react-native';
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

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Image
          source={{ uri: 'https://images.pexels.com/photos/8471799/pexels-photo-8471799.jpeg' }}
          style={styles.bannerImage}
        />

        <View style={styles.content}>
          <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]}>
            <GraduationCap size={24} color="#FF9800" />
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSizes.md }]}>
                Matrículas
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                Processo de matrícula escolar
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]}>
            <Calendar size={24} color="#4CAF50" />
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSizes.md }]}>
                Calendário Escolar
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                Datas e eventos importantes
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]}>
            <Building2 size={24} color="#2196F3" />
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSizes.md }]}>
                Rede de Ensino
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                Escolas e instituições de ensino
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    width: '100%',
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
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
  },
  bannerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
    width: '100%',
  },
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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