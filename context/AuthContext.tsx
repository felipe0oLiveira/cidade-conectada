// Importação dos hooks e tipos necessários
import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
// Cliente Supabase configurado
import { supabase } from '@/lib/supabase';

// Interface do contexto de autenticação
interface AuthContextType {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, cidade: string) => Promise<void>;
  signOut: () => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
}

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provedor de autenticação
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Estados para sessão e carregamento
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Efeito para inicializar o estado de autenticação
  useEffect(() => {
    // Obtém a sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Configura o listener para mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Limpeza do listener ao desmontar
    return () => subscription.unsubscribe();
  }, []);

  // Função de login
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw error;
  };

  // Função de cadastro
  const signUp = async (email: string, password: string, name: string, cidade: string) => {
    try {
      // Limpa a sessão antes do registro
      await signOut();

      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name.trim(),
            cidade: cidade.trim(),
          },
          emailRedirectTo: window.location.origin,
        },
      });
      
      if (signUpError) throw signUpError;

      // Limpa a sessão imediatamente
      setSession(null);
      
    } catch (error) {
      throw error;
    }
  };

  // Função de logout
  const signOut = async () => {
    try {
      // Limpa a sessão primeiro
      setSession(null);
      // Realiza o logout
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  };

  // Função para reenviar email de confirmação
  const resendConfirmationEmail = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim().toLowerCase(),
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      loading, 
      signIn, 
      signUp, 
      signOut,
      resendConfirmationEmail 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}