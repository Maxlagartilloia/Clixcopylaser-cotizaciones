export interface ParsedItem {
  id: string;
  raw: string;
  quantity: number;
  description: string;
}

export interface CatalogItem {
  id: string;
  material: string;
  unidad: string;
  costoUnitario: number;
  marca: string;
}

export interface MatchedItem extends ParsedItem {
  status: 'found' | 'not_found' | 'low_stock';
  catalogItem?: CatalogItem;
  normalizedDescription?: string;
}

export interface SuggestedReplacement {
  originalItem: string;
  replacementItem: string;
  reason: string;
}

export interface QuoteItem {
  id: string;
  material: string;
  marca: string;
  costoUnitario: number;
  quantity: number;
  totalPrice: number;
}

export interface Quote {
  items: QuoteItem[];
  subtotal: number;
  iva: number;
  total: number;
  unavailableItems: MatchedItem[];
  suggestions: SuggestedReplacement[];
}

export interface Synonym {
    id: string;
    term: string;
    normalizedTerm: string;
}

export interface AppSettings {
  ivaRate: number;
  whatsappNumber: string;
}
