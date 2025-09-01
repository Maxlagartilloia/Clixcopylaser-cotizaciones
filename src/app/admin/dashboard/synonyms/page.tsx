import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function SynonymsPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold">Diccionario de Sinónimos</h1>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Añadir Sinónimo
                </Button>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Lista de Sinónimos</CardTitle>
                    <CardDescription>Administra los sinónimos para mejorar la normalización de items por la IA.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-20">
                        <p>Próximamente: una tabla para gestionar sinónimos.</p>
                        <p className="text-sm">e.g., "hojas" {'->'} "h", "líneas" {'->'} "rayado".</p>
                    </div>
                </CardContent>
             </Card>
        </div>
    );
}
