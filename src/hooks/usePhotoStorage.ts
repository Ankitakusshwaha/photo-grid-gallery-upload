import { useState, useEffect, useCallback } from 'react';

interface Photo {
  id: string;
  name: string;
  url: string;
  size: number;
}

const STORAGE_KEY = 'photo-gallery-photos';

export const usePhotoStorage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  // Load photos from localStorage on mount
  useEffect(() => {
    const savedPhotos = localStorage.getItem(STORAGE_KEY);
    if (savedPhotos) {
      try {
        const parsed = JSON.parse(savedPhotos);
        setPhotos(parsed);
      } catch (error) {
        console.error('Failed to load photos from storage:', error);
      }
    }
  }, []);

  // Save photos to localStorage whenever photos change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  }, [photos]);

  const addPhotos = useCallback((files: File[]) => {
    const newPhotos = files.map(file => {
      // Generate unique filename to handle duplicates
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const fileName = `${timestamp}-${randomSuffix}-${file.name}`;
      
      return {
        id: `${timestamp}-${randomSuffix}`,
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size
      };
    });

    setPhotos(prev => [...prev, ...newPhotos]);
  }, []);

  const deletePhoto = useCallback((id: string) => {
    setPhotos(prev => {
      const photoToDelete = prev.find(p => p.id === id);
      if (photoToDelete) {
        // Revoke the object URL to free memory
        URL.revokeObjectURL(photoToDelete.url);
      }
      return prev.filter(p => p.id !== id);
    });
  }, []);

  const clearAllPhotos = useCallback(() => {
    // Revoke all object URLs to free memory
    photos.forEach(photo => {
      URL.revokeObjectURL(photo.url);
    });
    setPhotos([]);
    localStorage.removeItem(STORAGE_KEY);
  }, [photos]);

  return {
    photos,
    addPhotos,
    deletePhoto,
    clearAllPhotos
  };
};