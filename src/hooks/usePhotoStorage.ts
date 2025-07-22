import { useState, useEffect, useCallback } from 'react';

interface Photo {
  id: string;
  name: string;
  url: string;
  size: number;
}

const STORAGE_KEY = 'photo_gallery_photos';

export const usePhotoStorage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);

  // Load photos from localStorage on mount
  useEffect(() => {
    const savedPhotos = localStorage.getItem(STORAGE_KEY);
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }
  }, []);

  // Save photos to localStorage whenever photos change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  }, [photos]);

  const addPhotos = useCallback(async (files: File[]) => {
    setLoading(true);
    try {
      const newPhotos = await Promise.all(
        files.map(file => {
          return new Promise<Photo>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                name: file.name,
                url: e.target?.result as string,
                size: file.size,
              });
            };
            reader.readAsDataURL(file);
          });
        })
      );

      setPhotos(prev => [...prev, ...newPhotos]);
    } catch (error) {
      console.error('Failed to process photos:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePhoto = useCallback((id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  }, []);

  const clearAllPhotos = useCallback(() => {
    setPhotos([]);
  }, []);

  return {
    photos,
    addPhotos,
    deletePhoto,
    clearAllPhotos,
    loading
  };
};