
'use client';

import { useEffect, useState } from 'react';
import { getVehicles } from '@/lib/services/vehicle-service';
import VehicleGrid from '@/components/vehicles/vehicle-grid';
import AdBanner from '@/components/layout/ad-banner';
import SearchBar from '@/components/search/search-bar';
import { Car } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Vehicle } from '@/lib/types';
import { useVehicleFilterStore } from '@/store/vehicle-filters';
import { QueryParamSync } from '@/components/search/query-param-sync';

export default function Home() {
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { filters: { vehicleType } } = useVehicleFilterStore();

  useEffect(() => {
    async function loadVehicles() {
      setLoading(true);
      setError(null);
      try {
        const vehicles = await getVehicles();
        setAllVehicles(vehicles);
      } catch (e: any) {
        setError(e.message || 'Failed to load vehicles.');
      } finally {
        setLoading(false);
      }
    }
    loadVehicles();
  }, []);

  const filteredVehicles = allVehicles.filter(v => v.vehicleType === vehicleType);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-5 w-48" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
            </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-destructive">Something went wrong</h3>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      );
    }

    if (filteredVehicles.length > 0) {
      return <VehicleGrid vehicles={filteredVehicles} />;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-400px)] text-center">
        <Car className="w-24 h-24 text-muted-foreground mb-6" />
        <h2 className="text-2xl font-bold text-primary mb-2">No Vehicles Found</h2>
        <p className="text-lg text-muted-foreground">
          There are currently no vehicles available for this type. Please check back later.
        </p>
      </div>
    );
  };

  return (
    <>
      <QueryParamSync />
      <SearchBar />
      <AdBanner />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </>
  );
}
