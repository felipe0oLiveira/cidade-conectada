import React, { useState, useRef, useEffect } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface LazyImageProps {
  source: { uri: string };
  style?: any;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  placeholder?: boolean;
  fadeDuration?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export function LazyImage({ 
  source, 
  style, 
  resizeMode = 'cover', 
  placeholder = true,
  fadeDuration = 300 
}: LazyImageProps) {
  const { colors } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const placeholderFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isLoaded) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: fadeDuration,
          useNativeDriver: true,
        }),
        Animated.timing(placeholderFade, {
          toValue: 0,
          duration: fadeDuration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoaded, fadeAnim, placeholderFade, fadeDuration]);

  const handleLoad = () => {
    setIsLoaded(true);
    setIsError(false);
  };

  const handleError = () => {
    setIsError(true);
    setIsLoaded(false);
  };

  return (
    <View style={[styles.container, style]}>
      {/* Placeholder */}
      {placeholder && !isLoaded && (
        <Animated.View 
          style={[
            styles.placeholder, 
            { 
              backgroundColor: colors.border,
              opacity: placeholderFade 
            },
            StyleSheet.absoluteFill
          ]}
        >
          <View style={[styles.shimmer, { backgroundColor: colors.card }]} />
        </Animated.View>
      )}

      {/* Actual Image */}
      <Animated.Image
        source={source}
        style={[
          style,
          { 
            opacity: fadeAnim,
            position: isLoaded ? 'relative' : 'absolute'
          }
        ]}
        resizeMode={resizeMode}
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Error state */}
      {isError && (
        <View style={[styles.errorContainer, { backgroundColor: colors.border }]}>
          <View style={[styles.errorIcon, { backgroundColor: colors.textSecondary }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shimmer: {
    width: '60%',
    height: '60%',
    borderRadius: 8,
    opacity: 0.3,
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.5,
  },
});