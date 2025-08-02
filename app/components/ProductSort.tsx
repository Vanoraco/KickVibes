interface ProductSortProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

export function ProductSort({sortBy, onSortChange}: ProductSortProps) {
  const sortOptions = [
    {value: 'featured', label: 'Featured'},
    {value: 'price-low', label: 'Price: Low to High'},
    {value: 'price-high', label: 'Price: High to Low'},
    {value: 'name-asc', label: 'Name: A to Z'},
    {value: 'name-desc', label: 'Name: Z to A'},
  ];

  return (
    <div className="product-sort">
      <label htmlFor="sort-select" className="sort-label">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="sort-select"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
