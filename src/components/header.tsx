import Link from 'next/link';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full py-3 px-4 md:px-8 border-b border-border/40 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between">
        <Logo />
        <nav>
          <Button variant="ghost" asChild>
            <Link href="/admin/login">
              <User className="mr-2 h-4 w-4" />
              Admin
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
