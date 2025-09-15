'use client';
import { vehicles } from '@/lib/data';
import { Sidebar } from '@/components/ui/sidebar';
import VehicleFilters from '@/components/vehicles/vehicle-filters';
import VehicleGrid from '@/components/vehicles/vehicle-grid';
import { useVehicleFilterStore } from '@/store/vehicle-filters';
import type { Vehicle } from '@/lib/types';

export default function Home() {
  const {
    filters: { vehicleType },
  } = useVehicleFilterStore();

  const getVehicles = (): Vehicle[] => {
    if (vehicleType === '2-wheeler') {
      return [];
    }
    return vehicles;
  };

  return (
    <>
      <div className="flex">
        <Sidebar side="left">
          <VehicleFilters />
        </Sidebar>
        <div className="flex-1 lg:ml-72">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <VehicleGrid vehicles={getVehicles()} />
          </div>
        </div>
      </div>
    </>
  );
}
