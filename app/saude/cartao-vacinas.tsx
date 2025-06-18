import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Check, Clock } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface Vaccine {
  id: string;
  name: string;
  date?: string;
  status: 'completed' | 'pending' | 'scheduled';
  nextDose?: string;
}

const vaccines: Vaccine[] = [
  {
    id: '1',
    name: 'COVID-19 (1ª dose)',
    date: '15/01/2024',
    status: 'completed',
  },
  {
    id: '2',
    name: 'COVID-19 (2ª dose)',
    date: '15/02/2024',
    status: 'completed',
  },
  {
    id: '3',
    name: 'COVID-19 (Reforço)',
    status: 'scheduled',
    nextDose: '15/05/2025',
  },
  {
    id: '4',
    name: 'Gripe',
    status: 'pending',
  },
];

export default function CartaoVacinasScreen() {
  const router = useRouter();
  const { colors, fontSizes } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSizes.lg }]}>
          Cartão de Vacinas
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {vaccines.map((vaccine) => (
          <View 
            key={vaccine.id} 
            style={[
              styles.card,
              { backgroundColor: colors.card }
            ]}
          >
            <View style={[
              styles.statusIndicator,
              {
                backgroundColor: 
                  vaccine.status === 'completed' ? '#4CAF50' :
                  vaccine.status === 'scheduled' ? '#2196F3' : '#FFC107'
              }
            ]} />
            
            <View style={styles.cardContent}>
              <Text style={[styles.vaccineName, { color: colors.text, fontSize: fontSizes.md }]}>
                {vaccine.name}
              </Text>
              
              <View style={styles.statusContainer}>
                {vaccine.status === 'completed' && (
                  <View style={styles.statusInfo}>
                    <Check size={16} color="#4CAF50" />
                    <Text style={[styles.statusText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                      Aplicada em {vaccine.date}
                    </Text>
                  </View>
                )}
                
                {vaccine.status === 'scheduled' && (
                  <View style={styles.statusInfo}>
                    <Clock size={16} color="#2196F3" />
                    <Text style={[styles.statusText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                      Agendada para {vaccine.nextDose}
                    </Text>
                  </View>
                )}
                
                {vaccine.status === 'pending' && (
                  <View style={styles.statusInfo}>
                    <Clock size={16} color="#FFC107" />
                    <Text style={[styles.statusText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                      Pendente
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusIndicator: {
    width: 4,
    backgroundColor: '#4CAF50',
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  vaccineName: {
    fontWeight: '600',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    flex: 1,
  },
});