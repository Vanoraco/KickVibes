import { Link } from 'react-router';
import { useEffect, useRef, useState } from 'react';

// Custom hook for scroll-based animations
function useScrollAnimation(elementRef: React.RefObject<HTMLElement>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [elementRef]);

  return isVisible;
}

// Floating shoe animation component
function FloatingShoe({ delay = 0, direction = 1 }) {
  return (
    <div
      className="floating-shoe"
      style={{
        '--delay': `${delay}s`,
        '--direction': direction
      } as React.CSSProperties}
    >
      <img
        src="https://cdn.shopify.com/s/files/1/0757/9461/2478/files/proshoe.webp?v=1753864297"
        alt="Floating sneaker"
        className="floating-shoe-img"
      />
    </div>
  );
}

// Background decorative elements
function NotFoundBackgroundElements() {
  return (
    <div className="not-found-bg-elements">
      <div className="not-found-bg-circle not-found-bg-circle-1"></div>
      <div className="not-found-bg-circle not-found-bg-circle-2"></div>
      <div className="not-found-bg-circle not-found-bg-circle-3"></div>
      <div className="not-found-bg-shape not-found-bg-shape-1"></div>
      <div className="not-found-bg-shape not-found-bg-shape-2"></div>
      <div className="not-found-gradient-overlay"></div>
    </div>
  );
}

// Main 404 content
function NotFoundContent() {
  const contentRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(contentRef);

  return (
    <div 
      ref={contentRef}
      className={`not-found-content ${isVisible ? 'animate-in' : ''}`}
    >
      <div className="not-found-error-code">
        <span className="error-digit">4</span>
        <span className="error-digit">0</span>
        <span className="error-digit">4</span>
      </div>
      
      <h1 className="not-found-title">
        OOPS! PAGE NOT FOUND
      </h1>
      
      <p className="not-found-description">
        Looks like this page took a wrong turn and got lost in the sneaker maze. 
        Don't worry, we'll help you find your way back to the good stuff!
      </p>
      
      <div className="not-found-actions">
        <Link to="/" className="not-found-home-btn">
          <span className="btn-text">BACK TO HOME</span>
          <span className="btn-arrow">→</span>
        </Link>

        <Link to="/collections" className="not-found-shop-btn">
          <span className="btn-text">SHOP SNEAKERS</span>
          <span className="btn-arrow">→</span>
        </Link>
      </div>
      
      <div className="not-found-suggestions">
        <h3 className="suggestions-title">Popular Pages:</h3>
        <div className="suggestions-links">
          <Link to="/collections/running" className="suggestion-link">Running Shoes</Link>
          <Link to="/collections/men" className="suggestion-link">Men's Collection</Link>
          <Link to="/collections/women" className="suggestion-link">Women's Collection</Link>
          <Link to="/collections/hot-products" className="suggestion-link">Hot Products</Link>
        </div>
      </div>
    </div>
  );
}

// Main NotFoundPage component
export function NotFoundPage() {
  return (
    <div className="not-found-page">
      <NotFoundBackgroundElements />
      
      {/* Floating shoes for decoration */}
      <FloatingShoe delay={0} direction={1} />
      <FloatingShoe delay={2} direction={-1} />
      <FloatingShoe delay={4} direction={1} />
      
      <div className="not-found-container">
        <NotFoundContent />
      </div>
    </div>
  );
}
