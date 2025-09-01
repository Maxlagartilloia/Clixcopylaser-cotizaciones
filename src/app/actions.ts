'use server';

import { normalizeItemDescription as normalizeFlow } from '@/ai/flows/normalize-item-descriptions';
import { suggestReplacements as replacementsFlow } from '@/ai/flows/ai-suggested-replacements';
import { mockCatalog } from '@/lib/data';
import type { MatchedItem, ParsedItem, SuggestedReplacement, SuggestReplacementsInput } from '@/lib/types';

// Simulate parsing a file
export async function parseList(fileName: string): Promise<ParsedItem[]> {
  console.log(`Parsing file: ${fileName}`);
  // In a real app, this would use OCR/parsing logic.
  // Here we return mock data.
  await new Promise(resolve => setTimeout(resolve, 1500));
  return [
    { id: '1', raw: '2 cuadernos 100 hojas líneas', quantity: 2, description: 'cuadernos 100 hojas líneas' },
    { id: '2', raw: '1 Lápiz HB', quantity: 1, description: 'Lápiz HB' },
    { id: '3', raw: '1 borrador de queso', quantity: 1, description: 'borrador' },
    { id: '4', raw: '1 sacapuntas', quantity: 1, description: 'sacapuntas' },
    { id: '5', raw: '1 marcador permanente negro', quantity: 1, description: 'marcador permanente negro' },
  ];
}


// Normalize and match items
export async function processItems(items: ParsedItem[]): Promise<MatchedItem[]> {
  const processedItems: MatchedItem[] = await Promise.all(
    items.map(async (item) => {
      try {
        const { normalizedItemDescription } = await normalizeFlow({ itemDescription: item.description });
        
        // Match against catalog
        const catalogItem = mockCatalog.find(ci => ci.name.includes(normalizedItemDescription));

        if (catalogItem) {
          const status = catalogItem.stock === 0 ? 'not_found' : catalogItem.stock < item.quantity ? 'low_stock' : 'found';
          return {
            ...item,
            normalizedDescription: normalizedItemDescription,
            status: status,
            catalogItem: catalogItem,
          };
        } else {
          return { ...item, normalizedDescription: normalizedItemDescription, status: 'not_found' };
        }
      } catch (error) {
        console.error('Error processing item:', item.description, error);
        return { ...item, status: 'not_found' };
      }
    })
  );
  return processedItems;
}

// Get AI suggestions for replacements
export async function getSuggestions(unavailableItems: MatchedItem[]): Promise<SuggestedReplacement[]> {
  if(unavailableItems.length === 0) {
    return [];
  }

  const input: SuggestReplacementsInput = {
    unavailableItems: unavailableItems.map(item => ({
      itemName: item.normalizedDescription || item.description,
      quantity: item.quantity,
    })),
    availableItems: mockCatalog.filter(item => item.stock > 0).map(item => ({
        itemName: item.name,
        unitPrice: item.unitPrice,
        stock: item.stock
    })),
    budget: 100, // A mock budget for reasoning
  };

  try {
    const suggestions = await replacementsFlow(input);
    return suggestions;
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    // Return a mock suggestion on error for demo purposes
    return [{
      originalItem: unavailableItems[0].description,
      replacementItem: mockCatalog.find(i => i.stock > 0)?.name || 'No replacement found',
      reason: "El modelo AI no pudo generar una sugerencia, esta es una alternativa de respaldo."
    }];
  }
}
