import { useId } from 'react';
import { Aside, useAside } from './Aside';
import { SearchFormPredictive } from './SearchFormPredictive';
import { SearchResultsPredictive } from './SearchResultsPredictive';

export function EnhancedSearchAside() {
  const queriesDatalistId = useId();
  const { close } = useAside();

  return (
    <Aside type="search" heading="">
      <div className="enhanced-search-container">
        {/* Search Header */}
        <div className="enhanced-search-header">
          <h2 className="enhanced-search-title">Search Products</h2>
          <button 
            className="enhanced-search-close" 
            onClick={close}
            aria-label="Close search"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Enhanced Search Form */}
        <div className="enhanced-search-form-container">
          <SearchFormPredictive>
            {({fetchResults, goToSearch, inputRef}) => (
              <div className="enhanced-search-input-wrapper">
                <div className="enhanced-search-input-container">
                  <svg 
                    className="enhanced-search-icon" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    name="q"
                    onChange={fetchResults}
                    onFocus={fetchResults}
                    placeholder="Search for sneakers, brands, styles..."
                    ref={inputRef}
                    type="search"
                    className="enhanced-search-input"
                    list={queriesDatalistId}
                  />
                  <button 
                    onClick={goToSearch}
                    className="enhanced-search-button"
                    type="button"
                  >
                    Search
                  </button>
                </div>
              </div>
            )}
          </SearchFormPredictive>
        </div>

        {/* Search Results */}
        <div className="enhanced-search-results">
          <SearchResultsPredictive>
            {({items, total, term, closeSearch}) => {
              const {queries, products, collections, pages, articles} = items;

              if (!term.current) {
                return (
                  <div className="enhanced-search-suggestions">
                    <h3>Popular Searches</h3>
                    <div className="search-suggestions-grid">
                      <button className="search-suggestion-tag">Nike Air Jordan</button>
                      <button className="search-suggestion-tag">Adidas Campus</button>
                      <button className="search-suggestion-tag">Running Shoes</button>
                      <button className="search-suggestion-tag">Basketball</button>
                      <button className="search-suggestion-tag">Lifestyle</button>
                      <button className="search-suggestion-tag">Limited Edition</button>
                    </div>
                  </div>
                );
              }

              if (!total) {
                return (
                  <div className="enhanced-search-no-results">
                    <div className="no-results-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3>No results found</h3>
                    <p>Try searching for different keywords or check your spelling.</p>
                  </div>
                );
              }

              return (
                <div className="enhanced-search-results-content">
                  <SearchResultsPredictive.Queries
                    queries={queries}
                    queriesDatalistId={queriesDatalistId}
                  />
                  <SearchResultsPredictive.Products
                    products={products}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Collections
                    collections={collections}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Pages
                    pages={pages}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Articles
                    articles={articles}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  {term.current && total && (
                    <div className="enhanced-search-view-all">
                      <button
                        onClick={() => {
                          // Navigate to full search results
                          window.location.href = `/search?q=${term.current}`;
                          closeSearch();
                        }}
                        className="enhanced-search-view-all-button"
                      >
                        View all {total} results for "{term.current}"
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              );
            }}
          </SearchResultsPredictive>
        </div>
      </div>
    </Aside>
  );
}
