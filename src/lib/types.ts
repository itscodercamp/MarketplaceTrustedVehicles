
import { z } from 'zod';

export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'CNG' | 'LPG' | 'Hybrid';
export type Condition = 'New' | 'Like New' | 'Good' | 'Fair';
export type SortOption = 'price-asc' | 'price-desc' | 'year-desc' | 'year-asc' | 'kms-asc' | 'kms-desc';
export type Transmission = 'Automatic' | 'Manual';
export type Ownership = '1st Owner' | '2nd Owner' | '3rd Owner' | string;
export type ServiceHistory = 'Available' | 'Not Available';
export type Insurance = 'Comprehensive' | 'Third Party' | 'None' | 'Expired';
export type BodyType = 'SUV' | 'Sedan' | 'Hatchback' | 'MPV' | 'Off-road' | 'Cruiser' | 'Sports' | 'Scooter';
export type VehicleType = '4-wheeler' | '2-wheeler';
export type VehicleStatus = 'For Sale' | 'Sold' | 'Reserved' | string;

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  price: number;
  variant?: string;
  year?: number;
  status?: VehicleStatus;
  verified?: boolean;
  mfgYear?: number;
  regYear?: number;
  regNumber?: string;
  rtoState?: string;
  ownership?: Ownership;
  kmsDriven: number;
  fuelType?: FuelType;
  transmission?: Transmission;
  insurance?: Insurance;
  serviceHistory?: ServiceHistory;
  color?: string;
  imageUrl?: string;
  imageHint?: string;
  condition?: Condition;
  engine?: string;
  bodyType?: BodyType;
  seatingCapacity?: number;
  vehicleType: VehicleType;

  // New image fields from API
  img_front?: string;
  img_front_right?: string;
  img_right?: string;
  img_back_right?: string;
  img_back?: string;
  img_open_dickey?: string;
  img_back_left?: string;
  img_left?: string;
  img_front_left?: string;
  img_open_bonnet?: string;
  img_dashboard?: string;
  img_right_front_door?: string;
  img_right_back_door?: string;
  img_tyre_1?: string;
  img_tyre_2?: string;
  img_tyre_3?: string;
  img_tyre_4?: string;
  img_tyre_optional?: string;
  img_engine?: string;
  img_roof?: string;
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
  vehicleType: VehicleType;
}

export interface VehicleFilterState {
    filters: Filters;
    sort: SortOption;
    resultCount: number;
    setSort: (sort: SortOption) => void;
    toggleFilter: (filterType: keyof Omit<Filters, 'vehicleType'>, value: string) => void;
    setVehicleType: (vehicleType: VehicleType) => void;
    clearFilters: () => void;
    setResultCount: (count: number) => void;
}

export interface Banner {
  title: string;
  imageUrl: string;
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

const ChatHistoryMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  parts: z.array(z.object({ text: z.string() })),
});

// Schema for recommendVehiclesViaChatbot flow
export const RecommendVehiclesViaChatbotInputSchema = z.object({
  userInput: z.string().describe('The user input describing their vehicle preferences.'),
  vehicleList: z.string().describe('A list of available vehicles in JSON format. Each item is a string with year, make, model, price, kms driven and fuel type.'),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe('The previous messages in the chat.'),
  vehicleType: z.enum(['4-wheeler', '2-wheeler']).describe("The type of vehicle the user is looking for. This is a crucial piece of information for the recommendation."),
});
export type RecommendVehiclesViaChatbotInput = z.infer<typeof RecommendVehiclesViaChatbotInputSchema>;

const RecommendedVehicleSchema = z.object({
  make: z.string().describe("The make of the recommended vehicle. e.g., 'Maruti Suzuki'"),
  model: z.string().describe("The model of the recommended vehicle. e.g., 'Swift'"),
});

export const RecommendVehiclesViaChatbotOutputSchema = z.object({
  responseType: z.enum(['single', 'list', 'comparison', 'count', 'filter_suggestion', 'general']).describe("The type of response, indicating the user's intent."),
  responseText: z.string().describe("The textual response from the chatbot. This can include the main message, comparison summary, etc."),
  recommendations: z.array(RecommendedVehicleSchema).optional().describe("A list of recommended vehicles. Should be present for 'single', 'list', and 'comparison' types."),
  comparisonTable: z.string().optional().describe("A markdown table comparing the key specifications of two vehicles. Only for 'comparison' type."),
  vehicleCount: z.number().optional().describe("The number of vehicles found for a specific brand. Only for 'count' type."),
  brandToFilter: z.string().optional().describe("The brand name to use for filtering the main list. Only for 'filter_suggestion' and 'count' types."),
});
export type RecommendVehiclesViaChatbotOutput = z.infer<typeof RecommendVehiclesViaChatbotOutputSchema>;
