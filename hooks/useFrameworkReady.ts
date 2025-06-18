// Importação do hook de efeito do React
import { useEffect } from 'react';

// Declaração global para o tipo Window
declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

// Hook personalizado para inicialização do framework
export function useFrameworkReady() {
  useEffect(() => {
    // Chama a função frameworkReady se estiver disponível
    window.frameworkReady?.();
  }, []); // Added empty dependency array to run only once on mount
}