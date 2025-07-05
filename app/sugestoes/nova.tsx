import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

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

export default function NovaSugestaoScreen() {
  const router = useRouter();
  const { colors, fontSizes } = useTheme();
  const { session } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('medium');
  const [submitting, setSubmitting] = useState(false);

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
      setSubmitting(false);
      Alert.alert('Sucesso', 'Sua sugestão foi enviada com sucesso!');
      router.back();
    } catch (error) {
      setSubmitting(false);
      console.error('Erro ao enviar sugestão:', error, JSON.stringify(error));
      Alert.alert('Erro', 'Não foi possível enviar sua sugestão');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={[styles.header, { backgroundColor: colors.card }]}> 
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSizes.lg }]}>Nova Sugestão</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.helpTip}>
          <Text style={[styles.helpTipText, { color: colors.primary, fontSize: fontSizes.md }]}>💡 Dica: Seja claro e específico no título</Text>
          <Text style={[styles.helpTipSubtext, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>Descreva o problema e como pode ser resolvido</Text>
        </View>
        <Text style={[styles.inputLabel, { color: colors.text, fontSize: fontSizes.md }]}>Título da Sugestão *</Text>
        <TextInput
          style={[styles.textInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border, fontSize: fontSizes.md, paddingVertical: 16 }]}
          value={title}
          onChangeText={setTitle}
          placeholder="Ex: Melhorar a iluminação da praça central"
          placeholderTextColor={colors.textSecondary}
          maxLength={100}
        />
        <Text style={[styles.charCount, { color: colors.textSecondary, fontSize: fontSizes.xs }]}>{title.length}/100 caracteres</Text>
        <Text style={[styles.inputLabel, { color: colors.text, fontSize: fontSizes.md }]}>Descrição Detalhada *</Text>
        <TextInput
          style={[styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border, fontSize: fontSizes.md, paddingVertical: 16 }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Ex: A praça central está muito escura à noite. Seria importante instalar mais postes de luz para a segurança dos moradores que passeiam no local."
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={6}
          maxLength={1000}
        />
        <Text style={[styles.charCount, { color: colors.textSecondary, fontSize: fontSizes.xs }]}>{description.length}/1000 caracteres</Text>
        <Text style={[styles.inputLabel, { color: colors.text, fontSize: fontSizes.md }]}>Categoria da Sugestão *</Text>
        <View style={styles.categoryGrid}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryOption, category === cat.id && styles.categoryOptionActive]}
              onPress={() => setCategory(cat.id)}
            >
              <Text style={[styles.categoryOptionText, { color: colors.text, fontSize: fontSizes.sm }]}>{cat.name}</Text>
              <Text style={[styles.categoryDescription, { color: colors.textSecondary, fontSize: fontSizes.xs }]}>{getCategoryDescription(cat.id)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.inputLabel, { color: colors.text, fontSize: fontSizes.sm }]}>Localização (opcional)</Text>
        <TextInput
          style={[styles.textInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          value={location}
          onChangeText={setLocation}
          placeholder="Ex: Centro, Bairro Jardim, etc."
          placeholderTextColor={colors.textSecondary}
        />
        <Text style={[styles.inputLabel, { color: colors.text, fontSize: fontSizes.sm }]}>Prioridade</Text>
        <View style={styles.priorityGrid}>
          {priorities.map(pri => (
            <TouchableOpacity
              key={pri.id}
              style={[styles.priorityOption, priority === pri.id && styles.priorityOptionActive]}
              onPress={() => setPriority(pri.id)}
            >
              <Text style={[styles.priorityOptionText, { color: colors.text }]}>{pri.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          onPress={handleSubmitSuggestion}
          disabled={submitting || !title.trim() || !description.trim() || !category}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <View style={styles.submitButtonContent}>
              <Text style={styles.submitButtonText}>Enviar Sugestão</Text>
              <Text style={styles.submitButtonSubtext}>Sua opinião é importante!</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: { marginRight: 16 },
  headerTitle: { fontWeight: 'bold', flex: 1, textAlign: 'center' },
  content: { paddingHorizontal: 20 },
  helpTip: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  helpTipText: { fontWeight: '500' },
  helpTipSubtext: { marginTop: 4 },
  inputLabel: { fontWeight: '600', marginBottom: 8 },
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
  charCount: { textAlign: 'right', marginTop: 4 },
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
  categoryOptionActive: { backgroundColor: '#007AFF' },
  categoryOptionText: { fontSize: 14, fontWeight: '500' },
  categoryDescription: { marginTop: 4, textAlign: 'center' },
  priorityGrid: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  priorityOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
  },
  priorityOptionActive: { backgroundColor: '#007AFF' },
  priorityOptionText: { fontSize: 14, fontWeight: '500' },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  submitButtonContent: { alignItems: 'center' },
  submitButtonSubtext: { color: 'white', fontSize: 12, opacity: 0.8, marginTop: 2 },
}); 