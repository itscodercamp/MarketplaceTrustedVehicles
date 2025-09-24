'use client';
import { HardHat } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function StartSellingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-center px-4">
      <HardHat className="w-24 h-24 text-muted-foreground mb-6" />
      <h1 className="text-3xl font-bold text-primary mb-2">Coming Soon!</h1>
      <p className="text-lg text-muted-foreground mb-8">
        We're working hard to bring you an amazing selling experience. Please check back later!
      </p>
      <Button asChild>
        <Link href="/">Go back to Homepage</Link>
      </Button>
    </div>
  );
}
