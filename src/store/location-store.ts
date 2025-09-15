import { create } from 'zustand';

interface LocationState {
  location: { latitude: number; longitude: number } | null;
  locationError: string | null;
  hasLocationAccess: boolean;
  requestLocation: () => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  location: null,
  locationError: null,
  hasLocationAccess: false,
  requestLocation: () => {
    if (get().hasLocationAccess || typeof navigator === 'undefined') return;

    if (navigator.geolocation) {
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
    } else {
      set({
        locationError: "Geolocation is not supported by this browser.",
        hasLocationAccess: false,
      });
    }
  },
}));
