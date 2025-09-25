
'use client';
import { useAuth } from '@/context/auth-provider';
import { getVehicles } from '@/lib/services/vehicle-service';
import VehicleCard from '@/components/vehicles/vehicle-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Vehicle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadVehicles() {
      setVehiclesLoading(true);
      const vehicles = await getVehicles();
      setAllVehicles(vehicles);
      setVehiclesLoading(false);
    }
    loadVehicles();
  }, []);
  
  const savedVehicles = user?.savedVehicles ? allVehicles.filter(
    (vehicle) => user.savedVehicles.includes(vehicle.id)
  ) : [];

  const isLoading = authLoading || vehiclesLoading;

  if (isLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2 text-center md:text-left">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-10 w-24 mt-4" />
          </div>
        </div>
        <div>
            <Skeleton className="h-8 w-40 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-72 w-full" />)}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <Button onClick={logout} variant="outline" className="mt-4">
            Logout
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Saved Vehicles</h2>
        {savedVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">You haven&apos;t saved any vehicles yet.</p>
        )}
      </div>
    </div>
  );
}
