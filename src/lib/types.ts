export interface ParsedItem {
  id: string;
  raw: string;
  quantity: number;
  description: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  brand: string;
  unitPrice: number;
  stock: number;
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

export interface QuoteItem extends CatalogItem {
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
