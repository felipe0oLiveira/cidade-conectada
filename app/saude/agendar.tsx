import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Calendar, Clock, User } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  crm: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function AgendarScreen() {
  const router = useRouter();
  const { colors, fontSizes } = useTheme();
  const { session } = useAuth();
  const { unitId } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Available time slots (in a real app, this would come from the backend)
  const timeSlots: TimeSlot[] = [
    { time: '08:00', available: true },
    { time: '09:00', available: true },
    { time: '10:00', available: true },
    { time: '11:00', available: true },
    { time: '14:00', available: true },
    { time: '15:00', available: true },
    { time: '16:00', available: true },
  ];

  useEffect(() => {
    loadDoctors();
  }, [unitId]);

  async function loadDoctors() {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('name');

      if (error) throw error;

      setDoctors(data || []);
    } catch (error: any) {
      console.error('Error loading doctors:', error.message);
      setError('Não foi possível carregar os médicos');
    } finally {
      setLoading(false);
    }
  }

  const handleSchedule = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !session?.user) {
      setError('Por favor, selecione todas as informações necessárias');
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('appointments')
        .insert({
          patient_id: session.user.id,
          doctor_id: selectedDoctor,
          health_unit_id: unitId,
          appointment_date: selectedDate.toISOString().split('T')[0],
          appointment_time: selectedTime,
        });

      if (error) throw error;

      router.push('/saude/minhas-consultas');
    } catch (error: any) {
      console.error('Error scheduling appointment:', error.message);
      setError('Não foi possível agendar a consulta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSizes.lg }]}>
          Agendar Consulta
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {error && (
          <View style={[styles.errorContainer, { backgroundColor: `${colors.error}20` }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Selecione o Médico</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.doctorsScroll}>
            {doctors.map((doctor) => (
              <TouchableOpacity
                key={doctor.id}
                style={[
                  styles.doctorCard,
                  { backgroundColor: colors.card },
                  selectedDoctor === doctor.id && { borderColor: colors.primary, borderWidth: 2 }
                ]}
                onPress={() => setSelectedDoctor(doctor.id)}
              >
                <User size={24} color={colors.primary} />
                <Text style={[styles.doctorName, { color: colors.text }]}>{doctor.name}</Text>
                <Text style={[styles.doctorSpecialty, { color: colors.textSecondary }]}>
                  {doctor.specialty}
                </Text>
                <Text style={[styles.doctorCRM, { color: colors.textSecondary }]}>
                  CRM: {doctor.crm}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Selecione a Data</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesScroll}>
            {Array.from({ length: 7 }).map((_, index) => {
              const date = new Date();
              date.setDate(date.getDate() + index);
              const isSelected = selectedDate?.toDateString() === date.toDateString();

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateCard,
                    { backgroundColor: colors.card },
                    isSelected && { borderColor: colors.primary, borderWidth: 2 }
                  ]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text style={[styles.dateDay, { color: colors.text }]}>
                    {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </Text>
                  <Text style={[styles.dateNumber, { color: colors.text }]}>
                    {date.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Selecione o Horário</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot.time}
                style={[
                  styles.timeCard,
                  { backgroundColor: colors.card },
                  selectedTime === slot.time && { borderColor: colors.primary, borderWidth: 2 },
                  !slot.available && { opacity: 0.5 }
                ]}
                onPress={() => slot.available && setSelectedTime(slot.time)}
                disabled={!slot.available}
              >
                <Clock size={16} color={colors.primary} />
                <Text style={[styles.timeText, { color: colors.text }]}>{slot.time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.scheduleButton,
            { backgroundColor: colors.primary },
            (!selectedDoctor || !selectedDate || !selectedTime) && { opacity: 0.5 }
          ]}
          onPress={handleSchedule}
          disabled={!selectedDoctor || !selectedDate || !selectedTime || loading}
        >
          <Calendar size={20} color="#FFFFFF" />
          <Text style={styles.scheduleButtonText}>
            {loading ? 'Agendando...' : 'Confirmar Agendamento'}
          </Text>
        </TouchableOpacity>
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
    width: 200,
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  doctorSpecialty: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  doctorCRM: {
    fontSize: 12,
    opacity: 0.7,
  },
  datesScroll: {
    flexGrow: 0,
  },
  dateCard: {
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  dateDay: {
    fontSize: 14,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: '600',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    width: '30%',
    justifyContent: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});