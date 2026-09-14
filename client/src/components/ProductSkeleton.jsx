import React from 'react';
import './ProductSkeleton.css';

const ProductSkeleton = ({ count = 8 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="product-skeleton" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="skeleton-image">
                        <div className="skeleton-shimmer"></div>
                        <div className="skeleton-pulse"></div>
                    </div>
                    <div className="skeleton-content">
                        <div className="skeleton-title">
                            <div className="skeleton-shimmer"></div>
                        </div>
                        <div className="skeleton-price">
                            <div className="skeleton-shimmer"></div>
                        </div>
                        <div className="skeleton-rating">
                            <div className="skeleton-shimmer"></div>
                        </div>
                        <div className="skeleton-button">
                            <div className="skeleton-shimmer"></div>
                        </div>
                    </div>
                    <div className="skeleton-glow"></div>
                </div>
            ))}
        </>
    );
};

export default ProductSkeleton;
