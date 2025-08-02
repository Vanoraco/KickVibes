import {Suspense} from 'react';
import {Await, NavLink, Link} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense fallback={
      <footer className="enhanced-footer">
        <div className="enhanced-footer-container">
          <div className="enhanced-footer-loading">
            <div className="enhanced-footer-loading-spinner"></div>
            <p>Loading footer...</p>
          </div>
        </div>
      </footer>
    }>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="enhanced-footer">
            <div className="enhanced-footer-container">
              {/* Main Footer Content */}
              <div className="enhanced-footer-main">
                {/* Brand Section */}
                <div className="enhanced-footer-brand">
                  <Link to="/" className="enhanced-footer-logo">
                    <img
                      src="https://cdn.shopify.com/s/files/1/0757/9461/2478/files/logo.png?v=1753520942"
                      alt="KickVibes"
                      className="enhanced-footer-logo-img"
                    />
                  </Link>
                  <p className="enhanced-footer-description">
                    Discover the latest and greatest in premium sneaker fashion.
                    From limited editions to everyday essentials, we bring you
                    the best kicks from top brands worldwide.
                  </p>
                  <div className="enhanced-footer-social">
                    <a href="#" className="enhanced-footer-social-link" aria-label="Instagram">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a href="#" className="enhanced-footer-social-link" aria-label="Twitter">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                    <a href="#" className="enhanced-footer-social-link" aria-label="Facebook">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a href="#" className="enhanced-footer-social-link" aria-label="YouTube">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="enhanced-footer-section">
                  <h3 className="enhanced-footer-section-title">Quick Links</h3>
                  <ul className="enhanced-footer-links">
                    <li><Link to="/collections/all" className="enhanced-footer-link">All Products</Link></li>
                    <li><Link to="/collections/new-arrivals" className="enhanced-footer-link">New Arrivals</Link></li>
                    <li><Link to="/collections/sale" className="enhanced-footer-link">Sale</Link></li>
                    <li><Link to="/collections/featured" className="enhanced-footer-link">Featured</Link></li>
                  </ul>
                </div>

                {/* Categories */}
                <div className="enhanced-footer-section">
                  <h3 className="enhanced-footer-section-title">Categories</h3>
                  <ul className="enhanced-footer-links">
                    <li><Link to="/collections/nike" className="enhanced-footer-link">Nike</Link></li>
                    <li><Link to="/collections/adidas" className="enhanced-footer-link">Adidas</Link></li>
                    <li><Link to="/collections/jordan" className="enhanced-footer-link">Jordan</Link></li>
                    <li><Link to="/collections/puma" className="enhanced-footer-link">Puma</Link></li>
                    <li><Link to="/collections/new-balance" className="enhanced-footer-link">New Balance</Link></li>
                  </ul>
                </div>

                {/* Customer Service */}
                <div className="enhanced-footer-section">
                  <h3 className="enhanced-footer-section-title">Customer Service</h3>
                  <ul className="enhanced-footer-links">
                    <li><Link to="/pages/contact" className="enhanced-footer-link">Contact Us</Link></li>
                    <li><Link to="/pages/shipping" className="enhanced-footer-link">Shipping Info</Link></li>
                    <li><Link to="/pages/returns" className="enhanced-footer-link">Returns</Link></li>
                    <li><Link to="/pages/size-guide" className="enhanced-footer-link">Size Guide</Link></li>
                    <li><Link to="/pages/faq" className="enhanced-footer-link">FAQ</Link></li>
                  </ul>
                </div>

                {/* Newsletter */}
                <div className="enhanced-footer-section enhanced-footer-newsletter">
                  <h3 className="enhanced-footer-section-title">Stay Updated</h3>
                  <p className="enhanced-footer-newsletter-text">
                    Subscribe to get special offers, free giveaways, and exclusive deals.
                  </p>
                  <form className="enhanced-footer-newsletter-form">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="enhanced-footer-newsletter-input"
                      required
                    />
                    <button type="submit" className="enhanced-footer-newsletter-button">
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>

              {/* Footer Bottom */}
              <div className="enhanced-footer-bottom">
                <div className="enhanced-footer-bottom-content">
                  <div className="enhanced-footer-legal">
                    {footer?.menu && header.shop.primaryDomain?.url && (
                      <FooterMenu
                        menu={footer.menu}
                        primaryDomainUrl={header.shop.primaryDomain.url}
                        publicStoreDomain={publicStoreDomain}
                      />
                    )}
                  </div>
                  <div className="enhanced-footer-copyright">
                    <p>&copy; {new Date().getFullYear()} KickVibes. All rights reserved.</p>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="enhanced-footer-legal-menu" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items
        .filter((item) => item.title.toLowerCase() !== 'search') // Filter out search items
        .map((item) => {
          if (!item.url) return null;
          // if the url is internal, we strip the domain
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          const isExternal = !url.startsWith('/');
          return isExternal ? (
            <a
              href={url}
              key={item.id}
              rel="noopener noreferrer"
              target="_blank"
              className="enhanced-footer-legal-link"
            >
              {item.title}
            </a>
          ) : (
            <NavLink
              end
              key={item.id}
              prefetch="intent"
              to={url}
              className="enhanced-footer-legal-link"
            >
              {item.title}
            </NavLink>
          );
        })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};


