import { useState, useEffect } from 'react';

interface ImageCacheItem {
  uri: string;
  timestamp: number;
  loaded: boolean;
}

class ImageCache {
  private cache = new Map<string, ImageCacheItem>();
  private maxAge = 30 * 60 * 1000; // 30 minutes
  private maxSize = 100; // Maximum number of cached images

  preload(uri: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Check if already cached and not expired
      const cached = this.cache.get(uri);
      if (cached && (Date.now() - cached.timestamp) < this.maxAge) {
        resolve(cached.loaded);
        return;
      }

      // Preload the image
      const image = new Image();
      image.onload = () => {
        this.set(uri, true);
        resolve(true);
      };
      image.onerror = () => {
        this.set(uri, false);
        resolve(false);
      };
      image.src = uri;
    });
  }

  private set(uri: string, loaded: boolean) {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = Array.from(this.cache.keys())[0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(uri, {
      uri,
      timestamp: Date.now(),
      loaded,
    });
  }

  get(uri: string): boolean | null {
    const cached = this.cache.get(uri);
    if (!cached) return null;

    // Check if expired
    if ((Date.now() - cached.timestamp) > this.maxAge) {
      this.cache.delete(uri);
      return null;
    }

    return cached.loaded;
  }

  clear() {
    this.cache.clear();
  }
}

const imageCache = new ImageCache();

export function useImageCache(uris: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const preloadImages = async () => {
      const promises = uris.map(async (uri) => {
        const cached = imageCache.get(uri);
        if (cached !== null) {
          if (cached) {
            setLoadedImages(prev => new Set(prev).add(uri));
          }
          return;
        }

        const loaded = await imageCache.preload(uri);
        if (loaded) {
          setLoadedImages(prev => new Set(prev).add(uri));
        }
      });

      await Promise.all(promises);
    };

    preloadImages();
  }, [uris]);

  return {
    isImageLoaded: (uri: string) => loadedImages.has(uri),
    preloadImage: (uri: string) => imageCache.preload(uri),
    clearCache: () => {
      imageCache.clear();
      setLoadedImages(new Set());
    },
  };
}