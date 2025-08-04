import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  const isOnSale = compareAtPrice && price &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  // Calculate savings amount and percentage
  const savingsAmount = isOnSale && compareAtPrice && price
    ? parseFloat(compareAtPrice.amount) - parseFloat(price.amount)
    : 0;

  const savingsPercentage = isOnSale && compareAtPrice && price
    ? Math.round((savingsAmount / parseFloat(compareAtPrice.amount)) * 100)
    : 0;

  return (
    <div className="enhanced-product-price">
      {price && (
        <span className="enhanced-product-price-current">
          <Money data={price} />
        </span>
      )}

      {isOnSale && compareAtPrice && (
        <>
          <span className="enhanced-product-price-compare">
            <Money data={compareAtPrice} />
          </span>
          <span className="enhanced-product-price-badge">
            {savingsPercentage}% OFF
          </span>
        </>
      )}

      {!price && (
        <span className="enhanced-product-price-current">
          Price unavailable
        </span>
      )}

      {isOnSale && savingsAmount > 0 && price && (
        <div className="enhanced-product-price-savings">
          You save {price.currencyCode} {savingsAmount.toFixed(2)}
        </div>
      )}
    </div>
  );
}
