'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AppSettings, Quote } from "@/lib/types";
import { Download, Printer, RotateCcw, Share2, ThumbsDown, ThumbsUp, XCircle, Loader2 } from "lucide-react";
import { getSettings } from '@/app/actions';

export default function FinalQuoteStep({ quote, onReset }: { quote: Quote, onReset: () => void }) {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .finally(() => setIsLoading(false));
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
  
  const ivaRatePercentage = settings ? settings.ivaRate : quote.iva / quote.subtotal * 100;
  const ivaDisplay = isNaN(ivaRatePercentage) ? '15' : ivaRatePercentage.toFixed(0);

  const generateWhatsAppMessage = () => {
    const whatsappNumber = settings?.whatsappNumber || "593123456789"; // Fallback
    const header = "¡Hola! 👋 Aquí está un resumen de tu cotización de Importadora Clixcopylaser:\n\n";
    const items = quote.items.map(item => `- ${item.quantity}x ${item.material}`).join('\n');
    const footer = `\n\n*Subtotal:* ${formatCurrency(quote.subtotal)}\n*IVA (${ivaDisplay}%):* ${formatCurrency(quote.iva)}\n*Total:* *${formatCurrency(quote.total)}*\n\nPara ver el detalle completo o confirmar tu pedido, contáctanos.`;
    
    const message = encodeURIComponent(header + items + footer);
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  }

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500">
      <header className="mb-6 text-center">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">Tu Cotización está Lista</h2>
        <p className="text-muted-foreground mt-1">Aquí tienes el desglose. Puedes compartirlo, descargarlo o empezar de nuevo.</p>
      </header>

      <Card className="max-w-3xl mx-auto shadow-md">
        <CardHeader>
          <CardTitle>Resumen de Cotización</CardTitle>
          <CardDescription>ID: #CLX-{(new Date()).getTime().toString().slice(-6)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead className="text-center">Cant.</TableHead>
                  <TableHead className="text-right">Costo Unitario</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quote.items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.material}</TableCell>
                    <TableCell className="text-muted-foreground">{item.marca}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.costoUnitario)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.totalPrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                  <TableRow>
                      <TableCell colSpan={4} className="text-right font-medium">Subtotal</TableCell>
                      <TableCell className="text-right font-mono font-semibold">{formatCurrency(quote.subtotal)}</TableCell>
                  </TableRow>
                  <TableRow>
                      <TableCell colSpan={4} className="text-right font-medium">IVA ({ivaDisplay}%)</TableCell>
                      <TableCell className="text-right font-mono font-semibold">{formatcurrency(quote.iva)}</TableCell>
                  </TableRow>
                  <TableRow className="text-lg font-bold">
                      <TableCell colSpan={4} className="text-right">Total</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(quote.total)}</TableCell>
                  </TableRow>
              </TableFooter>
            </Table>
          </div>

          {quote.unavailableItems.length > 0 && (
            <div className="mt-6">
                <h4 className="font-semibold mb-2">Items no disponibles:</h4>
                <div className="rounded-md border p-4 text-sm">
                  <ul className="space-y-2">
                    {quote.unavailableItems.map(item => (
                      <li key={item.id} className="flex items-center gap-2 text-muted-foreground">
                        <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                        <span>{item.quantity} x {item.raw}</span>
                      </li>
                    ))}
                  </ul>
                  {quote.suggestions.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-foreground text-xs">Te hemos dado algunas sugerencias para estos productos. Puedes editar la lista y volver a cotizar.</p>
                    </div>
                  )}
                </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-4">
            <div className="flex w-full justify-center md:justify-end gap-2 flex-wrap">
                <Button variant="outline" onClick={onReset}><RotateCcw className="mr-2 h-4 w-4" />Nueva Cotización</Button>
                <Button variant="outline" disabled><Download className="mr-2 h-4 w-4" />PDF</Button>
                <Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Imprimir</Button>
                {isLoading ? (
                  <Button disabled className="bg-[#25D366] hover:bg-[#128C7E] text-white"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cargando...</Button>
                ) : (
                  <Button asChild className="bg-[#25D366] hover:bg-[#128C7E] text-white">
                      <a href={generateWhatsAppMessage()} target="_blank" rel="noopener noreferrer">
                          <Share2 className="mr-2 h-4 w-4" />Compartir
                      </a>
                  </Button>
                )}
            </div>
            <Separator className="my-2" />
            <div className="text-xs text-muted-foreground w-full flex justify-between items-center">
                <span>¿Fue útil esta cotización?</span>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><ThumbsUp className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><ThumbsDown className="h-4 w-4" /></Button>
                </div>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
