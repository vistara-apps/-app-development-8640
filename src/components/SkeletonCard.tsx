import React from 'react';

interface SkeletonCardProps {
  className?: string;
}

function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <div className={`product-card ${className}`}>
      <div className="skeleton skeleton-card mb-0" style={{ height: '200px' }} />
      <div className="product-content">
        <div className="skeleton skeleton-text mb-2" style={{ height: '1.5rem' }} />
        <div className="skeleton skeleton-text mb-3" style={{ height: '1.25rem', width: '60%' }} />
        <div className="skeleton skeleton-text mb-5" style={{ height: '1rem' }} />
        <div className="skeleton skeleton-text" style={{ height: '2.75rem', width: '100%' }} />
      </div>
    </div>
  );
}

export default SkeletonCard;

