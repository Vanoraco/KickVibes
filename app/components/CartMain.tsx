import {useOptimisticCart} from '@shopify/hydrogen';
import { Link } from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = cart?.lines?.nodes?.length || 0;
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = linesCount > 0;

  return (
    <div className="cart-layout">
      <div className="cart-items-section">
        <div className={className}>
          {!cartHasItems && <CartEmpty layout={layout} />}
          {cartHasItems && (
            <>
              <div className="cart-items-header">
                <h2>Items in your cart</h2>
              </div>
              <div className="cart-details">
                <div aria-labelledby="cart-lines">
                  <ul className="cart-items-list">
                    {(cart?.lines?.nodes ?? []).map((line) => (
                      <CartLineItem key={line.id} line={line} layout={layout} />
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {cartHasItems && (
        <div className="cart-summary-section">
          <CartSummary cart={cart} layout={layout} />
        </div>
      )}
    </div>
  );
}

function CartEmpty({
  layout,
}: {
  layout?: CartMainProps['layout'];
}) {
  return (
    <div className="cart-empty">
      <div className="cart-empty-content">
        <div className="cart-empty-icon">
          🛒
        </div>
        <h2 className="cart-empty-title">Your Cart is Empty</h2>
        <p className="cart-empty-description">
          Looks like you haven't added any kicks to your cart yet.
          Let's find you some fresh sneakers!
        </p>
        <div className="cart-empty-actions">
          <Link to="/collections/all" className="cart-empty-shop-btn" prefetch="viewport">
            <span className="cart-empty-btn-text">Shop All Products</span>
            <span className="cart-empty-btn-arrow">→</span>
          </Link>
          <Link to="/" className="cart-empty-home-btn" prefetch="viewport">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
