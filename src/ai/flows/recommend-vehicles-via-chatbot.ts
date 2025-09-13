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
import {z} from 'genkit';

const RecommendVehiclesViaChatbotInputSchema = z.object({
  userInput: z.string().describe('The user input describing their vehicle preferences.'),
  language: z
    .string()
    .describe(
      'The language the user is speaking in (Hindi, Marathi, Urdu, English), but using English alphabet.'
    ),
  vehicleList: z.string().describe('A list of available vehicles in JSON format.'),
});
export type RecommendVehiclesViaChatbotInput = z.infer<typeof RecommendVehiclesViaChatbotInputSchema>;

const RecommendVehiclesViaChatbotOutputSchema = z.object({
  recommendation: z.string().describe('The vehicle recommendation from the chatbot.'),
});
export type RecommendVehiclesViaChatbotOutput = z.infer<typeof RecommendVehiclesViaChatbotOutputSchema>;

export async function recommendVehiclesViaChatbot(
  input: RecommendVehiclesViaChatbotInput
): Promise<RecommendVehiclesViaChatbotOutput> {
  return recommendVehiclesViaChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendVehiclesViaChatbotPrompt',
  input: {schema: RecommendVehiclesViaChatbotInputSchema},
  output: {schema: RecommendVehiclesViaChatbotOutputSchema},
  prompt: `You are a helpful AI-powered vehicle recommendation chatbot. You are helping a user find a vehicle from a list of available vehicles.

The user will provide their preferences, and you should recommend a vehicle that matches their needs.
The user may be speaking in Hindi, Marathi, Urdu, or English, but using English alphabet. You should adapt your tone to match the user's language while responding using English alphabet.

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
