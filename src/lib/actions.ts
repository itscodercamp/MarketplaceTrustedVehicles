'use server';

import { recommendVehiclesViaChatbot as recommendVehiclesFlow } from '@/ai/flows/recommend-vehicles-via-chatbot';
import type { RecommendVehiclesViaChatbotInput, RecommendVehiclesViaChatbotOutput, VehicleType } from '@/lib/types';
import { vehicles } from './data';
import type { Vehicle } from './types';

// Augment the output type to include the full vehicle objects
export type RecommendVehiclesViaChatbotActionOutput = Omit<RecommendVehiclesViaChatbotOutput, 'recommendations'> & {
    recommendedVehicles?: Vehicle[];
}

export async function recommendVehiclesViaChatbot(input: RecommendVehiclesViaChatbotInput): Promise<RecommendVehiclesViaChatbotActionOutput> {
    try {
        const result = await recommendVehiclesFlow(input);
        
        let recommendedVehicles: Vehicle[] = [];

        if (result.recommendations && result.recommendations.length > 0) {
            // The AI will return recommendations. We need to find the full vehicle object.
            const availableVehicles = vehicles.filter(v => v.vehicleType === input.vehicleType);
            
            recommendedVehicles = result.recommendations.map(rec => {
                // Find the vehicle in our data that matches the AI's recommendation
                return availableVehicles.find(vehicle => 
                    vehicle.make.toLowerCase() === rec.make.toLowerCase() &&
                    vehicle.model.toLowerCase() === rec.model.toLowerCase()
                );
            }).filter((v): v is Vehicle => !!v); // Filter out any undefined results
        }
        
        // Exclude the raw recommendations from the final result, since we've processed them
        const { recommendations, ...rest } = result;

        // Return the AI's response text, plus our processed list of full vehicle objects
        return { ...rest, recommendedVehicles };

    } catch(e) {
        console.error(e);
        // We can throw a more specific error to be handled by the UI
        throw new Error("An error occurred while fetching recommendations from the AI.");
    }
}
