import { create } from 'zustand';
import type { VehicleFilterState, Filters, SortOption } from '@/lib/types';

export const useVehicleFilterStore = create<VehicleFilterState>((set) => ({
  filters: {
    fuelType: [],
    condition: [],
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
  clearFilters: () =>
    set({
      filters: {
        fuelType: [],
        condition: [],
      },
    }),
    setResultCount: (count) => set({ resultCount: count }),
}));
