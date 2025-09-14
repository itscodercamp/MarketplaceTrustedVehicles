'use server';

import { recommendVehiclesViaChatbot as recommendVehiclesFlow } from '@/ai/flows/recommend-vehicles-via-chatbot';
import type { RecommendVehiclesViaChatbotInput, RecommendVehiclesViaChatbotOutput } from '@/lib/types';
import { vehicles } from './data';
import type { Vehicle } from './types';

export async function recommendVehiclesViaChatbot(input: RecommendVehiclesViaChatbotInput): Promise<RecommendVehiclesViaChatbotOutput & { recommendedVehicle?: Vehicle }> {
    try {
        const result = await recommendVehiclesFlow(input);
        
        // Find a matching vehicle from the list based on the AI's recommendation text
        const recommendedVehicle = vehicles.find(vehicle => 
            result.recommendation.toLowerCase().includes(vehicle.make.toLowerCase()) &&
            result.recommendation.toLowerCase().includes(vehicle.model.toLowerCase())
        );

        return { ...result, recommendedVehicle };

    } catch(e) {
        console.error(e);
        throw new Error("Failed to get recommendation from AI.");
    }
}
