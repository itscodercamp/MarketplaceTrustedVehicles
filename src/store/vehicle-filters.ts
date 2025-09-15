import { create } from 'zustand';
import type { VehicleFilterState, VehicleType } from '@/lib/types';

const initialState = {
  fuelType: [],
  condition: [],
  vehicleType: '4-wheeler' as VehicleType,
};

export const useVehicleFilterStore = create<VehicleFilterState>((set) => ({
  filters: initialState,
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
  setVehicleType: (vehicleType) =>
    set((state) => ({
      filters: {
        ...state.filters,
        vehicleType,
      },
    })),
  clearFilters: () => set((state) => ({ filters: {...initialState, vehicleType: state.filters.vehicleType} })),
  setResultCount: (count) => set({ resultCount: count }),
}));
