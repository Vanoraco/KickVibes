import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

interface EnhancedProductCardProps {
  product: any;
  loading?: 'eager' | 'lazy';
  viewMode?: 'grid' | 'list';
}

export function EnhancedProductCard({
  product,
  loading = 'lazy',
  viewMode = 'grid'
}: EnhancedProductCardProps) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const price = product.priceRange.minVariantPrice;
  const maxPrice = product.priceRange.maxVariantPrice;
  const isOnSale = parseFloat(price.amount) < parseFloat(maxPrice.amount);

  if (viewMode === 'list') {
    return (
      <div className="enhanced-product-card enhanced-product-card-list">
        <Link to={variantUrl} className="enhanced-product-link">
          <div className="enhanced-product-image-container">
            {image && (
              <Image
                alt={image.altText || product.title}
                data={image}
                loading={loading}
                className="enhanced-product-image"
                sizes="(min-width: 768px) 200px, 150px"
              />
            )}
            {isOnSale && (
              <div className="enhanced-product-badge">Sale</div>
            )}
          </div>
          
          <div className="enhanced-product-info">
            <div className="enhanced-product-details">
              <h3 className="enhanced-product-title">{product.title}</h3>
              <p className="enhanced-product-brand">
                {product.vendor || product.title.split(' ')[0]}
              </p>
            </div>
            
            <div className="enhanced-product-pricing">
              <div className="enhanced-product-price">
                <Money data={price} />
                {isOnSale && (
                  <span className="enhanced-product-price-original">
                    <Money data={maxPrice} />
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="enhanced-product-actions">
            <button className="enhanced-product-btn enhanced-product-btn-primary">
              View Details
            </button>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="enhanced-product-card">
      <Link to={variantUrl} className="enhanced-product-link">
        <div className="enhanced-product-image-container">
          {image && (
            <Image
              alt={image.altText || product.title}
              data={image}
              loading={loading}
              className="enhanced-product-image"
              sizes="(min-width: 1024px) 300px, (min-width: 768px) 250px, 200px"
            />
          )}
          {isOnSale && (
            <div className="enhanced-product-badge">Sale</div>
          )}
          <div className="enhanced-product-overlay">
            <button className="enhanced-product-btn enhanced-product-btn-secondary">
              Quick View
            </button>
          </div>
        </div>
        
        <div className="enhanced-product-info">
          <div className="enhanced-product-brand">
            {product.vendor || product.title.split(' ')[0]}
          </div>
          <h3 className="enhanced-product-title">{product.title}</h3>
          <div className="enhanced-product-price">
            <Money data={price} />
            {isOnSale && (
              <span className="enhanced-product-price-original">
                <Money data={maxPrice} />
              </span>
            )}
          </div>
        </div>
      </Link>
      
      <div className="enhanced-product-actions">
        <button className="enhanced-product-btn enhanced-product-btn-primary">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
