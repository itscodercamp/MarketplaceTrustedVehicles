
'use client';
import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Car, Store, User, Upload, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

type UserType = 'customer' | 'dealer';

export default function StartSellingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [userType, setUserType] = useState<UserType | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCustomerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
    setImagePreview(null);

    toast({
      title: 'Submission Received!',
      description: "Thank you! Our inspection team will contact you shortly to schedule a visit.",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-background px-4 py-12">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  const renderSelection = () => (
    <section className="mt-12 max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Are you a Customer or a Dealer?</CardTitle>
            <CardDescription>Choose the option that best describes you to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={cn('step-card cursor-pointer')} onClick={() => setUserType('customer')}>
                <User className="mx-auto h-12 w-12 text-primary" />
                <h3 className="mt-4 text-lg font-medium text-foreground">I am a Customer</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    I want to sell my single vehicle. I need an easy process with a trusted inspection and the best market price.
                </p>
              </div>
                <div className={cn('step-card cursor-pointer')} onClick={() => setUserType('dealer')}>
                <Store className="mx-auto h-12 w-12 text-primary" />
                <h3 className="mt-4 text-lg font-medium text-foreground">I am a Dealer</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    I own a dealership and want to list my inventory, manage leads, and grow my business on your platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
  );

  const renderCustomerForm = () => (
     <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-3">
            <Car className="w-6 h-6 text-primary" />
            <span>Sell Your Vehicle</span>
          </CardTitle>
          <Button variant="link" onClick={() => setUserType('dealer')}>
            Are you a Dealer?
          </Button>
        </div>
        <CardDescription>
          Fill out the details below. Our team will call you to schedule a free inspection, and we'll list your vehicle for you at the best price, including our margin and your take-home value.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCustomerSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
              <Label htmlFor="customerName">Your Name</Label>
              <Input id="customerName" placeholder="Enter your full name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerContact">Contact Number</Label>
              <Input id="customerContact" type="tel" placeholder="Enter your mobile number" required />
            </div>
              <div className="space-y-2">
              <Label htmlFor="vehicleNumber">Vehicle Number</Label>
              <Input id="vehicleNumber" placeholder="e.g., MH-12-AB-1234" required />
            </div>
              <div className="space-y-2">
              <Label htmlFor="vehicleLocation">Vehicle Location</Label>
              <Input id="vehicleLocation" placeholder="Full address for inspection" required />
            </div>
          </div>
            <div className="space-y-2">
            <Label htmlFor="vehiclePhoto" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Front Photo (with Number Plate)
            </Label>
            <Input id="vehiclePhoto" type="file" accept="image/*" onChange={handleImageChange} required className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
              {imagePreview && (
              <div className="mt-4">
                <Image src={imagePreview} alt="Vehicle preview" width={150} height={100} className="rounded-md object-cover" />
              </div>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit for Inspection'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderDealerOptions = () => (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-3">
              <Store className="w-6 h-6 text-primary" />
              <span>Dealer Options</span>
            </CardTitle>
            <Button variant="link" onClick={() => setUserType('customer')}>
                Not a Dealer?
            </Button>
        </div>
        <CardDescription>
          Manage your inventory with our dedicated tools or list your vehicles directly. Once your account is set as a dealer, admin approval is required to change it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
          <div className="bg-primary/10 p-6 rounded-lg text-center">
              <h3 className="text-lg font-semibold">Inventory Management System</h3>
              <p className="text-muted-foreground mt-2 mb-4">Use our powerful IMS to manage your listings, track leads, and grow your business.</p>
              <Button>
                  Continue with IMS by Trusted Vehicles
                  <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
          </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-2 text-muted-foreground">
                  OR
                </span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">List Directly</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                Want to list vehicles one by one? We'll perform an inspection for each vehicle before it goes live to ensure quality.
              </p>
              <Button variant="secondary" onClick={() => router.push('/register?role=dealer')}>Register as a Dealer</Button>
            </div>
      </CardContent>
    </Card>
  );


  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <section className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
            Sell Your Vehicle, Your Way
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
            Whether you're an individual seller or a professional dealer, we provide the best platform to reach genuine buyers.
          </p>
        </section>

        <section className="mt-12 max-w-4xl mx-auto">
            {!userType && renderSelection()}
            {userType === 'customer' && renderCustomerForm()}
            {userType === 'dealer' && renderDealerOptions()}
        </section>

      </div>
    </div>
  );
}
