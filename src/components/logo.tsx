import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
      <div className="p-2 bg-primary rounded-lg">
        <ShoppingCart className="text-primary-foreground h-5 w-5" />
      </div>
      <span className="font-headline text-xl font-bold tracking-tight">
        Clixcopylaser
      </span>
    </Link>
  );
}
