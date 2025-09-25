
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { VehicleFilterState, VehicleType, Filters, SortOption, MultiFilter } from '@/lib/types';

const initialFilters: Omit<Filters, 'vehicleType'> = {
  fuelType: [],
  year: [],
  rto: [],
  ownership: [],
  transmission: [],
};

const defaultState = {
  filters: {
    ...initialFilters,
    vehicleType: '4-wheeler' as VehicleType,
  },
  sort: 'price-asc' as SortOption,
};

export const useVehicleFilterStore = create<VehicleFilterState>()(
  persist(
    (set, get) => ({
      ...defaultState,
      resultCount: 0,
      setSort: (sort) => set({ sort }),
      toggleMultiFilter: (filterType, value) =>
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
          filters: {
            ...initialFilters,
            vehicleType,
          },
        }));
      },
      clearFilters: () => set((state) => ({ filters: { ...initialFilters, vehicleType: state.filters.vehicleType } })),
      setResultCount: (count) => set({ resultCount: count }),
    }),
    {
      name: 'vehicle-filter-storage',
      storage: createJSONStorage(() => localStorage),
      // Merge the stored state with the default state to prevent undefined properties
      merge: (persistedState, currentState) => {
        const state = { ...currentState, ...(persistedState as Partial<VehicleFilterState>) };
        state.filters = {
            ...currentState.filters,
            ...(persistedState as Partial<VehicleFilterState>).filters,
        };
        return state;
      },
      partialize: (state) => ({
        filters: state.filters,
        sort: state.sort,
      }),
    }
  )
);
