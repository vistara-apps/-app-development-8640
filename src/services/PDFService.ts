import jsPDF from 'jspdf';
import { aiImageService } from './AIImageService';

export interface Product {
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

export interface PDFOptions {
  includeFullContent?: boolean;
  includeAIImage?: boolean;
}

export class PDFService {
  async generatePromoPDF(product: Product, options: PDFOptions = {}): Promise<void> {
    const { includeFullContent = false, includeAIImage = true } = options;
    
    try {
      // Create new PDF document
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Add title
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Ancient Eats', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      pdf.setFontSize(18);
      pdf.text(product.name, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Add AI-generated promo image if requested
      if (includeAIImage) {
        try {
          const prompt = aiImageService.generatePromoPrompt(
            product.name, 
            product.description, 
            product.category
          );
          
          const imageData = await aiImageService.generatePromoImage({ prompt });
          
          // Add image to PDF
          const imgWidth = 120;
          const imgHeight = 120;
          const imgX = (pageWidth - imgWidth) / 2;
          
          pdf.addImage(imageData, 'PNG', imgX, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 15;
        } catch (error) {
          console.error('Error adding AI image to PDF:', error);
          // Continue without image
        }
      }

      // Add product information
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Product Information', 20, yPosition);
      yPosition += 10;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      
      // Category and Price
      pdf.text(`Category: ${product.category === 'ebook' ? 'E-book' : 'Workshop'}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Price: ${product.price}`, 20, yPosition);
      yPosition += 15;

      // Description
      pdf.setFont('helvetica', 'bold');
      pdf.text('Description:', 20, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      const descriptionLines = pdf.splitTextToSize(product.description, pageWidth - 40);
      pdf.text(descriptionLines, 20, yPosition);
      yPosition += descriptionLines.length * 6 + 10;

      // Add detailed content if available and requested
      if (includeFullContent && product.detailedDescription) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Detailed Description:', 20, yPosition);
        yPosition += 8;
        
        pdf.setFont('helvetica', 'normal');
        const detailedLines = pdf.splitTextToSize(product.detailedDescription, pageWidth - 40);
        pdf.text(detailedLines, 20, yPosition);
        yPosition += detailedLines.length * 6 + 10;
      }

      // Add historical context if available
      if (product.historicalContext) {
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFont('helvetica', 'bold');
        pdf.text('Historical Context:', 20, yPosition);
        yPosition += 8;
        
        pdf.setFont('helvetica', 'normal');
        const contextLines = pdf.splitTextToSize(product.historicalContext, pageWidth - 40);
        pdf.text(contextLines, 20, yPosition);
        yPosition += contextLines.length * 6 + 10;
      }

      // Add ingredients if available (for recipes)
      if (product.ingredients && product.ingredients.length > 0) {
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFont('helvetica', 'bold');
        pdf.text('Key Ingredients:', 20, yPosition);
        yPosition += 8;
        
        pdf.setFont('helvetica', 'normal');
        product.ingredients.forEach(ingredient => {
          pdf.text(`• ${ingredient}`, 25, yPosition);
          yPosition += 6;
        });
        yPosition += 10;
      }

      // Add techniques if available (for workshops)
      if (product.techniques && product.techniques.length > 0) {
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFont('helvetica', 'bold');
        pdf.text('Techniques Covered:', 20, yPosition);
        yPosition += 8;
        
        pdf.setFont('helvetica', 'normal');
        product.techniques.forEach(technique => {
          pdf.text(`• ${technique}`, 25, yPosition);
          yPosition += 6;
        });
        yPosition += 10;
      }

      // Add sample content if available and requested
      if (includeFullContent && product.sampleContent) {
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFont('helvetica', 'bold');
        pdf.text('Sample Content:', 20, yPosition);
        yPosition += 8;
        
        pdf.setFont('helvetica', 'normal');
        const sampleLines = pdf.splitTextToSize(product.sampleContent, pageWidth - 40);
        pdf.text(sampleLines, 20, yPosition);
        yPosition += sampleLines.length * 6 + 10;
      }

      // Add footer
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = pageHeight - 30;
      } else {
        yPosition = pageHeight - 30;
      }
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Generated by Ancient Eats - Rediscover the flavors of the past', pageWidth / 2, yPosition, { align: 'center' });

      // Save the PDF
      const fileName = `${product.name.replace(/[^a-zA-Z0-9]/g, '_')}_promo.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }
}

export const pdfService = new PDFService();

