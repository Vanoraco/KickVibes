import { useState, useRef, useEffect } from 'react';
import { Link, useFetcher } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import type { PredictiveSearchReturn } from '~/lib/search';

export function NewSearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fetcher = useFetcher<PredictiveSearchReturn>({ key: 'search' });
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle search input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    if (value.trim()) {
      fetcher.submit(
        { q: value, limit: '6' },
        { method: 'GET', action: '/search?predictive=true' }
      );
    }
  };

  // Handle search form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  // Handle search icon click
  const handleSearchIconClick = () => {
    setShowInput(true);
    setIsOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (!searchTerm) {
          setShowInput(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchTerm]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
        setShowInput(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const searchResults = fetcher.data?.result;
  const hasResults = searchResults && searchTerm.trim();

  return (
    <div className="new-search-bar" ref={containerRef}>
      {!showInput ? (
        // Search Icon
        <button
          onClick={handleSearchIconClick}
          className="search-icon-button"
          aria-label="Open search"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      ) : (
        // Search Input
        <div className={`search-input-container ${isOpen ? 'search-expanded' : ''}`}>
          <input
            ref={inputRef}
            type="search"
            placeholder="Search sneakers, brands..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (searchTerm.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
                }
              }
            }}
            className="search-input"
            autoComplete="off"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                inputRef.current?.focus();
              }}
              className="search-clear"
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}

          {/* Search Results Dropdown */}
          {isOpen && (
            <div className="search-results-dropdown">
              {hasResults ? (
                <div className="search-results-content">
                  {/* Products */}
                  {searchResults.items.products?.nodes?.length > 0 && (
                    <div className="search-section">
                      <h3 className="search-section-title">Products</h3>
                      <div className="search-products-grid">
                        {searchResults.items.products.nodes.slice(0, 4).map((product: any) => (
                          <a
                            key={product.id}
                            href={`/products/${product.handle}`}
                            className="search-product-item"
                            onClick={() => {
                              setIsOpen(false);
                              setShowInput(false);
                              setSearchTerm('');
                            }}
                          >
                            {product.featuredImage && (
                              <img
                                src={product.featuredImage.url}
                                alt={product.title}
                                className="search-product-image"
                              />
                            )}
                            <div className="search-product-info">
                              <h4 className="search-product-title">{product.title}</h4>
                              <p className="search-product-price">
                                {product.priceRange?.minVariantPrice?.amount &&
                                  `R${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}`
                                }
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* View All Results Button */}
                  <div className="search-view-all">
                    <a
                      href={`/search?q=${encodeURIComponent(searchTerm)}`}
                      className="search-view-all-button"
                      onClick={() => {
                        setIsOpen(false);
                        setShowInput(false);
                        setSearchTerm('');
                      }}
                    >
                      View all results for "{searchTerm}" →
                    </a>
                  </div>
                </div>
              ) : searchTerm ? (
                <div className="search-no-results">
                  <p>No results found for "{searchTerm}"</p>
                  <p className="search-no-results-suggestion">Try searching for sneakers, brands, or styles</p>
                </div>
              ) : (
                <div className="search-suggestions">
                  <h3 className="search-section-title">Popular Searches</h3>
                  <div className="search-suggestions-grid">
                    {['Nike Air Jordan', 'Adidas Campus', 'Running Shoes', 'Basketball', 'Lifestyle'].map((suggestion) => (
                      <button
                        key={suggestion}
                        className="search-suggestion-tag"
                        onClick={() => {
                          setSearchTerm(suggestion);
                          fetcher.submit(
                            { q: suggestion, limit: '6' },
                            { method: 'GET', action: '/search?predictive=true' }
                          );
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
