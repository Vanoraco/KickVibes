/**
 * Product Filters Metaobject Definition and GraphQL Queries
 *
 * This file contains the metaobject definition for product filters
 * and the GraphQL queries to fetch this data from Shopify.
 */

// Metaobject Definition for Shopify Admin
export const PRODUCT_FILTERS_METAOBJECT_DEFINITION = {
  type: "product_filters",
  displayName: "Product Filters",
  description: "Configuration for product filtering options",
  fields: [
    {
      key: "filter_type",
      name: "Filter Type",
      description: "Type of filter (size, color, material, etc.)",
      type: "single_line_text_field",
      required: true,
      validations: {
        choices: ["size", "color", "material", "brand", "price_range", "availability", "category", "custom"]
      }
    },
    {
      key: "filter_name",
      name: "Filter Name",
      description: "Display name for the filter",
      type: "single_line_text_field",
      required: true,
      validations: {
        max: 50
      }
    },
    {
      key: "filter_options",
      name: "Filter Options",
      description: "Available options for this filter (one per line)",
      type: "multi_line_text_field",
      required: true,
      validations: {
        max: 1000
      }
    },
    {
      key: "default_options",
      name: "Default Options",
      description: "Default selected options (one per line)",
      type: "multi_line_text_field",
      required: false,
      validations: {
        max: 500
      }
    },
    {
      key: "min_value",
      name: "Minimum Value",
      description: "Minimum value for range filters (price, etc.)",
      type: "number_decimal",
      required: false
    },
    {
      key: "max_value",
      name: "Maximum Value",
      description: "Maximum value for range filters (price, etc.)",
      type: "number_decimal",
      required: false
    },
    {
      key: "step_value",
      name: "Step Value",
      description: "Step increment for range filters",
      type: "number_decimal",
      required: false
    },
    {
      key: "filter_style",
      name: "Filter Style",
      description: "How the filter should be displayed",
      type: "single_line_text_field",
      required: false,
      validations: {
        choices: ["checkbox", "radio", "dropdown", "range", "color_swatch", "size_grid"]
      }
    },
    {
      key: "is_collapsible",
      name: "Is Collapsible",
      description: "Whether this filter section can be collapsed",
      type: "boolean",
      required: false
    },
    {
      key: "is_expanded_default",
      name: "Is Expanded by Default",
      description: "Whether this filter section is expanded by default",
      type: "boolean",
      required: false
    },
    {
      key: "is_active",
      name: "Is Active",
      description: "Whether this filter should be displayed",
      type: "boolean",
      required: true
    },
    {
      key: "display_order",
      name: "Display Order",
      description: "Order in which this filter should appear",
      type: "number_integer",
      required: false
    }
  ]
};

// TypeScript interface for the product filter data
export interface ProductFilter {
  id: string;
  filterType: 'size' | 'color' | 'material' | 'brand' | 'price_range' | 'availability' | 'category' | 'custom';
  filterName: string;
  filterOptions: string[];
  defaultOptions?: string[];
  minValue?: number;
  maxValue?: number;
  stepValue?: number;
  filterStyle?: 'checkbox' | 'radio' | 'dropdown' | 'range' | 'color_swatch' | 'size_grid';
  isCollapsible: boolean;
  isExpandedDefault: boolean;
  isActive: boolean;
  displayOrder?: number;
}

// GraphQL fragment for product filters
export const PRODUCT_FILTERS_FRAGMENT = `#graphql
  fragment ProductFilter on Metaobject {
    id
    handle
    type
    fields {
      key
      value
    }
  }
` as const;

// GraphQL query to fetch all active product filters
export const PRODUCT_FILTERS_QUERY = `#graphql
  query ProductFilters($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobjects(type: "product_filters", first: 50) {
      nodes {
        ...ProductFilter
      }
    }
  }
  ${PRODUCT_FILTERS_FRAGMENT}
` as const;

// GraphQL query to fetch specific filter by handle
export const PRODUCT_FILTER_BY_HANDLE_QUERY = `#graphql
  query ProductFilterByHandle(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: $handle, type: "product_filters"}) {
      ...ProductFilter
    }
  }
  ${PRODUCT_FILTERS_FRAGMENT}
` as const;

// Utility function to transform metaobject data to typed interface
export function transformProductFilterData(metaobject: any): ProductFilter | null {
  if (!metaobject || !metaobject.fields) return null;

  const fields = metaobject.fields.reduce((acc: any, field: any) => {
    acc[field.key] = field.value;
    return acc;
  }, {});

  // Check if filter is active
  if (!fields.is_active || fields.is_active !== 'true') return null;

  // Parse filter options from multi-line text
  const filterOptions = fields.filter_options
    ? fields.filter_options.split('\n').map((option: string) => option.trim()).filter(Boolean)
    : [];

  // Parse default options from multi-line text
  const defaultOptions = fields.default_options
    ? fields.default_options.split('\n').map((option: string) => option.trim()).filter(Boolean)
    : undefined;

  return {
    id: metaobject.id,
    filterType: fields.filter_type as ProductFilter['filterType'] || 'custom',
    filterName: fields.filter_name || '',
    filterOptions,
    defaultOptions,
    minValue: fields.min_value ? parseFloat(fields.min_value) : undefined,
    maxValue: fields.max_value ? parseFloat(fields.max_value) : undefined,
    stepValue: fields.step_value ? parseFloat(fields.step_value) : undefined,
    filterStyle: fields.filter_style as ProductFilter['filterStyle'] || 'checkbox',
    isCollapsible: fields.is_collapsible === 'true',
    isExpandedDefault: fields.is_expanded_default === 'true',
    isActive: fields.is_active === 'true',
    displayOrder: fields.display_order ? parseInt(fields.display_order) : undefined,
  };
}

// Utility function to get active product filters sorted by display order
export function getActiveProductFilters(metaobjects: any[]): ProductFilter[] {
  return metaobjects
    .map(transformProductFilterData)
    .filter((filter): filter is ProductFilter => filter !== null)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
}

// Utility function to get filters by type
export function getFiltersByType(filters: ProductFilter[], type: ProductFilter['filterType']): ProductFilter[] {
  return filters.filter(filter => filter.filterType === type);
}

// Utility function to get size filter options
export function getSizeOptions(filters: ProductFilter[]): string[] {
  const sizeFilter = filters.find(filter => filter.filterType === 'size');
  return sizeFilter?.filterOptions || [];
}

// Utility function to get price range filter
export function getPriceRangeFilter(filters: ProductFilter[]): { min: number; max: number; step: number } | null {
  const priceFilter = filters.find(filter => filter.filterType === 'price_range');
  if (!priceFilter || priceFilter.minValue === undefined || priceFilter.maxValue === undefined) {
    return null;
  }

  return {
    min: priceFilter.minValue,
    max: priceFilter.maxValue,
    step: priceFilter.stepValue || 1,
  };
}

// Default fallback product filters for when metaobjects are not available
export const DEFAULT_PRODUCT_FILTERS: ProductFilter[] = [
  {
    id: 'default-price-range',
    filterType: 'price_range',
    filterName: 'Price Range',
    filterOptions: [],
    minValue: 500,
    maxValue: 3000,
    stepValue: 50,
    filterStyle: 'range',
    isCollapsible: true,
    isExpandedDefault: true,
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'default-sizes',
    filterType: 'size',
    filterName: 'Size',
    filterOptions: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
    filterStyle: 'size_grid',
    isCollapsible: true,
    isExpandedDefault: true,
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'default-availability',
    filterType: 'availability',
    filterName: 'Availability',
    filterOptions: ['all', 'in-stock', 'on-sale'],
    defaultOptions: ['all'],
    filterStyle: 'radio',
    isCollapsible: true,
    isExpandedDefault: true,
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 'default-brands',
    filterType: 'brand',
    filterName: 'Brands',
    filterOptions: ['Nike', 'Adidas', 'Reebok', 'Skechers', 'Puma', 'New Balance'],
    filterStyle: 'checkbox',
    isCollapsible: true,
    isExpandedDefault: true,
    isActive: true,
    displayOrder: 4,
  },
];