// Importação do componente Tabs do expo-router
import { Tabs } from 'expo-router';
// Importação dos ícones necessários
import { Chrome as Home, Mail, Bell, User } from 'lucide-react-native';
// Importação do hook de tema
import { useTheme } from '@/context/ThemeContext';

// Componente que define o layout das abas
export default function TabLayout() {
  // Obtém as cores do tema atual
  const { colors } = useTheme();

  return (
    // Configuração do navegador de abas
    <Tabs
      screenOptions={{
        // Oculta o cabeçalho padrão
        headerShown: false,
        // Estilização da barra de abas
        tabBarStyle: {
          backgroundColor: colors.card,
          height: 60,
          paddingBottom: 8,
        },
        // Cores dos ícones ativos e inativos
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}>
      {/* Configuração das telas principais */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="comunicacoes"
        options={{
          title: 'Comunicações',
          tabBarIcon: ({ color, size }) => <Mail size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alertas"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      
      {/* Telas ocultas acessíveis via navegação direta */}
      <Tabs.Screen
        name="saude"
        options={{
          href: null, // Oculta da barra de abas
        }}
      />
      <Tabs.Screen
        name="educacao"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="empregos"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}