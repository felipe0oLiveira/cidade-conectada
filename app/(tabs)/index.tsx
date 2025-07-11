import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, GraduationCap, Users, Briefcase, Mail } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useEffect, useState, useCallback, useRef } from 'react';
import { LazyImage } from '@/components/LazyImage';
import { OptimizedScrollView } from '@/components/OptimizedScrollView';
import { useImageCache } from '@/hooks/useImageCache';
import { useWindowDimensions } from 'react-native';

interface BannerInfo {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface CategoryCardProps {
  route: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
  description: string;
  color: string;
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

const { width } = Dimensions.get('window');
const margin = 14; // <-- Espaçamento lateral entre os banners (ajustado para 14)
const bannerWidth = Math.round(width * 0.8); // <-- Diminui a largura do banner
const bannerHeight = Math.round(width * 0.38);

export default function HomeScreen() {
  const { colors, fontSizes } = useTheme();
  const router = useRouter();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { width: windowWidth } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);

  // Use the stable allImages array
  const { isImageLoaded, preloadImage } = useImageCache(allImages);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000); // 2 segundos
    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: (bannerWidth + margin * 2) * currentBanner,
        animated: true,
      });
    }
  }, [currentBanner, bannerWidth, margin]);

  const handleCategoryPress = (route: string) => {
    console.log('Navegando para:', route);
    router.push(route as any);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const CategoryCard = ({ route, icon: Icon, title, description, color }: CategoryCardProps) => (
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
    <OptimizedScrollView 
        style={[styles.container, { backgroundColor: colors.background, paddingHorizontal: 16 }]}
      onRefresh={handleRefresh}
      refreshing={refreshing}
    >
      <View style={[styles.header, { height: Math.max(200, Math.round(windowWidth * 0.60)), borderRadius: 18, overflow: 'hidden', marginBottom: 12 }]}> 
        <LazyImage
          source={{ uri: headerImage }}
          style={[styles.headerImage, { borderRadius: 18 }]}
          resizeMode="cover"
        />
        <View style={[styles.headerOverlay, { justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 28, paddingVertical: 24, backgroundColor: 'rgba(0,0,0,0.38)', borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }]}> 
          <Text style={[styles.headerTitle, { fontSize: fontSizes['2xl'], textAlign: 'left' }]}>Cidade Conectada</Text>
          <Text style={[styles.headerSubtitle, { fontSize: fontSizes.md, textAlign: 'left' }]}>Todos os serviços em um só lugar</Text>
        </View>
      </View>

        <View style={[styles.content, { maxWidth: 600, alignSelf: 'center', width: '100%' }]}> 
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSizes.xl }]}>Categorias</Text>
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
            <CategoryCard
              route="/sugestoes"
              icon={Mail}
              title="Sugestões"
              description="Participe e melhore a cidade"
              color="#9C27B0"
            />
          </View>
        </View>

        <View style={[styles.bannerContainer, { marginTop: 0, marginBottom: 8 }]}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onMomentumScrollEnd={(event) => {
              const slideIndex = Math.round(event.nativeEvent.contentOffset.x / (bannerWidth + margin * 2));
              setCurrentBanner(slideIndex);
            }}
            style={styles.bannerScrollView}
            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 0 }}
          >
            {banners.map((banner, index) => (
              <TouchableOpacity 
                key={banner.id}
                style={[
                  styles.banner,
                  {
                    backgroundColor: colors.card,
                    width: bannerWidth,
                    height: bannerHeight,
                    marginHorizontal: margin,
                    alignSelf: 'center'
                  },
                ]}
                activeOpacity={0.9}
              >
                <LazyImage
                  source={{ uri: banner.image }}
                  style={{ width: '100%', height: 55, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                  resizeMode="cover"
                />
                <View style={[styles.bannerContent, { paddingHorizontal: 20, paddingVertical: 10 }]}> 
                  <Text style={[styles.bannerTitle, { color: colors.text, fontSize: fontSizes.md, fontWeight: 'bold', textAlign: 'center' }]}> {banner.title} </Text>
                  <Text
                    style={[styles.bannerDescription, { color: colors.textSecondary, fontSize: fontSizes.xs, marginTop: 2, textAlign: 'center' }]}
                    numberOfLines={2}
                  >
                    {banner.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

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
    </OptimizedScrollView>
    </SafeAreaView>
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
    // altura agora é dinâmica pelo componente
    position: 'relative',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 12,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    // padding e backgroundColor agora são definidos inline para responsividade
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
    marginTop: 16,
    marginBottom: 24,
  },
  categoryCard: {
    flexBasis: '48%',
    width: '48%',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  categoryTitle: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
    fontSize: 18,
  },
  categoryDescription: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  bannerContainer: {
    width: '100%',
    marginTop: 0,
    marginBottom: 8,
  },
  bannerScrollView: {
    height: 220,
  },
  bannerScrollContent: {
    paddingHorizontal: 20,
  },
  banner: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    marginBottom: 8,
    alignSelf: 'center',
  },
  bannerContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  bannerTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  bannerDescription: {
    opacity: 0.8,
  },
  bannerIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});