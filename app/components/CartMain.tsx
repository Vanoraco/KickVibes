import {useOptimisticCart} from '@shopify/hydrogen';
import { Link } from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
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

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className="cart-layout">
      <div className="cart-items-section">
        <div className={className}>
          <CartEmpty hidden={linesCount} layout={layout} />
          {linesCount && (
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
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  return (
    <div hidden={hidden}>
      <br />
      <p>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <br />
      <Link to="/collections" onClick={close} prefetch="viewport">
        Continue shopping →
      </Link>
    </div>
  );
}
