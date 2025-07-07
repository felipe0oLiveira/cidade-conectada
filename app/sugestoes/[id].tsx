import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { 
  ChevronLeft, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Send,
  MapPin,
  Clock,
  User,
  Star,
  Edit,
  Trash2
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

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
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
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

export default function SuggestionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors, fontSizes } = useTheme();
  const { session } = useAuth();
  
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (id) {
      fetchSuggestion();
      fetchComments();
    }
  }, [id]);

  const fetchSuggestion = async () => {
    try {
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .eq('id', id)
        .single();
      if (error || !data) throw new Error('Sugestão não encontrada');
      // Get user vote
      if (session?.user) {
        const { data: userVote } = await supabase
          .from('suggestion_votes')
          .select('vote_type')
          .eq('suggestion_id', id)
          .eq('user_id', session.user.id)
          .single();
        setSuggestion({
          ...data,
          user_vote: userVote?.vote_type
        });
      } else {
        setSuggestion(data);
      }
    } catch (error) {
      console.error('Error fetching suggestion:', error);
      Alert.alert('Erro', 'Não foi possível carregar a sugestão');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('suggestion_comments')
        .select('*')
        .eq('suggestion_id', id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!session?.user) {
      Alert.alert('Erro', 'Você precisa estar logado para votar');
      return;
    }

    try {
      // Simular votação com dados mock
      const existingVote = suggestion?.user_vote;
      let newVotesCount = suggestion?.votes_count || 0;
      
      if (existingVote === voteType) {
        // Remove vote
        newVotesCount = voteType === 'upvote' ? newVotesCount - 1 : newVotesCount + 1;
        setSuggestion(prev => prev ? { ...prev, user_vote: undefined, votes_count: newVotesCount } : null);
      } else {
        // Add or change vote
        if (existingVote === 'upvote' && voteType === 'downvote') {
          newVotesCount = newVotesCount - 2;
        } else if (existingVote === 'downvote' && voteType === 'upvote') {
          newVotesCount = newVotesCount + 2;
        } else if (voteType === 'upvote') {
          newVotesCount = newVotesCount + 1;
        } else {
          newVotesCount = newVotesCount - 1;
        }
        setSuggestion(prev => prev ? { ...prev, user_vote: voteType, votes_count: newVotesCount } : null);
      }
      
      // Descomentar o código abaixo quando executar a migração do banco
      /*
      const existingVote = suggestion?.user_vote;
      
      if (existingVote === voteType) {
        // Remove vote
        const { error } = await supabase
          .from('suggestion_votes')
          .delete()
          .eq('suggestion_id', id)
          .eq('user_id', session.user.id);
        
        if (error) throw error;
      } else {
        // Insert or update vote
        const { error } = await supabase
          .from('suggestion_votes')
          .upsert({
            suggestion_id: id,
            user_id: session.user.id,
            vote_type: voteType
          });
        
        if (error) throw error;
      }

      // Refresh suggestion
      fetchSuggestion();
      */
    } catch (error) {
      console.error('Error voting:', error);
      Alert.alert('Erro', 'Não foi possível registrar seu voto');
    }
  };

  const handleSubmitComment = async () => {
    if (!session?.user) {
      Alert.alert('Erro', 'Você precisa estar logado para comentar');
      return;
    }

    if (!commentText.trim()) {
      Alert.alert('Erro', 'Digite um comentário');
      return;
    }

    try {
      setSubmittingComment(true);
      
      // Simular adição de comentário com dados mock
      const newComment: Comment = {
        id: Date.now().toString(),
        content: commentText.trim(),
        created_at: new Date().toISOString(),
        user_id: session.user.id
      };

      setComments(prev => [...prev, newComment]);
      setCommentText('');
      
      //  Descomentar o código abaixo quando executar a migração do banco
      /*
      const { error } = await supabase
        .from('suggestion_comments')
        .insert({
          suggestion_id: id,
          user_id: session.user.id,
          content: commentText.trim()
        });

      if (error) throw error;

      setCommentText('');
      fetchComments();
      */
    } catch (error) {
      console.error('Error submitting comment:', error);
      Alert.alert('Erro', 'Não foi possível enviar o comentário');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editText.trim()) {
      Alert.alert('Erro', 'Digite um comentário');
      return;
    }

    try {
      // Simular edição de comentário com dados mock
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, content: editText.trim() }
          : comment
      ));
      
      setEditingComment(null);
      setEditText('');
      
      //  Descomentar o código abaixo quando executar a migração do banco
      /*
      const { error } = await supabase
        .from('suggestion_comments')
        .update({ content: editText.trim() })
        .eq('id', commentId)
        .eq('user_id', session?.user?.id);

      if (error) throw error;

      setEditingComment(null);
      setEditText('');
      fetchComments();
      */
    } catch (error) {
      console.error('Error editing comment:', error);
      Alert.alert('Erro', 'Não foi possível editar o comentário');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este comentário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              // Simular exclusão de comentário com dados mock
              setComments(prev => prev.filter(comment => comment.id !== commentId));
              
              //  Descomentar o código abaixo quando executar a migração do banco
              /*
              const { error } = await supabase
                .from('suggestion_comments')
                .delete()
                .eq('id', commentId)
                .eq('user_id', session?.user?.id);

              if (error) throw error;
              fetchComments();
              */
            } catch (error) {
              console.error('Error deleting comment:', error);
              Alert.alert('Erro', 'Não foi possível excluir o comentário');
            }
          }
        }
      ]
    );
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

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={[styles.commentCard, { backgroundColor: colors.card }]}>
      <View style={styles.commentHeader}>
        <View style={styles.commentUser}>
          <User size={16} color={colors.textSecondary} />
                      <Text style={[styles.commentUserName, { color: colors.text, fontSize: fontSizes.sm }]}>
              Usuário
            </Text>
        </View>
        <View style={styles.commentDate}>
          <Clock size={14} color={colors.textSecondary} />
          <Text style={[styles.commentDateText, { color: colors.textSecondary, fontSize: fontSizes.xs }]}>
            {new Date(item.created_at).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </View>

      {editingComment === item.id ? (
        <View style={styles.editCommentContainer}>
          <TextInput
            style={[styles.editCommentInput, { 
              backgroundColor: colors.background, 
              color: colors.text, 
              borderColor: colors.border 
            }]}
            value={editText}
            onChangeText={setEditText}
            multiline
            placeholder="Editar comentário..."
            placeholderTextColor={colors.textSecondary}
          />
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: colors.primary }]}
              onPress={() => handleEditComment(item.id)}
            >
              <Text style={styles.editButtonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: colors.border }]}
              onPress={() => {
                setEditingComment(null);
                setEditText('');
              }}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={[styles.commentContent, { color: colors.text, fontSize: fontSizes.sm }]}>
          {item.content}
        </Text>
      )}

              {session?.user?.id === item.user_id && editingComment !== item.id && (
        <View style={styles.commentActions}>
          <TouchableOpacity
            style={styles.commentAction}
            onPress={() => {
              setEditingComment(item.id);
              setEditText(item.content);
            }}
          >
            <Edit size={16} color={colors.textSecondary} />
            <Text style={[styles.commentActionText, { color: colors.textSecondary, fontSize: fontSizes.xs }]}>
              Editar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.commentAction}
            onPress={() => handleDeleteComment(item.id)}
          >
            <Trash2 size={16} color="#FF4444" />
            <Text style={[styles.commentActionText, { color: '#FF4444', fontSize: fontSizes.xs }]}>
              Excluir
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Carregando sugestão...
        </Text>
      </View>
    );
  }

  if (!suggestion) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Star size={64} color={colors.textSecondary} />
        <Text style={[styles.errorTitle, { color: colors.text, fontSize: fontSizes.lg }]}>
          Sugestão não encontrada
        </Text>
        <Text style={[styles.errorText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
          A sugestão que você está procurando não existe ou foi removida.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSizes.md }]}>
          Detalhes da Sugestão
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.suggestionCard, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <View style={styles.categoryBadge}>
              <Text style={[styles.categoryText, { color: getCategoryColor(suggestion.category) }]}>
                {categories.find(c => c.id === suggestion.category)?.name}
              </Text>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(suggestion.priority) }]}>
              <Text style={styles.priorityText}>
                {priorities.find(p => p.id === suggestion.priority)?.name}
              </Text>
            </View>
          </View>

          <Text style={[styles.suggestionTitle, { color: colors.text, fontSize: fontSizes.xl }]}>
            {suggestion.title}
          </Text>
          
          <Text style={[styles.suggestionDescription, { color: colors.text, fontSize: fontSizes.md }]}>
            {suggestion.description}
          </Text>

          {suggestion.location && (
            <View style={styles.locationContainer}>
              <MapPin size={16} color={colors.textSecondary} />
              <Text style={[styles.locationText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                {suggestion.location}
              </Text>
            </View>
          )}

          <View style={styles.suggestionMeta}>
            <View style={styles.userInfo}>
              <User size={16} color={colors.textSecondary} />
                          <Text style={[styles.userText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
              Usuário
            </Text>
            </View>

            <View style={styles.dateInfo}>
              <Clock size={16} color={colors.textSecondary} />
              <Text style={[styles.dateText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                {new Date(suggestion.created_at).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          </View>

          <View style={styles.interactionBar}>
            <View style={styles.voteContainer}>
              <TouchableOpacity 
                style={[styles.voteButton, suggestion.user_vote === 'upvote' && styles.voteButtonActive]}
                onPress={() => handleVote('upvote')}
              >
                <ThumbsUp size={24} color={suggestion.user_vote === 'upvote' ? colors.primary : colors.textSecondary} />
                <Text style={[styles.voteCount, { color: colors.textSecondary, fontSize: fontSizes.md }]}>
                  {Math.max(0, suggestion.votes_count)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.voteButton, suggestion.user_vote === 'downvote' && styles.voteButtonActive]}
                onPress={() => handleVote('downvote')}
              >
                <ThumbsDown size={24} color={suggestion.user_vote === 'downvote' ? colors.primary : colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(suggestion.status) }]}>
              <Text style={styles.statusText}>
                {statuses.find(s => s.id === suggestion.status)?.name}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.commentsSection}>
          <Text style={[styles.commentsTitle, { color: colors.text, fontSize: fontSizes.lg }]}>
            Comentários ({comments.length})
          </Text>
          
          {comments.length > 0 ? (
            <FlatList
              data={comments}
              renderItem={renderComment}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyComments}>
              <MessageCircle size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyCommentsText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.commentInputContainer, { backgroundColor: colors.card }]}>
        <TextInput
          style={[styles.commentInput, { 
            backgroundColor: colors.background, 
            color: colors.text, 
            borderColor: colors.border 
          }]}
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Adicionar comentário..."
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={handleSubmitComment}
          disabled={submittingComment || !commentText.trim()}
        >
          {submittingComment ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Send size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  suggestionCard: {
    padding: 20,
    borderRadius: 12,
    marginVertical: 16,
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
    marginBottom: 16,
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
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 28,
  },
  suggestionDescription: {
    lineHeight: 24,
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    marginLeft: 8,
  },
  suggestionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    marginLeft: 8,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 8,
  },
  interactionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  voteButtonActive: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  voteCount: {
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  commentsSection: {
    marginTop: 20,
  },
  commentsTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  commentCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentUserName: {
    fontWeight: '600',
    marginLeft: 6,
  },
  commentDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentDateText: {
    marginLeft: 4,
  },
  commentContent: {
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 16,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentActionText: {
    fontWeight: '500',
  },
  editCommentContainer: {
    marginBottom: 12,
  },
  editCommentInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyComments: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyCommentsText: {
    marginTop: 12,
    textAlign: 'center',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    gap: 12,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    textAlign: 'center',
  },
}); 