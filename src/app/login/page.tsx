'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FacebookIcon, GoogleIcon, Logo } from '@/components/icons';
import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    login();
    router.push('/profile');
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{' '}
            <Link href="/register" className="font-medium text-primary hover:text-primary/90">
              start your 14-day free trial
            </Link>
          </p>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">
              <GoogleIcon className="mr-2 h-5 w-5" />
              Google
            </Button>
            <Button variant="outline" className="w-full">
              <FacebookIcon className="mr-2 h-5 w-5" />
              Facebook
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" type="tel" autoComplete="tel" required className="mt-1" />
          </div>

          <div>
            <Button onClick={handleLogin} className="w-full">
              Send OTP
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
