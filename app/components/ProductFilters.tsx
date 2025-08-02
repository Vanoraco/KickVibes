import {useState} from 'react';

interface ProductFiltersProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  availableBrands: string[];
  selectedBrands: string[];
  onBrandsChange: (brands: string[]) => void;
}

export function ProductFilters({
  priceRange,
  onPriceRangeChange,
  availableBrands,
  selectedBrands,
  onBrandsChange
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleBrandToggle = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandsChange(selectedBrands.filter(b => b !== brand));
    } else {
      onBrandsChange([...selectedBrands, brand]);
    }
  };

  const clearAllFilters = () => {
    onPriceRangeChange([0, 1000]);
    onBrandsChange([]);
  };

  const activeFiltersCount = selectedBrands.length + (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0);

  return (
    <div className="product-filters">
      <button 
        className="filters-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="filters-count">{activeFiltersCount}</span>
        )}
        <svg 
          className={`filters-icon ${isOpen ? 'filters-icon-open' : ''}`}
          width="16" 
          height="16" 
          viewBox="0 0 16 16"
        >
          <path d="M8 12l-4-4h8l-4 4z" fill="currentColor"/>
        </svg>
      </button>

      {isOpen && (
        <div className="filters-dropdown">
          <div className="filters-header">
            <h3>Filters</h3>
            {activeFiltersCount > 0 && (
              <button className="filters-clear" onClick={clearAllFilters}>
                Clear All
              </button>
            )}
          </div>

          {/* Price Range Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Price Range</h4>
            <div className="price-range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => onPriceRangeChange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="price-input"
              />
              <span className="price-separator">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value) || 1000])}
                className="price-input"
              />
            </div>
            <div className="price-range-slider">
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[0]}
                onChange={(e) => onPriceRangeChange([parseInt(e.target.value), priceRange[1]])}
                className="range-slider range-slider-min"
              />
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
                className="range-slider range-slider-max"
              />
            </div>
          </div>

          {/* Brand Filter */}
          {availableBrands.length > 0 && (
            <div className="filter-section">
              <h4 className="filter-title">Brands</h4>
              <div className="brand-filters">
                {availableBrands.map((brand) => (
                  <label key={brand} className="brand-filter-item">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                      className="brand-checkbox"
                    />
                    <span className="brand-name">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
