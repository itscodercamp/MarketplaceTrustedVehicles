
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GoogleIcon } from '@/components/icons';
import { User, Building } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';

type Role = 'customer' | 'dealer';
type Step = 1 | 2;

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<Role>('customer');
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


  const renderStepOne = () => (
    <div className="text-center">
      <Link href="/" className="inline-flex flex-col -my-2">
        <span className="text-3xl font-bold tracking-tight text-primary leading-tight">
          Marketplace
        </span>
        <span className="text-sm text-muted-foreground leading-tight">
          by <span className="text-success font-semibold">Trusted</span> Vehicles
        </span>
      </Link>
      <h2 className="mt-6 text-3xl font-extrabold text-foreground">Create a new account</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:text-primary/90">
          Sign in
        </Link>
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          className={cn('step-card', role === 'customer' && 'step-card-active')}
          onClick={() => setRole('customer')}
        >
          <User className="mx-auto h-12 w-12 text-primary" />
          <h3 className="mt-4 text-lg font-medium text-foreground">Customer</h3>
          <p className="mt-1 text-sm text-muted-foreground">I want to buy vehicles.</p>
        </div>
        <div
          className={cn('step-card', role === 'dealer' && 'step-card-active')}
          onClick={() => setRole('dealer')}
        >
          <Building className="mx-auto h-12 w-12 text-primary" />
          <h3 className="mt-4 text-lg font-medium text-foreground">Dealer</h3>
          <p className="mt-1 text-sm text-muted-foreground">I want to sell vehicles.</p>
        </div>
      </div>
      <Button onClick={() => setStep(2)} className="mt-8 w-full sm:w-auto">
        Continue as a {role}
      </Button>
    </div>
  );

  const renderStepTwo = () => (
    <div>
      <div className="text-center">
        <Link href="/" className="inline-flex flex-col -my-2">
          <span className="text-2xl font-bold tracking-tight text-primary leading-tight">
            Marketplace
          </span>
          <span className="text-xs text-muted-foreground leading-tight">
            by <span className="text-success font-semibold">Trusted</span> Vehicles
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold text-foreground">
          Register as a {role}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your account to get started.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <Button variant="outline" className="w-full" onClick={() => login('google')}>
            <GoogleIcon className="mr-2 h-5 w-5" />
            Sign up with Google
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or with email
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" required className="mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" required className="mt-1" />
          </div>
          {role === 'dealer' && (
            <>
              <div>
                <Label htmlFor="dealershipName">Dealership Name</Label>
                <Input id="dealershipName" type="text" required className="mt-1" />
              </div>
              <div>
                <Label>Dealership Type</Label>
                <RadioGroup defaultValue="4-wheeler" className="mt-2 flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4-wheeler" id="4-wheeler" />
                    <Label htmlFor="4-wheeler">4-Wheeler</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2-wheeler" id="2-wheeler" />
                    <Label htmlFor="2-wheeler">2-Wheeler</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" type="text" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" type="text" required className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" type="text" required className="mt-1" />
              </div>
            </>
          )}
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required className="mt-1" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="link" onClick={() => setStep(1)} className="p-0">
            Back
          </Button>
          <Button>Create Account</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        {step === 1 ? renderStepOne() : renderStepTwo()}
      </div>
    </div>
  );
}
