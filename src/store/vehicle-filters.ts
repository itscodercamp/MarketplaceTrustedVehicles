import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { VehicleFilterState, VehicleType, Filters } from '@/lib/types';

const initialState: Omit<Filters, 'vehicleType'> = {
  fuelType: [],
  condition: [],
};

export const useVehicleFilterStore = create<VehicleFilterState>()(
  persist(
    (set, get) => ({
      filters: {
        ...initialState,
        vehicleType: '4-wheeler',
      },
      sort: 'price-asc',
      resultCount: 0,
      setSort: (sort) => set({ sort }),
      toggleFilter: (filterType, value) =>
        set((state) => {
          const currentValues = state.filters[filterType] as string[];
          const newValues = currentValues.includes(value)
            ? currentValues.filter((item) => item !== value)
            : [...currentValues, value];
          return {
            filters: {
              ...state.filters,
              [filterType]: newValues,
            },
          };
        }),
      setVehicleType: (vehicleType) => {
        set((state) => ({
          // Clear filters when vehicle type changes
          filters: {
            ...initialState,
            vehicleType,
          },
        }));
      },
      clearFilters: () => set((state) => ({ filters: { ...initialState, vehicleType: state.filters.vehicleType } })),
      setResultCount: (count) => set({ resultCount: count }),
    }),
    {
      name: 'vehicle-filter-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist the vehicleType
      partialize: (state) => ({
        filters: { vehicleType: state.filters.vehicleType },
      }),
    }
  )
);
