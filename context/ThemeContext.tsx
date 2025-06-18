// Importação dos hooks e tipos necessários
import { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

// Definição dos tipos para o tema
type ThemeType = 'light' | 'dark' | 'system';
type FontSizeType = 'small' | 'medium' | 'large';

// Interface do contexto do tema
interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  fontSize: FontSizeType;
  setFontSize: (size: FontSizeType) => void;
  isDarkMode: boolean;
  colors: typeof lightColors;
  fontSizes: typeof mediumFontSizes;
}

// Paleta de cores para o tema claro
const lightColors = {
  background: '#F5F7FA',
  card: '#FFFFFF',
  text: '#1B3B58',
  textSecondary: '#5A7184',
  primary: '#2B5B7B',
  secondary: '#4CAF50',
  accent: '#FF9800',
  border: '#E5E9EF',
  error: '#DC3545',
  success: '#28A745',
  warning: '#FFC107',
  info: '#17A2B8',
};

// Paleta de cores para o tema escuro
const darkColors = {
  background: '#1A2634',
  card: '#243447',
  text: '#FFFFFF',
  textSecondary: '#A0AEC0',
  primary: '#4C8DAF',
  secondary: '#6FCF97',
  accent: '#FFB74D',
  border: '#2D3748',
  error: '#EF5350',
  success: '#4CAF50',
  warning: '#FFB900',
  info: '#29B6F6',
};

// Configurações de tamanhos de fonte
const smallFontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
};

const mediumFontSizes = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
  '2xl': 28,
};

const largeFontSizes = {
  xs: 16,
  sm: 18,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 32,
};

// Criação do contexto
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provedor do tema
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Estado para o esquema de cores do sistema
  const systemColorScheme = useColorScheme();
  // Estados para tema e tamanho de fonte
  const [theme, setTheme] = useState<ThemeType>('system');
  const [fontSize, setFontSize] = useState<FontSizeType>('medium');

  // Determina se o modo escuro está ativo
  const isDarkMode =
    theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark';

  // Seleciona as cores e tamanhos de fonte apropriados
  const colors = isDarkMode ? darkColors : lightColors;
  const fontSizes = fontSize === 'small' 
    ? smallFontSizes 
    : fontSize === 'large' 
    ? largeFontSizes 
    : mediumFontSizes;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        fontSize,
        setFontSize,
        isDarkMode,
        colors,
        fontSizes,
      }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personalizado para usar o contexto do tema
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}