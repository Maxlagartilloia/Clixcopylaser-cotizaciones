
'use server';

import { suggestReplacements as replacementsFlow } from '@/ai/flows/ai-suggested-replacements';
import { getDb } from '@/lib/firebase-admin';
import type { CatalogItem, MatchedItem, ParsedItem, SuggestedReplacement, SuggestReplacementsInput } from '@/lib/types';
import crypto from 'crypto';
import { matchProducto } from '@/lib/normalizar';


async function generateImageHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

// Simulate parsing a file
export async function parseList(file: File): Promise<ParsedItem[]> {
  console.log(`Parsing file: ${file.name}`);
  const db = getDb();

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


// Fetch catalog from firestore
async function getCatalog(): Promise<CatalogItem[]> {
  const db = getDb();
  const productsSnapshot = await db.collection('products').get();
  if (productsSnapshot.empty) {
    console.log('No products found in Firestore.');
    return [];
  }
  const catalog: CatalogItem[] = [];
  productsSnapshot.forEach(doc => {
    catalog.push(doc.data() as CatalogItem);
  });
  return catalog;
}


// Normalize and match items
export async function processItems(items: ParsedItem[]): Promise<MatchedItem[]> {
  const catalog = await getCatalog();
  if (catalog.length === 0) {
    // If catalog is empty, mark all as not found
    return items.map(item => ({ ...item, status: 'not_found' }));
  }

  const processedItems: MatchedItem[] = await Promise.all(
    items.map(async (item) => {
      try {
        const match = matchProducto(item.description);
        
        if (match) {
          const normalizedDescription = match.canonico;
          // Match against catalog using the canonical name
          const catalogItem = catalog.find(ci => ci.material.toLowerCase().includes(normalizedDescription.toLowerCase()));

          if (catalogItem) {
            return {
              ...item,
              normalizedDescription: normalizedDescription,
              status: 'found',
              catalogItem: catalogItem,
            };
          } else {
            return { ...item, normalizedDescription: normalizedDescription, status: 'not_found' };
          }
        } else {
           return { ...item, status: 'not_found' };
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
  
  const catalog = await getCatalog();

  const input: SuggestReplacementsInput = {
    unavailableItems: unavailableItems.map(item => ({
      itemName: item.normalizedDescription || item.description,
      quantity: item.quantity,
    })),
    availableItems: catalog.map(item => ({
        itemName: item.material,
        unitPrice: item.costoUnitario,
        stock: 999 // Representing as in-stock
    })),
    budget: 100, // A mock budget for reasoning
  };

  try {
    const suggestions = await replacementsFlow(input);
    return suggestions;
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    // Return a mock suggestion on error for demo purposes
    if (catalog.length > 0) {
        return [{
          originalItem: unavailableItems[0].description,
          replacementItem: catalog[0]?.material || 'No replacement found',
          reason: "El modelo AI no pudo generar una sugerencia, esta es una alternativa de respaldo."
        }];
    }
    return [];
  }
}

// Upload catalog from CSV
export async function uploadCatalog(file: File): Promise<{success: boolean, message: string, count: number}> {
    if (!file || file.type !== 'text/csv') {
        return { success: false, message: 'Por favor, selecciona un archivo CSV válido.', count: 0 };
    }

    try {
        const fileContent = await file.text();
        const rows = fileContent.split('\n').filter(row => row.trim() !== '');
        
        const headerLine = rows.shift()?.trim();
        if (!headerLine) {
            return { success: false, message: 'El archivo CSV está vacío o no tiene cabecera.', count: 0 };
        }
        
        const headers = headerLine.split(',').map(h => h.trim().toUpperCase());
        
        const requiredHeaders = ['ID', 'MATERIAL', 'UNIDAD', 'COSTO UNITARIO', 'MARCA'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

        if (missingHeaders.length > 0) {
             return { success: false, message: `Faltan las siguientes cabeceras en el CSV: ${missingHeaders.join(', ')}`, count: 0 };
        }

        const idIndex = headers.indexOf('ID');
        const materialIndex = headers.indexOf('MATERIAL');
        const unidadIndex = headers.indexOf('UNIDAD');
        const costoIndex = headers.indexOf('COSTO UNITARIO');
        const marcaIndex = headers.indexOf('MARCA');

        const products: CatalogItem[] = rows.map(row => {
            const values = row.trim().split(',');
            const costString = values[costoIndex]?.replace(/[^0-9,.]/g, '').replace(',', '.') || '0';
            
            return {
                id: values[idIndex],
                material: values[materialIndex],
                unidad: values[unidadIndex],
                costoUnitario: parseFloat(costString),
                marca: values[marcaIndex],
            };
        }).filter(p => p.id && p.material); // Filter out empty rows

        if (products.length === 0) {
            return { success: false, message: 'No se encontraron productos válidos en el archivo.', count: 0 };
        }

        const db = getDb();
        const batch = db.batch();

        products.forEach(product => {
            const docRef = db.collection('products').doc(product.id);
            batch.set(docRef, product);
        });

        await batch.commit();

        return { success: true, message: 'Catálogo subido exitosamente.', count: products.length };
    } catch(error) {
        console.error("Error al subir el catálogo:", error);
        const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido.';
        return { success: false, message: `Error al procesar el archivo: ${errorMessage}`, count: 0 };
    }
}
