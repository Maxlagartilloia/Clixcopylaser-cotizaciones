'use client';

import { useState, useEffect, useTransition } from 'react';
import { processItems, getSuggestions, getSettings, saveQuote } from '@/app/actions';
import type { MatchedItem, ParsedItem, Quote, SuggestedReplacement, AppSettings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Bot, CheckCircle, Loader2, RotateCcw, Sparkles, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ReviewStepProps {
  initialItems: ParsedItem[];
  onReviewCompleted: (quote: Quote) => void;
  onReset: () => void;
}

export default function ReviewStep({ initialItems, onReviewCompleted, onReset }: ReviewStepProps) {
  const [isProcessing, startProcessing] = useTransition();
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  const [items, setItems] = useState<MatchedItem[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestedReplacement[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    startProcessing(async () => {
      try {
        const appSettings = await getSettings();
        setSettings(appSettings);

        const processed = await processItems(initialItems);
        setItems(processed);
        
        const unavailable = processed.filter(p => p.status === 'not_found' || p.status === 'low_stock');
        if (unavailable.length > 0) {
          const aiSuggestions = await getSuggestions(unavailable);
          setSuggestions(aiSuggestions);
        }
      } catch (error) {
        console.error("Error processing list:", error);
        toast({
          variant: "destructive",
          title: "Error al procesar",
          description: "Hubo un problema al analizar tu lista de útiles. Inténtalo de nuevo."
        });
        onReset(); // Go back to upload step
      }
    });
  }, [initialItems, onReset, toast]);
  
  const handleCreateQuote = async () => {
      if (!settings) return;
      setIsGeneratingQuote(true);
      
      try {
        const quoteItems = items.filter(item => item.status === 'found' && item.catalogItem).map(item => ({
          id: item.catalogItem!.id,
          material: item.catalogItem!.material,
          marca: item.catalogItem!.marca,
          costoUnitario: item.catalogItem!.costoUnitario,
          quantity: item.quantity,
          totalPrice: item.catalogItem!.costoUnitario * item.quantity,
        }));
        
        const subtotal = quoteItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const iva = subtotal * (settings.ivaRate / 100);
        const total = subtotal + iva;
        
        const unavailableItems = items.filter(item => item.status !== 'found');
        
        const finalQuote: Quote = {
          items: quoteItems,
          subtotal,
          iva,
          total,
          unavailableItems,
          suggestions,
        };

        await saveQuote(finalQuote);
        
        onReviewCompleted(finalQuote);

      } catch (error) {
        console.error("Error creating or saving quote:", error);
        toast({
          variant: "destructive",
          title: "Error al generar cotización",
          description: "No se pudo guardar la cotización. Por favor, inténtalo de nuevo."
        });
      } finally {
        setIsGeneratingQuote(false);
      }
  };
  
  const getStatusBadge = (status: MatchedItem['status']) => {
    switch (status) {
      case 'found':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="mr-1 h-3 w-3" />Encontrado</Badge>;
      case 'not_found':
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />No encontrado</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  }

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500">
      <header className="mb-6">
        <h2 className="font-headline text-2xl md:text-3xl font-bold">Revisa tu Lista</h2>
        <p className="text-muted-foreground mt-1">Verifica los productos, su disponibilidad y las sugerencias de la IA.</p>
      </header>

      {isProcessing ? (
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Analizando tu lista y cargando configuración...</p>
        </div>
      ) : (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Items de la Lista</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cant.</TableHead>
                      <TableHead>Descripción Original</TableHead>
                      <TableHead>Normalizado (IA)</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Costo Unit.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.quantity}</TableCell>
                        <TableCell>{item.raw}</TableCell>
                        <TableCell className="text-muted-foreground italic">
                          {item.normalizedDescription || '...'}
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="text-right font-mono">
                          {item.catalogItem ? `$${item.catalogItem.costoUnitario.toFixed(2)}` : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {suggestions.length > 0 && (
            <Card className="bg-accent/10 border-accent/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent">
                  <Sparkles className="h-6 w-6" />
                  Sugerencias de Reemplazo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <Alert key={index}>
                    <Bot className="h-4 w-4" />
                    <AlertTitle>Para: <span className="font-bold">{suggestion.originalItem}</span></AlertTitle>
                    <AlertDescription>
                      <p>Sugerimos: <span className="font-semibold text-foreground">{suggestion.replacementItem}</span></p>
                      <p className="text-xs text-muted-foreground mt-1">Razón: {suggestion.reason}</p>
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={onReset} disabled={isGeneratingQuote}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Empezar de nuevo
            </Button>
            <Button onClick={handleCreateQuote} disabled={isGeneratingQuote || items.filter(i => i.status === 'found').length === 0} size="lg">
              {isGeneratingQuote ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" /> }
              Generar Cotización
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
