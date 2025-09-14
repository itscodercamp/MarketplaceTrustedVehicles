export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'CNG';
export type Condition = 'New' | 'Like New' | 'Good' | 'Fair';
export type SortOption = 'price-asc' | 'price-desc' | 'year-desc' | 'year-asc' | 'kms-asc' | 'kms-desc';
export type Transmission = 'Automatic' | 'Manual';
export type Ownership = '1st Owner' | '2nd Owner' | '3rd Owner';
export type ServiceHistory = 'Available' | 'Not Available';
export type Insurance = 'Comprehensive' | 'Third Party' | 'Expired';
export type BodyType = 'SUV' | 'Sedan' | 'Hatchback' | 'MPV' | 'Off-road';


export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  kmsDriven: number;
  fuelType: FuelType;
  condition: Condition;
  imageUrl: string;
  imageHint: string;
  verified: boolean;
  transmission: Transmission;
  engine: string; // e.g., "1.2L"
  ownership: Ownership;
  serviceHistory: ServiceHistory;
  bodyType: BodyType;
  registration: string; // e.g. "MH-01"
  insurance: Insurance;
  color: string;
  mileage: string; // e.g. "18.5 kmpl"
  seatingCapacity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  savedVehicles: string[]; // array of vehicle IDs
}

export interface Filters {
  fuelType: FuelType[];
  condition: Condition[];
}

export interface VehicleFilterState {
    filters: Filters;
    sort: SortOption;
    resultCount: number;
    setSort: (sort: SortOption) => void;
    toggleFilter: (filterType: keyof Filters, value: string) => void;
    clearFilters: () => void;
    setResultCount: (count: number) => void;
}
