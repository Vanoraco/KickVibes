import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

interface NewEnhancedProductCardProps {
  product: any;
  loading?: 'eager' | 'lazy';
}

export function NewEnhancedProductCard({
  product,
  loading = 'lazy',
}: NewEnhancedProductCardProps) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const price = product.priceRange.minVariantPrice;
  const maxPrice = product.priceRange.maxVariantPrice;
  const isOnSale = parseFloat(price.amount) < parseFloat(maxPrice.amount);

  return (
    <div className={`new-enhanced-product-card ${!product.availableForSale ? 'out-of-stock' : ''}`}>
      <Link to={variantUrl} className="product-link">
        <div className="product-image-container">
          {image && (
            <Image
              alt={image.altText || product.title}
              data={image}
              loading={loading}
              className="product-image"
              sizes="200px"
            />
          )}

          {!product.availableForSale && (
            <div className="product-stock-badge">OUT OF STOCK</div>
          )}
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.title}</h3>
          <div className="product-price">
            <Money data={price} />
          </div>
        </div>
      </Link>
    </div>
  );
}
