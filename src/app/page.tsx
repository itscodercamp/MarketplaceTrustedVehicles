
import { getVehicles } from '@/lib/services/vehicle-service';
import VehicleGrid from '@/components/vehicles/vehicle-grid';
import AdBanner from '@/components/layout/ad-banner';
import SearchBar from '@/components/search/search-bar';
import { Car } from 'lucide-react';

// Revalidate this page every 5 minutes
export const revalidate = 300;

export default async function Home() {
  let allVehicles = [];
  let error = null;

  try {
    allVehicles = await getVehicles();
  } catch (e: any) {
    error = e.message;
  }

  const fourWheelers = allVehicles.filter(v => v.vehicleType === '4-wheeler');

  return (
    <>
      <AdBanner />
      <SearchBar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-destructive">Something went wrong</h3>
            <p className="text-muted-foreground mt-2">{error}</p>
          </div>
        ) : fourWheelers.length > 0 ? (
          <VehicleGrid vehicles={fourWheelers} />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-400px)] text-center">
            <Car className="w-24 h-24 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-bold text-primary mb-2">No Vehicles Found</h2>
            <p className="text-lg text-muted-foreground">
              There are currently no vehicles available. Please check back later.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
