'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import FileUploadStep from '@/components/quotation/file-upload-step';
import ReviewStep from '@/components/quotation/review-step';
import FinalQuoteStep from '@/components/quotation/final-quote-step';
import type { ParsedItem, Quote } from '@/lib/types';

export type Step = 'upload' | 'review' | 'quote';

export default function QuotationTool() {
  const [step, setStep] = useState<Step>('upload');
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);

  const handleFileProcessed = (items: ParsedItem[]) => {
    setParsedItems(items);
    setStep('review');
  };

  const handleReviewCompleted = (finalQuote: Quote) => {
    setQuote(finalQuote);
    setStep('quote');
  };

  const handleReset = () => {
    setStep('upload');
    setParsedItems([]);
    setQuote(null);
  };

  const renderStep = () => {
    switch (step) {
      case 'upload':
        return <FileUploadStep onFileProcessed={handleFileProcessed} />;
      case 'review':
        return <ReviewStep initialItems={parsedItems} onReviewCompleted={handleReviewCompleted} onReset={handleReset} />;
      case 'quote':
        return quote && <FinalQuoteStep quote={quote} onReset={handleReset} />;
      default:
        return <FileUploadStep onFileProcessed={handleFileProcessed} />;
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl overflow-hidden transition-all duration-500">
      {renderStep()}
    </Card>
  );
}
