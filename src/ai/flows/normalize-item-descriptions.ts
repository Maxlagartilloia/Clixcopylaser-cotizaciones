'use server';

/**
 * @fileOverview Normalizes item descriptions using synonym matching to standardize descriptions.
 *
 * - normalizeItemDescription - A function that normalizes a single item description.
 * - NormalizeItemDescriptionInput - The input type for the normalizeItemDescription function.
 * - NormalizeItemDescriptionOutput - The return type for the normalizeItemDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NormalizeItemDescriptionInputSchema = z.object({
  itemDescription: z
    .string()
    .describe('The item description to normalize, e.g., \'cuaderno 100 hojas líneas\'.'),
});
export type NormalizeItemDescriptionInput = z.infer<
  typeof NormalizeItemDescriptionInputSchema
>;

const NormalizeItemDescriptionOutputSchema = z.object({
  normalizedItemDescription: z
    .string()
    .describe(
      'The normalized item description, e.g., \'cuaderno 100h rayado\'.'
    ),
});
export type NormalizeItemDescriptionOutput = z.infer<
  typeof NormalizeItemDescriptionOutputSchema
>;

export async function normalizeItemDescription(
  input: NormalizeItemDescriptionInput
): Promise<NormalizeItemDescriptionOutput> {
  return normalizeItemDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'normalizeItemDescriptionPrompt',
  input: {schema: NormalizeItemDescriptionInputSchema},
  output: {schema: NormalizeItemDescriptionOutputSchema},
  prompt: `You are an expert in normalizing product descriptions for school supplies.

You will be given an item description, and you will normalize it using synonym matching to standardize the description.

Here is the item description:
{{itemDescription}}

Consider these synonyms when normalizing descriptions:
- "hojas": "h"
- "líneas": "rayado"
- "cuaderno": "cuaderno"

Return the normalized item description.
`, // Shorten prompt to use less tokens
});

const normalizeItemDescriptionFlow = ai.defineFlow(
  {
    name: 'normalizeItemDescriptionFlow',
    inputSchema: NormalizeItemDescriptionInputSchema,
    outputSchema: NormalizeItemDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
