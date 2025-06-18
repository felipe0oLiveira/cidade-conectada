import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, MapPin, Phone, Clock, Calendar, User, Star } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LazyImage } from '@/components/LazyImage';
import { OptimizedScrollView } from '@/components/OptimizedScrollView';

interface HealthUnit {
  id: string;
  name: string;
  address: string;
  phone: string;
  neighborhood: {
    name: string;
  };
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  crm: string;
}

const unitImage = 'https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg';

export default function UnidadeDetailsScreen() {
  const router = useRouter();
  const { colors, fontSizes } = useTheme();
  const { id } = useLocalSearchParams();
  const [unit, setUnit] = useState<HealthUnit | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUnitDetails();
  }, [id]);

  async function loadUnitDetails() {
    try {
      // Load UBS details
      const { data: unitData, error: unitError } = await supabase
        .from('health_units')
        .select(`
          id,
          name,
          address,
          phone,
          neighborhood:neighborhoods(name)
        `)
        .eq('id', id)
        .single();

      if (unitError) throw unitError;
      setUnit(unitData);

      // Load doctors for this UBS
      const { data: doctorsData, error: doctorsError } = await supabase
        .from('doctor_schedules')
        .select(`
          doctor:doctors(
            id,
            name,
            specialty,
            crm
          )
        `)
        .eq('health_unit_id', id);

      if (doctorsError) throw doctorsError;
      
      // Remove duplicates and extract doctor info
      const uniqueDoctors = doctorsData
        .map(d => d.doctor)
        .filter((doctor, index, self) => 
          index === self.findIndex(d => d.id === doctor.id)
        );
      
      setDoctors(uniqueDoctors);
    } catch (error: any) {
      console.error('Error loading unit details:', error.message);
      setError('Não foi possível carregar os detalhes da unidade');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Carregando...
          </Text>
        </View>
      </View>
    );
  }

  if (error || !unit) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error || 'Unidade não encontrada'}
          </Text>
          <TouchableOpacity
            style={[styles.backToListButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backToListButtonText}>Voltar para a lista</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <OptimizedScrollView style={styles.scrollView}>
        <LazyImage
          source={{ uri: unitImage }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        
        <View style={styles.headerOverlay}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={[styles.mainCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.unitName, { color: colors.text, fontSize: fontSizes.xl }]}>
              {unit.name}
            </Text>

            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <MapPin size={16} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                  {unit.address}, {unit.neighborhood.name}
                </Text>
              </View>

              {unit.phone && (
                <View style={styles.infoItem}>
                  <Phone size={16} color={colors.primary} />
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                    {unit.phone}
                  </Text>
                </View>
              )}

              <View style={styles.infoItem}>
                <Clock size={16} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                  Segunda a Sexta, 07h às 17h
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.scheduleButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push({
                pathname: '/saude/agendar',
                params: { unitId: unit.id }
              })}
            >
              <Calendar size={20} color="#FFFFFF" />
              <Text style={styles.scheduleButtonText}>Agendar Consulta</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Médicos Disponíveis
            </Text>
            <OptimizedScrollView
              horizontal
              style={styles.doctorsScroll}
            >
              {doctors.map((doctor) => (
                <View
                  key={doctor.id}
                  style={[styles.doctorCard, { backgroundColor: colors.card }]}
                >
                  <View style={[styles.doctorIconContainer, { backgroundColor: colors.primary + '20' }]}>
                    <User size={24} color={colors.primary} />
                  </View>
                  <Text style={[styles.doctorName, { color: colors.text }]}>
                    Dr. {doctor.name}
                  </Text>
                  <Text style={[styles.doctorSpecialty, { color: colors.textSecondary }]}>
                    {doctor.specialty}
                  </Text>
                  <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={12}
                        color={colors.primary}
                        fill={colors.primary}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </OptimizedScrollView>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Serviços Disponíveis
            </Text>
            <View style={[styles.servicesCard, { backgroundColor: colors.card }]}>
              {[
                'Clínica Médica',
                'Pediatria',
                'Ginecologia',
                'Vacinação',
                'Curativos',
                'Farmácia Básica'
              ].map((service, index) => (
                <View 
                  key={index}
                  style={[
                    styles.serviceItem,
                    { borderBottomColor: colors.border },
                    index === 5 && { borderBottomWidth: 0 }
                  ]}
                >
                  <Text style={[styles.serviceText, { color: colors.text }]}>
                    {service}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </OptimizedScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: -40,
  },
  mainCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unitName: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoContainer: {
    gap: 12,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  doctorsScroll: {
    flexGrow: 0,
  },
  doctorCard: {
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 160,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  doctorIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  servicesCard: {
    borderRadius: 12,
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
  serviceItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  serviceText: {
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  backToListButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backToListButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});