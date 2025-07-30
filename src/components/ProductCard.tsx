import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { usePaymentContext } from '../hooks/usePaymentContext';
import PaymentModal from './PaymentModal';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: 'ebook' | 'workshop';
  icon: string;
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
      <div className="product-card hover-lift">
        <div className="product-image">
          {product.icon}
        </div>
        <div className="product-content">
          <h3 className="font-semibold">{product.name}</h3>
          <div className="product-price font-bold">{product.price}</div>
          <p className="text-secondary">{product.description}</p>
          {isPurchased ? (
            <button className="btn btn-secondary" disabled>
              ✅ Purchased
            </button>
          ) : (
            <button 
              className="btn btn-primary hover-scale transition-transform"
              onClick={handlePurchaseClick}
            >
              {product.category === 'workshop' ? '🎓 Get Workshop' : '📖 Get E-book'}
            </button>
          )}
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
