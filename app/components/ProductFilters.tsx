
import { useState, useRef, useEffect } from 'react';
import type { ProductFilter } from '~/lib/metaobjects/product-filters';
import { DEFAULT_PRODUCT_FILTERS, getSizeOptions, getPriceRangeFilter } from '~/lib/metaobjects/product-filters';

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
  productFilters?: ProductFilter[];
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
  onClose,
  productFilters
}: ProductFiltersProps) {

  // Use provided filters or fallback to default
  const filters = productFilters && productFilters.length > 0 ? productFilters : DEFAULT_PRODUCT_FILTERS;

  // Get dynamic values from filters
  const sizeOptions = getSizeOptions(filters);
  const priceRangeConfig = getPriceRangeFilter(filters);

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
    // Use dynamic price range from filters or fallback to default
    const defaultPriceRange: [number, number] = priceRangeConfig
      ? [priceRangeConfig.min, priceRangeConfig.max]
      : [500, 3000];

    onPriceRangeChange(defaultPriceRange);
    onBrandsChange([]);
    onAvailabilityChange('all');
    onSizesChange([]);
  };

  // Calculate active filters count using dynamic values
  const defaultPriceRange = priceRangeConfig
    ? [priceRangeConfig.min, priceRangeConfig.max]
    : [500, 3000];

  const activeFiltersCount = selectedBrands.length +
    selectedSizes.length +
    (priceRange[0] > defaultPriceRange[0] || priceRange[1] < defaultPriceRange[1] ? 1 : 0) +
    (availabilityFilter !== 'all' ? 1 : 0);

  // Use dynamic size options or fallback to default
  const commonSizes = sizeOptions.length > 0
    ? sizeOptions
    : ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'];

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
            <EnhancedAvailabilityFilter
              value={availabilityFilter}
              onChange={onAvailabilityChange}
            />
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

// Enhanced Availability Filter Component
interface EnhancedAvailabilityFilterProps {
  value: 'all' | 'in-stock' | 'on-sale';
  onChange: (value: 'all' | 'in-stock' | 'on-sale') => void;
}

function EnhancedAvailabilityFilter({ value, onChange }: EnhancedAvailabilityFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availabilityOptions = [
    { value: 'all', label: 'All Products', icon: '📦', description: 'Show all items' },
    { value: 'in-stock', label: 'In Stock', icon: '✅', description: 'Available now' },
    { value: 'on-sale', label: 'On Sale', icon: '🏷️', description: 'Discounted items' },
  ];

  const selectedOption = availabilityOptions.find(option => option.value === value) || availabilityOptions[0];

  const handleOptionClick = (optionValue: 'all' | 'in-stock' | 'on-sale') => {
    onChange(optionValue);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="enhanced-availability-filter" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`enhanced-availability-trigger ${isOpen ? 'open' : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="enhanced-availability-selected">
          <span className="enhanced-availability-icon">{selectedOption.icon}</span>
          <div className="enhanced-availability-text">
            <span className="enhanced-availability-label">{selectedOption.label}</span>
            <span className="enhanced-availability-description">{selectedOption.description}</span>
          </div>
        </div>
        <svg
          className={`enhanced-availability-chevron ${isOpen ? 'rotated' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </button>

      {isOpen && (
        <div className="enhanced-availability-dropdown">
          <div className="enhanced-availability-options">
            {availabilityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option.value as 'all' | 'in-stock' | 'on-sale')}
                className={`enhanced-availability-option ${option.value === value ? 'selected' : ''}`}
                role="option"
                aria-selected={option.value === value}
              >
                <span className="enhanced-availability-option-icon">{option.icon}</span>
                <div className="enhanced-availability-option-text">
                  <span className="enhanced-availability-option-label">{option.label}</span>
                  <span className="enhanced-availability-option-description">{option.description}</span>
                </div>
                {option.value === value && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
