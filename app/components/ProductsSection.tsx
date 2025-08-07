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
      className={`product-card ${!availableForSale ? 'out-of-stock' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${handle}`} className="product-link">
        <div className="product-image-container">
          {featuredImage && (
            <Image
              data={featuredImage}
              alt={featuredImage.altText || title}
              className="product-image"
              sizes="200px"
            />
          )}

          {!availableForSale && (
            <div className="product-stock-badge">OUT OF STOCK</div>
          )}
        </div>

        <div className="product-info">
          <h3 className="product-name">{title}</h3>
          <div className="product-price">
            {price ? <Money data={price} /> : 'Price unavailable'}
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
