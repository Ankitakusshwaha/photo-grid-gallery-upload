import { useState, useEffect, useCallback } from 'react';

interface Photo {
  id: string;
  name: string;
  url: string;
  size: number;
  filename?: string;
}

const API_BASE = '';

export const usePhotoStorage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPhotos = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/photos`);
      if (response.ok) {
        const serverPhotos = await response.json();
        setPhotos(serverPhotos);
      }
    } catch (error) {
      console.error('Failed to load photos from server:', error);
    }
  }, []);

  // Load photos from server on mount
  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const addPhotos = useCallback(async (files: File[]) => {
    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('photos', file);
      });

      const response = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Add API_BASE to URLs for proper serving
          const newPhotos = result.files.map((file: any) => ({
            ...file,
            url: `${API_BASE}${file.url}`
          }));
          setPhotos(prev => [...prev, ...newPhotos]);
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Failed to upload photos:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePhoto = useCallback(async (id: string) => {
    try {
      const photoToDelete = photos.find(p => p.id === id);
      if (photoToDelete && photoToDelete.filename) {
        const response = await fetch(`${API_BASE}/api/photos/${photoToDelete.filename}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setPhotos(prev => prev.filter(p => p.id !== id));
        } else {
          throw new Error('Delete failed');
        }
      }
    } catch (error) {
      console.error('Failed to delete photo:', error);
    }
  }, [photos]);

  const clearAllPhotos = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/photos`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPhotos([]);
      } else {
        throw new Error('Clear all failed');
      }
    } catch (error) {
      console.error('Failed to clear photos:', error);
    }
  }, []);

  return {
    photos,
    addPhotos,
    deletePhoto,
    clearAllPhotos,
    loading
  };
};