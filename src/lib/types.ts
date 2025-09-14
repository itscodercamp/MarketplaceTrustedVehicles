export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'CNG';
export type Condition = 'New' | 'Like New' | 'Good' | 'Fair';
export type SortOption = 'price-asc' | 'price-desc' | 'year-desc' | 'year-asc' | 'kms-asc' | 'kms-desc';
export type Transmission = 'Automatic' | 'Manual';
export type Ownership = '1st Owner' | '2nd Owner' | '3rd Owner';
export type ServiceHistory = 'Available' | 'Not Available';

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
