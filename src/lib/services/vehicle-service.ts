
import type { Vehicle, Banner } from '@/lib/types';

const API_BASE_URL = 'https://apis.trustedvehicles.com';
const VEHICLES_API_URL = `${API_BASE_URL}/marketplace/vehicles`;
const BANNERS_API_URL = `${API_BASE_URL}/marketplace/banners`;


// This is a temporary cache to avoid re-fetching data on every page navigation during development.
// In a real-world app, you might use a more sophisticated caching strategy like React Query or SWR.
let cachedVehicles: any[] | null = null;
let cachedBanners: Banner[] | null = null;

const constructImageUrl = (path?: string) => {
  if (!path) return undefined;
  // If the path is already a full URL, return it as is.
  if (path.startsWith('http')) return path;
  
  // Construct the full URL.
  const separator = path.startsWith('/') ? '' : '/';
  return `${API_BASE_URL}${separator}${path}`;
}

export const transformVehicleData = (item: any): Vehicle => ({
  id: item.id.toString(),
  make: item.make,
  model: item.model,
  price: item.price,
  variant: item.variant,
  year: item.year || item.regYear,
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
  img_odometer: constructImageUrl(item.img_odometer),
});


/**
 * Fetches vehicle data from the remote API and transforms it to match the application's Vehicle type.
 * @returns {Promise<Vehicle[]>} A promise that resolves to an array of vehicles.
 */
export async function getVehicles(): Promise<Vehicle[]> {
  // Only use the cache if it's a valid, non-empty array.
  if (cachedVehicles && cachedVehicles.length > 0) {
    console.log("Returning cached vehicle data.");
    // Return transformed data from cache
    return cachedVehicles.map(transformVehicleData);
  }

  try {
    const response = await fetch(VEHICLES_API_URL, {
      mode: 'cors'
    });

    if (!response.ok) {
      console.error("API Error Response Status:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("API Error Response Body:", errorText);
      throw new Error(`Failed to fetch vehicles. Status: ${response.status}`);
    }

    const data: any[] = await response.json();

    // Cache the raw data
    cachedVehicles = data;
    
    // The API response uses different field names than the app's internal `Vehicle` type.
    // We need to map the API fields to our internal type.
    const transformedVehicles: Vehicle[] = data.map(transformVehicleData);
    
    return transformedVehicles;
  } catch (error) {
    console.error("Error fetching or transforming vehicle data:", error);
    // Throw a more user-friendly error to be caught by the UI
    throw new Error('The server is currently under maintenance. Please try again later.');
  }
}

/**
 * Fetches a single vehicle by its ID.
 * @param {string} id The ID of the vehicle to fetch.
 * @returns {Promise<any | undefined>} A promise that resolves to the raw vehicle data or undefined if not found.
 */
export async function getVehicleById(id: string): Promise<any | undefined> {
  // Ensure we have the latest data before trying to find a vehicle
  try {
    if (!cachedVehicles || cachedVehicles.length === 0) {
        await getVehicles();
    }
  } catch (error) {
      console.error("Failed to pre-fetch vehicles for getVehicleById:", error);
      // We can still try to find it if the cache was populated on a previous successful run
  }


  // Find the raw vehicle data from the cache.
  // The ID from the API might be a number, so we use '==' for loose comparison.
  if (cachedVehicles) {
    const vehicle = cachedVehicles.find(v => v.id == id);
    if (vehicle) {
      return vehicle;
    }
  }
  
  // If not found in cache, maybe the cache is stale. Try fetching it directly.
  try {
    const response = await fetch(`${VEHICLES_API_URL}/${id}`, { mode: 'cors' });
    if (response.ok) {
      const vehicle = await response.json();
      // Optionally update cache here
      return vehicle;
    }
  } catch (error) {
     console.error(`Direct fetch for vehicle ${id} failed:`, error);
  }

  return undefined;
}

/**
 * Fetches banner data from the remote API.
 * @returns {Promise<Banner[]>} A promise that resolves to an array of banners.
 */
export async function getBanners(): Promise<Banner[]> {
  if (cachedBanners) {
    return cachedBanners;
  }

  try {
    const response = await fetch(BANNERS_API_URL, { mode: 'cors' });

    if (!response.ok) {
      throw new Error(`Failed to fetch banners. Status: ${response.status}`);
    }

    const data: any[] = await response.json();

    const transformedBanners: Banner[] = data.map(item => ({
      title: item.title,
      imageUrl: constructImageUrl(item.imageUrl)!,
    }));
    
    cachedBanners = transformedBanners;
    return transformedBanners;
  } catch (error) {
    console.error("Error fetching banner data:", error);
    // Return empty array on error so the UI doesn't break
    return [];
  }
}
