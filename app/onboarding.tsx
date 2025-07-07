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
  const router = useRouter();

  const next = async () => {
    if (index < slides.length - 1) setIndex(index + 1);
    else {
      router.replace('/login');
    }
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
}); 