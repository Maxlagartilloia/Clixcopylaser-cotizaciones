'use server';

import { suggestReplacements as replacementsFlow } from '@/ai/flows/ai-suggested-replacements';
import { getDb } from '@/lib/firebase-admin';
import type { AppSettings, CatalogItem, MatchedItem, ParsedItem, SuggestedReplacement, SuggestReplacementsInput, Synonym } from '@/lib/types';
import crypto from 'crypto';
import { matchProducto } from '@/lib/normalizar';


async function generateImageHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export async function parseList(file: File): Promise<ParsedItem[]> {
  console.log(`Parsing file: ${file.name} of type ${file.type}`);

  if (file.type.startsWith('image/')) {
    const db = getDb();
    const imageHash = await generateImageHash(file);
    const cacheRef = db.collection('imageCache').doc(imageHash);
    const cacheDoc = await cacheRef.get();

    if (cacheDoc.exists) {
      console.log('Cache hit! Returning cached result for image.');
      const data = cacheDoc.data();
      if(data) {
        return data.result as ParsedItem[];
      }
    } 
    
    console.log('Cache miss. Processing image with AI.');
    // Mock processing for image
    await new Promise(resolve => setTimeout(resolve, 1500));
    const result: ParsedItem[] = [
      { id: '1', raw: '2 cuadernos 100 hojas líneas', quantity: 2, description: 'cuadernos 100 hojas líneas' },
      { id: '2', raw: '1 Lápiz HB', quantity: 1, description: 'Lápiz HB' },
      { id: '3', raw: '1 borrador de queso', quantity: 1, description: 'borrador' },
      { id: '4', raw: '1 sacapuntas', quantity: 1, description: 'sacapuntas' },
      { id: '5', raw: '1 marcador permanente negro', quantity: 1, description: 'marcador permanente negro' },
    ];
    
    await cacheRef.set({ result, createdAt: new Date() });
    console.log('Result saved to cache.');
    return result;
  }
  
  // This part is for the example button, not for CSV.
  if (file.size === 0 && file.name === "lista_ejemplo.txt") {
      console.log('Using example data.');
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        { id: '1', raw: '2 cuadernos 100 hojas líneas', quantity: 2, description: 'cuadernos 100 hojas líneas' },
        { id: '2', raw: '1 Lápiz HB', quantity: 1, description: 'Lápiz HB' },
        { id: '3', raw: '1 borrador de queso', quantity: 1, description: 'borrador' },
        { id: '4', raw: '1 sacapuntas', quantity: 1, description: 'sacapuntas' },
        { id: '5', raw: '1 marcador permanente negro', quantity: 1, description: 'marcador permanente negro' },
      ];
  }

  // If a CSV is passed here by mistake, return empty. It's handled by uploadCatalog.
  if (file.type === 'text/csv') {
      console.log('CSV file passed to parseList, ignoring.');
      return [];
  }
  
  // Fallback for other file types or errors
  console.log('Unsupported file type for parsing, returning empty array.');
  return [];
}


// Fetch catalog from firestore
export async function getCatalog(): Promise<CatalogItem[]> {
  const db = getDb();
  const productsSnapshot = await db.collection('products').orderBy('material').get();
  if (productsSnapshot.empty) {
    console.log('No products found in Firestore.');
    return [];
  }
  const catalog: CatalogItem[] = [];
  productsSnapshot.forEach(doc => {
    const data = doc.data();
    catalog.push({
        id: doc.id,
        material: data.material,
        marca: data.marca,
        unidad: data.unidad,
        costoUnitario: data.costoUnitario,
    });
  });
  return catalog;
}

// Add a new product to firestore
export async function addProduct(id: string, product: Omit<CatalogItem, 'id'>) {
    const db = getDb();
    const docRef = db.collection('products').doc(id);
    await docRef.set(product);
}

// Update an existing product
export async function updateProduct(id: string, product: Omit<CatalogItem, 'id'>) {
    const db = getDb();
    const docRef = db.collection('products').doc(id);
    await docRef.update(product);
}


// Delete a product from firestore
export async function deleteProduct(id: string) {
    const db = getDb();
    await db.collection('products').doc(id).delete();
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
    
    console.log("Processing CSV file upload...");

    try {
        const fileContent = await file.text();
        const rows = fileContent.split('\n').filter(row => row.trim() !== '');
        
        const headerLine = rows.shift()?.trim();
        if (!headerLine) {
            return { success: false, message: 'El archivo CSV está vacío o no tiene cabecera.', count: 0 };
        }

        // Detect delimiter
        const delimiter = headerLine.includes(';') ? ';' : ',';
        
        const fileHeaders = headerLine.split(delimiter).map(h => h.trim().toUpperCase().replace(/\s+/g, ''));
        
        const requiredHeadersMap = {
            'ID': 'ID',
            'MATERIAL': 'MATERIAL',
            'UNIDAD': 'UNIDAD',
            'COSTOUNITARIO': 'COSTO UNITARIO',
            'MARCA': 'MARCA',
        };
        const requiredHeaderKeys = Object.keys(requiredHeadersMap);

        const missingHeaders = requiredHeaderKeys.filter(rh => !fileHeaders.includes(rh));

        if (missingHeaders.length > 0) {
            const originalMissing = missingHeaders.map(mh => requiredHeadersMap[mh as keyof typeof requiredHeadersMap]);
            return { success: false, message: `Faltan las siguientes cabeceras en el CSV: ${originalMissing.join(', ')}`, count: 0 };
        }

        const idIndex = fileHeaders.indexOf('ID');
        const materialIndex = fileHeaders.indexOf('MATERIAL');
        const unidadIndex = fileHeaders.indexOf('UNIDAD');
        const costoIndex = fileHeaders.indexOf('COSTOUNITARIO');
        const marcaIndex = fileHeaders.indexOf('MARCA');

        const products: CatalogItem[] = rows.map(row => {
            const values = row.trim().split(delimiter);
            const costString = values[costoIndex]?.replace(/[^0-9,.]/g, '').replace(',', '.') || '0';
            
            return {
                id: values[idIndex],
                material: values[materialIndex],
                unidad: values[unidadIndex],
                costoUnitario: parseFloat(costString),
                marca: values[marcaIndex],
            };
        }).filter(p => p.id && p.material);

        if (products.length === 0) {
            return { success: false, message: 'No se encontraron productos válidos en el archivo.', count: 0 };
        }

        const db = getDb();
        const batch = db.batch();

        products.forEach(product => {
            const docRef = db.collection('products').doc(product.id);
            batch.set(docRef, {
                material: product.material,
                unidad: product.unidad,
                costoUnitario: product.costoUnitario,
                marca: product.marca,
            });
        });

        await batch.commit();

        return { success: true, message: 'Catálogo subido exitosamente.', count: products.length };
    } catch(error) {
        console.error("Error al subir el catálogo:", error);
        const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido.';
        return { success: false, message: `Error al procesar el archivo: ${errorMessage}`, count: 0 };
    }
}

// ---- SYNONYM ACTIONS ----
export async function getSynonyms(): Promise<Synonym[]> {
    const db = getDb();
    const snapshot = await db.collection('synonyms').orderBy('term').get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Synonym));
}

export async function addSynonym(synonym: Omit<Synonym, 'id'>): Promise<string> {
    const db = getDb();
    const docRef = await db.collection('synonyms').add(synonym);
    return docRef.id;
}

export async function updateSynonym(id: string, synonym: Omit<Synonym, 'id'>) {
    const db = getDb();
    await db.collection('synonyms').doc(id).update(synonym);
}

export async function deleteSynonym(id: string) {
    const db = getDb();
    await db.collection('synonyms').doc(id).delete();
}


// ---- SETTINGS ACTIONS ----
export async function getSettings(): Promise<AppSettings> {
    const db = getDb();
    const docRef = db.collection('settings').doc('appConfig');
    const doc = await docRef.get();
    if (!doc.exists) {
        // Return default values if no settings are found
        return { ivaRate: 15, whatsappNumber: '593123456789' };
    }
    return doc.data() as AppSettings;
}

export async function saveSettings(settings: AppSettings) {
    const db = getDb();
    const docRef = db.collection('settings').doc('appConfig');
    await docRef.set(settings, { merge: true });
}
