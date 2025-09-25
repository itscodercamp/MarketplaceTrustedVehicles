
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/profile');
    }
  }, [user, loading, router]);


  if (loading || (!loading && user)) {
     return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex flex-col -my-2">
            <span className="text-3xl font-bold tracking-tight text-primary leading-tight">
              Marketplace
            </span>
            <span className="text-sm text-muted-foreground leading-tight">
              by <span className="text-success font-semibold">Trusted</span> Vehicles
            </span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{' '}
            <Link href="/register" className="font-medium text-primary hover:text-primary/90">
              create an account
            </Link>
          </p>
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" autoComplete="tel" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required className="mt-1" />
            </div>
          </div>

          <div>
            <Button onClick={() => login('phone')} className="w-full">
              Sign In
            </Button>
          </div>
          
          <div className="text-sm text-center">
              <a href="#" className="font-medium text-primary hover:text-primary/90">
                Forgot your password?
              </a>
            </div>
        </div>
      </div>
    </div>
  );
}
