import { Link } from 'react-router';
import type { HeroSection } from '~/lib/metaobjects/hero-section';
import { DEFAULT_HERO_SECTION } from '~/lib/metaobjects/hero-section';

export function KickVibesHero({
  heroSection
}: {
  heroSection?: HeroSection
}) {
  // Use provided hero section or fallback to default
  const hero = heroSection || DEFAULT_HERO_SECTION;

  // Don't render if not active
  if (!hero.isActive) {
    return null;
  }
  return (
    <section className="kickvibes-hero">
      {/* Background decorative elements */}
      <div className="kickvibes-hero-bg">
        {/* Large circles */}
        <div className="kickvibes-bg-circle kickvibes-bg-circle-yellow"></div>
        <div className="kickvibes-bg-circle kickvibes-bg-circle-red"></div>
        <div className="kickvibes-bg-circle kickvibes-bg-circle-blue"></div>

        {/* Geometric shapes */}
        <div className="kickvibes-bg-shape kickvibes-bg-diamond-red"></div>
        <div className="kickvibes-bg-shape kickvibes-bg-diamond-blue"></div>
        <div className="kickvibes-bg-shape kickvibes-bg-square-yellow"></div>
        <div className="kickvibes-bg-shape kickvibes-bg-square-purple"></div>

        {/* Spring coils */}
        <div className="kickvibes-bg-spring kickvibes-spring-left"></div>
        <div className="kickvibes-bg-spring kickvibes-spring-right"></div>
      </div>

      <div className="kickvibes-hero-container">
        {/* Left content */}
        <div className="kickvibes-hero-content">
          <h1 className="kickvibes-hero-title">{hero.heroTitle}</h1>
          <h2 className="kickvibes-hero-subtitle">{hero.heroSubtitle}</h2>

          <p className="kickvibes-hero-description">
            {hero.heroDescription}
          </p>

          <div className="kickvibes-hero-thumbnails">
            {hero.thumbnailImage1 && (
              <div className="kickvibes-thumbnail kickvibes-thumbnail-active">
                <img
                  src={hero.thumbnailImage1.url}
                  alt={hero.thumbnailImage1.altText}
                />
              </div>
            )}
            {hero.thumbnailImage2 && (
              <div className="kickvibes-thumbnail">
                <img
                  src={hero.thumbnailImage2.url}
                  alt={hero.thumbnailImage2.altText}
                />
              </div>
            )}
          </div>

          <Link to={hero.buttonUrl} className="kickvibes-shop-button">
            {hero.buttonText}
          </Link>
        </div>

        {/* Right content - Main shoe image */}
        <div className="kickvibes-hero-image">
          <div className="kickvibes-main-shoe">
            <img
              src={hero.mainHeroImage.url}
              alt={hero.mainHeroImage.altText}
              className="kickvibes-shoe-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
