// Importação do polyfill necessário para URLs no React Native
import 'react-native-url-polyfill/auto';
// Importação do cliente Supabase
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

if (!supabaseUrl) throw new Error('supabaseUrl não definida');
if (!supabaseAnonKey) throw new Error('supabaseAnonKey não definida');

// Criação e exportação do cliente Supabase configurado
export const supabase = createClient(supabaseUrl, supabaseAnonKey);