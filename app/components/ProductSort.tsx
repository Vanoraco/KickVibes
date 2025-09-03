import { useState, useRef, useEffect } from 'react';

interface ProductSortProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

export function ProductSort({sortBy, onSortChange}: ProductSortProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    {value: 'featured', label: 'Featured', icon: '⭐'},
    {value: 'price-low', label: 'Price: Low to High', icon: '💰'},
    {value: 'price-high', label: 'Price: High to Low', icon: '💎'},
    {value: 'name-asc', label: 'Name: A to Z', icon: '🔤'},
    {value: 'name-desc', label: 'Name: Z to A', icon: '🔠'},
  ];

  const selectedOption = sortOptions.find(option => option.value === sortBy) || sortOptions[0];

  const handleOptionClick = (value: string) => {
    onSortChange(value);
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
    <div className="enhanced-product-sort" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`enhanced-sort-trigger ${isOpen ? 'open' : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="enhanced-sort-selected">
          <span className="enhanced-sort-icon">{selectedOption.icon}</span>
          <span className="enhanced-sort-label">{selectedOption.label}</span>
        </div>
        <svg
          className={`enhanced-sort-chevron ${isOpen ? 'rotated' : ''}`}
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
        <div className="enhanced-sort-dropdown">
          <div className="enhanced-sort-options">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`enhanced-sort-option ${option.value === sortBy ? 'selected' : ''}`}
                role="option"
                aria-selected={option.value === sortBy}
              >
                <span className="enhanced-sort-option-icon">{option.icon}</span>
                <span className="enhanced-sort-option-label">{option.label}</span>
                {option.value === sortBy && (
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
