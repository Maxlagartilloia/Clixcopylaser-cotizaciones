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
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({ children }: PropsWithChildren) {
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
                                <SidebarMenuButton asChild tooltip="Dashboard">
                                    <Link href="/admin/dashboard"><Home /><span>Dashboard</span></Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Productos">
                                    <Link href="/admin/dashboard/products"><Package /><span>Productos</span></Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Sinónimos">
                                    <Link href="/admin/dashboard/synonyms"><BookType /><span>Sinónimos</span></Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Ajustes">
                                    <Link href="/admin/dashboard/settings"><Settings /><span>Ajustes</span></Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Salir">
                                    <Link href="/"><LogOut /><span>Salir</span></Link>
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
