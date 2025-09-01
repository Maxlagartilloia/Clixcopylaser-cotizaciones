# **App Name**: Clixcopylaser cotizaciones

## Core Features:

- Upload and Parse: Allows users to upload school supply lists in various formats (image, PDF, DOCX, XLSX) and automatically parses them using OCR and structured extraction to identify individual items.
- Item Normalization: Normalizes extracted items by applying synonym matching to standardize descriptions (e.g., 'cuaderno 100 hojas líneas' becomes 'cuaderno 100h rayado'). Uses a central dictionary of synonyms.
- Catalog Matching: Matches normalized items against a product catalog (from an accounting API or Google Sheet) to retrieve unit price, suggested brand, stock availability, and potential substitutes.
- AI Suggested Replacements: Uses AI to suggest appropriate replacements for items in the list that have low stock or are unavailable. An LLM will be used as a tool to reason about when substitutions should occur, and when higher priced or lower priced substitutes might be considered more acceptable
- Quotation Generation: Calculates the subtotal, IVA (12% Ecuador, configurable), discounts/promos, optional delivery cost, and final total. Returns a downloadable quotation in PDF and Excel formats, and a WhatsApp link with a summary and payment link (if applicable).
- WhatsApp Sharing: Generates a WhatsApp message with a summary of the quotation and a link to view the details, enabling easy sharing with clients.
- Admin Dashboard: Provides a protected admin interface (email+password authentication) to manage the product catalog, synonym dictionary, pricing rules, and quotations. Includes functionalities to sync products from an API/Sheet, CRUD synonyms, configure IVA/discounts, and review/export quotations.

## Style Guidelines:

- Primary color: HSL(48, 77%, 55%) -> RGB(#F0C22B) - A vibrant yellow to convey a sense of organization, dependability, and affordability.
- Background color: HSL(48, 20%, 96%) -> RGB(#F7F6F1) - A very light off-white to provide a neutral, calming backdrop to the main yellow accents.
- Accent color: HSL(18, 65%, 47%) -> RGB(#D17729) - A warm, complementary orange to give subtle call-to-action alerts and focus user's eyes toward what's most relevant.
- Headline font: 'Space Grotesk' (sans-serif) for headlines, body uses 'Inter' (sans-serif) Note: currently only Google Fonts are supported.
- Use simple, clear icons to represent item categories and actions, ensuring clarity and ease of navigation.
- Design a clean and responsive layout, optimized for both desktop and mobile devices, to ensure a seamless user experience.
- Incorporate subtle animations and transitions to enhance user engagement and provide visual feedback.