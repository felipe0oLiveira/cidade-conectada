import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Users, DollarSign, CircleCheck as CheckCircle, FileText } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function SocialScreen() {
  const router = useRouter();
  const { colors, fontSizes } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSizes.lg }]}>
          Social
        </Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]}>
          <Users size={24} color="#FF4B4B" />
          <View style={styles.cardText}>
            <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSizes.md }]}>
              Programas Assistenciais
            </Text>
            <Text style={[styles.cardDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
              Informações sobre programas de assistência social
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]}>
          <DollarSign size={24} color="#FFB800" />
          <View style={styles.cardText}>
            <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSizes.md }]}>
              Bolsa Família
            </Text>
            <Text style={[styles.cardDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
              Detalhes e requisitos para o benefício
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]}>
          <CheckCircle size={24} color="#00C853" />
          <View style={styles.cardText}>
            <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSizes.md }]}>
              Benefício de Prestação Continuada
            </Text>
            <Text style={[styles.cardDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
              Critérios e processos para o BPC
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]}>
          <FileText size={24} color="#2196F3" />
          <View style={styles.cardText}>
            <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSizes.md }]}>
              Cadastro Único
            </Text>
            <Text style={[styles.cardDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
              Inscrição e atualização cadastral
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
  content: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
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
    fontSize: 14,
  },
});