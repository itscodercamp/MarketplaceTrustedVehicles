import { z } from 'zod';

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
  detailImages: {
    Exterior: string[];
    Interior: string[];
    Engine: string[];
    Tyres: string[];
  };
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


// Schema for generateVehicleConditionReport flow
export const GenerateVehicleConditionReportInputSchema = z.object({
  vehicleDescription: z.string().describe('A detailed description of the vehicle, including make, model, and year.'),
  condition: z.string().describe('The current condition of the vehicle (e.g., excellent, good, fair, poor).'),
  features: z.string().describe('A list of features and options the vehicle has.'),
  images: z.array(z.string()).describe(
    "A list of photos of the vehicle, as data URIs that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type GenerateVehicleConditionReportInput = z.infer<typeof GenerateVehicleConditionReportInputSchema>;

export const GenerateVehicleConditionReportOutputSchema = z.object({
  report: z.string().describe('A comprehensive condition report of the vehicle in Markdown format.'),
});
export type GenerateVehicleConditionReportOutput = z.infer<typeof GenerateVehicleConditionReportOutputSchema>;


// Schema for recommendVehiclesViaChatbot flow
export const RecommendVehiclesViaChatbotInputSchema = z.object({
  userInput: z.string().describe('The user input describing their vehicle preferences.'),
  language: z
    .string()
    .describe(
      'The language the user is speaking in (Hindi, Marathi, Urdu, English), but using English alphabet.'
    ),
  vehicleList: z.string().describe('A list of available vehicles in JSON format. Each item is a string with year, make, model and price.'),
});
export type RecommendVehiclesViaChatbotInput = z.infer<typeof RecommendVehiclesViaChatbotInputSchema>;

export const RecommendVehiclesViaChatbotOutputSchema = z.object({
  recommendation: z.string().describe("The vehicle recommendation from the chatbot. If you recommend a specific vehicle, mention its exact make and model from the list. If no specific vehicle is recommended, this can be a general response."),
});
export type RecommendVehiclesViaChatbotOutput = z.infer<typeof RecommendVehiclesViaChatbotOutputSchema>;
