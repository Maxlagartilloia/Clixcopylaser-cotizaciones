'use server';

import { normalizeItemDescription as normalizeFlow } from '@/ai/flows/normalize-item-descriptions';
import { suggestReplacements as replacementsFlow } from '@/ai/flows/ai-suggested-replacements';
import { mockCatalog } from '@/lib/data';
import type { MatchedItem, ParsedItem, SuggestedReplacement, SuggestReplacementsInput } from '@/lib/types';
import { db } from '@/lib/firebase-admin';
import crypto from 'crypto';


async function generateImageHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

// Simulate parsing a file
export async function parseList(file: File): Promise<ParsedItem[]> {
  console.log(`Parsing file: ${file.name}`);

  // Caching for images
  if (file.type.startsWith('image/')) {
    const imageHash = await generateImageHash(file);
    const cacheRef = db.collection('imageCache').doc(imageHash);
    const cacheDoc = await cacheRef.get();

    if (cacheDoc.exists) {
      console.log('Cache hit! Returning cached result for image.');
      const data = cacheDoc.data();
      if(data) {
        // Ensure createdAt is a serializable format if needed, but for returning it's fine
        return data.result as ParsedItem[];
      }
    } 
    
    console.log('Cache miss. Processing image with AI.');
    // In a real app, this would use OCR/parsing logic.
    // Here we return mock data.
    await new Promise(resolve => setTimeout(resolve, 1500));
    const result: ParsedItem[] = [
      { id: '1', raw: '2 cuadernos 100 hojas líneas', quantity: 2, description: 'cuadernos 100 hojas líneas' },
      { id: '2', raw: '1 Lápiz HB', quantity: 1, description: 'Lápiz HB' },
      { id: '3', raw: '1 borrador de queso', quantity: 1, description: 'borrador' },
      { id: '4', raw: '1 sacapuntas', quantity: 1, description: 'sacapuntas' },
      { id: '5', raw: '1 marcador permanente negro', quantity: 1, description: 'marcador permanente negro' },
    ];
    
    // Save result to cache
    await cacheRef.set({ result, createdAt: new Date() });
    console.log('Result saved to cache.');
    return result;
  }

  // Fallback for non-image files or if caching is not applicable
  console.log('Processing non-image file.');
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
