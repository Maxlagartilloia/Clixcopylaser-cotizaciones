import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
      <div className="p-1 bg-primary rounded-lg flex items-center justify-center">
        <Image 
            src="https://i.postimg.cc/SNVkrFmX/361864255-293122636575506-2052512049624583768-n-removebg-preview.webp"
            alt="Logo"
            width={32}
            height={32}
            className="w-8 h-8"
        />
      </div>
      <span className="font-headline text-xl font-bold tracking-tight">
        Importadora Clixcopylaser
      </span>
    </Link>
  );
}
