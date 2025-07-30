import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import SubscriptionModal from '../components/SubscriptionModal';
import SkeletonCard from '../components/SkeletonCard';

function Home() {
  const { products, user } = useApp();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<'monthly' | 'yearly' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    {
      icon: '📜',
      title: 'Lost Recipe Reconstructions',
      description: 'Interactive e-books that guide users through the process of recreating long-lost recipes from ancient texts and archaeological findings.'
    },
    {
      icon: '🏛️',
      title: 'Culinary Time Travels',
      description: 'Immersive e-books that transport readers back in time through imagined dining experiences, providing historical context and sensory details.'
    },
    {
      icon: '🔥',
      title: 'Ancient Techniques Workshops',
      description: 'Online workshops that teach users forgotten culinary skills and techniques from history, such as open-fire cooking, fermentation, and grain milling.'
    }
  ];

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1 className="text-hero">Ancient Eats</h1>
          <p className="text-subtitle">
            Rediscover the flavors of the past through immersive culinary experiences
          </p>
          {!user && (
            <a href="/auth" className="btn btn-primary btn-lg hover-lift">
              ✨ Start Your Culinary Journey
            </a>
          )}
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="text-center mb-12">Explore Ancient Culinary Traditions</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`feature-card animate-fade-in-up stagger-${index + 1}`}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="products">
        <div className="container">
          <h2 className="text-center mb-12">Featured Content</h2>
          <div className="products-grid">
            {isLoading ? (
              // Show skeleton loading states
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : (
              products.slice(0, 6).map((product, index) => (
                <div 
                  key={product.id}
                  className={`animate-fade-in-up stagger-${(index % 3) + 1}`}
                >
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="subscription">
        <div className="container">
          <h2>Unlock Everything</h2>
          <p>Get unlimited access to all ancient recipes, workshops, and exclusive content</p>
          <div className="pricing">
            <div className="price-card hover-lift">
              <h3>Monthly</h3>
              <div className="price">$9.99</div>
              <div className="price-period">per month</div>
              <button 
                className="btn btn-primary"
                onClick={() => setShowSubscriptionModal('monthly')}
              >
                📅 Subscribe Monthly
              </button>
            </div>
            <div className="price-card hover-lift">
              <h3>Yearly</h3>
              <div className="price">$99.99</div>
              <div className="price-period">per year</div>
              <div className="text-xs text-success mb-4">
                💰 Save $19.89 per year!
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => setShowSubscriptionModal('yearly')}
              >
                🎯 Subscribe Yearly
              </button>
            </div>
          </div>
        </div>
      </section>

      {showSubscriptionModal && (
        <SubscriptionModal 
          plan={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(null)}
        />
      )}
    </>
  );
}

export default Home;
