'use server';
/**
 * @fileOverview An AI agent for suggesting replacements for school supply items.
 *
 * - suggestReplacements - A function that suggests replacements for school supply items.
 * - SuggestReplacementsInput - The input type for the suggestReplacements function.
 * - SuggestReplacementsOutput - The return type for the suggestReplacements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestReplacementsInputSchema = z.object({
  unavailableItems: z.array(
    z.object({
      itemName: z.string().describe('The name of the unavailable item.'),
      quantity: z.number().describe('The quantity of the unavailable item requested.'),
    })
  ).describe('A list of unavailable school supply items.'),
  availableItems: z.array(
    z.object({
      itemName: z.string().describe('The name of the available item (material).'),
      unitPrice: z.number().describe('The unit cost of the available item.'),
      stock: z.number().describe('The stock quantity of the available item. Assumed to be available.'),
    })
  ).describe('A list of currently available school supply items with prices.'),
  budget: z.number().describe('The total budget for the school supplies.'),
});
export type SuggestReplacementsInput = z.infer<typeof SuggestReplacementsInputSchema>;

const SuggestReplacementsOutputSchema = z.array(
  z.object({
    originalItem: z.string().describe('The name of the original unavailable item.'),
    replacementItem: z.string().describe('The suggested replacement item.'),
    reason: z.string().describe('The reason for suggesting this replacement.'),
  })
);
export type SuggestReplacementsOutput = z.infer<typeof SuggestReplacementsOutputSchema>;

export async function suggestReplacements(input: SuggestReplacementsInput): Promise<SuggestReplacementsOutput> {
  return suggestReplacementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestReplacementsPrompt',
  input: {schema: SuggestReplacementsInputSchema},
  output: {schema: SuggestReplacementsOutputSchema},
  prompt: `You are a helpful assistant that suggests replacement items for unavailable school supplies.

You will receive a list of unavailable items, a list of available items, and the total budget.

Suggest replacement items from the available items list for each unavailable item, considering the budget and quantity requested.
Explain the reason for each replacement suggestion.

Unavailable Items:
{{#each unavailableItems}}
- {{quantity}} x {{itemName}}
{{/each}}

Available Items:
{{#each availableItems}}
- {{itemName}} (Price: {{unitPrice}})
{{/each}}

Total Budget: {{budget}}

Provide the suggestions in JSON format.
`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const suggestReplacementsFlow = ai.defineFlow(
  {
    name: 'suggestReplacementsFlow',
    inputSchema: SuggestReplacementsInputSchema,
    outputSchema: SuggestReplacementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
