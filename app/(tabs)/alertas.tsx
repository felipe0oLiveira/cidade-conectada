import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Button, FlatList, Modal, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Trash2, Lightbulb, Droplets, Truck } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

// Lista de tipos de problemas urbanos disponíveis para solicitação
const tiposProblema = [
  { label: 'Coleta de Lixo', value: 'Lixo acumulado', icon: <Trash2 size={24} color="#FF6347" /> },
  { label: 'Iluminação com Defeito', value: 'Iluminação pública', icon: <Lightbulb size={24} color="#FFD700" /> },
  { label: 'Desobstrução de Bueiros', value: 'Desobstrução de bueiros', icon: <Droplets size={24} color="#4169E1" /> },
  { label: 'Retirada de Entulhos', value: 'Retirada de entulhos', icon: <Truck size={24} color="#32CD32" /> },
];

// Componente principal da tela de Alertas
export default function AlertasScreen() {
  // Hooks de tema e autenticação
  const { colors, fontSizes } = useTheme();
  const { session } = useAuth();

  // Estados para controle dos formulários e dados
  const [modalVisible, setModalVisible] = useState(false);
  const [tipo, setTipo] = useState(tiposProblema[0].value);
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [foto, setFoto] = useState<null | { uri: string; type?: string; name?: string }>(null);
  const [enviando, setEnviando] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Carrega as solicitações do usuário ao abrir a tela ou mudar de usuário
  useEffect(() => {
    if (session?.user) fetchSolicitacoes();
  }, [session]);

  // Busca as solicitações do usuário no Supabase
  async function fetchSolicitacoes() {
    if (!session?.user) return;
    setCarregando(true);
    const { data, error } = await supabase
      .from('servicos_urbanos')
      .select('*')
      .eq('usuario_id', session.user.id)
      .order('data_criacao', { ascending: false });
    if (!error && data) setSolicitacoes(data);
    setCarregando(false);
  }

  // Seleciona uma imagem da galeria, redimensiona e comprime antes de salvar
  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      // Redimensiona e comprime a imagem antes de salvar
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }],
        { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG }
      );
      setFoto(manipResult);
    }
  }

  // Tira uma foto com a câmera, redimensiona e comprime antes de salvar
  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('É necessário permitir o acesso à câmera para tirar uma foto.');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      // Redimensiona e comprime a imagem antes de salvar
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }],
        { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG }
      );
      setFoto(manipResult);
    }
  }

  // Envia a solicitação para o Supabase, incluindo upload da foto se houver
  async function handleSubmit() {
    if (!descricao) return alert('Descreva o problema.');
    if (!session?.user) return alert('Usuário não autenticado.');
    setEnviando(true);
    let foto_url = null;
    if (foto) {
      const fileExt = foto.uri.split('.').pop();
      const fileName = `${session.user.id}_${Date.now()}.${fileExt}`;
      // Sempre buscar como blob
      const response = await fetch(foto.uri);
      const blob = await response.blob();
      const { data, error } = await supabase.storage
        .from('servicos-urbanos')
        .upload(fileName, blob);
      if (!error) {
        const { data: publicUrl } = supabase.storage
          .from('servicos-urbanos')
          .getPublicUrl(fileName);
        foto_url = publicUrl.publicUrl;
      }
    }
    console.log('Enviando solicitação:', {
      usuario_id: session.user.id,
      tipo,
      descricao,
      localizacao,
      foto_url,
    });
    const { error } = await supabase.from('servicos_urbanos').insert([
      {
        usuario_id: session.user.id,
        tipo,
        descricao,
        localizacao,
        foto_url,
      },
    ]);
    setEnviando(false);
    if (!error) {
      setDescricao('');
      setLocalizacao('');
      setFoto(null);
      setModalVisible(false);
      fetchSolicitacoes();
      alert('Solicitação enviada!');
    } else {
      console.log('ERRO AO ENVIAR SOLICITAÇÃO:', error);
      alert('Erro ao enviar solicitação: ' + (error?.message || JSON.stringify(error)));
    }
  }

  // Retorna o estilo de fundo do ícone do card de acordo com o tipo
  function cardIconBg(idx: number) {
    return [
      { backgroundColor: '#FF634740' },
      { backgroundColor: '#FFD70040' },
      { backgroundColor: '#4169E140' },
      { backgroundColor: '#32CD3240' },
    ][idx] || { backgroundColor: '#ccc' };
  }

  // Cabeçalho, banner e cards de serviços urbanos
  const header = (
    <>
      <View style={[styles.header, { backgroundColor: colors.card }]}>  
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSizes['2xl'], textAlign: 'center', alignSelf: 'center' }]}>  
          Serviços Urbanos
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontSize: fontSizes.md, textAlign: 'center', alignSelf: 'center' }]}>  
          Solicite serviços para sua região
        </Text>
      </View>
      {/* Banner ilustrativo */}
      <Image
        source={require('../../assets/images/banner_servicos_urbanos.png')}
        style={styles.bannerImage}
      />
      {/* Cards de tipos de problemas urbanos */}
      <View style={styles.content}>
        {tiposProblema.map((tp, idx) => (
          <TouchableOpacity
            key={tp.value}
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={() => { setTipo(tp.value); setModalVisible(true); }}
          >
            <View style={[styles.iconContainer, cardIconBg(idx)]}>{tp.icon}</View>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSizes.md }]}>{tp.label}</Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>Solicitar {tp.label.toLowerCase()}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      {/* Título das solicitações do usuário */}
      <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSizes.xl, marginTop: 24, textAlign: 'center', alignSelf: 'center' }]}>Minhas Solicitações</Text>
    </>
  );

  return (
    // Container principal da tela
    <View style={[styles.container, { backgroundColor: colors.background }]}>  
      {/* Lista de solicitações do usuário */}
      <FlatList
        ListHeaderComponent={header}
        data={solicitacoes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.tipo}</Text>
            <Text>{item.descricao}</Text>
            {item.foto_url && <Image source={{ uri: item.foto_url }} style={styles.cardFoto} />}
            <Text>Status: {item.status}</Text>
            <Text style={styles.cardData}>{new Date(item.data_criacao).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={carregando ? <ActivityIndicator /> : <Text style={{ textAlign: 'center', margin: 20 }}>Nenhuma solicitação encontrada.</Text>}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
      {/* Modal para nova solicitação */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: colors.card }]}>  
                <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSizes.lg }]}>Nova Solicitação</Text>
                <Text style={{ marginBottom: 8 }}>Tipo: <Text style={{ fontWeight: 'bold' }}>{tipo}</Text></Text>
                <Text>Descrição:</Text>
                <TextInput
                  style={styles.input}
                  value={descricao}
                  onChangeText={setDescricao}
                  placeholder="Descreva o problema"
                  multiline
                />
                <Text>Localização (opcional):</Text>
                <TextInput
                  style={styles.input}
                  value={localizacao}
                  onChangeText={setLocalizacao}
                  placeholder="Endereço ou ponto de referência"
                />
                {/* Botões para selecionar ou tirar foto */}
                <View style={{ flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Button title="Selecionar Foto" onPress={pickImage} />
                  <Button title="Tirar Foto" onPress={takePhoto} />
                  {foto && <Image source={{ uri: foto.uri }} style={{ width: 120, height: 120, marginTop: 8, borderRadius: 8 }} />}
                </View>
                {/* Botão de envio */}
                <Button title={enviando ? 'Enviando...' : 'Enviar Solicitação'} onPress={handleSubmit} disabled={enviando} />
                <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#888" />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
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
  // novos estilos para formulário/modal/listagem
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  foto: {
    width: 100,
    height: 100,
    marginVertical: 8,
    borderRadius: 8,
  },
  cardFoto: {
    width: 80,
    height: 80,
    marginVertical: 6,
    borderRadius: 6,
  },
  cardData: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});