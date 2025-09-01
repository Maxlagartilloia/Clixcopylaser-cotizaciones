"use client"

import type { PropsWithChildren } from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Home, Package, Settings, BookType, LogOut } from 'lucide-react';
import Logo from "@/components/logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: PropsWithChildren) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Cargando...</p>
            </div>
        );
    }

    if (!user) {
        router.push("/admin/login");
        return null;
    }
    
    const handleLogout = async () => {
        await auth.signOut();
        router.push("/admin/login");
    };

    return (
        <div className="min-h-screen w-full">
            <SidebarProvider>
                <Sidebar side="left" variant="sidebar" collapsible="icon">
                    <SidebarHeader>
                        <div className="group-data-[collapsible=icon]:hidden">
                            <Logo />
                        </div>
                        <div className="hidden group-data-[collapsible=icon]:block">
                            <SidebarTrigger />
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Dashboard" isActive={pathname === "/admin/dashboard"}>
                                    <Link href="/admin/dashboard"><Home /><span>Dashboard</span></Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Productos" isActive={pathname.startsWith("/admin/dashboard/products")}>
                                    <Link href="/admin/dashboard/products"><Package /><span>Productos</span></Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Sinónimos" isActive={pathname.startsWith("/admin/dashboard/synonyms")}>
                                    <Link href="/admin/dashboard/synonyms"><BookType /><span>Sinónimos</span></Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Ajustes" isActive={pathname.startsWith("/admin/dashboard/settings")}>
                                    <Link href="/admin/dashboard/settings"><Settings /><span>Ajustes</span></Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={handleLogout} asChild tooltip="Salir">
                                    <div><LogOut /><span>Salir</span></div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>
                <div className="md:pl-[3rem]">
                    <header className="p-4 border-b flex items-center justify-between md:hidden sticky top-0 bg-background/80 backdrop-blur-sm">
                        <Logo />
                        <SidebarTrigger />
                    </header>
                    <main className="p-4 md:p-8">
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        </div>
    );
}
