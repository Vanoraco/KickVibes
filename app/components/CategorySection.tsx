import { Link } from 'react-router';
import { Suspense } from 'react';
import { Await } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import type { CategoryCard } from '~/lib/metaobjects/category-cards';
import { DEFAULT_CATEGORY_CARDS } from '~/lib/metaobjects/category-cards';
import type { BrandInformation } from '~/lib/metaobjects/brand-information';
import { DEFAULT_BRANDS } from '~/lib/metaobjects/brand-information';
import type { RecommendedProductsQuery } from 'storefrontapi.generated';

interface CategorySectionProps {
  products?: Promise<RecommendedProductsQuery | null>;
  categoryCards?: CategoryCard[];
  brands?: BrandInformation[];
}

export function CategorySection({ products, categoryCards, brands }: CategorySectionProps) {
  // Use provided category cards or fallback to default
  const cards = categoryCards && categoryCards.length > 0 ? categoryCards : DEFAULT_CATEGORY_CARDS;
  // Use provided brands or fallback to default
  const brandList = brands && brands.length > 0 ? brands : DEFAULT_BRANDS;
  return (
    <section className="category-section">
      <div className="category-section-container">
        {/* Category Cards Row */}
        <div className="category-cards">
          {cards.map((card) => (
            <CategoryCardComponent key={card.id} card={card} />
          ))}
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
              Welcome to your ultimate destination for all things footwear. We know that in South Africa, a good pair of shoes is a non-negotiable. Whether you're heading to a braai, hitting the streets, or getting ready for a big night out, the right shoes complete your look and give you the confidence to own it.
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
          {brandList.map((brand) => (
            <BrandLogoComponent key={brand.id} brand={brand} />
          ))}
          {/* Duplicate set for seamless loop */}
          {brandList.map((brand) => (
            <BrandLogoComponent key={`${brand.id}-duplicate`} brand={brand} />
          ))}
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

// Component for individual category card
function CategoryCardComponent({ card }: { card: CategoryCard }) {
  const cardSizeClass = `category-card-${card.cardSize}`;
  const backgroundClass = card.cssClass || '';

  return (
    <div className={`category-card ${cardSizeClass}`}>
      <div className="category-card-content">
        <h2 className="category-title">{card.title}</h2>
        {card.description && (
          <p className="category-description">{card.description}</p>
        )}
        <Link to={card.buttonUrl} className="category-button">
          {card.buttonText}
        </Link>
      </div>

      {/* Background image or CSS class */}
      {card.backgroundImage ? (
        <div className="category-card-bg">
          <img
            src={card.backgroundImage.url}
            alt={card.backgroundImage.altText}
            className="category-bg-image"
            loading="lazy"
          />
        </div>
      ) : (
        <div className={`category-card-bg ${backgroundClass}`}></div>
      )}

      {/* Accent color */}
      {card.accentColor && (
        <div
          className="category-accent"
          style={{ backgroundColor: card.accentColor }}
        ></div>
      )}
    </div>
  );
}

// Component for individual brand logo
function BrandLogoComponent({ brand }: { brand: BrandInformation }) {
  const displayName = brand.displayName || brand.name;
  const brandClass = brand.cssClass || '';

  const brandElement = (
    <div className="brand-logo">
      {brand.logoImage ? (
        <img
          src={brand.logoImage.url}
          alt={brand.logoImage.altText}
          className="brand-logo-image"
          loading="lazy"
        />
      ) : (
        <span
          className={`brand-name ${brandClass}`}
          style={{ color: brand.brandColor }}
        >
          {displayName}
        </span>
      )}
    </div>
  );

  // If there's a collection URL, wrap in a Link
  if (brand.collectionUrl) {
    return (
      <Link to={brand.collectionUrl} className="brand-link">
        {brandElement}
      </Link>
    );
  }

  // If there's a website URL, wrap in an external link
  if (brand.websiteUrl) {
    return (
      <a
        href={brand.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="brand-link"
      >
        {brandElement}
      </a>
    );
  }

  // Otherwise, just return the brand element
  return brandElement;
}
