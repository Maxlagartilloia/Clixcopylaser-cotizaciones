
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Upload } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function ProductsPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            if (selectedFile && selectedFile.type === 'text/csv') {
                setFile(selectedFile);
            } else {
                toast({
                    variant: "destructive",
                    title: "Archivo inválido",
                    description: "Por favor, selecciona un archivo con formato .csv",
                });
                setFile(null);
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast({
                title: "No hay archivo seleccionado",
                description: "Por favor, selecciona un archivo CSV para subir.",
            });
            return;
        }

        setIsUploading(true);
        // Aquí irá la lógica para procesar el CSV y subirlo a Firestore
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulación de carga
        setIsUploading(false);
        
        toast({
            title: "Carga Exitosa",
            description: `El archivo ${file.name} se ha subido. (La importación a la base de datos se implementará a continuación).`,
        });

        setFile(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold">Gestión de Productos</h1>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Añadir Producto Manual
                </Button>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Subir Catálogo con CSV</CardTitle>
                        <CardDescription>Importa tu catálogo de productos masivamente desde un archivo CSV.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="csv-upload">Archivo CSV</Label>
                            <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} />
                        </div>
                        {file && (
                            <p className="text-sm text-muted-foreground">
                                Archivo seleccionado: <span className="font-medium text-foreground">{file.name}</span>
                            </p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleUpload} disabled={!file || isUploading}>
                            <Upload className="mr-2 h-4 w-4" />
                            {isUploading ? 'Subiendo...' : 'Subir y Procesar'}
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Catálogo de Productos Actual</CardTitle>
                        <CardDescription>Aquí puedes ver y editar los productos existentes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center text-muted-foreground py-20">
                            <p>La tabla con tus productos se mostrará aquí una vez que los subas.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
