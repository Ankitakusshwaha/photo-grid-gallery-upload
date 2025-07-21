import React from 'react';
import { Camera, Trash2 } from 'lucide-react';
import PhotoUpload from '@/components/PhotoUpload';
import PhotoGallery from '@/components/PhotoGallery';
import { usePhotoStorage } from '@/hooks/usePhotoStorage';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { photos, addPhotos, deletePhoto, clearAllPhotos } = usePhotoStorage();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Camera className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Photo Gallery</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Upload and manage your photos
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <PhotoUpload onPhotosUploaded={addPhotos} />
        </div>

        {/* Gallery Header */}
        {photos.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              Your Photos ({photos.length})
            </h2>
            <Button 
              variant="outline" 
              onClick={clearAllPhotos}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        )}

        {/* Photo Gallery */}
        <PhotoGallery 
          photos={photos} 
          onDeletePhoto={deletePhoto} 
        />
      </div>
    </div>
  );
};

export default Index;
