import VehicleGrid from '@/components/vehicles/vehicle-grid';
import { vehicles } from '@/lib/data';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-headline font-bold tracking-tight text-primary md:text-5xl">
          Find Your Next Ride
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse our curated selection of trusted and verified vehicles.
        </p>
      </header>
      <VehicleGrid vehicles={vehicles} />
    </div>
  );
}