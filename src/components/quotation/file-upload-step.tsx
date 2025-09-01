'use client';

import { useState } from 'react';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { parseList } from '@/app/actions';
import type { ParsedItem } from '@/lib/types';

interface FileUploadStepProps {
  onFileProcessed: (items: ParsedItem[]) => void;
}

export default function FileUploadStep({ onFileProcessed }: FileUploadStepProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const parsedItems = await parseList(file.name);
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

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()} className="w-full">
        <label
          htmlFor="dropzone-file"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors ${dragActive ? 'border-primary' : 'border-border'}`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className={`w-10 h-10 mb-3 transition-colors ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold text-primary">Haz clic para subir</span> o arrastra y suelta
            </p>
            <p className="text-xs text-muted-foreground">PDF, DOCX, XLSX, o una imagen de tu lista</p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" onChange={handleChange} disabled={isUploading} />
          {isUploading && (
            <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center rounded-lg">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground font-medium">Procesando tu lista...</p>
            </div>
          )}
        </label>
      </form>
      <div className="mt-6 text-center">
        <p className="text-muted-foreground mb-4 text-sm">¿No tienes una lista a mano?</p>
        <Button 
          onClick={() => handleFile(new File([], "lista_ejemplo.txt"))}
          disabled={isUploading}
          variant="outline"
        >
          <FileText className="mr-2 h-4 w-4" />
          Usa una lista de ejemplo
        </Button>
      </div>
    </div>
  );
}
