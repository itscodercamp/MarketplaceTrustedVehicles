// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Generates a condition report for a vehicle based on provided details.
 *
 * - generateVehicleConditionReport - A function that generates the vehicle condition report.
 * - GenerateVehicleConditionReportInput - The input type for the generateVehicleConditionReport function.
 * - GenerateVehicleConditionReportOutput - The return type for the generateVehicleConditionReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVehicleConditionReportInputSchema = z.object({
  vehicleDescription: z
    .string()
    .describe('A detailed description of the vehicle, including make, model, and year.'),
  condition: z.string().describe('The current condition of the vehicle (e.g., excellent, good, fair, poor).'),
  features: z.string().describe('A list of features and options the vehicle has.'),
  images: z
    .string()
    .describe(
      "A photo of the vehicle, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateVehicleConditionReportInput = z.infer<typeof GenerateVehicleConditionReportInputSchema>;

const GenerateVehicleConditionReportOutputSchema = z.object({
  conditionReport: z.string().describe('A comprehensive condition report of the vehicle.'),
});
export type GenerateVehicleConditionReportOutput = z.infer<typeof GenerateVehicleConditionReportOutputSchema>;

export async function generateVehicleConditionReport(
  input: GenerateVehicleConditionReportInput
): Promise<GenerateVehicleConditionReportOutput> {
  return generateVehicleConditionReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVehicleConditionReportPrompt',
  input: {schema: GenerateVehicleConditionReportInputSchema},
  output: {schema: GenerateVehicleConditionReportOutputSchema},
  prompt: `You are an AI expert in vehicle inspections and condition reporting. Analyze the following information about a vehicle and generate a detailed condition report.

Vehicle Description: {{{vehicleDescription}}}
Condition: {{{condition}}}
Features: {{{features}}}
Image: {{media url=images}}

Based on the provided information, create a comprehensive condition report that covers all aspects of the vehicle's condition. The report should be detailed and easy to understand.`,
});

const generateVehicleConditionReportFlow = ai.defineFlow(
  {
    name: 'generateVehicleConditionReportFlow',
    inputSchema: GenerateVehicleConditionReportInputSchema,
    outputSchema: GenerateVehicleConditionReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
