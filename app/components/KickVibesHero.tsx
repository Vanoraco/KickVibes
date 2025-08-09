import { Link } from 'react-router';

export function KickVibesHero() {
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
          

          <h1 className="kickvibes-hero-title">KICKVIBES</h1>
          <h2 className="kickvibes-hero-subtitle">COMFY AND TRENDY</h2>

          <p className="kickvibes-hero-description">
             Your destination for the comfiest and trendiest sneakers and shoes in South Africa. Find your perfect pair with our curated collection of styles, blending cutting-edge design with all-day comfort. Step up your street style with KICKVIBES.
          </p>

          <div className="kickvibes-hero-thumbnails">
            <div className="kickvibes-thumbnail kickvibes-thumbnail-active">
              <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=80&h=80&fit=crop&crop=center" alt="KickVibes  Black" />
            </div>
            <div className="kickvibes-thumbnail">
              <img src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=80&h=80&fit=crop&crop=center" alt="KickVibes Blue" />
            </div>
          </div>

          <Link to="/collections/all" className="kickvibes-shop-button">
            SHOP NOW
          </Link>
        </div>

        {/* Right content - Main shoe image */}
        <div className="kickvibes-hero-image">
          <div className="kickvibes-main-shoe">
            <img
              src="https://cdn.shopify.com/s/files/1/0757/9461/2478/files/Sneaker.png?v=1753524891"
              alt="KickVibes Sneaker"
              className="kickvibes-shoe-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
