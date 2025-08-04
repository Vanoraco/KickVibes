import { Link } from 'react-router';
import { useEffect, useRef, useState } from 'react';

// Custom hook for responsive screen size detection
function useResponsiveScreen() {
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width <= 768,
        isTablet: width > 768 && width <= 1024,
        isDesktop: width > 1024
      });
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return screenSize;
}

// Custom hook for scroll progress tracking
function useScrollProgress(elementRef: React.RefObject<HTMLElement>) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;

      // Calculate scroll progress when section is in view
      if (sectionTop < windowHeight && sectionBottom > 0) {
        const visibleHeight = Math.min(windowHeight, sectionBottom) - Math.max(0, sectionTop);
        const progress = Math.min(1, Math.max(0, visibleHeight / sectionHeight));
        setScrollProgress(progress);
      } else if (sectionTop >= windowHeight) {
        setScrollProgress(0);
      } else if (sectionBottom <= 0) {
        setScrollProgress(1);
      }
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
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [elementRef]);

  return scrollProgress;
}

// Component for promo content section
function PromoContent() {
  return (
    <div className="promo-content">
      <h2 className="promo-title">
        MAKES YOURSELF KEEP<br />
        SPORTY & STYLISH
      </h2>
      <p className="promo-description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
        commodo ligula eget dolor. Aenean massa. Cum sociis natoque
        penatibus et magnis dis parturient montes, nascetur ridiculus mus.
      </p>
      <Link to="/collections" className="promo-button">
        SHOP NOW
      </Link>
    </div>
  );
}

// Component for promo image section
function PromoImage() {
  const { isMobile } = useResponsiveScreen();

  return (
    <div className="promo-image">
      <div className="promo-shoe-container">
        <img
          src="https://cdn.shopify.com/s/files/1/0757/9461/2478/files/proshoe.webp?v=1753864297"
          alt="Sporty & Stylish Sneakers"
          className="promo-shoe-img"
          loading="lazy"
          style={{
            objectFit: 'contain',
            objectPosition: isMobile ? 'center center' : 'center bottom'
          }}
        />
      </div>
    </div>
  );
}

// Component for background decorative elements
function PromoBackgroundElements() {
  return (
    <div className="promo-bg-elements">
      <div className="promo-bg-circle promo-bg-circle-1"></div>
      <div className="promo-bg-circle promo-bg-circle-2"></div>
      <div className="promo-bg-shape promo-bg-shape-1"></div>
      <div className="promo-bg-shape promo-bg-shape-2"></div>
    </div>
  );
}

// Main PromoSection component
export function PromoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollProgress = useScrollProgress(sectionRef);

  return (
    <section ref={sectionRef} className="promo-section">
      <div
        className="promo-section-container"
        style={{
          '--scroll-progress': scrollProgress.toString()
        } as React.CSSProperties}
      >
        <PromoContent />
        <PromoImage />
      </div>

      <PromoBackgroundElements />
    </section>
  );
}
