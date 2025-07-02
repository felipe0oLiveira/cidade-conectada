import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Calendar, MapPin } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { LazyImage } from '@/components/LazyImage';
import { OptimizedScrollView } from '@/components/OptimizedScrollView';

interface Campaign {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
}

const campaigns: Campaign[] = [
  {
    id: '1',
    title: 'Vacinação contra COVID-19',
    description: 'Doses de reforço disponíveis para toda população acima de 18 anos',
    date: '01/05/2025 - 31/05/2025',
    location: 'Todas as UBS',
    image: 'https://images.pexels.com/photos/3952240/pexels-photo-3952240.jpeg'
  },
  {
    id: '2',
    title: 'Campanha de Vacinação contra Gripe',
    description: 'Proteja-se contra os vírus da gripe. Vacina disponível para grupos prioritários',
    date: '15/04/2025 - 31/05/2025',
    location: 'UBS Central',
    image: 'https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg'
  },
];

export default function CampanhasScreen() {
  const router = useRouter();
  const { colors, fontSizes } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSizes.lg }]}>
          Campanhas de Vacinação
        </Text>
      </View>

      <OptimizedScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {campaigns.map((campaign) => (
          <View key={campaign.id} style={[styles.card, { backgroundColor: colors.card }]}>
            <LazyImage 
              source={{ uri: campaign.image }} 
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSizes.md }]}>
                {campaign.title}
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                {campaign.description}
              </Text>
              
              <View style={styles.cardInfo}>
                <View style={styles.infoItem}>
                  <Calendar size={16} color={colors.primary} />
                  <Text style={[styles.infoText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                    {campaign.date}
                  </Text>
                </View>
                
                <View style={styles.infoItem}>
                  <MapPin size={16} color={colors.primary} />
                  <Text style={[styles.infoText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                    {campaign.location}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </OptimizedScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDescription: {
    marginBottom: 16,
    lineHeight: 20,
  },
  cardInfo: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    flex: 1,
  },
});