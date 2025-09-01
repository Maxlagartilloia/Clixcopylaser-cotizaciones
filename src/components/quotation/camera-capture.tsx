'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Camera, CameraOff, Check, X } from 'lucide-react';

interface CameraCaptureProps {
  onPhotoTaken: (dataUri: string) => void;
}

export default function CameraCapture({ onPhotoTaken }: CameraCaptureProps) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('La API de Media Devices no es soportada en este navegador.');
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Acceso a Cámara Denegado',
          description: 'Por favor, habilita los permisos de la cámara en la configuración de tu navegador.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
      // Cleanup: stop video stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [toast]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUri = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUri);
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onPhotoTaken(capturedImage);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };
  
  if (hasCameraPermission === false) {
    return (
        <div className="p-6 flex flex-col items-center justify-center text-center">
            <CameraOff className="h-12 w-12 text-destructive mb-4" />
            <Alert variant="destructive">
              <AlertTitle>Acceso a la Cámara Requerido</AlertTitle>
              <AlertDescription>
                No se pudo acceder a la cámara. Por favor, asegúrate de haber concedido los permisos necesarios en tu navegador e inténtalo de nuevo.
              </AlertDescription>
            </Alert>
        </div>
    );
  }

  if (hasCameraPermission === null) {
      return (
        <div className="p-6 flex items-center justify-center h-96">
            <p>Solicitando acceso a la cámara...</p>
        </div>
      );
  }

  return (
    <div className="relative p-4">
      <div className="relative w-full aspect-video rounded-md overflow-hidden bg-black flex items-center justify-center">
        {capturedImage ? (
          <img src={capturedImage} alt="Captura" className="w-full h-full object-contain" />
        ) : (
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex justify-center gap-4 mt-4">
        {capturedImage ? (
          <>
            <Button onClick={handleRetake} variant="outline" size="lg">
              <X className="mr-2" /> Volver a Tomar
            </Button>
            <Button onClick={handleConfirm} size="lg">
              <Check className="mr-2" /> Confirmar
            </Button>
          </>
        ) : (
          <Button onClick={handleCapture} size="lg" className="rounded-full w-20 h-20">
            <Camera className="h-8 w-8" />
            <span className="sr-only">Capturar Foto</span>
          </Button>
        )}
      </div>
    </div>
  );
}
