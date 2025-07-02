import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, MessageSquare, Bell, Clock } from 'lucide-react-native';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: any;
  enabled: boolean;
}

export default function NotificacoesScreen() {
  const router = useRouter();
  const { colors, fontSizes } = useTheme();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'messages',
      title: 'Mensagens',
      description: 'Notificações de novas mensagens',
      icon: MessageSquare,
      enabled: true,
    },
    {
      id: 'alerts',
      title: 'Alertas',
      description: 'Notificações de alertas importantes',
      icon: Bell,
      enabled: true,
    },
    {
      id: 'reminders',
      title: 'Lembretes',
      description: 'Notificações de compromissos e prazos',
      icon: Clock,
      enabled: true,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(settings.map(setting =>
      setting.id === id
        ? { ...setting, enabled: !setting.enabled }
        : setting
    ));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSizes.lg }]}>
          Notificações
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          {settings.map((setting) => (
            <View key={setting.id} style={[styles.settingCard, { backgroundColor: colors.card }]}>
              <View style={[styles.settingIcon, { backgroundColor: colors.background }]}>
                <setting.icon size={24} color={colors.primary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text, fontSize: fontSizes.md }]}>
                  {setting.title}
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                  {setting.description}
                </Text>
              </View>
              <Switch
                value={setting.enabled}
                onValueChange={() => toggleSetting(setting.id)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.card}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    width: '100%',
  },
  settingCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
  },
  settingTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    opacity: 0.8,
  },
});