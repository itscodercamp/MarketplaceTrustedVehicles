
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
  searchQuery: '',
};

export const useVehicleFilterStore = create<VehicleFilterState & { 
    isHydrated: boolean; 
    setFiltersFromURL: (newFilters: Partial<Filters>) => void;
  }>()(
  persist(
    (set, get) => ({
      ...defaultState,
      resultCount: 0,
      isHydrated: false,
      setSort: (sort) => set({ sort }),
      setSearchQuery: (query) => set({ searchQuery: query }),
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
        set(() => ({
          filters: {
            ...initialFilters,
            vehicleType,
          },
          searchQuery: '', // Also reset search query on type change
        }));
      },
      clearFilters: () => set((state) => ({ 
        filters: { ...initialFilters, vehicleType: state.filters.vehicleType },
        searchQuery: '',
      })),
      setResultCount: (count) => set({ resultCount: count }),
      setFiltersFromURL: (newFilters) => set((state) => ({
        filters: {
            ...state.filters,
            ...newFilters,
        }
      })),
    }),
    {
      name: 'vehicle-filter-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.isHydrated = true;
      },
      partialize: (state) => ({
        // We only persist a subset of the state to avoid issues with non-serializable parts
        filters: state.filters,
        sort: state.sort,
        searchQuery: state.searchQuery,
      }),
    }
  )
);
