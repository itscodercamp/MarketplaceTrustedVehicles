'use client';
import { useEffect } from 'react';
import type { Vehicle } from '@/lib/types';
import { useVehicleFilterStore } from '@/store/vehicle-filters';
import VehicleCard from './vehicle-card';
import { useLayoutStore } from '@/store/layout-store';
import { cn } from '@/lib/utils';
import VehicleListItem from './vehicle-list-item';

interface VehicleGridProps {
  vehicles: Vehicle[];
}

export default function VehicleGrid({ vehicles }: VehicleGridProps) {
  const { filters, sort, setResultCount } = useVehicleFilterStore();
  const { layout } = useLayoutStore();

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
  const CardComponent = layout === 'grid' ? VehicleCard : VehicleListItem;

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {resultCount} of {vehicles.length} vehicles
        </p>
      </div>

      {filteredAndSortedVehicles.length > 0 ? (
         <div
         className={cn(
           'gap-4',
           layout === 'grid'
             ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3'
             : 'flex flex-col'
         )}
       >
          {filteredAndSortedVehicles.map((vehicle) => (
            <CardComponent key={vehicle.id} vehicle={vehicle} />
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
