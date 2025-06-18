import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Save, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface CadastroUnico {
  cpf: string;
  rg: string;
  nome_completo: string;
  data_nascimento: string;
  nome_mae: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone: string;
  renda_familiar: string;
  num_pessoas: string;
}

export default function CadastroUnicoScreen() {
  const router = useRouter();
  const { colors, fontSizes } = useTheme();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<CadastroUnico>({
    cpf: '',
    rg: '',
    nome_completo: '',
    data_nascimento: '',
    nome_mae: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
    renda_familiar: '',
    num_pessoas: ''
  });

  const handleChange = (field: keyof CadastroUnico, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.cpf || !formData.nome_completo || !formData.data_nascimento) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!session?.user) {
        setError('Você precisa estar logado para enviar o cadastro');
        return;
      }

      if (!validateForm()) return;

      setLoading(true);
      setError(null);

      const { error: submitError } = await supabase
        .from('cadastro_unico')
        .upsert({
          user_id: session.user.id,
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (submitError) throw submitError;

      setSuccess(true);
      setTimeout(() => {
        router.back();
      }, 2000);

    } catch (error: any) {
      console.error('Error submitting form:', error.message);
      setError('Não foi possível salvar o cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ 
    label, 
    field, 
    placeholder, 
    keyboardType = 'default',
    required = false 
  }: { 
    label: string;
    field: keyof CadastroUnico;
    placeholder: string;
    keyboardType?: 'default' | 'numeric' | 'email-address';
    required?: boolean;
  }) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label} {required && <Text style={{ color: colors.error }}>*</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          { 
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border
          }
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={formData[field]}
        onChangeText={(value) => handleChange(field, value)}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSizes.lg }]}>
          Cadastro Único
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {error && (
          <View style={[styles.errorContainer, { backgroundColor: `${colors.error}20` }]}>
            <AlertCircle size={20} color={colors.error} />
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        )}

        {success && (
          <View style={[styles.successContainer, { backgroundColor: `${colors.success}20` }]}>
            <Text style={[styles.successText, { color: colors.success }]}>
              Cadastro salvo com sucesso!
            </Text>
          </View>
        )}

        <View style={styles.formContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Dados Pessoais</Text>
          
          <InputField
            label="CPF"
            field="cpf"
            placeholder="Digite seu CPF"
            keyboardType="numeric"
            required
          />

          <InputField
            label="RG"
            field="rg"
            placeholder="Digite seu RG"
            keyboardType="numeric"
            required
          />

          <InputField
            label="Nome Completo"
            field="nome_completo"
            placeholder="Digite seu nome completo"
            required
          />

          <InputField
            label="Data de Nascimento"
            field="data_nascimento"
            placeholder="DD/MM/AAAA"
            required
          />

          <InputField
            label="Nome da Mãe"
            field="nome_mae"
            placeholder="Digite o nome da sua mãe"
            required
          />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Endereço</Text>

          <InputField
            label="Endereço"
            field="endereco"
            placeholder="Digite seu endereço"
          />

          <InputField
            label="Número"
            field="numero"
            placeholder="Digite o número"
            keyboardType="numeric"
          />

          <InputField
            label="Bairro"
            field="bairro"
            placeholder="Digite seu bairro"
          />

          <InputField
            label="Cidade"
            field="cidade"
            placeholder="Digite sua cidade"
          />

          <InputField
            label="Estado"
            field="estado"
            placeholder="Digite seu estado"
          />

          <InputField
            label="CEP"
            field="cep"
            placeholder="Digite seu CEP"
            keyboardType="numeric"
          />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contato</Text>

          <InputField
            label="Telefone"
            field="telefone"
            placeholder="Digite seu telefone"
            keyboardType="numeric"
          />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Informações Socioeconômicas</Text>

          <InputField
            label="Renda Familiar"
            field="renda_familiar"
            placeholder="Digite a renda familiar"
            keyboardType="numeric"
          />

          <InputField
            label="Número de Pessoas na Residência"
            field="num_pessoas"
            placeholder="Digite o número de pessoas"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: colors.primary },
            (loading || success) && { opacity: 0.7 }
          ]}
          onPress={handleSubmit}
          disabled={loading || success}
        >
          <Save size={20} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>
            {loading ? 'Salvando...' : 'Salvar Cadastro'}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
  },
  successContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  successText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  formContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    padding: Platform.OS === 'ios' ? 16 : 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 40,
    gap: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});