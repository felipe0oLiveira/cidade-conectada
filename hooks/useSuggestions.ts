import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export interface Suggestion {
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

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

export interface SuggestionFilters {
  category?: string;
  priority?: string;
  status?: string;
  search?: string;
  sortBy?: 'votes' | 'date';
}

export const useSuggestions = () => {
  const { session } = useAuth();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async (filters: SuggestionFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('suggestions')
        .select('*')
        .order(filters.sortBy === 'votes' ? 'votes_count' : 'created_at', { ascending: false });

      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Get user votes for each suggestion
      if (session?.user) {
        const { data: userVotes } = await supabase
          .from('suggestion_votes')
          .select('suggestion_id, vote_type')
          .eq('user_id', session.user.id);

        const votesMap = new Map();
        userVotes?.forEach(vote => {
          votesMap.set(vote.suggestion_id, vote.vote_type);
        });

        // Get comments count for each suggestion
        const commentsMap = new Map();
        if (data) {
          for (const suggestion of data) {
            const { count } = await supabase
              .from('suggestion_comments')
              .select('*', { count: 'exact', head: true })
              .eq('suggestion_id', suggestion.id);
            commentsMap.set(suggestion.id, count || 0);
          }
        }

        const suggestionsWithVotes = data?.map(suggestion => ({
          ...suggestion,
          user_vote: votesMap.get(suggestion.id),
          comments_count: commentsMap.get(suggestion.id) || 0
        }));

        setSuggestions(suggestionsWithVotes || []);
      } else {
        setSuggestions(data || []);
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError('Não foi possível carregar as sugestões');
    } finally {
      setLoading(false);
    }
  };

  const createSuggestion = async (suggestionData: {
    title: string;
    description: string;
    category: string;
    location?: string;
    priority: string;
  }) => {
    if (!session?.user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const { data, error } = await supabase
        .from('suggestions')
        .insert({
          user_id: session.user.id,
          ...suggestionData
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh suggestions
      await fetchSuggestions();
      
      return data;
    } catch (err) {
      console.error('Error creating suggestion:', err);
      throw new Error('Não foi possível criar a sugestão');
    }
  };

  const voteSuggestion = async (suggestionId: string, voteType: 'upvote' | 'downvote') => {
    if (!session?.user) {
      throw new Error('Usuário não autenticado');
    }

    try {
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
      await fetchSuggestions();
    } catch (err) {
      console.error('Error voting:', err);
      throw new Error('Não foi possível registrar seu voto');
    }
  };

  const getSuggestion = async (suggestionId: string): Promise<Suggestion | null> => {
    try {
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .eq('id', suggestionId)
        .single();

      if (error) throw error;

      // Get user vote
      if (session?.user) {
        const { data: userVote } = await supabase
          .from('suggestion_votes')
          .select('vote_type')
          .eq('suggestion_id', suggestionId)
          .eq('user_id', session.user.id)
          .single();

        return {
          ...data,
          user_vote: userVote?.vote_type
        };
      }

      return data;
    } catch (err) {
      console.error('Error fetching suggestion:', err);
      throw new Error('Não foi possível carregar a sugestão');
    }
  };

  const getComments = async (suggestionId: string): Promise<Comment[]> => {
    try {
      const { data, error } = await supabase
        .from('suggestion_comments')
        .select('*')
        .eq('suggestion_id', suggestionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching comments:', err);
      throw new Error('Não foi possível carregar os comentários');
    }
  };

  const addComment = async (suggestionId: string, content: string) => {
    if (!session?.user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const { error } = await supabase
        .from('suggestion_comments')
        .insert({
          suggestion_id: suggestionId,
          user_id: session.user.id,
          content: content.trim()
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error adding comment:', err);
      throw new Error('Não foi possível adicionar o comentário');
    }
  };

  const editComment = async (commentId: string, content: string) => {
    if (!session?.user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const { error } = await supabase
        .from('suggestion_comments')
        .update({ content: content.trim() })
        .eq('id', commentId)
        .eq('user_id', session.user.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error editing comment:', err);
      throw new Error('Não foi possível editar o comentário');
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!session?.user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const { error } = await supabase
        .from('suggestion_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', session.user.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting comment:', err);
      throw new Error('Não foi possível excluir o comentário');
    }
  };

  return {
    suggestions,
    loading,
    error,
    fetchSuggestions,
    createSuggestion,
    voteSuggestion,
    getSuggestion,
    getComments,
    addComment,
    editComment,
    deleteComment
  };
}; 