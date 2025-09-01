"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import Logo from '@/components/logo';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function AdminLoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/admin/dashboard');
        } catch (error: any) {
            console.error("Error de autenticación:", error);
            toast({
                variant: "destructive",
                title: "Error de autenticación",
                description: "Las credenciales son incorrectas. Por favor, inténtalo de nuevo.",
            });
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-background p-4">
            <Card className="w-full max-w-sm shadow-lg">
                <CardHeader className="text-center space-y-4">
                    <div className="inline-block mx-auto">
                      <Logo />
                    </div>
                    <CardTitle className="font-headline text-2xl">Área de Administración</CardTitle>
                    <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="admin@clix.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Ingresar
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
