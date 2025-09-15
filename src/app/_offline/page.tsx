import { WifiOff } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-center px-4">
      <WifiOff className="w-24 h-24 text-muted-foreground mb-6" />
      <h1 className="text-3xl font-bold text-primary mb-2">You are offline</h1>
      <p className="text-lg text-muted-foreground mb-8">
        It seems you've lost your connection. Please check your network and try again.
      </p>
      <Button asChild>
        <Link href="/">Go to Homepage</Link>
      </Button>
    </div>
  );
}
