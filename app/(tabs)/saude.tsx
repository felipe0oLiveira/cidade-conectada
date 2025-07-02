import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Syringe, Calendar, Building2 } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { LazyImage } from '@/components/LazyImage';
import { OptimizedScrollView } from '@/components/OptimizedScrollView';

const bannerImage = 'https://images.pexels.com/photos/3376799/pexels-photo-3376799.jpeg';

export default function SaudeScreen() {
  const router = useRouter();
  const { colors, fontSizes } = useTheme();

  const handleCardPress = (route: string) => {
    console.log('Navegando para:', route);
    router.push(route as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSizes.lg }]}>
          Saúde
        </Text>
      </View>

      <OptimizedScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <LazyImage
          source={{ uri: bannerImage }}
          style={styles.bannerImage}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={() => handleCardPress('/saude/campanhas')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 75, 75, 0.1)' }]}>
              <Syringe size={24} color="#FF4B4B" />
            </View>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSizes.md }]}>
                Campanha de Vacinação
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                Informações sobre campanhas ativas
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={() => handleCardPress('/saude/cartao-vacinas')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
              <Calendar size={24} color="#4CAF50" />
            </View>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSizes.md }]}>
                Cartão de Vacinas
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                Histórico e próximas vacinas
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={() => handleCardPress('/saude/unidades')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(103, 58, 183, 0.1)' }]}>
              <Building2 size={24} color="#673AB7" />
            </View>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSizes.md }]}>
                Unidade Básica de Saúde
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                Encontre a UBS mais próxima
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </OptimizedScrollView>
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
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