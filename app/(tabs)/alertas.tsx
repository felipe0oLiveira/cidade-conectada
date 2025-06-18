// Importação dos componentes necessários do React Native e ícones
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
// Importação dos ícones que serão usados nos cards
import { Trash2, Lightbulb, Droplets, Truck } from 'lucide-react-native';
// Importação do hook de tema personalizado
import { useTheme } from '@/context/ThemeContext';

export default function AlertasScreen() {
  // Obtém as cores e tamanhos de fonte do tema atual
  const { colors, fontSizes } = useTheme();

  return (
    // Container principal com cor de fundo do tema
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Cabeçalho fixo da tela com título e subtítulo */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSizes['2xl'] }]}>
          Serviços Urbanos
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontSize: fontSizes.md }]}>
          Solicite serviços para sua região
        </Text>
      </View>

      {/* ScrollView para permitir rolagem do conteúdo */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Imagem de banner mostrando uma cidade à noite */}
        <Image
          source={{ uri: 'https://images.pexels.com/photos/1881069/pexels-photo-1881069.jpeg' }}
          style={styles.bannerImage}
        />

        {/* Área de conteúdo com os cards de serviços */}
        <View style={styles.content}>
          {/* Card para Coleta de Lixo */}
          <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]}>
            {/* Container do ícone com fundo vermelho transparente */}
            <View style={[styles.iconContainer, { backgroundColor: '#FF634740' }]}>
              <Trash2 size={24} color="#FF6347" />
            </View>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSizes.md }]}>
                Coleta de Lixo
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                Solicitar coleta de resíduos
              </Text>
            </View>
          </TouchableOpacity>

          {/* Card para Iluminação com Defeito */}
          <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]}>
            {/* Container do ícone com fundo amarelo transparente */}
            <View style={[styles.iconContainer, { backgroundColor: '#FFD70040' }]}>
              <Lightbulb size={24} color="#FFD700" />
            </View>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSizes.md }]}>
                Iluminação com Defeito
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                Reportar problemas de iluminação
              </Text>
            </View>
          </TouchableOpacity>

          {/* Card para Desobstrução de Bueiros */}
          <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]}>
            {/* Container do ícone com fundo azul transparente */}
            <View style={[styles.iconContainer, { backgroundColor: '#4169E140' }]}>
              <Droplets size={24} color="#4169E1" />
            </View>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSizes.md }]}>
                Desobstrução de Bueiros
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                Solicitar limpeza de bueiros
              </Text>
            </View>
          </TouchableOpacity>

          {/* Card para Retirada de Entulhos */}
          <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]}>
            {/* Container do ícone com fundo verde transparente */}
            <View style={[styles.iconContainer, { backgroundColor: '#32CD3240' }]}>
              <Truck size={24} color="#32CD32" />
            </View>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSizes.md }]}>
                Retirada de Entulhos
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                Agendar retirada de entulhos
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  // Container principal que ocupa toda a tela
  container: {
    flex: 1,
  },
  // Estilo do cabeçalho fixo com padding adequado
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  // Título principal em negrito com margem inferior
  headerTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  // Subtítulo com opacidade reduzida
  headerSubtitle: {
    opacity: 0.8,
  },
  // Configuração do ScrollView
  scrollView: {
    flex: 1,
  },
  // Configuração do conteúdo do ScrollView
  scrollContent: {
    flexGrow: 1,
  },
  // Imagem de banner com altura fixa e cobertura total
  bannerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  // Área de conteúdo com padding
  content: {
    padding: 20,
  },
  // Estilo dos cards com sombra e cantos arredondados
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    // Configuração de sombra para dar profundidade
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  // Container circular para os ícones
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Área de texto dos cards
  cardText: {
    marginLeft: 16,
    flex: 1,
  },
  // Título do card em negrito
  cardTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  // Descrição do card com opacidade reduzida
  cardDescription: {
    opacity: 0.8,
  },
});