import {useState, useMemo} from 'react';
import {Pagination} from '@shopify/hydrogen';
import {NewEnhancedProductCard} from './NewEnhancedProductCard';
import '~/styles/new-enhanced-product-card.css';
import {ProductFilters} from './ProductFilters';
import {ProductSort} from './ProductSort';
import {ProductSearch} from './ProductSearch';

interface EnhancedAllProductsPageProps {
  products: any;
}

export function EnhancedAllProductsPage({products}: EnhancedAllProductsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 3000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'in-stock' | 'on-sale'>('all');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Extract unique product types from products for filtering
  const availableBrands = useMemo(() => {
    if (!products?.nodes) return [];
    const productTypes = new Set<string>();
    products.nodes.forEach((product: any) => {
      // Extract product type from title (e.g., "Sneakers", "Boots", "Running Shoes")
      const title = product.title.toLowerCase();
      if (title.includes('sneaker') || title.includes('trainer')) {
        productTypes.add('Sneakers');
      } else if (title.includes('boot')) {
        productTypes.add('Boots');
      } else if (title.includes('running')) {
        productTypes.add('Running Shoes');
      } else if (title.includes('basketball')) {
        productTypes.add('Basketball');
      } else if (title.includes('casual')) {
        productTypes.add('Casual');
      } else if (title.includes('sport')) {
        productTypes.add('Sports');
      } else {
        // Fallback to first word of title
        const firstWord = product.title.split(' ')[0];
        if (firstWord && firstWord.length > 2) {
          productTypes.add(firstWord);
        }
      }
    });
    return Array.from(productTypes);
  }, [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!products?.nodes) return [];

    const filtered = products.nodes.filter((product: any) => {
      // Search filter
      if (searchTerm && !product.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Price filter
      const price = parseFloat(product.priceRange.minVariantPrice.amount);
      if (price < priceRange[0] || price > priceRange[1]) {
        return false;
      }

      // Product type filter
      if (selectedBrands.length > 0) {
        const title = product.title.toLowerCase();
        let productType = '';

        if (title.includes('sneaker') || title.includes('trainer')) {
          productType = 'Sneakers';
        } else if (title.includes('boot')) {
          productType = 'Boots';
        } else if (title.includes('running')) {
          productType = 'Running Shoes';
        } else if (title.includes('basketball')) {
          productType = 'Basketball';
        } else if (title.includes('casual')) {
          productType = 'Casual';
        } else if (title.includes('sport')) {
          productType = 'Sports';
        } else {
          productType = product.title.split(' ')[0];
        }

        if (!selectedBrands.includes(productType)) {
          return false;
        }
      }

      // Availability filter
      if (availabilityFilter === 'in-stock' && !product.availableForSale) {
        return false;
      }

      if (availabilityFilter === 'on-sale') {
        const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);
        const maxPrice = parseFloat(product.priceRange.maxVariantPrice.amount);
        if (minPrice >= maxPrice) {
          return false;
        }
      }

      return true;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a: any, b: any) => 
          parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount)
        );
        break;
      case 'price-high':
        filtered.sort((a: any, b: any) => 
          parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount)
        );
        break;
      case 'name-asc':
        filtered.sort((a: any, b: any) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        filtered.sort((a: any, b: any) => b.title.localeCompare(a.title));
        break;
      default:
        // Keep original order for 'featured'
        break;
    }

    return filtered;
  }, [products, searchTerm, sortBy, priceRange, selectedBrands, availabilityFilter]);

  return (
    <div className="enhanced-all-products">
      {/* Hero Section */}
      <div className="products-hero">
        <div className="products-hero-content">
          <h1 className="products-hero-title">All Products</h1>
          <p className="products-hero-subtitle">
            Discover our complete collection of premium sneakers
          </p>
        </div>
      </div>

      {/* Main Content with Sidebar Layout */}
      <div className="products-main-content">
        <div className="products-main-container">

          {/* Mobile Filter Toggle */}
          <div className="mobile-filter-toggle-container">
            <button
              className="mobile-filter-toggle"
              onClick={() => setFiltersOpen(!filtersOpen)}
              aria-label={filtersOpen ? "Close filters" : "Open filters"}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filters {filtersOpen ? '✕' : ''}
            </button>
          </div>

          {/* Left Sidebar - Filters */}
          <aside className={`products-sidebar ${filtersOpen ? 'filters-open' : ''}`}>
            <div className="products-sidebar-content">
              <ProductSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />

              {/* Results Info */}
              <div className="sidebar-results-info">
                <span className="products-count">
                  {filteredAndSortedProducts.length} products found
                </span>
              </div>

              {/* Sort Controls */}
              <div className="sidebar-sort-section">
                <h4 className="filter-title">Sort By</h4>
                <ProductSort sortBy={sortBy} onSortChange={setSortBy} />
              </div>

              <ProductFilters
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                availableBrands={availableBrands}
                selectedBrands={selectedBrands}
                onBrandsChange={setSelectedBrands}
                availabilityFilter={availabilityFilter}
                onAvailabilityChange={setAvailabilityFilter}
                selectedSizes={selectedSizes}
                onSizesChange={setSelectedSizes}
              />
            </div>
          </aside>

          {/* Right Content - Products */}
          <main className="products-content">
            {/* Products Grid */}
            <div className="products-results">
              <Pagination connection={{
                ...products,
                nodes: filteredAndSortedProducts
              }}>
                {({nodes, isLoading, PreviousLink, NextLink}) => (
                  <div>
                    <PreviousLink className="pagination-link pagination-previous">
                      {isLoading ? 'Loading...' : '← Previous'}
                    </PreviousLink>

                    <div className="products-grid">
                      {nodes.map((product: any, index: number) => (
                        <NewEnhancedProductCard
                          key={product.id}
                          product={product}
                          loading={index < 8 ? 'eager' : 'lazy'}
                        />
                      ))}
                    </div>

                    <NextLink className="pagination-link pagination-next">
                      {isLoading ? 'Loading...' : 'Next →'}
                    </NextLink>
                  </div>
                )}
              </Pagination>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
