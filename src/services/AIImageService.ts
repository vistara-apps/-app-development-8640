import OpenAI from 'openai';

export interface AIImageOptions {
  prompt: string;
  size?: '256x256' | '512x512' | '1024x1024';
  quality?: 'standard' | 'hd';
}

export class AIImageService {
  private openai: OpenAI;

  constructor() {
    // Initialize OpenAI client - in production, this should use environment variables
    this.openai = new OpenAI({
      apiKey: process.env.VITE_OPENAI_API_KEY || 'demo-key',
      dangerouslyAllowBrowser: true // Only for demo purposes
    });
  }

  async generatePromoImage(options: AIImageOptions): Promise<string> {
    try {
      // For demo purposes, we'll return a placeholder image if no API key is provided
      if (!process.env.VITE_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY === 'demo-key') {
        console.log('Demo mode: Using placeholder image for prompt:', options.prompt);
        return this.generatePlaceholderImage(options.prompt);
      }

      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: options.prompt,
        n: 1,
        size: options.size || '1024x1024',
        quality: options.quality || 'standard',
      });

      const imageUrl = response.data[0]?.url;
      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI');
      }

      // Convert the image URL to a base64 data URL for embedding in PDF
      return await this.convertImageToBase64(imageUrl);
    } catch (error) {
      console.error('Error generating AI image:', error);
      // Fallback to placeholder image
      return this.generatePlaceholderImage(options.prompt);
    }
  }

  private async convertImageToBase64(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  }

  private generatePlaceholderImage(prompt: string): string {
    // Create a simple placeholder image using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Create a gradient background
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, '#8B4513');
    gradient.addColorStop(0.5, '#D2691E');
    gradient.addColorStop(1, '#F4A460');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // Add some decorative elements
    ctx.fillStyle = '#654321';
    ctx.fillRect(50, 50, 412, 412);
    
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(75, 75, 362, 362);

    // Add text
    ctx.fillStyle = '#F5DEB3';
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.fillText('Ancient Eats', 256, 200);
    
    ctx.font = '16px serif';
    ctx.fillText('Promo Image', 256, 230);
    
    // Add a simple description (truncated)
    const words = prompt.split(' ').slice(0, 6).join(' ');
    ctx.font = '14px serif';
    ctx.fillText(words + '...', 256, 300);

    return canvas.toDataURL('image/png');
  }

  generatePromoPrompt(productName: string, description: string, category: string): string {
    const basePrompt = `Create a beautiful, appetizing promotional image for "${productName}", an ancient culinary ${category}. `;
    const stylePrompt = `The image should have a warm, historical atmosphere with rich colors and textures that evoke ancient times. `;
    const contentPrompt = `Focus on: ${description}. `;
    const technicalPrompt = `Style: photorealistic, warm lighting, rustic textures, ancient cooking implements, historical ambiance.`;
    
    return basePrompt + stylePrompt + contentPrompt + technicalPrompt;
  }
}

export const aiImageService = new AIImageService();

