import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { usePaymentContext } from '../hooks/usePaymentContext';
import PaymentModal from './PaymentModal';
import PDFDownloadButton from './PDFDownloadButton';

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

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { user, purchases } = useApp();
  const [showModal, setShowModal] = useState(false);
  
  const isPurchased = purchases.some(p => p.product_id === product.id && p.user_id === user?.id);

  const handlePurchaseClick = () => {
    if (!user) {
      alert('Please login to purchase products');
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      <div className="product-card">
        <div className="product-image">
          {product.icon}
        </div>
        <div className="product-content">
          <h3>{product.name}</h3>
          <div className="product-price">{product.price}</div>
          <p>{product.description}</p>
          {isPurchased ? (
            <button className="btn btn-secondary" disabled>
              ✓ Purchased
            </button>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={handlePurchaseClick}
            >
              Purchase {product.category === 'workshop' ? 'Workshop' : 'E-book'}
            </button>
          )}
          <PDFDownloadButton 
            product={product} 
            isPurchased={isPurchased}
            variant="outline"
            size="small"
          />
        </div>
      </div>
      
      {showModal && (
        <PaymentModal 
          product={product}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default ProductCard;
