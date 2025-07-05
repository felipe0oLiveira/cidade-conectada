import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Volume2, VolumeX, ZoomIn, ZoomOut, HelpCircle } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface AccessibilityHelperProps {
  onFontSizeChange: (size: 'small' | 'medium' | 'large') => void;
  onVoiceModeToggle: () => void;
  voiceMode: boolean;
  currentFontSize: 'small' | 'medium' | 'large';
}

export const AccessibilityHelper: React.FC<AccessibilityHelperProps> = ({
  onFontSizeChange,
  onVoiceModeToggle,
  voiceMode,
  currentFontSize
}) => {
  const { colors, fontSizes } = useTheme();
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);

  const fontSizeOptions = [
    { id: 'small', label: 'Pequeno', size: fontSizes.sm },
    { id: 'medium', label: 'Médio', size: fontSizes.md },
    { id: 'large', label: 'Grande', size: fontSizes.lg }
  ];

  return (
    <>
      <TouchableOpacity
        style={[styles.accessibilityButton, { backgroundColor: colors.card }]}
        onPress={() => setShowAccessibilityModal(true)}
      >
        <HelpCircle size={24} color={colors.primary} />
      </TouchableOpacity>

      <Modal
        visible={showAccessibilityModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAccessibilityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.accessibilityModal, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text, fontSize: fontSizes.lg }]}>
              Configurações de Acessibilidade
            </Text>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSizes.md }]}>
                Tamanho do Texto
              </Text>
              <View style={styles.fontSizeOptions}>
                {fontSizeOptions.map(option => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.fontSizeOption,
                      currentFontSize === option.id && styles.fontSizeOptionActive,
                      { borderColor: colors.border }
                    ]}
                    onPress={() => onFontSizeChange(option.id as 'small' | 'medium' | 'large')}
                  >
                    <Text style={[
                      styles.fontSizeOptionText,
                      { color: colors.text, fontSize: option.size },
                      currentFontSize === option.id && { color: colors.primary }
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSizes.md }]}>
                Modo de Voz
              </Text>
              <TouchableOpacity
                style={[styles.voiceToggle, { backgroundColor: voiceMode ? colors.primary : colors.background }]}
                onPress={onVoiceModeToggle}
              >
                {voiceMode ? <Volume2 size={24} color="white" /> : <VolumeX size={24} color={colors.textSecondary} />}
                <Text style={[styles.voiceToggleText, { color: voiceMode ? 'white' : colors.text }]}>
                  {voiceMode ? 'Ativado' : 'Desativado'}
                </Text>
              </TouchableOpacity>
              <Text style={[styles.voiceDescription, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                {voiceMode 
                  ? 'O modo de voz está ativo. Toque nos elementos para ouvir descrições.'
                  : 'Ative o modo de voz para ouvir descrições dos elementos da tela.'
                }
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSizes.md }]}>
                Dicas de Uso
              </Text>
              <View style={styles.tipsContainer}>
                <Text style={[styles.tipText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                  • Toque nos botões com calma e firmeza{'\n'}
                  • Use o botão de ajuda (?) quando tiver dúvidas{'\n'}
                  • Aumente o tamanho do texto se necessário{'\n'}
                  • Peça ajuda a familiares se precisar{'\n'}
                  • Sua opinião é muito importante para a cidade!
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowAccessibilityModal(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  accessibilityButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  accessibilityModal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  fontSizeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  fontSizeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  fontSizeOptionActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderColor: '#007AFF',
  },
  fontSizeOptionText: {
    fontWeight: '500',
  },
  voiceToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  voiceToggleText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  voiceDescription: {
    lineHeight: 20,
  },
  tipsContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 16,
    borderRadius: 12,
  },
  tipText: {
    lineHeight: 20,
  },
  closeButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 