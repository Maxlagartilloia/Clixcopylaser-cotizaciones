import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";

export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-3xl font-headline font-bold mb-8">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cotizaciones</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground">+180.1% desde el mes pasado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ventas Confirmadas</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12,234</div>
                        <p className="text-xs text-muted-foreground">+19% desde el mes pasado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">57.3%</div>
                        <p className="text-xs text-muted-foreground">+2.1% desde la semana pasada</p>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Cotizaciones Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center text-muted-foreground py-12">
                            <p>Aquí se mostrará una tabla con las cotizaciones recientes.</p>
                        </div>
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
}
