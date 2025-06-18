import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, GraduationCap, Users, Briefcase } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useEffect, useState, useCallback } from 'react';
import { LazyImage } from '@/components/LazyImage';
import { OptimizedScrollView } from '@/components/OptimizedScrollView';
import { useImageCache } from '@/hooks/useImageCache';

interface BannerInfo {
  id: string;
  title: string;
  description: string;
  image: string;
}

const banners: BannerInfo[] = [
  {
    id: '1',
    title: 'Vacinação de Rotina',
    description: 'Centro Municipal de Imunização',
    image: 'https://images.pexels.com/photos/3952240/pexels-photo-3952240.jpeg'
  },
  {
    id: '2',
    title: 'Castração Gratuita',
    description: 'Programa de Controle Populacional de Animais',
    image: 'https://images.pexels.com/photos/6235233/pexels-photo-6235233.jpeg'
  },
  {
    id: '3',
    title: 'Matrícula Escolar',
    description: 'Período de matrículas para o ano letivo 2025',
    image: 'https://images.pexels.com/photos/8471799/pexels-photo-8471799.jpeg'
  }
];

const headerImage = 'https://www.cedrotech.com/wp-content/uploads/2022/12/voce-sabe-o-que-e-uma-cidade-inteligente19420.jpg';

// Move allImages outside the component to prevent recreation on every render
const allImages = [headerImage, ...banners.map(b => b.image)];

export default function HomeScreen() {
  const { colors, fontSizes } = useTheme();
  const router = useRouter();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();

  // Use the stable allImages array
  const { isImageLoaded, preloadImage } = useImageCache(allImages);

  const rotateBanner = useCallback(() => {
    setCurrentBanner((current) => (current + 1) % banners.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(rotateBanner, 5000);
    return () => clearInterval(interval);
  }, [rotateBanner]);

  const handleCategoryPress = (route: string) => {
    console.log('Navegando para:', route);
    router.push(route);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const CategoryCard = ({ route, icon: Icon, title, description, color }) => (
    <TouchableOpacity 
      style={[styles.categoryCard, { backgroundColor: colors.card }]}
      onPress={() => handleCategoryPress(route)}
      activeOpacity={0.7}
    >
      <Icon size={32} color={color} />
      <Text style={[styles.categoryTitle, { color: colors.text, fontSize: fontSizes.md }]}>
        {title}
      </Text>
      <Text style={[styles.categoryDescription, { color: colors.textSecondary, fontSize: fontSizes.xs }]}>
        {description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <OptimizedScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      onRefresh={handleRefresh}
      refreshing={refreshing}
    >
      <View style={styles.header}>
        <LazyImage
          source={{ uri: headerImage }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <View style={styles.headerOverlay}>
          <Text style={[styles.headerTitle, { fontSize: fontSizes['2xl'] }]}>
            Cidade Conectada
          </Text>
          <Text style={[styles.headerSubtitle, { fontSize: fontSizes.md }]}>
            Todos os serviços em um só lugar
          </Text>
        </View>
      </View>

      <View style={[styles.content, { maxWidth: 1200, alignSelf: 'center', width: '100%' }]}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSizes.xl }]}>
          Categorias
        </Text>
        
        <View style={styles.grid}>
          <CategoryCard
            route="/saude"
            icon={Heart}
            title="Saúde"
            description="Vacinação, consultas e mais"
            color="#FF4B4B"
          />
          <CategoryCard
            route="/educacao"
            icon={GraduationCap}
            title="Educação"
            description="Matrículas e calendário escolar"
            color="#FF9800"
          />
          <CategoryCard
            route="/social"
            icon={Users}
            title="Social"
            description="Programas e benefícios sociais"
            color="#2196F3"
          />
          <CategoryCard
            route="/empregos"
            icon={Briefcase}
            title="Empregos"
            description="Oportunidades e orientação"
            color="#4CAF50"
          />
        </View>

        <View style={styles.bannerContainer}>
          <TouchableOpacity 
            style={[styles.banner, { backgroundColor: colors.card }]}
            activeOpacity={0.9}
          >
            <LazyImage
              source={{ uri: banners[currentBanner].image }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <View style={styles.bannerContent}>
              <Text style={[styles.bannerTitle, { color: colors.text, fontSize: fontSizes.lg }]}>
                {banners[currentBanner].title}
              </Text>
              <Text style={[styles.bannerDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                {banners[currentBanner].description}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.bannerIndicators}>
            {banners.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentBanner(index)}
                style={[
                  styles.indicator,
                  {
                    backgroundColor: index === currentBanner ? colors.primary : colors.border,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </OptimizedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    height: 200,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#FFFFFF',
    opacity: 0.9,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoryCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryTitle: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryDescription: {
    textAlign: 'center',
  },
  bannerContainer: {
    width: '100%',
  },
  banner: {
    borderRadius: 16,
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
  bannerImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    height: undefined,
  },
  bannerContent: {
    padding: 16,
  },
  bannerTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  bannerDescription: {
    opacity: 0.8,
  },
  bannerIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});