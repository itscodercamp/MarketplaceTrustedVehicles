"use server";

import { recommendVehiclesViaChatbot as recommendVehiclesFlow, RecommendVehiclesViaChatbotInput } from '@/ai/flows/recommend-vehicles-via-chatbot';
import { generateVehicleConditionReport as generateReportFlow, GenerateVehicleConditionReportInput } from '@/ai/flows/generate-vehicle-condition-report';

export async function recommendVehiclesViaChatbot(input: RecommendVehiclesViaChatbotInput) {
    try {
        const result = await recommendVehiclesFlow(input);
        return result;
    } catch(e) {
        console.error(e);
        throw new Error("Failed to get recommendation from AI.");
    }
}

export async function generateVehicleConditionReport(input: GenerateVehicleConditionReportInput) {
    try {
        const result = await generateReportFlow(input);
        return result;
    } catch(e) {
        console.error(e);
        throw new Error("Failed to generate condition report.");
    }
}
