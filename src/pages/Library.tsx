import React from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import PDFDownloadButton from '../components/PDFDownloadButton';

function Library() {
  const { user, products, purchases } = useApp();

  if (!user) {
    return (
      <div className="container library">
        <h2>Please login to access your library</h2>
        <Link to="/auth" className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }

  const purchasedProducts = products.filter(product => 
    purchases.some(purchase => purchase.product_id === product.id && purchase.user_id === user.id)
  );

  return (
    <div className="container library">
      <h2>My Library</h2>
      {purchasedProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>You haven't purchased any content yet.</p>
          <Link to="/" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {purchasedProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.icon}
              </div>
              <div className="product-content">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <button className="btn btn-primary">
                  {product.category === 'workshop' ? 'Start Workshop' : 'Read E-book'}
                </button>
                <PDFDownloadButton 
                  product={product} 
                  isPurchased={true}
                  variant="secondary"
                  size="small"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Library;
