
'use client';

import { useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useVehicleFilterStore } from '@/store/vehicle-filters';
import { Filters, SortOption } from '@/lib/types';
import { shallow } from 'zustand/shallow';

// This component handles the two-way synchronization between the Zustand store and the URL query parameters.
export function QueryParamSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const { filters, sort, setFiltersFromURL, setSort, isHydrated } = useVehicleFilterStore(
    (state) => ({
      filters: state.filters,
      sort: state.sort,
      setFiltersFromURL: state.setFiltersFromURL,
      setSort: state.setSort,
      isHydrated: state.isHydrated,
    }),
    shallow
  );

  // 1. On initial component mount, read from URL and update the store.
  useEffect(() => {
    // Only run this once after the store has been hydrated from localStorage
    if (!isHydrated) return;

    const currentParams = new URLSearchParams(searchParams.toString());
    const newFilters: Partial<Filters> = {};
    const newSort = currentParams.get('sort') as SortOption | null;

    if (newSort) {
      setSort(newSort);
    }
    
    // We can add more filter sync logic here in the future
    if (currentParams.has('fuelType')) {
        newFilters.fuelType = currentParams.get('fuelType')?.split(',') as Filters['fuelType'];
    }
     if (currentParams.has('year')) {
        newFilters.year = currentParams.get('year')?.split(',') as Filters['year'];
    }

    if (Object.keys(newFilters).length > 0) {
        setFiltersFromURL(newFilters);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, setFiltersFromURL, setSort]);


  // 2. On store change, update the URL.
  useEffect(() => {
    // Don't update the URL until the store is hydrated and has read the initial URL state.
    if (!isHydrated) return;

    const currentParams = new URLSearchParams(searchParams.toString());
    
    // Sync sort
    if (sort) {
      currentParams.set('sort', sort);
    } else {
      currentParams.delete('sort');
    }

    // Sync filters
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        currentParams.set(key, value.join(','));
      } else if (!Array.isArray(value) && value) {
         // for non-array filters like vehicleType
         currentParams.set(key, String(value));
      } else {
        currentParams.delete(key);
      }
    });
    
    // We construct the new search string.
    const newSearch = currentParams.toString();
    // We use router.replace to update the URL without adding to the history stack.
    router.replace(`${pathname}?${newSearch}`, { scroll: false });
    
  }, [filters, sort, pathname, router, searchParams, isHydrated]);

  return null; // This component does not render anything.
}
