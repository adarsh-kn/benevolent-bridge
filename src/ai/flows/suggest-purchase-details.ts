// src/ai/flows/suggest-purchase-details.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting purchase details to recipients.
 *
 * The flow takes a donation description as input and returns suggested purchase details.
 * This helps recipients quickly and easily report how the donation funds were used.
 *
 * @exports {suggestPurchaseDetails} - The main function to trigger the flow.
 * @exports {SuggestPurchaseDetailsInput} - The input type for the suggestPurchaseDetails function.
 * @exports {SuggestPurchaseDetailsOutput} - The output type for the suggestPurchaseDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const SuggestPurchaseDetailsInputSchema = z.object({
  donationDescription: z
    .string()
    .describe('A description of the donation and its intended purpose.'),
});
export type SuggestPurchaseDetailsInput = z.infer<
  typeof SuggestPurchaseDetailsInputSchema
>;

// Define the output schema
const SuggestPurchaseDetailsOutputSchema = z.object({
  suggestedDetails: z
    .string()
    .describe(
      'Suggested details of purchases made with the donation, formatted as a concise summary.'
    ),
});
export type SuggestPurchaseDetailsOutput = z.infer<
  typeof SuggestPurchaseDetailsOutputSchema
>;

// Define the main function to trigger the flow
export async function suggestPurchaseDetails(
  input: SuggestPurchaseDetailsInput
): Promise<SuggestPurchaseDetailsOutput> {
  return suggestPurchaseDetailsFlow(input);
}

// Define the prompt
const suggestPurchaseDetailsPrompt = ai.definePrompt({
  name: 'suggestPurchaseDetailsPrompt',
  input: {schema: SuggestPurchaseDetailsInputSchema},
  output: {schema: SuggestPurchaseDetailsOutputSchema},
  prompt: `You are an AI assistant helping recipients of donations to quickly report how the funds were used. Based on the description of the donation and its intended purpose, suggest specific details of purchases that could have been made.

Donation Description: {{{donationDescription}}}

Suggested Purchase Details:`, // Use Handlebars templating
});

// Define the flow
const suggestPurchaseDetailsFlow = ai.defineFlow(
  {
    name: 'suggestPurchaseDetailsFlow',
    inputSchema: SuggestPurchaseDetailsInputSchema,
    outputSchema: SuggestPurchaseDetailsOutputSchema,
  },
  async input => {
    const {output} = await suggestPurchaseDetailsPrompt(input);
    return output!;
  }
);
