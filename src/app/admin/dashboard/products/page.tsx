import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function ProductsPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold">Gestión de Productos</h1>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Añadir Producto
                </Button>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Catálogo de Productos</CardTitle>
                    <CardDescription>Aquí puedes ver, editar y añadir productos a tu catálogo.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-20">
                        <p>Próximamente: una tabla para gestionar tu catálogo de productos.</p>
                        <p className="text-sm">Se implementará la funcionalidad CRUD para productos.</p>
                    </div>
                </CardContent>
             </Card>
        </div>
    );
}
