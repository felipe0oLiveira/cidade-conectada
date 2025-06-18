import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Phone, Clock, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface HealthUnit {
  id: string;
  name: string;
  address: string;
  phone: string;
  neighborhood: {
    name: string;
  };
}

export default function UnidadesScreen() {
  const router = useRouter();
  const { colors, fontSizes } = useTheme();
  const [units, setUnits] = useState<HealthUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHealthUnits();
  }, []);

  async function loadHealthUnits() {
    try {
      const { data, error } = await supabase
        .from('health_units')
        .select(`
          id,
          name,
          address,
          phone,
          neighborhood:neighborhoods(name)
        `)
        .order('name');

      if (error) throw error;

      setUnits(data || []);
    } catch (error: any) {
      console.error('Error loading health units:', error.message);
      setError('Não foi possível carregar as unidades de saúde');
    } finally {
      setLoading(false);
    }
  }

  const handleUnitPress = (unitId: string) => {
    router.push(`/saude/unidades/${unitId}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSizes.lg }]}>
          Unidades Básicas de Saúde
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {error ? (
          <View style={[styles.errorContainer, { backgroundColor: `${colors.error}20` }]}>
            <Text style={[styles.errorText, { color: colors.error, fontSize: fontSizes.sm }]}>
              {error}
            </Text>
          </View>
        ) : loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.textSecondary, fontSize: fontSizes.md }]}>
              Carregando unidades...
            </Text>
          </View>
        ) : (
          units.map((unit) => (
            <TouchableOpacity
              key={unit.id}
              style={[styles.card, { backgroundColor: colors.card }]}
              onPress={() => handleUnitPress(unit.id)}
            >
              <View style={styles.cardContent}>
                <Text style={[styles.unitName, { color: colors.text, fontSize: fontSizes.md }]}>
                  {unit.name}
                </Text>

                <View style={styles.infoContainer}>
                  <View style={styles.infoItem}>
                    <MapPin size={16} color={colors.primary} />
                    <Text style={[styles.infoText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                      {unit.address}, {unit.neighborhood.name}
                    </Text>
                  </View>

                  {unit.phone && (
                    <View style={styles.infoItem}>
                      <Phone size={16} color={colors.primary} />
                      <Text style={[styles.infoText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                        {unit.phone}
                      </Text>
                    </View>
                  )}

                  <View style={styles.infoItem}>
                    <Clock size={16} color={colors.primary} />
                    <Text style={[styles.infoText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                      Segunda a Sexta, 07h às 17h
                    </Text>
                  </View>
                </View>
              </View>
              
              <ChevronRight size={20} color={colors.primary} />
            </TouchableOpacity>
          ))
        )}
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
  errorContainer: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    opacity: 0.7,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
  cardContent: {
    flex: 1,
  },
  unitName: {
    fontWeight: '600',
    marginBottom: 12,
  },
  infoContainer: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    flex: 1,
  },
});