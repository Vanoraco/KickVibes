import {useState, useMemo} from 'react';
import {Pagination} from '@shopify/hydrogen';
import {EnhancedProductCard} from './EnhancedProductCard';
import {ProductFilters} from './ProductFilters';
import {ProductSort} from './ProductSort';
import {ViewToggle} from './ViewToggle';
import {ProductSearch} from './ProductSearch';

interface EnhancedAllProductsPageProps {
  products: any;
}

export function EnhancedAllProductsPage({products}: EnhancedAllProductsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 3000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'in-stock' | 'on-sale'>('all');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // Extract unique brands from products for filtering
  const availableBrands = useMemo(() => {
    if (!products?.nodes) return [];
    const brands = new Set<string>();
    products.nodes.forEach((product: any) => {
      // Extract brand from product title or vendor
      const brand = product.vendor || product.title.split(' ')[0];
      brands.add(brand);
    });
    return Array.from(brands);
  }, [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!products?.nodes) return [];

    let filtered = products.nodes.filter((product: any) => {
      // Search filter
      if (searchTerm && !product.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Price filter
      const price = parseFloat(product.priceRange.minVariantPrice.amount);
      if (price < priceRange[0] || price > priceRange[1]) {
        return false;
      }

      // Brand filter
      if (selectedBrands.length > 0) {
        const brand = product.vendor || product.title.split(' ')[0];
        if (!selectedBrands.includes(brand)) {
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
  }, [products, searchTerm, sortBy, priceRange, selectedBrands, availabilityFilter, selectedSizes]);

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

          {/* Left Sidebar - Filters */}
          <aside className="products-sidebar">
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
            {/* Top Controls - Only View Toggle */}
            <div className="products-content-header">
              <div className="products-content-controls">
                <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
              </div>
            </div>

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

                    <div className={`products-grid ${viewMode === 'list' ? 'products-list' : ''}`}>
                      {nodes.map((product: any, index: number) => (
                        <EnhancedProductCard
                          key={product.id}
                          product={product}
                          loading={index < 8 ? 'eager' : 'lazy'}
                          viewMode={viewMode}
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
