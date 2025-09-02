import {Suspense, useEffect, useState} from 'react';
import { Await, Link, NavLink, useAsyncValue } from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';

import {NewSearchBar} from '~/components/NewSearchBar';
import type { SiteSettings } from '~/lib/metaobjects/site-settings';
import { DEFAULT_SITE_SETTINGS } from '~/lib/metaobjects/site-settings';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  siteSettings?: SiteSettings;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
  siteSettings,
}: HeaderProps) {
  // Use provided site settings or fallback to default
  const settings = siteSettings || DEFAULT_SITE_SETTINGS;
  const {shop, menu} = header;
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header when scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      }
      // Hide header when scrolling down and past a certain threshold
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [lastScrollY]);

  return (
    <header className={`kickvibes-header ${isVisible ? 'header-visible' : 'header-hidden'}`}>
      <div className="kickvibes-header-container">
        {/* Logo */}
        <NavLink prefetch="intent" to="/" className="kickvibes-logo" end>
          <img
            src={settings.logoImage?.url || 'https://cdn.shopify.com/s/files/1/0757/9461/2478/files/logo.png?v=1753520942'}
            alt={settings.logoImage?.altText || settings.logoAltText || settings.siteName}
            className="kickvibes-logo-img"
          />
        </NavLink>

        {/* Desktop Navigation */}
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
          siteSettings={settings}
        />

        {/* Search Bar */}
        <NewSearchBar />

        {/* Right side actions */}
        <HeaderCtas cart={cart} />
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
  siteSettings,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
  siteSettings?: SiteSettings;
}) {
  const className = `kickvibes-header-menu-${viewport}`;

  // Use dynamic navigation items or fallback to default
  const settings = siteSettings || DEFAULT_SITE_SETTINGS;
  const kickVibesNavItems = settings.navigationItems || [
    { title: 'HOME', url: '/' },
    { title: 'SHOP', url: '/collections/all' },
    { title: 'CONTACT US', url: '/contact' },
  ];

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end={true}
          prefetch="intent"
          className={({isActive}) => `kickvibes-nav-item ${isActive ? 'active' : ''}`}
          to="/"
        >
          HOME
        </NavLink>
      )}
      {kickVibesNavItems.map((item) => {
        if (viewport === 'mobile' && item.url === '/') return null; // Skip home for mobile as it's already added above

        return (
          <NavLink
            className={({isActive}) => `kickvibes-nav-item ${isActive ? 'active' : ''}`}
            end={item.url === '/'}
            key={item.title}
            prefetch="intent"
            to={item.url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  cart,
}: Pick<HeaderProps, 'cart'>) {
  return (
    <div className="kickvibes-header-actions">
      <CartToggle cart={cart} />
    </div>
  );
}





function CartBadge({count}: {count: number | null}) {
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <Link
      to="/cart"
      className="kickvibes-cart-toggle"
      onClick={() => {
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      aria-label={`Open cart with ${count || 0} items`}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {count !== null && count > 0 && (
        <span className="kickvibes-cart-count">{count}</span>
      )}
    </Link>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};


