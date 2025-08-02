import { Await, Link } from 'react-router';
import { Suspense, useState, useEffect } from 'react';
import { Image, Money } from '@shopify/hydrogen';
import type { RecommendedProductsQuery } from 'storefrontapi.generated';

interface ProductsSectionProps {
  products: Promise<RecommendedProductsQuery | null>;
}

export function ProductsSection({ products }: ProductsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector('.enhanced-products-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className={`enhanced-products-section ${isVisible ? 'section-visible' : ''}`}>
      <div className="enhanced-products-container">
        {/* Enhanced Background Elements */}
        <div className="enhanced-products-bg">
          <div className="enhanced-products-bg-gradient"></div>
          <div className="enhanced-products-bg-pattern"></div>
          <div className="enhanced-products-bg-orbs">
            <div className="bg-orb bg-orb-1"></div>
            <div className="bg-orb bg-orb-2"></div>
            <div className="bg-orb bg-orb-3"></div>
          </div>
        </div>

        <div className="enhanced-products-content">
          <div className="enhanced-products-header">
            <div className="enhanced-products-header-content">
              <div className="enhanced-products-title-wrapper">
                <h2 className="enhanced-products-title">
                  <span className="enhanced-products-title-main">ALL OUR</span>
                  <span className="enhanced-products-title-accent">PRODUCTS</span>
                </h2>
                <div className="enhanced-products-title-underline"></div>
              </div>
              <p className="enhanced-products-subtitle">
                Discover our curated collection of premium sneakers crafted for style and performance
              </p>
              <div className="enhanced-products-stats">
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Premium Styles</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">10+</span>
                  <span className="stat-label">Top Brands</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Fast Shipping</span>
                </div>
              </div>
            </div>
            <Link to="/collections/all" className="enhanced-see-more-link">
              <span className="see-more-text">EXPLORE ALL</span>
              <div className="see-more-icon-wrapper">
                <svg className="enhanced-see-more-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          </div>

          <Suspense fallback={<EnhancedProductsGridSkeleton />}>
            <Await resolve={products}>
              {(response) => (
                <div className="enhanced-products-grid">
                  {response
                    ? response.products.nodes.slice(0, 8).map((product, index) => (
                        <EnhancedProductCard
                          key={product.id}
                          product={product}
                          index={index}
                        />
                      ))
                    : null}
                </div>
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </section>
  );
}

function EnhancedProductCard({ product, index }: { product: any; index: number }) {
  const { title, handle, priceRange, featuredImage, vendor, availableForSale } = product;
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Safe access to price data with fallbacks
  const price = priceRange?.minVariantPrice;
  const maxPrice = priceRange?.maxVariantPrice;
  const isOnSale = price && maxPrice && parseFloat(price.amount) < parseFloat(maxPrice.amount);

  // Calculate discount percentage
  const discountPercentage = isOnSale && price?.amount && maxPrice?.amount
    ? Math.round(((parseFloat(maxPrice.amount) - parseFloat(price.amount)) / parseFloat(maxPrice.amount)) * 100)
    : 0;

  return (
    <div
      className={`enhanced-product-card ${!availableForSale ? 'out-of-stock' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${handle}`} className="enhanced-product-link">
        <div className="enhanced-product-image-container">
          {/* Premium Image Loading Effect */}
          <div className={`enhanced-product-image-wrapper ${imageLoaded ? 'image-loaded' : ''}`}>
            {featuredImage && (
              <Image
                data={featuredImage}
                alt={featuredImage.altText || title}
                className="enhanced-product-image"
                sizes="(min-width: 1024px) 300px, (min-width: 768px) 250px, 200px"
                onLoad={() => setImageLoaded(true)}
              />
            )}
            {!imageLoaded && (
              <div className="enhanced-product-image-placeholder">
                <div className="placeholder-shimmer"></div>
              </div>
            )}
          </div>

          {/* Enhanced Sale Badge */}
          {isOnSale && (
            <div className="enhanced-product-sale-badge">
              <span className="sale-text">SALE</span>
              <span className="sale-percentage">-{discountPercentage}%</span>
            </div>
          )}

          {/* Out of Stock Badge */}
          {!availableForSale && (
            <div className="enhanced-product-stock-badge">
              <span>OUT OF STOCK</span>
            </div>
          )}

          {/* New Badge for recent products */}
          {index < 2 && (
            <div className="enhanced-product-new-badge">
              <span>NEW</span>
            </div>
          )}

          {/* Enhanced Hover Overlay */}
          <div className={`enhanced-product-overlay ${isHovered ? 'enhanced-product-overlay-visible' : ''}`}>
            <div className="enhanced-product-overlay-content">
              <button className="enhanced-product-quick-view" onClick={(e) => e.preventDefault()}>
                <div className="btn-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Quick View</span>
              </button>
              {availableForSale && (
                <button className="enhanced-product-add-to-cart" onClick={(e) => e.preventDefault()}>
                  <div className="btn-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                  </div>
                  <span>Add to Cart</span>
                </button>
              )}
            </div>
          </div>

          {/* Premium Glow Effect */}
          <div className="enhanced-product-glow"></div>
        </div>

        <div className="enhanced-product-info">
          <div className="enhanced-product-brand">
            {vendor || title.split(' ')[0]}
          </div>
          <h3 className="enhanced-product-name">{title}</h3>
          <div className="enhanced-product-pricing">
            <div className="enhanced-product-price">
              {price ? <Money data={price} /> : 'Price unavailable'}
            </div>
            {isOnSale && maxPrice && (
              <div className="enhanced-product-price-original">
                <Money data={maxPrice} />
              </div>
            )}
          </div>

          {/* Product Rating Stars (placeholder) */}
          <div className="enhanced-product-rating">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`rating-star ${i < 4 ? 'filled' : ''}`} width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="rating-text">(4.0)</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

function EnhancedProductsGridSkeleton() {
  return (
    <div className="enhanced-products-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="enhanced-product-card enhanced-product-skeleton" style={{ animationDelay: `${i * 0.1}s` }}>
          <div className="enhanced-product-image-container">
            <div className="enhanced-skeleton-image">
              <div className="skeleton-shimmer"></div>
            </div>
          </div>
          <div className="enhanced-product-info">
            <div className="enhanced-skeleton-brand">
              <div className="skeleton-shimmer"></div>
            </div>
            <div className="enhanced-skeleton-title">
              <div className="skeleton-shimmer"></div>
            </div>
            <div className="enhanced-skeleton-title-line2">
              <div className="skeleton-shimmer"></div>
            </div>
            <div className="enhanced-skeleton-price">
              <div className="skeleton-shimmer"></div>
            </div>
            <div className="enhanced-skeleton-rating">
              <div className="skeleton-shimmer"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
