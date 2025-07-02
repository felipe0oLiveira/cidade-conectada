// Importação do componente Tabs do expo-router
import { Tabs } from 'expo-router';
// Importação dos ícones necessários
import { Chrome as Home, Mail, Bell, User } from 'lucide-react-native';
// Importação do hook de tema
import { useTheme } from '@/context/ThemeContext';
import React, { useRef, useEffect, useMemo } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface RotatingIconProps {
  Icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
  size: number;
  focused: boolean;
}

const ZoomIcon = React.memo(function ZoomIcon({ Icon, color, size, focused }: RotatingIconProps) {
  const scale = useSharedValue(focused ? 1.1 : 1.05);

  React.useEffect(() => {
    scale.value = withTiming(focused ? 1.1 : 1, { duration: 300 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Icon size={size} color={color} />
    </Animated.View>
  );
});

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
          tabBarIcon: (props) => {
            const { color, size, focused = false } = props;
            return <ZoomIcon Icon={Home} color={color} size={size} focused={focused} />;
          },
        }}
      />
      <Tabs.Screen
        name="comunicacoes"
        options={{
          title: 'Comunicações',
          tabBarIcon: (props) => {
            const { color, size, focused = false } = props;
            return <ZoomIcon Icon={Mail} color={color} size={size} focused={focused} />;
          },
        }}
      />
      <Tabs.Screen
        name="alertas"
        options={{
          title: 'Alertas',
          tabBarIcon: (props) => {
            const { color, size, focused = false } = props;
            return <ZoomIcon Icon={Bell} color={color} size={size} focused={focused} />;
          },
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: (props) => {
            const { color, size, focused = false } = props;
            return <ZoomIcon Icon={User} color={color} size={size} focused={focused} />;
          },
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