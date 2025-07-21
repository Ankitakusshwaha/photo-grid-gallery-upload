import React, { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  onPhotosUploaded: (photos: File[]) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotosUploaded }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const photoFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') && 
      (file.type === 'image/jpeg' || file.type === 'image/png')
    );

    if (photoFiles.length === 0) {
      toast({
        title: "Invalid files",
        description: "Please select JPEG or PNG images only.",
        variant: "destructive"
      });
      return;
    }

    if (photoFiles.length !== files.length) {
      toast({
        title: "Some files skipped",
        description: "Only JPEG and PNG images were uploaded.",
      });
    }

    onPhotosUploaded(photoFiles);
    toast({
      title: "Photos uploaded",
      description: `${photoFiles.length} photo(s) added to gallery.`,
    });
  }, [onPhotosUploaded, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = '';
  }, [handleFiles]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragOver 
          ? 'border-primary bg-primary/5' 
          : 'border-muted-foreground/25 hover:border-primary/50'
      }`}
    >
      <input
        type="file"
        multiple
        accept="image/jpeg,image/png"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        id="photo-upload"
      />
      
      <div className="space-y-4">
        <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
        <div>
          <p className="text-lg font-medium">
            Drop photos here or click to upload
          </p>
          <p className="text-sm text-muted-foreground">
            Supports JPEG and PNG files
          </p>
        </div>
        <Button variant="outline" asChild>
          <label htmlFor="photo-upload" className="cursor-pointer">
            Choose Files
          </label>
        </Button>
      </div>
    </div>
  );
};

export default PhotoUpload;