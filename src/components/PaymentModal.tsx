import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { usePaymentContext } from '../hooks/usePaymentContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: 'ebook' | 'workshop';
  icon: string;
}

interface PaymentModalProps {
  product: Product;
  onClose: () => void;
}

function PaymentModal({ product, onClose }: PaymentModalProps) {
  const { purchaseProduct } = useApp();
  const { createSession } = usePaymentContext();
  const [paid, setPaid] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    try {
      setProcessing(true);
      await createSession(product.price);
      await purchaseProduct(product.id);
      setPaid(true);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (paid) {
    return (
      <div className="modal">
        <div className="modal-content">
          <h3>🎉 Purchase Successful!</h3>
          <p>You now have access to "{product.name}". Check your library to start your culinary journey!</p>
          <button className="btn btn-primary" onClick={onClose}>
            Go to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}>&times;</button>
        <h3>Purchase {product.name}</h3>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{product.icon}</div>
        <p>{product.description}</p>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d4a574', marginBottom: '2rem' }}>
          {product.price}
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handlePayment}
          disabled={processing}
          style={{ marginRight: '1rem' }}
        >
          {processing ? 'Processing...' : 'Pay with Crypto Wallet'}
        </button>
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default PaymentModal;