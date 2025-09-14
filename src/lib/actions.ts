"use server";

import { recommendVehiclesViaChatbot as recommendVehiclesFlow, RecommendVehiclesViaChatbotInput } from '@/ai/flows/recommend-vehicles-via-chatbot';

export async function recommendVehiclesViaChatbot(input: RecommendVehiclesViaChatbotInput) {
    try {
        const result = await recommendVehiclesFlow(input);
        return result;
    } catch(e) {
        console.error(e);
        throw new Error("Failed to get recommendation from AI.");
    }
}
