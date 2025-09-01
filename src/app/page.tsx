import QuotationTool from './quotation-tool';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-12">
        <div className="flex justify-center mb-8">
            <Image 
                src="https://i.postimg.cc/SNVkrFmX/361864255-293122636575506-2052512049624583768-n-removebg-preview.webp"
                alt="Importadora Clixcopylaser Logo"
                width={200}
                height={200}
                className="w-48 h-48"
                priority
            />
        </div>
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Generador de Cotizaciones Escolares
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Sube tu lista de útiles escolares en cualquier formato y recibe una cotización detallada al instante. ¡Rápido, fácil y preciso!
        </p>
      </header>
      <Suspense fallback={<Skeleton className="w-full h-96" />}>
        <QuotationTool />
      </Suspense>
    </div>
  );
}
