'use server';

import { recommendVehiclesViaChatbot as recommendVehiclesFlow } from '@/ai/flows/recommend-vehicles-via-chatbot';
import type { RecommendVehiclesViaChatbotInput, RecommendVehiclesViaChatbotOutput, VehicleType } from '@/lib/types';
import { vehicles } from './data';
import type { Vehicle } from './types';

// Augment the output type to include the full vehicle objects
export type RecommendVehiclesViaChatbotActionOutput = Omit<RecommendVehiclesViaChatbotOutput, 'recommendations'> & {
    recommendedVehicles?: Vehicle[];
}

// Extend the input to include vehicleType
export type RecommendVehiclesActionInput = RecommendVehiclesViaChatbotInput & {
    vehicleType: VehicleType;
}

export async function recommendVehiclesViaChatbot(input: RecommendVehiclesActionInput): Promise<RecommendVehiclesViaChatbotActionOutput> {
    try {
        const result = await recommendVehiclesFlow(input);
        
        let recommendedVehicles: Vehicle[] = [];

        if (result.recommendations && result.recommendations.length > 0) {
            // Filter vehicles by the selected type BEFORE matching recommendations
            const availableVehicles = vehicles.filter(v => v.vehicleType === input.vehicleType);
            
            recommendedVehicles = result.recommendations.map(rec => {
                return availableVehicles.find(vehicle => 
                    vehicle.make.toLowerCase() === rec.make.toLowerCase() &&
                    vehicle.model.toLowerCase() === rec.model.toLowerCase()
                );
            }).filter((v): v is Vehicle => !!v); // Filter out any undefined results
        }
        
        const { recommendations, ...rest } = result;

        return { ...rest, recommendedVehicles };

    } catch(e) {
        console.error(e);
        throw new Error("Failed to get recommendation from AI.");
    }
}
