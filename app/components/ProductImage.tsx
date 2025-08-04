import {useState} from 'react';
import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

export function ProductImage({
  image,
}: {
  image: ProductVariantFragment['image'];
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!image) {
    return (
      <div className="enhanced-product-image-container">
        <div className="enhanced-product-image-placeholder">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: '#9ca3af' }}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
          </svg>
          <p style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.875rem' }}>
            No image available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-product-image-container">
      {!imageLoaded && !imageError && (
        <div className="enhanced-product-image-loading" />
      )}

      {/* Zoom overlay hint */}
      <div className="enhanced-product-image-zoom-overlay">
        Click to zoom
      </div>

      {imageError ? (
        <div className="enhanced-product-image-placeholder">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: '#ef4444' }}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
            <line x1="18" y1="6" x2="6" y2="18"/>
          </svg>
          <p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.875rem' }}>
            Failed to load image
          </p>
        </div>
      ) : (
        <Image
          alt={image.altText || 'Product Image'}
          data={image}
          key={image.id}
          sizes="(min-width: 1440px) 60vw, (min-width: 1024px) 55vw, (min-width: 768px) 50vw, 100vw"
          className={`enhanced-product-image ${imageLoaded ? 'fade-in' : ''}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          loading="eager"
        />
      )}
    </div>
  );
}
