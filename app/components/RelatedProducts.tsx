import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import { useVariantUrl } from '~/lib/variants';

interface RelatedProduct {
  id: string;
  title: string;
  handle: string;
  vendor?: string;
  featuredImage?: {
    id: string;
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  availableForSale?: boolean;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
  title?: string;
  maxProducts?: number;
}

export function RelatedProducts({ 
  products, 
  title = "You might also like",
  maxProducts = 4 
}: RelatedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  const displayProducts = products.slice(0, maxProducts);

  return (
    <section className="enhanced-related-products">
      <h2 className="enhanced-related-products-title">{title}</h2>
      <div className="enhanced-related-products-grid">
        {displayProducts.map((product) => (
          <RelatedProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function RelatedProductCard({ product }: { product: RelatedProduct }) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const price = product.priceRange.minVariantPrice;
  const maxPrice = product.priceRange.maxVariantPrice;
  const isOnSale = parseFloat(price.amount) < parseFloat(maxPrice.amount);

  return (
    <div className="simple-product-card">
      <Link to={variantUrl} className="simple-product-link">
        <div className="simple-product-image-container">
          {image && (
            <Image
              alt={image.altText || product.title}
              data={image}
              loading="lazy"
              className="simple-product-image"
              sizes="(min-width: 1024px) 250px, (min-width: 768px) 200px, 150px"
            />
          )}
          {isOnSale && (
            <div className="simple-product-badge">Sale</div>
          )}
        </div>

        <div className="simple-product-info">
          <div className="simple-product-brand">
            {product.vendor || product.title.split(' ')[0]}
          </div>
          <h3 className="simple-product-title">{product.title}</h3>
          <div className="simple-product-price">
            <Money data={price} />
            {isOnSale && (
              <span className="simple-product-price-original">
                <Money data={maxPrice} />
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

// Mock data generator for development/demo purposes
export function generateMockRelatedProducts(count: number = 4): RelatedProduct[] {
  const mockProducts: RelatedProduct[] = [
    {
      id: 'mock-1',
      title: 'Air Max Premium',
      handle: 'air-max-premium',
      vendor: 'Nike',
      featuredImage: {
        id: 'img-1',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        altText: 'Air Max Premium sneakers',
        width: 400,
        height: 400,
      },
      priceRange: {
        minVariantPrice: { amount: '129.99', currencyCode: 'USD' },
        maxVariantPrice: { amount: '129.99', currencyCode: 'USD' },
      },
      availableForSale: true,
    },
    {
      id: 'mock-2',
      title: 'Classic Runner',
      handle: 'classic-runner',
      vendor: 'Adidas',
      featuredImage: {
        id: 'img-2',
        url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
        altText: 'Classic Runner sneakers',
        width: 400,
        height: 400,
      },
      priceRange: {
        minVariantPrice: { amount: '89.99', currencyCode: 'USD' },
        maxVariantPrice: { amount: '109.99', currencyCode: 'USD' },
      },
      availableForSale: true,
    },
    {
      id: 'mock-3',
      title: 'Urban Street',
      handle: 'urban-street',
      vendor: 'Puma',
      featuredImage: {
        id: 'img-3',
        url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
        altText: 'Urban Street sneakers',
        width: 400,
        height: 400,
      },
      priceRange: {
        minVariantPrice: { amount: '99.99', currencyCode: 'USD' },
        maxVariantPrice: { amount: '99.99', currencyCode: 'USD' },
      },
      availableForSale: true,
    },
    {
      id: 'mock-4',
      title: 'Sport Elite',
      handle: 'sport-elite',
      vendor: 'New Balance',
      featuredImage: {
        id: 'img-4',
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
        altText: 'Sport Elite sneakers',
        width: 400,
        height: 400,
      },
      priceRange: {
        minVariantPrice: { amount: '149.99', currencyCode: 'USD' },
        maxVariantPrice: { amount: '149.99', currencyCode: 'USD' },
      },
      availableForSale: true,
    },
  ];

  return mockProducts.slice(0, count);
}
