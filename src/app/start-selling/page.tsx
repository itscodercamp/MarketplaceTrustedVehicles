
'use client';
import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, Hammer } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function StartSellingPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) {
      // Auth state is still loading
      return;
    }
    if (user === null) {
      router.push('/login?redirect=/start-selling');
    }
  }, [user, router]);

  if (user === undefined || user === null) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-background px-4 py-12">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-background px-4 py-12">
      <div className="text-center">
        <Hammer className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground">
          Coming Soon!
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Our dealer portal is under construction. We're working hard to bring you the best experience for selling your vehicles.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">Go Back Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
