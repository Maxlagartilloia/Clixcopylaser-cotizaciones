'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Synonym } from '@/lib/types';
import { getSynonyms, addSynonym, deleteSynonym, updateSynonym } from '@/app/actions';

export default function SynonymsPage() {
    const [synonyms, setSynonyms] = useState<Synonym[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSynonym, setEditingSynonym] = useState<Synonym | null>(null);
    const { toast } = useToast();

    const fetchSynonyms = async () => {
        setIsLoading(true);
        try {
            const data = await getSynonyms();
            setSynonyms(data);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar la lista de sinónimos.' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSynonyms();
    }, []);

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        
        const formData = new FormData(event.currentTarget);
        const synonymData: Omit<Synonym, 'id'> = {
            term: formData.get('term') as string,
            normalizedTerm: formData.get('normalizedTerm') as string,
        };

        try {
            if (editingSynonym) {
                await updateSynonym(editingSynonym.id, synonymData);
                toast({ title: 'Éxito', description: 'Sinónimo actualizado correctamente.' });
            } else {
                await addSynonym(synonymData);
                toast({ title: 'Éxito', description: 'Sinónimo añadido correctamente.' });
            }
            fetchSynonyms();
            setIsDialogOpen(false);
            setEditingSynonym(null);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar el sinónimo.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditDialog = (synonym: Synonym) => {
        setEditingSynonym(synonym);
        setIsDialogOpen(true);
    };

    const openAddDialog = () => {
        setEditingSynonym(null);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este sinónimo?')) {
            try {
                await deleteSynonym(id);
                toast({ title: 'Sinónimo eliminado', description: 'El sinónimo ha sido eliminado exitosamente.' });
                fetchSynonyms();
            } catch (error) {
                 toast({ variant: 'destructive', title: 'Error', description: 'No se pudo eliminar el sinónimo.' });
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold">Diccionario de Sinónimos</h1>
                 <Button onClick={openAddDialog}><PlusCircle className="mr-2 h-4 w-4" />Añadir Sinónimo</Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
                setIsDialogOpen(isOpen);
                if (!isOpen) setEditingSynonym(null);
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingSynonym ? 'Editar Sinónimo' : 'Añadir Nuevo Sinónimo'}</DialogTitle>
                        <DialogDescription>
                            Asocia un término común (ej: "cuaderno chico") a un término canónico de tu catálogo (ej: "cuaderno pequeño rayado").
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="term">Término del Usuario</Label>
                            <Input id="term" name="term" defaultValue={editingSynonym?.term} placeholder="ej: cuaderno 100h lineas" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="normalizedTerm">Término Canónico (del Catálogo)</Label>
                            <Input id="normalizedTerm" name="normalizedTerm" defaultValue={editingSynonym?.normalizedTerm} placeholder="ej: cuaderno 100 hojas rayado" required />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancelar</Button></DialogClose>
                            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar Sinónimo'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Sinónimos</CardTitle>
                    <CardDescription>Administra los sinónimos para mejorar la normalización de items.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center text-muted-foreground py-20"><p>Cargando sinónimos...</p></div>
                    ) : synonyms.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Término de Usuario</TableHead>
                                    <TableHead>Término Normalizado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {synonyms.map((synonym) => (
                                    <TableRow key={synonym.id}>
                                        <TableCell className="font-medium">{synonym.term}</TableCell>
                                        <TableCell className="text-muted-foreground">{synonym.normalizedTerm}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(synonym)}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(synonym.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center text-muted-foreground py-20">
                            <p>No hay sinónimos definidos.</p>
                            <p className="text-sm">Añade tu primer sinónimo para empezar.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
