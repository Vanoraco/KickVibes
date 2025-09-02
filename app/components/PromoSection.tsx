import { Link } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import type { HomepageContent } from '~/lib/metaobjects/homepage-content';
import { DEFAULT_HOMEPAGE_CONTENT } from '~/lib/metaobjects/homepage-content';

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
function PromoContent({ content }: { content: HomepageContent }) {
  // Convert \n in title to <br> tags
  const formatTitle = (title: string) => {
    return title.split('\\n').map((line, index, array) => (
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="promo-content">
      <h2 className="promo-title">
        {formatTitle(content.title)}
      </h2>
      <p className="promo-description">
        {content.description}
      </p>
      <Link to={content.buttonUrl} className="promo-button">
        {content.buttonText}
      </Link>
    </div>
  );
}

// Component for promo image section
function PromoImage({ content }: { content: HomepageContent }) {
  const { isMobile } = useResponsiveScreen();

  return (
    <div className="promo-image">
      <div className="promo-shoe-container">
        <img
          src={content.featuredImage.url}
          alt={content.featuredImage.altText}
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
export function PromoSection({
  homepageContent
}: {
  homepageContent?: HomepageContent
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollProgress = useScrollProgress(sectionRef);

  // Use provided content or fallback to default
  const content = homepageContent || DEFAULT_HOMEPAGE_CONTENT;

  return (
    <section ref={sectionRef} className="promo-section">
      <div
        className="promo-section-container"
        style={{
          '--scroll-progress': scrollProgress.toString()
        } as React.CSSProperties}
      >
        <PromoContent content={content} />
        <PromoImage content={content} />
      </div>

      <PromoBackgroundElements />
    </section>
  );
}
