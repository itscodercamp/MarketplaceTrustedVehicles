'use server';

import { recommendVehiclesViaChatbot as recommendVehiclesFlow } from '@/ai/flows/recommend-vehicles-via-chatbot';
import type { RecommendVehiclesViaChatbotInput, RecommendVehiclesViaChatbotOutput } from '@/lib/types';
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
            recommendedVehicles = result.recommendations.map(rec => {
                return vehicles.find(vehicle => 
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
