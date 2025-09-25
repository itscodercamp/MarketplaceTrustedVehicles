
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

const checkYearInRange = (year: number, range: string) => {
    if (range === '2020-Present') return year >= 2020;
    if (range === 'Before 2005') return year < 2005;
    const [start, end] = range.split('-').map(Number);
    return year >= start && year <= end;
}

export default function VehicleGrid({ vehicles }: VehicleGridProps) {
  const { filters, sort, setResultCount } = useVehicleFilterStore();
  const { layout } = useLayoutStore();

  const filteredAndSortedVehicles = vehicles
    .filter((vehicle) => {
      const { fuelType, year: yearRanges, ownership, rto, transmission } = filters;
      if (fuelType.length > 0 && vehicle.fuelType && !fuelType.includes(vehicle.fuelType)) return false;
      if (ownership.length > 0 && vehicle.ownership && !ownership.includes(vehicle.ownership)) return false;
      if (transmission.length > 0 && vehicle.transmission && !transmission.includes(vehicle.transmission)) return false;
      
      // RTO filter - check if vehicle's RTO state is in the selected RTOs
      if (rto.length > 0 && vehicle.rtoState && !rto.some(rtoFilter => vehicle.rtoState!.startsWith(rtoFilter))) {
          return false;
      }
      
      // Year range filter
      if (yearRanges.length > 0 && vehicle.year) {
          const vehicleInAnyRange = yearRanges.some(range => checkYearInRange(vehicle.year!, range));
          if (!vehicleInAnyRange) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'year-asc': return (a.year || 0) - (b.year || 0);
        case 'year-desc': return (b.year || 0) - (a.year || 0);
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
             ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'
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
