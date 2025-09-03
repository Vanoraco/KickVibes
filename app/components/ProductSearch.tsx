import { useState, useRef, useEffect } from 'react';

interface ProductSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function ProductSearch({searchTerm, onSearchChange}: ProductSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions] = useState([
    'Nike Air Max', 'Adidas Ultraboost', 'Jordan Retro', 'Converse Chuck Taylor',
    'Vans Old Skool', 'Puma Suede', 'New Balance 990', 'Reebok Classic'
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchTerm.toLowerCase()) &&
    suggestion.toLowerCase() !== searchTerm.toLowerCase()
  ).slice(0, 5);

  const handleSuggestionClick = (suggestion: string) => {
    onSearchChange(suggestion);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="enhanced-product-search">
      <div className="enhanced-search-container">
        <div className={`enhanced-search-input-wrapper ${isFocused ? 'focused' : ''}`}>
          <svg
            className="enhanced-search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search sneakers, brands, styles..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className="enhanced-search-input"
          />
          {searchTerm && (
            <button
              onClick={() => {
                onSearchChange('');
                inputRef.current?.focus();
              }}
              className="enhanced-search-clear"
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* Search Suggestions Dropdown */}
        {isFocused && searchTerm && filteredSuggestions.length > 0 && (
          <div className="enhanced-search-suggestions">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="enhanced-search-suggestion-item"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
