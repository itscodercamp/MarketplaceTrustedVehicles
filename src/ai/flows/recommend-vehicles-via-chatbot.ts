'use server';
/**
 * @fileOverview This file defines a Genkit flow for an AI-powered vehicle recommendation chatbot.
 *
 * The chatbot recommends vehicles based on user preferences such as make, model, price, performance, and family needs.
 * The AI adapts its tone to match the user's language (Hindi, Marathi, Urdu, English) while using English alphabets.
 *
 * - recommendVehiclesViaChatbot - A function that handles the vehicle recommendation process.
 * - RecommendVehiclesViaChatbotInput - The input type for the recommendVehiclesViaChatbot function.
 * - RecommendVehiclesViaChatbotOutput - The return type for the recommendVehiclesViaChatbot function.
 */

import {ai} from '@/ai/genkit';
import { RecommendVehiclesViaChatbotInputSchema, RecommendVehiclesViaChatbotOutputSchema } from '@/lib/types';
import type { RecommendVehiclesViaChatbotInput, RecommendVehiclesViaChatbotOutput } from '@/lib/types';


export async function recommendVehiclesViaChatbot(
  input: RecommendVehiclesViaChatbotInput
): Promise<RecommendVehiclesViaChatbotOutput> {
  return recommendVehiclesViaChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendVehiclesViaChatbotPrompt',
  input: {schema: RecommendVehiclesViaChatbotInputSchema},
  output: {schema: RecommendVehiclesViaChatbotOutputSchema},
  prompt: `You are a helpful and friendly AI-powered vehicle recommendation chatbot for a marketplace called 'Trusted Vehicles'. You are helping a user find a vehicle from a list of available vehicles.

Your goal is to understand the user's needs and recommend the best vehicle from the provided list. Be conversational.

The user may be speaking in Hindi, Marathi, Urdu, or English, but using the English alphabet. You should adapt your tone to match the user's language while responding in the same language (using English alphabet).

When you recommend a specific vehicle, make sure you mention its exact make and model as it appears in the list. This is very important so the system can show it to the user. Also, briefly mention its key specs like kms driven and fuel type.

Available Vehicles: {{{vehicleList}}}

User Input: {{{userInput}}}
Language: {{{language}}}`,
});

const recommendVehiclesViaChatbotFlow = ai.defineFlow(
  {
    name: 'recommendVehiclesViaChatbotFlow',
    inputSchema: RecommendVehiclesViaChatbotInputSchema,
    outputSchema: RecommendVehiclesViaChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
