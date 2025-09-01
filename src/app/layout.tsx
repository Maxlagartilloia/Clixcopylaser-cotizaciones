import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import Header from '@/components/header';

export const metadata: Metadata = {
  title: 'Clixcopylaser Cotizaciones',
  description: 'Generador de cotizaciones de útiles escolares.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen flex flex-col", "bg-background")}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
