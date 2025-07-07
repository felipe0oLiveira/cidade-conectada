import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextStyle } from 'react-native';
import { ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckCircle, Bell, Calendar, Star } from 'lucide-react-native';

const slides = [
  {
    title: 'Bem-vindo ao Cidade Conectada!',
    description: 'O app que aproxima você da sua cidade.',
    image: require('@/assets/images/icon.png'),
  },
  {
    title: 'Funcionalidades',
    description: '', // será renderizado customizado
    image: null,
    features: [
      { icon: <CheckCircle color="#4CAF50" size={22} />, text: 'Solicite serviços' },
      { icon: <Bell color="#FF9800" size={22} />, text: 'Receba avisos' },
      { icon: <Calendar color="#2196F3" size={22} />, text: 'Veja eventos e mapas' },
      { icon: <Star color="#FFD700" size={22} />, text: 'E muito mais!', style: { color: '#FFD700', fontWeight: 'bold' } as TextStyle },
    ],
  },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      const countStr = await AsyncStorage.getItem('onboardingCount');
      const count = countStr ? parseInt(countStr, 10) : 0;
      await AsyncStorage.setItem('onboardingCount', String(count + 1));
      if (count + 1 === 3) {
        setShowQuestion(true);
      }
    })();
  }, []);

  const next = async () => {
    if (index < slides.length - 1) setIndex(index + 1);
    else {
      if (showQuestion) return; // Espera resposta do usuário
      await AsyncStorage.setItem('onboardingJustFinished', 'true');
      router.replace('/login');
    }
  };

  const handleUserChoice = async (alwaysShow: boolean) => {
    await AsyncStorage.setItem('onboardingAlwaysShow', alwaysShow ? 'true' : 'false');
    await AsyncStorage.setItem('onboardingJustFinished', 'true');
    router.replace('/login');
  };

  return (
    <ImageBackground source={require('../assets/images/city_background.jpg')} style={styles.background} resizeMode="cover" blurRadius={1}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.title}>{slides[index].title}</Text>
          {slides[index].features ? (
            <View style={{ marginTop: 24 }}>
              {slides[index].features.map((item, idx) => (
                <View key={idx} style={styles.featureItem}>
                  {item.icon}
                  <Text style={[styles.featureText, item.style as TextStyle]}>{item.text}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.description}>{slides[index].description}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={next}>
          <Text style={styles.buttonText}>{index < slides.length - 1 ? 'Próximo' : 'Começar'}</Text>
        </TouchableOpacity>
        {showQuestion && index === slides.length - 1 && (
          <>
            <Text style={styles.welcomeQuestionTextPlain}>
              Deseja continuar vendo esta tela de boas-vindas nas próximas vezes?
            </Text>
            <View style={styles.welcomeButtonRowPlain}>
              <TouchableOpacity
                style={styles.welcomeButtonPlain}
                activeOpacity={0.7}
                onPress={() => handleUserChoice(true)}
              >
                <Text style={styles.welcomeButtonTextPlain}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.welcomeButtonPlain}
                activeOpacity={0.7}
                onPress={() => handleUserChoice(false)}
              >
                <Text style={styles.welcomeButtonTextPlain}>Não</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', padding: 24 },
  image: { width: 200, height: 200, marginBottom: 32, resizeMode: 'contain' },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  button: { backgroundColor: '#2B5B7B', padding: 16, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  featureText: { color: '#fff', fontSize: 18, marginLeft: 10, textShadowColor: 'rgba(0,0,0,0.7)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  welcomeQuestionContainer: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 20,
    padding: 24,
    marginTop: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  welcomeQuestionText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  welcomeButton: {
    minWidth: 100,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  welcomeButtonYes: {
    backgroundColor: '#43A047',
  },
  welcomeButtonNo: {
    backgroundColor: '#D32F2F',
  },
  welcomeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  welcomeQuestionTextPlain: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  welcomeButtonRowPlain: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  welcomeButtonPlain: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  welcomeButtonTextPlain: {
    color: '#fff', // Troque para a cor do background se desejar
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 