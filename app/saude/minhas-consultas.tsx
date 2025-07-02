import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Calendar, MapPin, User, Clock, X } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  doctor: {
    name: string;
    specialty: string;
  };
  health_unit: {
    name: string;
    address: string;
  };
}

export default function MinhasConsultasScreen() {
  const router = useRouter();
  const { colors, fontSizes } = useTheme();
  const { session } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      loadAppointments();
    }
  }, [session]);

  async function loadAppointments() {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          appointment_time,
          status,
          doctor:doctors(name, specialty),
          health_unit:health_units(name, address)
        `)
        .eq('patient_id', session?.user?.id)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) throw error;

      setAppointments(data || []);
    } catch (error: any) {
      console.error('Error loading appointments:', error.message);
      setError('Não foi possível carregar suas consultas');
    } finally {
      setLoading(false);
    }
  }

  const cancelAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;

      // Reload appointments
      loadAppointments();
    } catch (error: any) {
      console.error('Error cancelling appointment:', error.message);
      setError('Não foi possível cancelar a consulta');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSizes.lg }]}>
          Minhas Consultas
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {error ? (
          <View style={[styles.errorContainer, { backgroundColor: `${colors.error}20` }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        ) : loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Carregando consultas...
            </Text>
          </View>
        ) : appointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Calendar size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Você não tem consultas agendadas
            </Text>
            <TouchableOpacity
              style={[styles.scheduleButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/saude/unidades')}
            >
              <Text style={styles.scheduleButtonText}>Agendar Consulta</Text>
            </TouchableOpacity>
          </View>
        ) : (
          appointments.map((appointment) => (
            <View
              key={appointment.id}
              style={[
                styles.appointmentCard,
                { backgroundColor: colors.card },
                appointment.status === 'cancelled' && styles.cancelledCard
              ]}
            >
              <View style={styles.appointmentHeader}>
                <Calendar size={20} color={colors.primary} />
                <Text style={[styles.appointmentDate, { color: colors.text }]}>
                  {formatDate(appointment.appointment_date)}
                </Text>
                {appointment.status === 'scheduled' && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => cancelAppointment(appointment.id)}
                  >
                    <X size={20} color={colors.error} />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.appointmentInfo}>
                <View style={styles.infoItem}>
                  <Clock size={16} color={colors.primary} />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    {appointment.appointment_time}
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <User size={16} color={colors.primary} />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    Dr. {appointment.doctor.name} - {appointment.doctor.specialty}
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <MapPin size={16} color={colors.primary} />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    {appointment.health_unit.name}
                  </Text>
                </View>
              </View>

              {appointment.status === 'cancelled' && (
                <View style={[styles.statusBadge, { backgroundColor: colors.error + '20' }]}>
                  <Text style={[styles.statusText, { color: colors.error }]}>Cancelada</Text>
                </View>
              )}
            </View>
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
    marginBottom: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  scheduleButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  appointmentCard: {
    borderRadius: 12,
    padding: 16,
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
  cancelledCard: {
    opacity: 0.7,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
    textTransform: 'capitalize',
  },
  cancelButton: {
    padding: 4,
  },
  appointmentInfo: {
    gap: 8,
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
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
});