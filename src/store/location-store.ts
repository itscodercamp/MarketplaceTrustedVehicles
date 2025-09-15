
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LocationState {
  location: { latitude: number; longitude: number } | null;
  locationError: string | null;
  hasLocationAccess: boolean;
  requestLocation: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      location: null,
      locationError: null,
      hasLocationAccess: false,
      _hasHydrated: false,

      setHasHydrated: (hydrated) => {
        set({ _hasHydrated: hydrated });
      },

      requestLocation: () => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
          set({
            locationError: "Geolocation is not supported by this browser.",
            hasLocationAccess: false,
          });
          return;
        }

        // Only request if we don't have access already
        if (get().hasLocationAccess) return;

        navigator.geolocation.getCurrentPosition(
          (position) => {
            set({
              location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
              locationError: null,
              hasLocationAccess: true,
            });
          },
          (error) => {
            set({
              locationError: `Error: ${error.message}`,
              hasLocationAccess: false,
            });
          }
        );
      },
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
      // Only persist location and access status
      partialize: (state) => ({ 
        location: state.location, 
        hasLocationAccess: state.hasLocationAccess 
      }),
    }
  )
);

    