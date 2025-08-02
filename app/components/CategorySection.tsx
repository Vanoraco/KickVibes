import { Link } from 'react-router';

export function CategorySection() {
  return (
    <section className="category-section">
      <div className="category-section-container">
        {/* Category Cards Row */}
        <div className="category-cards">
        {/* Running Category */}
        <div className="category-card category-card-large">
          <div className="category-card-content">
            <h2 className="category-title">RUNNING.</h2>
            <Link to="/collections/running" className="category-button">
              SEE PRODUCT
            </Link>
          </div>
          <div className="category-card-bg category-running-bg"></div>
        </div>

        {/* Woman Category */}
        <div className="category-card category-card-medium">
          <div className="category-card-content">
            <h2 className="category-title">WOMEN.</h2>
            <Link to="/collections/women" className="category-button">
              SEE PRODUCT
            </Link>
          </div>
          <div className="category-card-bg category-woman-bg"></div>
          <div className="category-accent category-accent-red"></div>
        </div>

        {/* Man Category */}
        <div className="category-card category-card-medium">
          <div className="category-card-content">
            <h2 className="category-title">MEN.</h2>
            <Link to="/collections/men" className="category-button">
              SEE PRODUCT
            </Link>
          </div>
          <div className="category-card-bg category-man-bg"></div>
          <div className="category-accent category-accent-red"></div>
        </div>
      </div>

      {/* Products and Hot Product Row */}
      <div className="products-row">
        {/* Product Grid */}
        <div className="products-grid">
          {/* Product 1 */}
          <div className="product-card">
            <div className="product-image">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop&crop=center" alt="KICK - XTREMA 3 RETRO" />
            </div>
            <div className="product-info">
              <h3 className="product-name">KICK – XTREMA 3 RETRO</h3>
              <p className="product-price">$20.00</p>
              <button className="product-select-btn">SELECT OPTIONS</button>
            </div>
          </div>

          {/* Product 2 */}
          <div className="product-card">
            <div className="product-image">
              <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop&crop=center" alt="NIKA - SPORTA X BROWN" />
            </div>
            <div className="product-info">
              <h3 className="product-name">NIKE – SPORTA X BROWN</h3>
              <p className="product-price">$20.00</p>
              <button className="product-select-btn">SELECT OPTIONS</button>
            </div>
          </div>

          {/* Product 3 */}
          <div className="product-card">
            <div className="product-image">
              <img src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=300&h=200&fit=crop&crop=center" alt="NIKA - SKORTA S BLACK" />
            </div>
            <div className="product-info">
              <h3 className="product-name">NIKE – SKORTA S BLACK</h3>
              <p className="product-price">$20.00</p>
              <button className="product-select-btn">SELECT OPTIONS</button>
            </div>
          </div>

          {/* Product 4 */}
          <div className="product-card">
            <div className="product-image">
              <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=200&fit=crop&crop=center" alt="KICK - YEZZO 2X WHITE" />
            </div>
            <div className="product-info">
              <h3 className="product-name">KICK – YEZZO 2X WHITE</h3>
              <p className="product-price">$20.00</p>
              <button className="product-select-btn">SELECT OPTIONS</button>
            </div>
          </div>
        </div>

        {/* Hot Product Card */}
        <div className="hot-product-card">
          <div className="hot-product-content">
            <h2 className="hot-product-title">HOT PRODUCT.</h2>
            <p className="hot-product-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, 
              luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </p>
            <Link to="/collections/hot-products" className="hot-product-button">
              SEE MORE
              <span className="button-arrow">→</span>
            </Link>
          </div>
          <div className="hot-product-bg"></div>
          <div className="hot-product-accent"></div>
        </div>
      </div>

      {/* Brand Logos */}
      <div className="brand-logos">
        <div className="brand-logo">
          <span className="brand-name brand-nike">NIKE</span>
        </div>
        <div className="brand-logo">
          <span className="brand-name brand-sketcha">SKETCHER</span>
        </div>
        <div className="brand-logo">
          <span className="brand-name brand-specha">REEBOK</span>
        </div>
        <div className="brand-logo">
          <span className="brand-name brand-adhida">ADIDAS</span>
        </div>
      </div>
      </div>
    </section>
  );
}
