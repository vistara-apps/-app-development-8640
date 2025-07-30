import React, { useState } from 'react';
import { pdfService } from '../services/PDFService';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: 'ebook' | 'workshop';
  icon: string;
  detailedDescription?: string;
  sampleContent?: string;
  historicalContext?: string;
  ingredients?: string[];
  techniques?: string[];
}

interface PDFDownloadButtonProps {
  product: Product;
  isPurchased?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

function PDFDownloadButton({ 
  product, 
  isPurchased = false, 
  variant = 'outline',
  size = 'medium'
}: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      await pdfService.generatePromoPDF(product, {
        includeFullContent: isPurchased,
        includeAIImage: true
      });
    } catch (err) {
      console.error('PDF generation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const getButtonClass = () => {
    const baseClass = 'pdf-download-btn';
    const variantClass = `pdf-download-btn--${variant}`;
    const sizeClass = `pdf-download-btn--${size}`;
    const loadingClass = isGenerating ? 'pdf-download-btn--loading' : '';
    
    return `${baseClass} ${variantClass} ${sizeClass} ${loadingClass}`.trim();
  };

  const getButtonText = () => {
    if (isGenerating) {
      return (
        <>
          <span className="pdf-download-spinner"></span>
          Generating PDF...
        </>
      );
    }
    
    return (
      <>
        📄 Download {isPurchased ? 'Full' : 'Promo'} PDF
      </>
    );
  };

  return (
    <div className="pdf-download-container">
      <button
        className={getButtonClass()}
        onClick={handleDownload}
        disabled={isGenerating}
        title={`Download ${isPurchased ? 'full content' : 'promotional'} PDF for ${product.name}`}
      >
        {getButtonText()}
      </button>
      
      {error && (
        <div className="pdf-download-error">
          <span className="error-icon">⚠️</span>
          <span className="error-message">{error}</span>
          <button 
            className="error-retry"
            onClick={handleDownload}
            disabled={isGenerating}
          >
            Retry
          </button>
        </div>
      )}
      
      {isGenerating && (
        <div className="pdf-download-progress">
          <div className="progress-text">
            {isPurchased ? 'Creating your personalized PDF...' : 'Generating promotional PDF...'}
          </div>
          <div className="progress-subtext">
            This may take a moment while we create your AI-generated promo image
          </div>
        </div>
      )}
    </div>
  );
}

export default PDFDownloadButton;

