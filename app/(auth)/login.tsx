import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Mail, Lock, ArrowRight, RefreshCw } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function LoginScreen() {
  const { colors, fontSizes } = useTheme();
  const { signIn, resendConfirmationEmail } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleResendConfirmation = async () => {
    if (!email || !isValidEmail(email)) {
      setError('Por favor, insira um email válido para reenviar a confirmação');
      return;
    }

    try {
      setResendLoading(true);
      await resendConfirmationEmail(email);
      setError('Email de confirmação reenviado. Por favor, verifique sua caixa de entrada.');
      setShowResendConfirmation(false);
    } catch (error: any) {
      setError('Não foi possível reenviar o email de confirmação. Por favor, tente novamente.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleLogin = async () => {
    setError('');
    setShowResendConfirmation(false);

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Por favor, insira um email válido');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      // Navigation will be handled by the auth state change in _layout.tsx
    } catch (error: any) {
      if (error?.message?.includes('invalid_credentials')) {
        setError('Email ou senha incorretos');
      } else if (error?.message?.includes('email_not_confirmed')) {
        setError('Por favor, confirme seu email antes de fazer login');
        setShowResendConfirmation(true);
      } else {
        setError('Ocorreu um erro ao fazer login. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://www.cedrotech.com/wp-content/uploads/2022/12/voce-sabe-o-que-e-uma-cidade-inteligente19420.jpg' }}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
        <View style={styles.logoContainer}>
          <Text style={[styles.title, { color: '#FFFFFF', fontSize: fontSizes['2xl'] }]}>
            Cidade Conectada
          </Text>
          <Text style={[styles.subtitle, { color: '#FFFFFF', fontSize: fontSizes.md }]}>
            Acesse sua conta
          </Text>
        </View>
      </View>

      <View style={[styles.formContainer, { backgroundColor: colors.card }]}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            {showResendConfirmation && (
              <TouchableOpacity
                style={[styles.resendButton, { backgroundColor: colors.primary }]}
                onPress={handleResendConfirmation}
                disabled={resendLoading}
              >
                {resendLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <RefreshCw size={16} color="#FFFFFF" style={styles.resendIcon} />
                    <Text style={styles.resendButtonText}>Reenviar email de confirmação</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        ) : null}

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
              setShowResendConfirmation(false);
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
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
              setShowResendConfirmation(false);
            }}
            secureTextEntry
            autoComplete="current-password"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.primary },
            loading && styles.buttonDisabled
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={[styles.buttonText, { fontSize: fontSizes.md }]}>Entrar</Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
            Não tem uma conta?{' '}
          </Text>
          {Platform.OS === 'web' ? (
            <Link href="/register" style={styles.link}>
              <Text style={[styles.linkText, { color: colors.primary, fontSize: fontSizes.sm }]}>
                Cadastre-se
              </Text>
            </Link>
          ) : (
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text style={[styles.linkText, { color: colors.primary, fontSize: fontSizes.sm }]}>
                  Cadastre-se
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
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 14,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    padding: 8,
    borderRadius: 6,
  },
  resendIcon: {
    marginRight: 8,
  },
  resendButtonText: {
    color: '#FFFFFF',
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