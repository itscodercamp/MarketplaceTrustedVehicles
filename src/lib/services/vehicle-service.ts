
import type { Vehicle } from '@/lib/types';

const API_BASE_URL = 'https://9000-firebase-studio-1757611792048.cluster-ancjwrkgr5dvux4qug5rbzyc2y.cloudworkstations.dev';
const API_URL = `${API_BASE_URL}/api/marketplace/vehicles`;

// This is a temporary cache to avoid re-fetching data on every page navigation during development.
// In a real-world app, you might use a more sophisticated caching strategy like React Query or SWR.
let cachedVehicles: Vehicle[] | null = null;

const constructImageUrl = (path?: string) => {
  if (!path) return undefined;
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
}

/**
 * Fetches vehicle data from the remote API and transforms it to match the application's Vehicle type.
 * @returns {Promise<Vehicle[]>} A promise that resolves to an array of vehicles.
 */
export async function getVehicles(): Promise<Vehicle[]> {
  if (cachedVehicles) {
    return cachedVehicles;
  }

  try {
    const response = await fetch(API_URL, {
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch vehicles. Status: ${response.status}`);
    }

    const data: any[] = await response.json();

    // The API response uses different field names than the app's internal `Vehicle` type.
    // We need to map the API fields to our internal type.
    const transformedVehicles: Vehicle[] = data.map((item, index) => ({
      // The API doesn't provide a unique ID, so we'll generate one for the key prop.
      // In a real app, the API should provide a stable, unique ID for each vehicle.
      id: item.id || `${index + 1}`, 
      make: item.make,
      model: item.model,
      price: item.price,
      variant: item.variant,
      year: item.year,
      status: item.status,
      verified: item.verified,
      mfgYear: item.mfgYear,
      regYear: item.regYear,
      regNumber: item.regNumber,
      rtoState: item.rtoState,
      ownership: item.ownership,
      kmsDriven: item.odometer, // Map 'odometer' from API to 'kmsDriven'
      fuelType: item.fuelType,
      transmission: item.transmission,
      insurance: item.insurance,
      serviceHistory: item.serviceHistory,
      color: item.color,
      vehicleType: '4-wheeler', // Assuming all vehicles from this API are 4-wheelers
      
      // Map all individual image fields and construct full URLs
      imageUrl: constructImageUrl(item.imageUrl),
      img_front: constructImageUrl(item.img_front),
      img_front_right: constructImageUrl(item.img_front_right),
      img_right: constructImageUrl(item.img_right),
      img_back_right: constructImageUrl(item.img_back_right),
      img_back: constructImageUrl(item.img_back),
      img_open_dickey: constructImageUrl(item.img_open_dickey),
      img_back_left: constructImageUrl(item.img_back_left),
      img_left: constructImageUrl(item.img_left),
      img_front_left: constructImageUrl(item.img_front_left),
      img_open_bonnet: constructImageUrl(item.img_open_bonnet),
      img_dashboard: constructImageUrl(item.img_dashboard),
      img_right_front_door: constructImageUrl(item.img_right_front_door),
      img_right_back_door: constructImageUrl(item.img_right_back_door),
      img_tyre_1: constructImageUrl(item.img_tyre_1),
      img_tyre_2: constructImageUrl(item.img_tyre_2),
      img_tyre_3: constructImageUrl(item.img_tyre_3),
      img_tyre_4: constructImageUrl(item.img_tyre_4),
      img_tyre_optional: constructImageUrl(item.img_tyre_optional),
      img_engine: constructImageUrl(item.img_engine),
      img_roof: constructImageUrl(item.img_roof),
    }));
    
    cachedVehicles = transformedVehicles;
    return transformedVehicles;
  } catch (error) {
    console.error("Error fetching or transforming vehicle data:", error);
    // Return an empty array or handle the error as appropriate for your application
    return [];
  }
}

/**
 * Fetches a single vehicle by its ID.
 * @param {string} id The ID of the vehicle to fetch.
 * @returns {Promise<Vehicle | undefined>} A promise that resolves to the vehicle or undefined if not found.
 */
export async function getVehicleById(id: string): Promise<Vehicle | undefined> {
  const vehicles = await getVehicles();
  return vehicles.find(v => v.id === id);
}

