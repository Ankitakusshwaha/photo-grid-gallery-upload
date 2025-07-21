import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Photo {
  id: string;
  name: string;
  url: string;
  size: number;
}

interface PhotoGalleryProps {
  photos: Photo[];
  onDeletePhoto: (id: string) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, onDeletePhoto }) => {
  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No photos uploaded yet. Start by uploading some images!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div 
          key={photo.id} 
          className="relative group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow animate-fade-in"
        >
          <div className="aspect-square">
            <img
              src={photo.url}
              alt={photo.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-start justify-end p-2">
            <Button
              variant="destructive"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8"
              onClick={() => onDeletePhoto(photo.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
            <p className="text-white text-sm truncate">{photo.name}</p>
            <p className="text-white/70 text-xs">
              {(photo.size / 1024 / 1024).toFixed(1)} MB
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGallery;