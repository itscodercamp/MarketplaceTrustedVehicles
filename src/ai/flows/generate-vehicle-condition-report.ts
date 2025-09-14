'use server';

/**
 * @fileOverview Generates a condition report for a vehicle based on provided details and images.
 *
 * - generateVehicleConditionReport - A function that generates the vehicle condition report.
 * - GenerateVehicleConditionReportInput - The input type for the generateVehicleConditionReport function.
 * - GenerateVehicleConditionReportOutput - The return type for the generateVehicleConditionReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

export async function generateVehicleConditionReport(
  input: GenerateVehicleConditionReportInput
): Promise<GenerateVehicleConditionReportOutput> {
  return generateVehicleConditionReportFlow(input);
}

const reportPrompt = ai.definePrompt({
  name: 'vehicleConditionReportPrompt',
  input: {schema: GenerateVehicleConditionReportInputSchema},
  output: {schema: GenerateVehicleConditionReportOutputSchema},
  prompt: `You are an AI expert in vehicle inspections and condition reporting. Analyze the following information and images to generate a detailed condition report.

The user has provided the following details:
- Vehicle: {{{vehicleDescription}}}
- Stated Condition: {{{condition}}}
- Key Features: {{{features}}}

The user has provided the following images:
{{#each images}}
- {{media url=this}}
{{/each}}

Generate a comprehensive condition report in Markdown format. Structure the report based on the following 70-point checklist. For each category and item, analyze the provided images and information. If the images provide a clear view of an item, comment on its condition. If an item is not visible or clear in the photos, state that it could not be assessed.

**Vehicle Condition Report**

**1. Exterior Angles**
    - Front view (daylight)
    - Rear view
    - Left side profile
    - Right side profile
    - Front-left 45° angle
    - Front-right 45° angle
    - Rear-left 45° angle
    - Rear-right 45° angle
    - Top-down view
    - Underbody view

**2. Close-ups of Body**
    - Front grille
    - Headlights (both sides)
    - Fog lamps
    - Tail lights
    - Indicators
    - Bonnet
    - Boot
    - Windshield (front)
    - Rear windshield
    - Wipers

**3. Tyres & Wheels**
    - Front-left tyre
    - Front-right tyre
    - Rear-left tyre
    - Rear-right tyre
    - Spare tyre
    - Alloy wheels
    - Tyre tread close-up
    - Wheel arches
    - Brake calipers
    - Mud flaps

**4. Pillars & Roof**
    - A-pillar (driver side)
    - B-pillar (both sides)
    - C-pillar (rear side)
    - Roof (sunroof if any)
    - Roof rails
    - Antenna

**5. Interior – Cabin**
    - Dashboard full view
    - Instrument cluster (speedometer, odometer)
    - Steering wheel
    - Center console
    - Gear lever
    - AC vents
    - Infotainment system
    - Driver seat
    - Passenger seat
    - Rear seats

**6. Interior – Details**
    - Seat upholstery close-up
    - Door panels (all 4)
    - Power window controls
    - Interior roof lining
    - Cabin lights
    - Glove box
    - Cup holders
    - Floor mats
    - Pedals (accelerator, brake, clutch)
    - Rear AC vents

**7. Engine & Boot**
    - Engine bay (full view)
    - Battery close-up
    - Fluid reservoirs (coolant, brake, etc.)
    - Air filter box
    - Boot space (empty)
    - Boot with luggage
    - Tool kit
    - Jack & accessories

**8. Documents & Extras**
    - RC card/photo
    - Insurance paper
    - Service history file
    - Owner’s manual
    - Extra key
    - Any accessories (camera, dashcam, seat covers)

Provide a final summary of the vehicle's overall condition based on your analysis.
`,
});

const generateVehicleConditionReportFlow = ai.defineFlow(
  {
    name: 'generateVehicleConditionReportFlow',
    inputSchema: GenerateVehicleConditionReportInputSchema,
    outputSchema: GenerateVehicleConditionReportOutputSchema,
  },
  async input => {
    const {output} = await reportPrompt(input);
    return { report: output!.report };
  }
);
