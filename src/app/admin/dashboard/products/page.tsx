'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Upload, Edit, Trash2, Loader2 } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { uploadCatalog, getCatalog, addProduct, deleteProduct, updateProduct } from '@/app/actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CatalogItem } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';

export default function ProductsPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [products, setProducts] = useState<CatalogItem[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<CatalogItem | null>(null);
    const { toast } = useToast();

    const fetchProducts = async () => {
        setIsLoadingProducts(true);
        try {
            const catalog = await getCatalog();
            setProducts(catalog);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "No se pudo cargar el catálogo de productos." });
        } finally {
            setIsLoadingProducts(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

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
            toast({ variant: "destructive", title: "No hay archivo seleccionado", description: "Por favor, selecciona un archivo CSV para subir." });
            return;
        }
        setIsUploading(true);
        try {
            const result = await uploadCatalog(file);
            if (result.success) {
                toast({ title: "Carga Exitosa", description: `${result.count} productos han sido importados.` });
                setFile(null);
                fetchProducts(); // Refresh product list
            } else {
                toast({ variant: "destructive", title: "Error al subir el catálogo", description: result.message });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error inesperado", description: "Ocurrió un error al comunicarse con el servidor." });
        } finally {
            setIsUploading(false);
        }
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        
        const formData = new FormData(event.currentTarget);
        const productData: Omit<CatalogItem, 'id'> = {
            material: formData.get('material') as string,
            marca: formData.get('marca') as string,
            unidad: formData.get('unidad') as string,
            costoUnitario: parseFloat(formData.get('costoUnitario') as string),
        };

        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, productData);
                toast({ title: "Éxito", description: "Producto actualizado correctamente." });
            } else {
                const id = formData.get('id') as string;
                if (!id) {
                    throw new Error("El ID es requerido para un nuevo producto.");
                }
                await addProduct(id, productData);
                toast({ title: "Éxito", description: "Producto añadido correctamente." });
            }
            fetchProducts();
            setIsDialogOpen(false);
            setEditingProduct(null);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "No se pudo guardar el producto.";
            toast({ variant: "destructive", title: "Error", description: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const openEditDialog = (product: CatalogItem) => {
        setEditingProduct(product);
        setIsDialogOpen(true);
    }
    
    const openAddDialog = () => {
        setEditingProduct(null);
        setIsDialogOpen(true);
    }

    const handleDelete = async (productId: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                await deleteProduct(productId);
                toast({ title: 'Producto eliminado', description: 'El producto ha sido eliminado exitosamente.' });
                fetchProducts();
            } catch (error) {
                toast({ variant: "destructive", title: "Error", description: "No se pudo eliminar el producto." });
            }
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold">Gestión de Productos</h1>
                <Button onClick={openAddDialog}><PlusCircle className="mr-2 h-4 w-4" />Añadir Producto</Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
                setIsDialogOpen(isOpen);
                if (!isOpen) setEditingProduct(null);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? 'Editar Producto' : 'Añadir Nuevo Producto'}</DialogTitle>
                         <DialogDescription>
                            {editingProduct ? 'Modifica los detalles del producto.' : 'Rellena los campos para añadir un nuevo item al catálogo.'}
                         </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="id">ID (Código único)</Label>
                            <Input id="id" name="id" defaultValue={editingProduct?.id} required disabled={!!editingProduct} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="material">Material</Label>
                            <Input id="material" name="material" defaultValue={editingProduct?.material} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="marca">Marca</Label>
                            <Input id="marca" name="marca" defaultValue={editingProduct?.marca} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="unidad">Unidad</Label>
                            <Input id="unidad" name="unidad" defaultValue={editingProduct?.unidad} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="costoUnitario">Costo Unitario</Label>
                            <Input id="costoUnitario" name="costoUnitario" type="number" step="0.01" defaultValue={editingProduct?.costoUnitario} required />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancelar</Button></DialogClose>
                            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar Producto'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Subir Catálogo con CSV</CardTitle>
                        <CardDescription>Importa tu catálogo de productos. Las columnas deben ser: ID, MATERIAL, UNIDAD, COSTO UNITARIO, MARCA.</CardDescription>
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
                            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                            {isUploading ? 'Subiendo...' : 'Subir y Procesar'}
                        </Button>
                    </CardFooter>
                </Card>
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Catálogo de Productos Actual</CardTitle>
                        <CardDescription>Aquí puedes ver y editar los productos existentes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingProducts ? (
                            <div className="text-center text-muted-foreground py-20"><p>Cargando productos...</p></div>
                        ) : products.length > 0 ? (
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Material</TableHead>
                                        <TableHead>Marca</TableHead>
                                        <TableHead>Costo</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-mono">{product.id}</TableCell>
                                            <TableCell>{product.material}</TableCell>
                                            <TableCell>{product.marca}</TableCell>
                                            <TableCell>${product.costoUnitario.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}><Edit className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center text-muted-foreground py-20">
                                <p>No hay productos en el catálogo. Sube un archivo CSV o añade uno manualmente para empezar.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
