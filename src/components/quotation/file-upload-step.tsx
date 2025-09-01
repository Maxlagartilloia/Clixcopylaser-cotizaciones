'use client';

import { useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2, Camera, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { parseList } from '@/app/actions';
import type { ParsedItem } from '@/lib/types';
import CameraCapture from './camera-capture';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface FileUploadStepProps {
  onFileProcessed: (items: ParsedItem[]) => void;
}

export default function FileUploadStep({ onFileProcessed }: FileUploadStepProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    try {
      // Pass the entire file object to the action
      const parsedItems = await parseList(file);
      onFileProcessed(parsedItems);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al procesar el archivo',
        description: 'Hubo un problema al leer la lista de útiles. Por favor, intenta de nuevo.',
      });
      setIsUploading(false);
    }
  };

  const handlePhotoTaken = (dataUri: string) => {
    // Convert data URI to a File object to use the existing handleFile logic
    const byteString = atob(dataUri.split(',')[1]);
    const mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    const file = new File([blob], `captura-${Date.now()}.jpg`, { type: mimeString });
    
    setIsCameraOpen(false);
    handleFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()} className="w-full">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors ${dragActive ? 'border-primary' : 'border-border'}`}
          onClick={onUploadButtonClick}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadCloud className={`w-10 h-10 mb-3 transition-colors ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold text-primary">Haz clic para subir un archivo</span> o arrastra y suelta
            </p>
            <p className="text-xs text-muted-foreground">Sube un PDF, DOCX, PNG, o JPG</p>
          </div>
          <input ref={fileInputRef} id="dropzone-file" type="file" className="hidden" onChange={handleChange} disabled={isUploading} accept="image/*,.pdf,.doc,.docx"/>
          {isUploading && (
            <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center rounded-lg">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground font-medium">Procesando tu lista...</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-6">
          <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-muted-foreground/20"></div>
              <span className="flex-shrink mx-4 text-xs text-muted-foreground uppercase">O usa una de estas opciones</span>
              <div className="flex-grow border-t border-muted-foreground/20"></div>
          </div>
        <div className="flex items-center justify-center gap-4 mt-2">
            <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
              <DialogTrigger asChild>
                <Button disabled={isUploading}>
                  <Camera className="mr-2 h-4 w-4" />
                  Tomar Foto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl p-0">
                  <DialogHeader className="p-4 pb-0">
                      <DialogTitle>Capturar Lista Escolar</DialogTitle>
                  </DialogHeader>
                  {isCameraOpen && <CameraCapture onPhotoTaken={handlePhotoTaken} />}
              </DialogContent>
            </Dialog>
            <Button 
              onClick={onUploadButtonClick}
              disabled={isUploading}
              variant="secondary"
            >
              <Paperclip className="mr-2 h-4 w-4" />
              Subir Archivo
            </Button>
            <Button 
              onClick={() => handleFile(new File([], "lista_ejemplo.txt"))}
              disabled={isUploading}
              variant="outline"
            >
              <FileText className="mr-2 h-4 w-4" />
              Usar Ejemplo
            </Button>
        </div>
      </div>
    </div>
  );
}
