
'use client';
import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, TrendingUp, Users, Bot, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Reach More Buyers',
    description: 'Tap into a vast network of verified buyers actively looking for their next vehicle.',
  },
  {
    icon: Users,
    title: 'Build Trust',
    description: 'Showcase your verified listings and build a reputation for quality and transparency.',
  },
  {
    icon: Bot,
    title: 'Leverage AI Tools',
    description: 'Use our AI-powered condition report generator to create detailed and impressive listings effortlessly.',
  },
    {
    icon: CheckCircle,
    title: 'Simple Listing Process',
    description: 'Our streamlined process makes it easy to list your vehicles and manage your inventory.',
  },
];

export default function StartSellingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

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
  
  if (user) {
    // If user is already logged in, maybe they want to see a dashboard in the future.
    // For now, we'll show them the same marketing page, but with a different CTA.
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <section className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
            Join the Future of Vehicle Sales
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Sell your vehicles faster and more efficiently by joining the most trusted digital marketplace.
          </p>
          <div className="mt-10">
            <Button size="lg" asChild>
              <Link href="/register">Become a Dealer Today</Link>
            </Button>
             <p className="mt-4 text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </section>

        <section className="mt-20">
          <div className="max-w-4xl mx-auto">
             <h2 className="text-3xl font-bold text-center mb-12">
                Why Sell with <span className="text-primary">Trusted Vehicles</span>?
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <benefit.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{benefit.title}</h3>
                    <p className="mt-2 text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="mt-20">
            <Card className="max-w-4xl mx-auto text-center shadow-lg border-primary/20">
                <CardHeader>
                    <CardTitle className="text-3xl">Ready to Boost Your Sales?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6">
                        Create your dealer account in minutes and start listing your inventory today. No hidden fees, no complex paperwork.
                    </p>
                     <Button size="lg" asChild>
                      <Link href="/register">Get Started for Free</Link>
                    </Button>
                </CardContent>
            </Card>
        </section>
      </div>
    </div>
  );
}

