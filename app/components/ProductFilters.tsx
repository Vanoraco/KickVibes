

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
  onClose?: () => void;
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
  onSizesChange,
  onClose
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
    onPriceRangeChange([500, 3000]);
    onBrandsChange([]);
    onAvailabilityChange('all');
    onSizesChange([]);
  };

  const activeFiltersCount = selectedBrands.length +
    selectedSizes.length +
    (priceRange[0] > 500 || priceRange[1] < 3000 ? 1 : 0) +
    (availabilityFilter !== 'all' ? 1 : 0);

  const commonSizes = ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'];

  return (
    <div className="product-filters-sidebar">
      {/* Modern Filter Header */}
      <div className="filter-header">
        <h3 className="filter-header-title">Filters</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="filter-clear-all"
          >
            Clear All ({activeFiltersCount})
          </button>
        )}
      </div>

      <div className="filters-content">
        {/* Modern Price Range Filter */}
        <div className="filter-section">
          <h4 className="filter-title">Price Range</h4>
          <div className="price-range-container">
              <div className="price-range-slider-container">
                <div className="price-range-slider">
                  <div
                    className="price-range-track"
                    style={{
                      left: `${((priceRange[0] - 500) / (3000 - 500)) * 100}%`,
                      width: `${((priceRange[1] - priceRange[0]) / (3000 - 500)) * 100}%`
                    }}
                  />
                  <input
                    type="range"
                    min="500"
                    max="3000"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const newMin = parseInt(e.target.value);
                      if (newMin <= priceRange[1]) {
                        onPriceRangeChange([newMin, priceRange[1]]);
                      }
                    }}
                    className="range-slider range-slider-min"
                  />
                  <input
                    type="range"
                    min="500"
                    max="3000"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const newMax = parseInt(e.target.value);
                      if (newMax >= priceRange[0]) {
                        onPriceRangeChange([priceRange[0], newMax]);
                      }
                    }}
                    className="range-slider range-slider-max"
                  />
                </div>
              </div>

              <div className="price-range-inputs">
                <div className="price-input-wrapper">
                  <label className="price-input-label">R Min</label>
                  <input
                    type="number"
                    min="500"
                    max="3000"
                    value={priceRange[0]}
                    onChange={(e) => onPriceRangeChange([parseInt(e.target.value) || 500, priceRange[1]])}
                    className="price-input"
                    placeholder="500"
                  />
                </div>
                <div className="price-input-wrapper">
                  <label className="price-input-label">R Max</label>
                  <input
                    type="number"
                    min="500"
                    max="3000"
                    value={priceRange[1]}
                    onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value) || 3000])}
                    className="price-input"
                    placeholder="3000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Availability Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Availability</h4>
            <select
              value={availabilityFilter}
              onChange={(e) => onAvailabilityChange(e.target.value as any)}
              className="availability-select"
            >
              <option value="all">All Products</option>
              <option value="in-stock">In Stock</option>
              <option value="on-sale">On Sale</option>
            </select>
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
