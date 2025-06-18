// Importação dos componentes e hooks necessários
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, ChevronRight, Bell, Shield, CircleHelp as HelpCircle, LogOut, Camera, Calendar } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';

// Interface para o perfil do usuário
interface Profile {
  name: string;
  email: string;
  avatar_url?: string | null;
}

export default function PerfilScreen() {
  const router = useRouter();
  const { colors, fontSizes } = useTheme();
  const { signOut, session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Carrega o perfil do usuário
  useEffect(() => {
    loadProfile();
  }, [session]);

  // Função para carregar o perfil do usuário
  async function loadProfile() {
    try {
      if (!session?.user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('name, avatar_url')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      setProfile({
        name: profile.name,
        email: session.user.email || '',
        avatar_url: profile.avatar_url,
      });
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setError('Não foi possível carregar seu perfil. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }

  // Função para selecionar uma imagem
  const pickImage = async () => {
    try {
      setError(null);
      
      if (Platform.OS === 'web') {
        // Web: Use file input
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      } else {
        // Native: Use expo-image-picker
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (!permissionResult.granted) {
          setError('É necessário permitir o acesso à galeria para alterar a foto de perfil');
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
          maxWidth: 800,
          maxHeight: 800,
        });

        if (!result.canceled && result.assets[0]) {
          await uploadProfileImage(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      setError('Não foi possível selecionar a imagem. Tente novamente.');
    }
  };

  // Handle web file selection
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB');
        return;
      }
      
      try {
        setUploadingImage(true);
        setError(null);

        if (!session?.user) {
          setError('Você precisa estar logado para atualizar sua foto de perfil');
          return;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('profiles')
          .getPublicUrl(filePath);

        // Update profile with new URL
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', session.user.id);

        if (updateError) throw updateError;

        // Update local state
        setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
        setError(null);
      } catch (error: any) {
        console.error('Erro ao atualizar foto de perfil:', error);
        setError('Não foi possível atualizar sua foto de perfil. Tente novamente mais tarde.');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  // Função para fazer upload da imagem (para plataformas nativas)
  const uploadProfileImage = async (uri: string) => {
    try {
      if (!session?.user) {
        setError('Você precisa estar logado para atualizar sua foto de perfil');
        return;
      }

      setUploadingImage(true);
      setError(null);

      // Converte URI para Blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Verifica o tamanho do arquivo (máximo 5MB)
      if (blob.size > 5 * 1024 * 1024) {
        throw new Error('A imagem deve ter no máximo 5MB');
      }

      // Gera um nome único para o arquivo
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Faz o upload para o Storage
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, blob, {
          contentType: `image/${fileExt}`,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Obtém a URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      // Atualiza o perfil com a nova URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      // Atualiza o estado local
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      setError(null);
    } catch (error: any) {
      console.error('Erro ao atualizar foto de perfil:', error);
      if (error.message.includes('5MB')) {
        setError('A imagem selecionada é muito grande. Escolha uma imagem menor que 5MB.');
      } else {
        setError('Não foi possível atualizar sua foto de perfil. Tente novamente mais tarde.');
      }
    } finally {
      setUploadingImage(false);
    }
  };

  // Itens do menu de configurações
  const menuItems = [
    {
      icon: Calendar,
      title: 'Minhas Consultas',
      description: 'Visualizar consultas agendadas',
      route: '/saude/minhas-consultas',
    },
    {
      icon: Settings,
      title: 'Configurações',
      description: 'Preferências e ajustes do app',
      route: '/perfil/configuracoes',
    },
    {
      icon: Bell,
      title: 'Notificações',
      description: 'Gerenciar alertas e avisos',
      route: '/perfil/notificacoes',
    },
    {
      icon: Shield,
      title: 'Privacidade',
      description: 'Controle seus dados pessoais',
      route: '/perfil/privacidade',
    },
    {
      icon: HelpCircle,
      title: 'Ajuda',
      description: 'Suporte e informações',
      route: '/perfil/ajuda',
    },
  ];

  // Função para fazer logout
  const handleLogout = async () => {
    try {
      await signOut();
      // A navegação será tratada pela mudança no estado de autenticação em _layout.tsx
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      setError('Não foi possível fazer logout. Tente novamente.');
    }
  };

  // Renderiza tela de carregamento
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {Platform.OS === 'web' && (
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      )}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={pickImage}
          disabled={uploadingImage}
        >
          {uploadingImage ? (
            <View style={[styles.avatar, { backgroundColor: colors.border }]}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <>
              <Image
                source={
                  profile?.avatar_url
                    ? { uri: profile.avatar_url }
                    : { uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1920&auto=format&fit=crop' }
                }
                style={styles.avatar}
              />
              <View style={[styles.cameraIcon, { backgroundColor: colors.primary }]}>
                <Camera size={16} color="#FFFFFF" />
              </View>
            </>
          )}
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.name, { color: colors.text, fontSize: fontSizes.xl }]}>
            {profile?.name || 'Usuário'}
          </Text>
          <Text style={[styles.email, { color: colors.textSecondary, fontSize: fontSizes.md }]}>
            {profile?.email || 'Email não disponível'}
          </Text>
          {error && (
            <Text style={[styles.errorText, { color: colors.error, fontSize: fontSizes.sm }]}>
              {error}
            </Text>
          )}
        </View>
      </View>

      <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() => router.push(item.route)}>
            <item.icon size={24} color={colors.primary} />
            <View style={styles.menuItemText}>
              <Text style={[styles.menuItemTitle, { color: colors.text, fontSize: fontSizes.md }]}>
                {item.title}
              </Text>
              <Text style={[styles.menuItemDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                {item.description}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.primary} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: colors.card }]}
        onPress={handleLogout}>
        <LogOut size={24} color={colors.error} />
        <Text style={[styles.logoutText, { color: colors.error, fontSize: fontSizes.md }]}>
          Sair
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerInfo: {
    marginLeft: 20,
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    opacity: 0.8,
  },
  errorText: {
    marginTop: 4,
  },
  menuContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemText: {
    flex: 1,
    marginLeft: 16,
  },
  menuItemTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  menuItemDescription: {
    opacity: 0.8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
  },
  logoutText: {
    marginLeft: 16,
    fontWeight: '600',
  },
});