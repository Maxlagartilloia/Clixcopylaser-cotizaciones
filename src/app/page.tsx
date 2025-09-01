import QuotationTool from './quotation-tool';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Generador de Cotizaciones Escolares
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Sube tu lista de útiles escolares en cualquier formato y recibe una cotización detallada al instante. ¡Rápido, fácil y preciso!
        </p>
      </header>
      <QuotationTool />
    </div>
  );
}
