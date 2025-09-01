'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Save, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { getSettings, saveSettings } from '@/app/actions';
import type { AppSettings } from '@/lib/types';

export default function SettingsPage() {
    const [settings, setSettings] = useState<AppSettings>({ ivaRate: 15, whatsappNumber: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const loadedSettings = await getSettings();
                setSettings(loadedSettings);
            } catch (error) {
                toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar los ajustes.' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, [toast]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setSettings(prev => ({ ...prev, [id]: id === 'ivaRate' ? parseFloat(value) : value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveSettings(settings);
            toast({ title: 'Éxito', description: 'Los ajustes se han guardado correctamente.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron guardar los ajustes.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div>
                <h1 className="text-3xl font-headline font-bold mb-8">Ajustes Generales</h1>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-headline font-bold mb-8">Ajustes Generales</h1>
             <Card>
                <CardHeader>
                    <CardTitle>Configuración</CardTitle>
                    <CardDescription>Ajusta los parámetros de la aplicación.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 max-w-md">
                    <div className="space-y-2">
                        <Label htmlFor="ivaRate">Porcentaje de IVA (%)</Label>
                        <Input id="ivaRate" type="number" value={settings.ivaRate} onChange={handleInputChange} />
                        <p className="text-xs text-muted-foreground">Valor actual para el cálculo en cotizaciones.</p>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="whatsappNumber">Número de WhatsApp</Label>
                        <Input id="whatsappNumber" type="tel" value={settings.whatsappNumber} placeholder="+593..." onChange={handleInputChange} />
                        <p className="text-xs text-muted-foreground">Número para compartir cotizaciones (con código de país).</p>
                    </div>
                     <div className="space-y-2">
                        <Label>Sincronización de Catálogo</Label>
                        <Button variant="outline" disabled>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Sincronizar con API/Google Sheet
                        </Button>
                        <p className="text-xs text-muted-foreground">Próximamente: Actualiza tu catálogo desde una fuente de datos externa.</p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Guardar Cambios
                    </Button>
                </CardFooter>
             </Card>
        </div>
    );
}
