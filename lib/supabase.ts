// Importação do polyfill necessário para URLs no React Native
import 'react-native-url-polyfill/auto';
// Importação do cliente Supabase
import { createClient } from '@supabase/supabase-js';

// Verificação das variáveis de ambiente necessárias
if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
  throw new Error('Variável de ambiente ausente: EXPO_PUBLIC_SUPABASE_URL');
}
if (!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Variável de ambiente ausente: EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

// Criação e exportação do cliente Supabase configurado
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);