"use client";

import { useMemo, useEffect } from 'react';
import VehicleCard from './vehicle-card';
import type { Vehicle } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useVehicleFilterStore } from '@/store/vehicle-filters';

interface VehicleGridProps {
  vehicles: Vehicle[];
}

export default function VehicleGrid({ vehicles }: VehicleGridProps) {
  const { filters, sort, setResultCount } = useVehicleFilterStore();

  const filteredAndSortedVehicles = useMemo(() => {
    let result = [...vehicles];

    // Filtering
    if (filters.fuelType.length > 0) {
      result = result.filter(v => filters.fuelType.includes(v.fuelType));
    }
    if (filters.condition.length > 0) {
      result = result.filter(v => filters.condition.includes(v.condition));
    }

    // Sorting
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'year-desc':
        result.sort((a, b) => b.year - a.year);
        break;
      case 'year-asc':
        result.sort((a, b) => a.year - b.year);
        break;
      case 'kms-asc':
        result.sort((a, b) => a.kmsDriven - b.kmsDriven);
        break;
      case 'kms-desc':
        result.sort((a, b) => b.kmsDriven - a.kmsDriven);
        break;
    }

    return result;
  }, [vehicles, filters, sort]);

  useEffect(() => {
    setResultCount(filteredAndSortedVehicles.length);
  }, [filteredAndSortedVehicles, setResultCount]);
  
  return (
    <section>
      {filteredAndSortedVehicles.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {filteredAndSortedVehicles.map((vehicle, i) => (
              <motion.div
                key={vehicle.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <VehicleCard vehicle={vehicle} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
         <div className="text-center py-20 bg-card rounded-lg border-2 border-dashed">
            <h3 className="text-xl font-semibold">No Vehicles Found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
        </div>
      )}
    </section>
  );
}
