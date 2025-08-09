import { Link } from 'react-router';
import { Suspense } from 'react';
import { Await } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import type { RecommendedProductsQuery } from 'storefrontapi.generated';

interface CategorySectionProps {
  products?: Promise<RecommendedProductsQuery | null>;
}

export function CategorySection({ products }: CategorySectionProps) {
  return (
    <section className="category-section">
      <div className="category-section-container">
        {/* Category Cards Row */}
        <div className="category-cards">
        {/* Running Category */}
        <div className="category-card category-card-large">
          <div className="category-card-content">
            <h2 className="category-title">RUNNING.</h2>
            <Link to="/collections/all" className="category-button">
              SEE PRODUCT
            </Link>
          </div>
          <div className="category-card-bg category-running-bg"></div>
        </div>

        {/* Woman Category */}
        <div className="category-card category-card-medium">
          <div className="category-card-content">
            <h2 className="category-title">WOMEN</h2>
            <Link to="/collections/all" className="category-button">
              SEE PRODUCT
            </Link>
          </div>
          <div className="category-card-bg category-woman-bg"></div>
          <div className="category-accent category-accent-red"></div>
        </div>

        {/* Man Category */}
        <div className="category-card category-card-medium">
          <div className="category-card-content">
            <h2 className="category-title">MEN</h2>
            <Link to="/collections/all" className="category-button">
              SEE PRODUCT
            </Link>
          </div>
          <div className="category-card-bg category-man-bg"></div>
          <div className="category-accent category-accent-red"></div>
        </div>
      </div>

      {/* Products and Hot Product Row */}
      <div className="products-row">
        {/* Product Grid */}
        <div className="products-grid">
          {products ? (
            <Suspense fallback={<ProductGridSkeleton />}>
              <Await resolve={products}>
                {(response) => (
                  <>
                    {response
                      ? response.products.nodes.slice(0, 4).map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))
                      : <ProductGridSkeleton />}
                  </>
                )}
              </Await>
            </Suspense>
          ) : (
            <ProductGridSkeleton />
          )}
        </div>

        {/* Hot Product Card */}
        <div className="hot-product-card">
          <div className="hot-product-content">
            <h2 className="hot-product-title">HOT PRODUCT.</h2>
            <p className="hot-product-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, 
              luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </p>
            <Link to="/collections/all" className="hot-product-button">
              SEE MORE
              <span className="button-arrow">→</span>
            </Link>
          </div>
          <div className="hot-product-bg"></div>
          <div className="hot-product-accent"></div>
        </div>
      </div>

      {/* Brand Logos Carousel */}
      <div className="brand-logos-carousel">
        <div className="brand-logos-track">
          {/* First set of brands */}
          <div className="brand-logo">
            <span className="brand-name brand-nike">NIKE</span>
          </div>
          <div className="brand-logo">
            <span className="brand-name brand-sketcha">SKETCHER</span>
          </div>
          <div className="brand-logo">
            <span className="brand-name brand-specha">REEBOK</span>
          </div>
          <div className="brand-logo">
            <span className="brand-name brand-adhida">ADIDAS</span>
          </div>
          {/* Duplicate set for seamless loop */}
          <div className="brand-logo">
            <span className="brand-name brand-nike">NIKE</span>
          </div>
          <div className="brand-logo">
            <span className="brand-name brand-sketcha">SKETCHER</span>
          </div>
          <div className="brand-logo">
            <span className="brand-name brand-specha">REEBOK</span>
          </div>
          <div className="brand-logo">
            <span className="brand-name brand-adhida">ADIDAS</span>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: any }) {
  const { title, handle, priceRange, featuredImage } = product;
  const price = priceRange?.minVariantPrice;

  return (
    <div className="product-card">
      <div className="product-image">
        {featuredImage && (
          <Image
            data={featuredImage}
            alt={featuredImage.altText || title}
            sizes="300px"
          />
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{title}</h3>
        <p className="product-price">
          {price ? <Money data={price} /> : 'Price unavailable'}
        </p>
        <Link to={`/products/${handle}`} className="product-select-btn">
          BUY NOW
        </Link>
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={`skeleton-${i}`} className="product-card">
          <div className="product-image">
            <div style={{
              width: '100%',
              height: '200px',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999'
            }}>
              Loading...
            </div>
          </div>
          <div className="product-info">
            <h3 className="product-name">Loading...</h3>
            <p className="product-price">$--</p>
            <button className="product-select-btn" disabled>
              BUY NOW
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
