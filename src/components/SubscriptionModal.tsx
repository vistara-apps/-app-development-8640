import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { usePaymentContext } from '../hooks/usePaymentContext';

interface SubscriptionModalProps {
  plan: 'monthly' | 'yearly';
  onClose: () => void;
}

function SubscriptionModal({ plan, onClose }: SubscriptionModalProps) {
  const { user, subscribe } = useApp();
  const { createSession } = usePaymentContext();
  const [paid, setPaid] = useState(false);
  const [processing, setProcessing] = useState(false);

  const planDetails = {
    monthly: { price: '$9.99', amount: '$9.99' },
    yearly: { price: '$99.99', amount: '$99.99' }
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);
      await createSession(planDetails[plan].amount);
      await subscribe(plan);
      setPaid(true);
    } catch (error) {
      console.error('Subscription failed:', error);
      alert('Subscription failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (paid) {
    return (
      <div className="modal">
        <div className="modal-content">
          <h3>🎉 Subscription Activated!</h3>
          <p>Welcome to Ancient Eats Premium! You now have unlimited access to all our content.</p>
          <button className="btn btn-primary" onClick={onClose}>
            Start Exploring
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="modal">
        <div className="modal-content">
          <h3>Login Required</h3>
          <p>Please login to subscribe to Ancient Eats.</p>
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}>&times;</button>
        <h3>Subscribe to Ancient Eats</h3>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🍯</div>
        <p>Get unlimited access to all recipes, workshops, and exclusive content.</p>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d4a574', marginBottom: '2rem' }}>
          {planDetails[plan].price} / {plan}
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handlePayment}
          disabled={processing}
          style={{ marginRight: '1rem' }}
        >
          {processing ? 'Processing...' : 'Subscribe with Crypto Wallet'}
        </button>
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default SubscriptionModal;