"use client";

import { useAuth } from '@/context/auth-provider';
import { vehicles } from '@/lib/data';
import VehicleCard from '@/components/vehicles/vehicle-card';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push('/');
    }
  }, [user, router]);
  
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Redirecting...</p>
      </div>
    );
  }

  const savedVehicles = vehicles.filter(v => user.savedVehicles.includes(v.id));

  const userInitials = user.name
    .split(' ')
    .map(n => n[0])
    .join('');

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="text-3xl">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-headline font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" onClick={logout}>Log Out</Button>
        </div>
      </Card>

      <div>
        <h2 className="text-2xl font-headline font-bold mb-6">My Saved Vehicles</h2>
        {savedVehicles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedVehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-lg border-2 border-dashed">
            <h3 className="text-xl font-semibold">No Saved Vehicles</h3>
            <p className="text-muted-foreground mt-2">You haven't saved any vehicles yet.</p>
            <Button asChild className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/">Browse Marketplace</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
