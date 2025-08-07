import {useState} from 'react';
import {Image} from '@shopify/hydrogen';

interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productTitle: string;
}

export function ProductImageGallery({
  images,
  productTitle,
}: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // If no images, show placeholder
  if (!images || images.length === 0) {
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
            No images available
          </p>
        </div>
      </div>
    );
  }

  const selectedImage = images[selectedImageIndex];

  return (
    <div className="product-image-gallery">
      {/* Main Image Display */}
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
          <img
            src={selectedImage.url}
            alt={selectedImage.altText || productTitle}
            className={`enhanced-product-image ${imageLoaded ? 'fade-in' : ''}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="eager"
            width={selectedImage.width}
            height={selectedImage.height}
          />
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="product-image-thumbnails">
          {images.map((image, index) => (
            <button
              key={image.id}
              className={`product-image-thumbnail ${
                index === selectedImageIndex ? 'active' : ''
              }`}
              onClick={() => {
                setSelectedImageIndex(index);
                setImageLoaded(false);
                setImageError(false);
              }}
              aria-label={`View image ${index + 1} of ${images.length}`}
            >
              <img
                src={image.url}
                alt={image.altText || `${productTitle} - Image ${index + 1}`}
                className="thumbnail-image"
                loading="lazy"
                width={80}
                height={80}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
