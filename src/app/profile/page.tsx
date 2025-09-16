'use client';
import { useAuth } from '@/context/auth-provider';
import { vehicles } from '@/lib/data';
import VehicleCard from '@/components/vehicles/vehicle-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  const savedVehicles = user ? vehicles.filter(
    (vehicle) => user.savedVehicles.includes(vehicle.id)
  ) : [];

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        <p className="text-muted-foreground">Please wait while we fetch your profile.</p>
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
