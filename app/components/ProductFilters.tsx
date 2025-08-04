

interface ProductFiltersProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  availableBrands: string[];
  selectedBrands: string[];
  onBrandsChange: (brands: string[]) => void;
  availabilityFilter: 'all' | 'in-stock' | 'on-sale';
  onAvailabilityChange: (filter: 'all' | 'in-stock' | 'on-sale') => void;
  selectedSizes: string[];
  onSizesChange: (sizes: string[]) => void;
}

export function ProductFilters({
  priceRange,
  onPriceRangeChange,
  availableBrands,
  selectedBrands,
  onBrandsChange,
  availabilityFilter,
  onAvailabilityChange,
  selectedSizes,
  onSizesChange
}: ProductFiltersProps) {

  const handleBrandToggle = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandsChange(selectedBrands.filter(b => b !== brand));
    } else {
      onBrandsChange([...selectedBrands, brand]);
    }
  };

  const handleSizeToggle = (size: string) => {
    if (selectedSizes.includes(size)) {
      onSizesChange(selectedSizes.filter(s => s !== size));
    } else {
      onSizesChange([...selectedSizes, size]);
    }
  };

  const clearAllFilters = () => {
    onPriceRangeChange([0, 1000]);
    onBrandsChange([]);
    onAvailabilityChange('all');
    onSizesChange([]);
  };

  const activeFiltersCount = selectedBrands.length +
    selectedSizes.length +
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0) +
    (availabilityFilter !== 'all' ? 1 : 0);

  const commonSizes = ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'];

  return (
    <div className="product-filters-sidebar">
      <div className="filters-header">
        <h3>Filters</h3>
        {activeFiltersCount > 0 && (
          <button onClick={clearAllFilters} className="filters-clear">
            Clear All ({activeFiltersCount})
          </button>
        )}
      </div>

      <div className="filters-content">
        {/* Enhanced Price Range Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Price Range</h4>
            <div className="price-range-container">
              <div className="price-range-inputs">
                <div className="price-input-wrapper">
                  <label className="price-input-label">Min Price</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={priceRange[0]}
                    onChange={(e) => onPriceRangeChange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="price-input"
                    placeholder="0"
                  />
                </div>
                <span className="price-separator">—</span>
                <div className="price-input-wrapper">
                  <label className="price-input-label">Max Price</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value) || 1000])}
                    className="price-input"
                    placeholder="1000"
                  />
                </div>
              </div>

              <div className="price-range-slider-container">
                <div className="price-range-slider">
                  <div
                    className="price-range-track"
                    style={{
                      left: `${(priceRange[0] / 1000) * 100}%`,
                      width: `${((priceRange[1] - priceRange[0]) / 1000) * 100}%`
                    }}
                  />
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

                <div className="price-range-values">
                  <span className="price-range-value">R{priceRange[0]}</span>
                  <span className="price-range-value">R{priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Availability Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Availability</h4>
            <div className="availability-filters">
              {[
                { value: 'all', label: 'All Products' },
                { value: 'in-stock', label: 'In Stock' },
                { value: 'on-sale', label: 'On Sale' }
              ].map((option) => (
                <label key={option.value} className="availability-filter-item">
                  <input
                    type="radio"
                    name="availability"
                    value={option.value}
                    checked={availabilityFilter === option.value}
                    onChange={(e) => onAvailabilityChange(e.target.value as any)}
                    className="availability-radio"
                  />
                  <span className="availability-name">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Sizes</h4>
            <div className="size-filters">
              {commonSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeToggle(size)}
                  className={`size-filter-item ${selectedSizes.includes(size) ? 'selected' : ''}`}
                >
                  {size}
                </button>
              ))}
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
    </div>
  );
}
