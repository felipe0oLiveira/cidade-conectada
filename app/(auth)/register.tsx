import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { User, Mail, Lock, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function RegisterScreen() {
  const router = useRouter();
  const { colors, fontSizes } = useTheme();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    // Reset states
    setError('');
    setSuccess(false);

    // Validate inputs
    if (!name.trim()) {
      setError('Por favor, insira seu nome');
      return;
    }
    if (!email.trim()) {
      setError('Por favor, insira seu email');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Por favor, insira um email válido');
      return;
    }
    if (!password) {
      setError('Por favor, insira uma senha');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, name);
      setSuccess(true);
      // Wait a moment before redirecting to ensure the user sees the success message
      setTimeout(() => {
        router.replace('/login');
      }, 2000);
    } catch (error: any) {
      if (error.message?.toLowerCase().includes('email')) {
        setError('Este email já está em uso');
      } else if (error.message?.toLowerCase().includes('password')) {
        setError('Senha muito fraca. Use pelo menos 6 caracteres');
      } else {
        setError('Erro ao criar conta. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/city_background.jpg')}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
        <View style={styles.logoContainer}>
          <Text style={[styles.title, { color: '#FFFFFF', fontSize: fontSizes['2xl'] }]}>
            Cidade Conectada
          </Text>
          <Text style={[styles.subtitle, { color: '#FFFFFF', fontSize: fontSizes.md }]}>
            Crie sua conta
          </Text>
        </View>
      </View>

      <View style={[styles.formContainer, { backgroundColor: colors.card }]}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        ) : null}

        {success ? (
          <View style={[styles.successContainer, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.successText, { color: colors.primary }]}>
              Cadastro realizado com sucesso! Redirecionando para o login...
            </Text>
          </View>
        ) : null}

        <View style={styles.inputContainer}>
          <User size={20} color="#666666" />
          <TextInput
            style={[styles.input, { color: '#000000', fontSize: fontSizes.md }]}
            placeholder="Nome completo"
            placeholderTextColor="#666666"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError('');
            }}
            autoCapitalize="words"
            autoComplete="name"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Mail size={20} color="#666666" />
          <TextInput
            style={[styles.input, { color: '#000000', fontSize: fontSizes.md }]}
            placeholder="Email"
            placeholderTextColor="#666666"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock size={20} color="#666666" />
          <TextInput
            style={[styles.input, { color: '#000000', fontSize: fontSizes.md }]}
            placeholder="Senha"
            placeholderTextColor="#666666"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            secureTextEntry
            autoComplete="new-password"
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.primary },
            loading && styles.buttonDisabled
          ]}
          onPress={handleRegister}
          disabled={loading || success}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={[styles.buttonText, { fontSize: fontSizes.md }]}>Cadastrar</Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
            Já tem uma conta?{' '}
          </Text>
          {Platform.OS === 'web' ? (
            <Link href="/login" style={styles.link}>
              <Text style={[styles.linkText, { color: colors.primary, fontSize: fontSizes.sm }]}>
                Faça login
              </Text>
            </Link>
          ) : (
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={[styles.linkText, { color: colors.primary, fontSize: fontSizes.sm }]}>
                  Faça login
                </Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 280,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  logoContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0,0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 14,
  },
  successText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    marginLeft: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    opacity: 0.8,
  },
  link: {
    textDecorationLine: 'none',
  },
  linkText: {
    fontWeight: '600',
  },
});