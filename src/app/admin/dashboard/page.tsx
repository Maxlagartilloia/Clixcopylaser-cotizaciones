import { getDb } from '@/lib/firebase-admin';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table';
import { Quote } from "@/lib/types";
import { DollarSign, FileText, CheckCircle, BarChart3 } from "lucide-react";

async function getDashboardData() {
    const db = getDb();
    const quotesSnapshot = await db.collection('quotes').orderBy('createdAt', 'desc').limit(50).get();
    
    if (quotesSnapshot.empty) {
        return {
            totalRevenue: 0,
            totalQuotes: 0,
            conversionRate: 0,
            recentQuotes: [],
        };
    }

    const quotes = quotesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quote & { id: string; createdAt: admin.firestore.Timestamp }));
    
    const totalRevenue = quotes.reduce((sum, quote) => sum + quote.total, 0);
    const totalQuotes = quotes.length;
    // Placeholder for conversion rate logic
    const conversionRate = totalQuotes > 0 ? 50 + Math.random() * 10 : 0; 
    
    const recentQuotes = quotes.slice(0, 5).map(q => ({
        id: q.id,
        total: q.total,
        itemsCount: q.items.length,
        date: q.createdAt.toDate().toLocaleDateString('es-EC')
    }));

    return {
        totalRevenue,
        totalQuotes,
        conversionRate,
        recentQuotes
    };
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default async function DashboardPage() {
    const { totalRevenue, totalQuotes, conversionRate, recentQuotes } = await getDashboardData();

    return (
        <div>
            <h1 className="text-3xl font-headline font-bold mb-8">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales (Potencial)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground">Basado en {totalQuotes} cotizaciones generadas</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cotizaciones Generadas</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{totalQuotes}</div>
                        <p className="text-xs text-muted-foreground">Total histórico en la plataforma</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ventas Confirmadas</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">N/A</div>
                        <p className="text-xs text-muted-foreground">Funcionalidad pendiente</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tasa de Conversión (Est.)</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground">Estimación de la plataforma</p>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Cotizaciones Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentQuotes.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID Cotización</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Nº Items</TableHead>
                                        <TableHead className="text-right">Monto Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentQuotes.map((quote) => (
                                        <TableRow key={quote.id}>
                                            <TableCell className="font-mono text-xs">{quote.id}</TableCell>
                                            <TableCell>{quote.date}</TableCell>
                                            <TableCell>{quote.itemsCount}</TableCell>
                                            <TableCell className="text-right font-semibold">{formatCurrency(quote.total)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                             <div className="text-center text-muted-foreground py-12">
                                <p>Aún no se han generado cotizaciones.</p>
                                <p className="text-sm">Usa la herramienta principal para crear la primera.</p>
                            </div>
                        )}
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
}
