import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Save, RefreshCw } from "lucide-react";

export default function SettingsPage() {
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
                        <Label htmlFor="iva">Porcentaje de IVA (%)</Label>
                        <Input id="iva" type="number" defaultValue="12" />
                        <p className="text-xs text-muted-foreground">Actualmente 12% en Ecuador.</p>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="whatsapp">Número de WhatsApp</Label>
                        <Input id="whatsapp" type="tel" defaultValue="593123456789" placeholder="+593..." />
                        <p className="text-xs text-muted-foreground">Número para compartir cotizaciones (con código de país).</p>
                    </div>
                     <div className="space-y-2">
                        <Label>Sincronización de Catálogo</Label>
                        <Button variant="outline">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Sincronizar con API/Google Sheet
                        </Button>
                        <p className="text-xs text-muted-foreground">Actualiza tu catálogo de productos desde la fuente de datos.</p>
                    </div>
                </CardContent>
                <div className="p-6 pt-0 flex justify-end">
                    <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Cambios
                    </Button>
                </div>
             </Card>
        </div>
    );
}
