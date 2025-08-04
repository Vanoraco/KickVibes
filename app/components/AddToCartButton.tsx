import { type FetcherWithComponents } from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  className = '',
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        const isLoading = fetcher.state !== 'idle';
        const isDisabled = disabled || isLoading;

        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <button
              type="submit"
              onClick={onClick}
              disabled={isDisabled}
              className={`enhanced-add-to-cart-btn ${className} ${isLoading ? 'loading' : ''}`}
              aria-label={isDisabled ? 'Product unavailable' : 'Add product to cart'}
            >
              <span className="enhanced-add-to-cart-content">
                {isLoading ? (
                  <>
                    <span className="enhanced-add-to-cart-spinner" />
                    Adding...
                  </>
                ) : (
                  children
                )}
              </span>
            </button>
          </>
        );
      }}
    </CartForm>
  );
}
