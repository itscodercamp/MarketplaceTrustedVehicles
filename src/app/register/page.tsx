
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Building, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Role = 'Customer' | 'Dealer';
type Step = 1 | 2 | 3;

const customerSchema = z.object({
  userType: z.literal('Customer'),
  fullName: z.string().min(2, 'Full name is required.'),
  phone: z.string().min(10, 'A valid phone number is required.'),
  email: z.string().email('Invalid email address.').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

const dealerSchema = z.object({
  userType: z.literal('Dealer'),
  fullName: z.string().min(2, 'Full name is required.'),
  phone: z.string().min(10, 'A valid phone number is required.'),
  email: z.string().email('A valid email is required for dealers.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  dealershipName: z.string().min(2, 'Dealership name is required.'),
  dealershipType: z.enum(['4w', '2w', 'both']),
  city: z.string().min(2, 'City is required.'),
  state: z.string().min(2, 'State is required.'),
  pincode: z.string().min(6, 'A valid pincode is required.'),
});

const formSchema = z.discriminatedUnion('userType', [customerSchema, dealerSchema]);
type FormValues = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<Role>('Customer');
  const { register, user, loading } = useAuth();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userType: 'Customer',
      fullName: '',
      phone: '',
      email: '',
      password: '',
    },
  });
  
  useEffect(() => {
    form.setValue('userType', role);
    if (role === 'Customer') {
        form.reset({
        ...form.getValues(),
        userType: 'Customer',
      });
    } else {
       form.reset({
        ...form.getValues(),
        userType: 'Dealer',
        dealershipName: '',
        dealershipType: '4w',
        city: '',
        state: '',
        pincode: '',
      });
    }
  }, [role, form]);


  useEffect(() => {
    if (!loading && user) {
      router.push('/profile');
    }
  }, [user, loading, router]);

  const handleNextStep = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      setStep(prev => (prev + 1) as Step);
    }
  };

  const onSubmit = (values: FormValues) => {
    register(values);
  };
  
  if (loading || (!loading && user)) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderStepOne = () => (
    <div className="text-center">
      <Link href="/" className="inline-flex flex-col -my-2">
        <span className="text-3xl font-bold tracking-tight text-primary leading-tight">Marketplace</span>
        <span className="text-sm text-muted-foreground leading-tight">by <span className="text-success font-semibold">Trusted</span> Vehicles</span>
      </Link>
      <h2 className="mt-6 text-3xl font-extrabold text-foreground">Create a new account</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:text-primary/90">Sign in</Link>
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className={cn('step-card', role === 'Customer' && 'step-card-active')} onClick={() => setRole('Customer')}>
          <User className="mx-auto h-12 w-12 text-primary" />
          <h3 className="mt-4 text-lg font-medium text-foreground">Customer</h3>
          <p className="mt-1 text-sm text-muted-foreground">I want to buy vehicles.</p>
        </div>
        <div className={cn('step-card', role === 'Dealer' && 'step-card-active')} onClick={() => setRole('Dealer')}>
          <Building className="mx-auto h-12 w-12 text-primary" />
          <h3 className="mt-4 text-lg font-medium text-foreground">Dealer</h3>
          <p className="mt-1 text-sm text-muted-foreground">I want to sell vehicles.</p>
        </div>
      </div>
      <Button onClick={() => setStep(2)} className="mt-8 w-full sm:w-auto">Continue as a {role}</Button>
    </div>
  );

  const renderStepTwo = () => (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">Register as a {role}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Create your account to get started.</p>
      </div>
      <Form {...form}>
        <form className="space-y-4">
          <FormField control={form.control} name="fullName" render={({ field }) => (
            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="9876543210" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email {role === 'Customer' && '(Optional)'}</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          
          {role === 'Dealer' && form.watch('userType') === 'Dealer' && (
            <>
              <FormField control={form.control} name="dealershipName" render={({ field }) => (
                <FormItem><FormLabel>Dealership Name</FormLabel><FormControl><Input placeholder="Awesome Motors" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="dealershipType" render={({ field }) => (
                <FormItem><FormLabel>Dealership Type</FormLabel><FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="mt-2 flex gap-4">
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="4w" id="4w" /></FormControl><Label htmlFor="4w" className="font-normal">4-Wheeler</Label></FormItem>
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="2w" id="2w" /></FormControl><Label htmlFor="2w" className="font-normal">2-Wheeler</Label></FormItem>
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="both" id="both" /></FormControl><Label htmlFor="both" className="font-normal">Both</Label></FormItem>
                    </RadioGroup>
                </FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Mumbai" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="Maharashtra" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>
              <FormField control={form.control} name="pincode" render={({ field }) => (
                <FormItem><FormLabel>Pincode</FormLabel><FormControl><Input placeholder="400001" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </>
          )}
          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" onClick={() => setStep(1)}><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
            <Button type="button" onClick={handleNextStep}>Proceed to Preview</Button>
          </div>
        </form>
      </Form>
    </div>
  );
  
  const renderStepThree = () => {
    const values = form.getValues();
    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground">Confirm Your Details</h2>
                <p className="mt-1 text-sm text-muted-foreground">Please review your information before creating your account.</p>
            </div>
            <Card>
                <CardHeader><CardTitle>Registration Preview</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <p className="text-muted-foreground">Registering as:</p><p className="font-semibold">{values.userType}</p>
                        <p className="text-muted-foreground">Full Name:</p><p className="font-semibold">{values.fullName}</p>
                        <p className="text-muted-foreground">Phone:</p><p className="font-semibold">{values.phone}</p>
                        <p className="text-muted-foreground">Email:</p><p className="font-semibold">{values.email || 'N/A'}</p>
                    </div>
                    {values.userType === 'Dealer' && (
                        <>
                            <hr />
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <p className="text-muted-foreground">Dealership Name:</p><p className="font-semibold">{values.dealershipName}</p>
                                <p className="text-muted-foreground">Type:</p><p className="font-semibold">{values.dealershipType}</p>
                                <p className="text-muted-foreground">City:</p><p className="font-semibold">{values.city}</p>
                                <p className="text-muted-foreground">State:</p><p className="font-semibold">{values.state}</p>
                                <p className="text-muted-foreground">Pincode:</p><p className="font-semibold">{values.pincode}</p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
            <div className="flex items-center justify-between pt-6">
                <Button variant="ghost" onClick={() => setStep(2)}><ArrowLeft className="w-4 h-4 mr-2" />Back to Edit</Button>
                <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
                </Button>
            </div>
        </div>
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        {step === 1 && renderStepOne()}
        {step === 2 && renderStepTwo()}
        {step === 3 && renderStepThree()}
      </div>
    </div>
  );
}
