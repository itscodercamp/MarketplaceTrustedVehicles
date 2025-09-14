'use client';
import { useEffect } from 'react';
import type { Vehicle } from '@/lib/types';
import { useVehicleFilterStore } from '@/store/vehicle-filters';
import VehicleCard from './vehicle-card';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { SidebarTrigger } from '../ui/sidebar';

interface VehicleGridProps {
  vehicles: Vehicle[];
}

export default function VehicleGrid({ vehicles }: VehicleGridProps) {
  const { filters, sort, setResultCount } = useVehicleFilterStore();

  const filteredAndSortedVehicles = vehicles
    .filter((vehicle) => {
      const { fuelType, condition } = filters;
      if (fuelType.length > 0 && !fuelType.includes(vehicle.fuelType)) return false;
      if (condition.length > 0 && !condition.includes(vehicle.condition)) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'year-asc': return a.year - b.year;
        case 'year-desc': return b.year - a.year;
        case 'kms-asc': return a.kmsDriven - b.kmsDriven;
        case 'kms-desc': return b.kmsDriven - a.kmsDriven;
        default: return 0;
      }
    });
  
  useEffect(() => {
    setResultCount(filteredAndSortedVehicles.length);
  }, [filteredAndSortedVehicles.length, setResultCount]);

  const resultCount = useVehicleFilterStore(state => state.resultCount);

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {resultCount} of {vehicles.length} vehicles
        </p>
        <SidebarTrigger asChild className="lg:hidden">
          <Button variant="outline">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <span>Filters & Sort</span>
          </Button>
        </SidebarTrigger>
      </div>

      {filteredAndSortedVehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold">No vehicles found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters to find what you&apos;re looking for.
          </p>
        </div>
      )}
    </section>
  );
}
