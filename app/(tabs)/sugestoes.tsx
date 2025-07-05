import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  Modal, 
  TextInput, 
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView
} from 'react-native';
import { 
  ChevronLeft, 
  Plus, 
  Filter, 
  Search, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle,
  MapPin,
  Clock,
  User,
  Star,
  HelpCircle,
  Volume2,
  VolumeX,
  Mic,
  MicOff
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { LazyImage } from '@/components/LazyImage';
import { OptimizedScrollView } from '@/components/OptimizedScrollView';
import { AccessibilityHelper } from '@/components/AccessibilityHelper';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  priority: string;
  status: string;
  votes_count: number;
  created_at: string;
  user_id: string;
  user_vote?: string;
  comments_count?: number;
}

const categories = [
  { id: 'infrastructure', name: 'Infraestrutura', color: '#FF6B6B' },
  { id: 'health', name: 'Saúde', color: '#4ECDC4' },
  { id: 'education', name: 'Educação', color: '#45B7D1' },
  { id: 'transport', name: 'Transporte', color: '#96CEB4' },
  { id: 'security', name: 'Segurança', color: '#FFEAA7' },
  { id: 'environment', name: 'Meio Ambiente', color: '#DDA0DD' },
  { id: 'culture', name: 'Cultura', color: '#FFB347' },
  { id: 'other', name: 'Outros', color: '#98D8C8' }
];

const priorities = [
  { id: 'low', name: 'Baixa', color: '#4CAF50' },
  { id: 'medium', name: 'Média', color: '#FF9800' },
  { id: 'high', name: 'Alta', color: '#F44336' },
  { id: 'critical', name: 'Crítica', color: '#9C27B0' }
];

const statuses = [
  { id: 'pending', name: 'Pendente', color: '#FF9800' },
  { id: 'under_review', name: 'Em Análise', color: '#2196F3' },
  { id: 'approved', name: 'Aprovada', color: '#4CAF50' },
  { id: 'rejected', name: 'Rejeitada', color: '#F44336' },
  { id: 'implemented', name: 'Implementada', color: '#9C27B0' }
];

export default function SugestoesScreen() {
  const router = useRouter();
  const { colors, fontSizes } = useTheme();
  const { session } = useAuth();
  
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<'votes' | 'date'>('votes');
  const [showHelp, setShowHelp] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('medium');
  const [submitting, setSubmitting] = useState(false);

  // Helper functions
  const getCategoryDescription = (categoryId: string) => {
    const descriptions: { [key: string]: string } = {
      infrastructure: 'Obras, pavimentação, iluminação',
      health: 'Unidades de saúde, campanhas',
      education: 'Escolas, bibliotecas, programas',
      transport: 'Ônibus, ciclovias, estacionamentos',
      security: 'Policiamento, câmeras, iluminação',
      environment: 'Parques, coleta seletiva, arborização',
      culture: 'Teatros, museus, eventos culturais',
      other: 'Demais sugestões'
    };
    return descriptions[categoryId] || 'Outras sugestões';
  };

  useEffect(() => {
    fetchSuggestions();
  }, [selectedCategory, selectedPriority, selectedStatus, sortBy]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .order(sortBy === 'votes' ? 'votes_count' : 'created_at', { ascending: false });
      if (error) throw error;
      let filteredSuggestions = data || [];
      if (selectedCategory) filteredSuggestions = filteredSuggestions.filter(s => s.category === selectedCategory);
      if (selectedPriority) filteredSuggestions = filteredSuggestions.filter(s => s.priority === selectedPriority);
      if (selectedStatus) filteredSuggestions = filteredSuggestions.filter(s => s.status === selectedStatus);
      if (searchQuery) filteredSuggestions = filteredSuggestions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase()));
      setSuggestions(filteredSuggestions);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as sugestões');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (suggestionId: string, voteType: 'upvote' | 'downvote') => {
    if (!session?.user) {
      Alert.alert('Erro', 'Você precisa estar logado para votar');
      return;
    }

    try {
      // Simular votação com dados mock
      setSuggestions(prev => prev.map(suggestion => {
        if (suggestion.id === suggestionId) {
          const currentVote = suggestion.user_vote;
          let newVotesCount = suggestion.votes_count;
          
          if (currentVote === voteType) {
            // Remove vote
            newVotesCount = voteType === 'upvote' ? suggestion.votes_count - 1 : suggestion.votes_count + 1;
            return { ...suggestion, user_vote: undefined, votes_count: newVotesCount };
          } else {
            // Add or change vote
            if (currentVote === 'upvote' && voteType === 'downvote') {
              newVotesCount = suggestion.votes_count - 2;
            } else if (currentVote === 'downvote' && voteType === 'upvote') {
              newVotesCount = suggestion.votes_count + 2;
            } else if (voteType === 'upvote') {
              newVotesCount = suggestion.votes_count + 1;
            } else {
              newVotesCount = suggestion.votes_count - 1;
            }
            return { ...suggestion, user_vote: voteType, votes_count: newVotesCount };
          }
        }
        return suggestion;
      }));
      
      // Comentário: Descomente o código abaixo quando executar a migração do banco
      /*
      const existingVote = suggestions.find(s => s.id === suggestionId)?.user_vote;
      
      if (existingVote === voteType) {
        // Remove vote
        const { error } = await supabase
          .from('suggestion_votes')
          .delete()
          .eq('suggestion_id', suggestionId)
          .eq('user_id', session.user.id);
        
        if (error) throw error;
      } else {
        // Insert or update vote
        const { error } = await supabase
          .from('suggestion_votes')
          .upsert({
            suggestion_id: suggestionId,
            user_id: session.user.id,
            vote_type: voteType
          });
        
        if (error) throw error;
      }

      // Refresh suggestions
      fetchSuggestions();
      */
    } catch (error) {
      console.error('Error voting:', error);
      Alert.alert('Erro', 'Não foi possível registrar seu voto');
    }
  };

  const handleSubmitSuggestion = async () => {
    if (!session?.user) {
      Alert.alert('Erro', 'Você precisa estar logado para enviar sugestões');
      return;
    }

    if (!title.trim() || !description.trim() || !category) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('suggestions')
        .insert({
          user_id: session.user.id,
          title: title.trim(),
          description: description.trim(),
          category,
          location: location.trim(),
          priority
        });

      if (error) throw error;

      Alert.alert('Sucesso', 'Sua sugestão foi enviada com sucesso!');
      setModalVisible(false);
      resetForm();
      fetchSuggestions();
    } catch (error) {
      console.error('Erro ao enviar sugestão:', error, JSON.stringify(error));
      Alert.alert('Erro', 'Não foi possível enviar sua sugestão');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setLocation('');
    setPriority('medium');
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || '#98D8C8';
  };

  const getPriorityColor = (priorityId: string) => {
    return priorities.find(p => p.id === priorityId)?.color || '#FF9800';
  };

  const getStatusColor = (statusId: string) => {
    return statuses.find(s => s.id === statusId)?.color || '#FF9800';
  };

  const renderSuggestionCard = ({ item }: { item: Suggestion }) => (
    <TouchableOpacity 
      style={[styles.suggestionCard, { backgroundColor: colors.card }]}
              onPress={() => router.push(`/sugestoes/${item.id}` as any)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.categoryBadge}>
          <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>
            {categories.find(c => c.id === item.category)?.name}
          </Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityText}>
            {priorities.find(p => p.id === item.priority)?.name}
          </Text>
        </View>
      </View>

      <Text style={[styles.suggestionTitle, { color: colors.text, fontSize: fontSizes.md }]}>
        {item.title}
      </Text>
      
      <Text style={[styles.suggestionDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
        {item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
      </Text>

      {item.location && (
        <View style={styles.locationContainer}>
          <MapPin size={16} color={colors.textSecondary} />
          <Text style={[styles.locationText, { color: colors.textSecondary, fontSize: fontSizes.xs }]}>
            {item.location}
          </Text>
        </View>
      )}

      <View style={styles.cardFooter}>
        <View style={styles.userInfo}>
          <User size={16} color={colors.textSecondary} />
          <Text style={[styles.userText, { color: colors.textSecondary, fontSize: fontSizes.xs }]}>
            Usuário
          </Text>
        </View>

        <View style={styles.dateInfo}>
          <Clock size={16} color={colors.textSecondary} />
          <Text style={[styles.dateText, { color: colors.textSecondary, fontSize: fontSizes.xs }]}>
            {new Date(item.created_at).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </View>

      <View style={styles.interactionBar}>
        <View style={styles.voteContainer}>
          <TouchableOpacity 
            style={[styles.voteButton, item.user_vote === 'upvote' && styles.voteButtonActive]}
            onPress={() => handleVote(item.id, 'upvote')}
          >
            <ThumbsUp size={20} color={item.user_vote === 'upvote' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.voteCount, { color: colors.textSecondary, fontSize: fontSizes.xs }]}>
              {Math.max(0, item.votes_count)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.voteButton, item.user_vote === 'downvote' && styles.voteButtonActive]}
            onPress={() => handleVote(item.id, 'downvote')}
          >
            <ThumbsDown size={20} color={item.user_vote === 'downvote' ? colors.primary : colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.commentsContainer}>
          <MessageCircle size={16} color={colors.textSecondary} />
          <Text style={[styles.commentsCount, { color: colors.textSecondary, fontSize: fontSizes.xs }]}>
            {item.comments_count || 0}
          </Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>
            {statuses.find(s => s.id === item.status)?.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterModal = () => (
    <Modal
      visible={filterModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.filterModal, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text, fontSize: fontSizes.lg }]}>
              Filtros
            </Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Text style={[styles.closeButton, { color: colors.primary }]}>Fechar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent}>
            <Text style={[styles.filterSectionTitle, { color: colors.text, fontSize: fontSizes.md }]}>
              Categoria
            </Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[styles.filterOption, !selectedCategory && styles.filterOptionActive]}
                onPress={() => setSelectedCategory('')}
              >
                <Text style={[styles.filterOptionText, { color: colors.text }]}>Todas</Text>
              </TouchableOpacity>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.filterOption, selectedCategory === cat.id && styles.filterOptionActive]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Text style={[styles.filterOptionText, { color: colors.text }]}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.filterSectionTitle, { color: colors.text, fontSize: fontSizes.md }]}>
              Prioridade
            </Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[styles.filterOption, !selectedPriority && styles.filterOptionActive]}
                onPress={() => setSelectedPriority('')}
              >
                <Text style={[styles.filterOptionText, { color: colors.text }]}>Todas</Text>
              </TouchableOpacity>
              {priorities.map(pri => (
                <TouchableOpacity
                  key={pri.id}
                  style={[styles.filterOption, selectedPriority === pri.id && styles.filterOptionActive]}
                  onPress={() => setSelectedPriority(pri.id)}
                >
                  <Text style={[styles.filterOptionText, { color: colors.text }]}>{pri.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.filterSectionTitle, { color: colors.text, fontSize: fontSizes.md }]}>
              Status
            </Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[styles.filterOption, !selectedStatus && styles.filterOptionActive]}
                onPress={() => setSelectedStatus('')}
              >
                <Text style={[styles.filterOptionText, { color: colors.text }]}>Todos</Text>
              </TouchableOpacity>
              {statuses.map(status => (
                <TouchableOpacity
                  key={status.id}
                  style={[styles.filterOption, selectedStatus === status.id && styles.filterOptionActive]}
                  onPress={() => setSelectedStatus(status.id)}
                >
                  <Text style={[styles.filterOptionText, { color: colors.text }]}>{status.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.filterSectionTitle, { color: colors.text, fontSize: fontSizes.md }]}>
              Ordenar por
            </Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[styles.filterOption, sortBy === 'votes' && styles.filterOptionActive]}
                onPress={() => setSortBy('votes')}
              >
                <Text style={[styles.filterOptionText, { color: colors.text }]}>Mais Votadas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOption, sortBy === 'date' && styles.filterOptionActive]}
                onPress={() => setSortBy('date')}
              >
                <Text style={[styles.filterOptionText, { color: colors.text }]}>Mais Recentes</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSizes.lg }]}>
          Sugestões
        </Text>
        <TouchableOpacity onPress={() => router.push('/sugestoes/nova')} style={styles.addButton}>
          <Plus size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text, fontSize: fontSizes.sm }]}
            placeholder="Buscar sugestões..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: colors.card }]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Filter size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.helpButton, { backgroundColor: colors.card }]}
          onPress={() => setShowHelp(!showHelp)}
        >
          <HelpCircle size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.voiceButton, { backgroundColor: colors.card }]}
          onPress={() => setVoiceMode(!voiceMode)}
        >
          {voiceMode ? <MicOff size={20} color={colors.primary} /> : <Mic size={20} color={colors.primary} />}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Carregando sugestões...
          </Text>
        </View>
      ) : (
        <FlatList
          data={suggestions}
          renderItem={renderSuggestionCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.suggestionsList}
          showsVerticalScrollIndicator={false}
          onRefresh={() => {
            setRefreshing(true);
            fetchSuggestions().finally(() => setRefreshing(false));
          }}
          refreshing={refreshing}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Star size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text, fontSize: fontSizes.lg }]}>
                Nenhuma sugestão encontrada
              </Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                {searchQuery || selectedCategory || selectedPriority || selectedStatus
                  ? 'Tente ajustar os filtros ou a busca'
                  : 'Seja o primeiro a fazer uma sugestão para melhorar nossa cidade!'}
              </Text>
              {!searchQuery && !selectedCategory && !selectedPriority && !selectedStatus && (
                <TouchableOpacity
                  style={[styles.emptyAddButton, { backgroundColor: colors.primary }]}
                  onPress={() => router.push('/sugestoes/nova')}
                >
                  <Plus size={24} color="white" />
                  <Text style={styles.emptyAddButtonText}>Fazer Primeira Sugestão</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}

      {showHelp && (
        <SafeAreaView style={[styles.helpPanel, { backgroundColor: colors.card }]}> 
          <ScrollView style={styles.helpContent} contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
            <Text style={[styles.helpTitle, { color: colors.text, fontSize: fontSizes.lg }]}>Como usar o sistema de sugestões</Text>
            <View style={styles.helpSection}>
              <Text style={[styles.helpSectionTitle, { color: colors.text, fontSize: fontSizes.md }]}>📝 Enviar uma sugestão</Text>
              <Text style={[styles.helpText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>1. Toque no botão "+" para criar uma nova sugestão{"\n"}2. Preencha o título e descrição{"\n"}3. Escolha a categoria (ex: Infraestrutura, Saúde){"\n"}4. Adicione a localização se quiser{"\n"}5. Defina a prioridade (Baixa, Média, Alta, Crítica){"\n"}6. Toque em "Enviar Sugestão"</Text>
            </View>
            <View style={styles.helpSection}>
              <Text style={[styles.helpSectionTitle, { color: colors.text, fontSize: fontSizes.md }]}>👍 Votar em sugestões</Text>
              <Text style={[styles.helpText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>• Toque no polegar para cima 👍 para apoiar{"\n"}• Toque no polegar para baixo 👎 para rejeitar{"\n"}• Você pode mudar seu voto a qualquer momento</Text>
            </View>
            <View style={styles.helpSection}>
              <Text style={[styles.helpSectionTitle, { color: colors.text, fontSize: fontSizes.md }]}>🔍 Filtrar e buscar</Text>
              <Text style={[styles.helpText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>• Use a barra de busca para encontrar sugestões{"\n"}• Toque no ícone de filtro para filtrar por categoria{"\n"}• Ordene por mais votadas ou mais recentes</Text>
            </View>
            <View style={styles.helpSection}>
              <Text style={[styles.helpSectionTitle, { color: colors.text, fontSize: fontSizes.md }]}>💬 Comentar</Text>
              <Text style={[styles.helpText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>• Toque em uma sugestão para ver os detalhes{"\n"}• Role para baixo para ver os comentários{"\n"}• Digite seu comentário na parte inferior{"\n"}• Toque no ícone de enviar para publicar</Text>
            </View>
          </ScrollView>
          <TouchableOpacity
            style={[styles.closeHelpButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowHelp(false)}
          >
            <Text style={styles.closeHelpButtonText}>Entendi</Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}
      {renderFilterModal()}
      
      {/* Botão flutuante para adicionar sugestão */}
      <TouchableOpacity
        style={[styles.floatingAddButton, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/sugestoes/nova')}
        activeOpacity={0.8}
      >
        <Plus size={28} color="white" />
      </TouchableOpacity>
      
      <AccessibilityHelper
        onFontSizeChange={(size) => {
          // Implementar mudança de tamanho de fonte
          console.log('Font size changed to:', size);
        }}
        onVoiceModeToggle={() => setVoiceMode(!voiceMode)}
        voiceMode={voiceMode}
        currentFontSize="medium"
      />
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
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    marginLeft: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
  },
  filterButton: {
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpButton: {
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButton: {
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  suggestionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  suggestionTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  suggestionDescription: {
    lineHeight: 20,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    marginLeft: 4,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 4,
  },
  interactionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  voteButtonActive: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  voteCount: {
    fontWeight: '600',
  },
  commentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentsCount: {
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  emptyAddButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    zIndex: 9999,
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  filterModal: {
    maxHeight: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  submitModal: {
    maxHeight: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontWeight: 'bold',
  },
  closeButton: {
    fontWeight: '600',
  },
  filterContent: {
    flex: 1,
  },
  submitContent: {
    flex: 1,
  },
  filterSectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 20,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  filterOptionActive: {
    backgroundColor: '#007AFF',
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputLabel: {
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  categoryOptionActive: {
    backgroundColor: '#007AFF',
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  priorityGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
  },
  priorityOptionActive: {
    backgroundColor: '#007AFF',
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  submitButtonContent: {
    alignItems: 'center',
  },
  submitButtonSubtext: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
  helpPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 0,
    maxWidth: 600,
    alignSelf: 'center',
  },
  helpTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  helpContent: {
    flex: 1,
    marginBottom: 20,
  },
  helpSection: {
    marginBottom: 20,
  },
  helpSectionTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  helpText: {
    lineHeight: 20,
  },
  closeHelpButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  closeHelpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  helpTip: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  helpTipText: {
    fontWeight: '500',
  },
  helpTipSubtext: {
    marginTop: 4,
  },
  charCount: {
    textAlign: 'right',
    marginTop: 4,
  },
  categoryDescription: {
    marginTop: 4,
    textAlign: 'center',
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 100, // Subiu para não sobrepor o botão de acessibilidade
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitModalFull: {
    flex: 1,
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 0,
    padding: 20,
    justifyContent: 'flex-start',
    zIndex: 10000,
  },
}); 