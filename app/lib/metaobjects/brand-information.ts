/**
 * Brand Information Metaobject Definition and GraphQL Queries
 *
 * This file contains the metaobject definition for brand information
 * and the GraphQL queries to fetch this data from Shopify.
 */

// Metaobject Definition for Shopify Admin
export const BRAND_INFORMATION_METAOBJECT_DEFINITION = {
  type: "brand_information",
  displayName: "Brand Information",
  description: "Brand information for logos, names, and links",
  fields: [
    {
      key: "name",
      name: "Brand Name",
      description: "Name of the brand",
      type: "single_line_text_field",
      required: true,
      validations: {
        max: 50
      }
    },
    {
      key: "display_name",
      name: "Display Name",
      description: "Name as it should appear on the website (if different from brand name)",
      type: "single_line_text_field",
      required: false,
      validations: {
        max: 50
      }
    },
    {
      key: "logo_image",
      name: "Logo Image",
      description: "Brand logo image",
      type: "file_reference",
      required: false,
      validations: {
        file_type_options: ["image"]
      }
    },
    {
      key: "website_url",
      name: "Website URL",
      description: "Official brand website URL",
      type: "url",
      required: false
    },
    {
      key: "collection_url",
      name: "Collection URL",
      description: "URL to the brand's collection on your store",
      type: "url",
      required: false
    },
    {
      key: "brand_color",
      name: "Brand Color",
      description: "Primary brand color (hex code)",
      type: "color",
      required: false
    },
    {
      key: "css_class",
      name: "CSS Class",
      description: "Additional CSS class for styling",
      type: "single_line_text_field",
      required: false,
      validations: {
        max: 50
      }
    },
    {
      key: "description",
      name: "Description",
      description: "Brief description of the brand",
      type: "multi_line_text_field",
      required: false,
      validations: {
        max: 300
      }
    },
    {
      key: "is_featured",
      name: "Is Featured",
      description: "Whether this brand should be featured prominently",
      type: "boolean",
      required: false
    },
    {
      key: "is_active",
      name: "Is Active",
      description: "Whether this brand should be displayed",
      type: "boolean",
      required: true
    },
    {
      key: "display_order",
      name: "Display Order",
      description: "Order in which this brand should appear",
      type: "number_integer",
      required: false
    }
  ]
};

// TypeScript interface for the brand information data
export interface BrandInformation {
  id: string;
  name: string;
  displayName?: string;
  logoImage?: {
    id: string;
    url: string;
    altText: string;
    width?: number;
    height?: number;
  };
  websiteUrl?: string;
  collectionUrl?: string;
  brandColor?: string;
  cssClass?: string;
  description?: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder?: number;
}

// GraphQL fragment for brand information
export const BRAND_INFORMATION_FRAGMENT = `#graphql
  fragment BrandInformation on Metaobject {
    id
    handle
    type
    fields {
      key
      value
      reference {
        ... on MediaImage {
          id
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
` as const;

// GraphQL query to fetch all active brands
export const BRAND_INFORMATION_QUERY = `#graphql
  query BrandInformation($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobjects(type: "brand_information", first: 50) {
      nodes {
        ...BrandInformation
      }
    }
  }
  ${BRAND_INFORMATION_FRAGMENT}
` as const;

// GraphQL query to fetch featured brands only
export const FEATURED_BRANDS_QUERY = `#graphql
  query FeaturedBrands($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobjects(type: "brand_information", first: 20) {
      nodes {
        ...BrandInformation
      }
    }
  }
  ${BRAND_INFORMATION_FRAGMENT}
` as const;

// GraphQL query to fetch specific brand by handle
export const BRAND_BY_HANDLE_QUERY = `#graphql
  query BrandByHandle(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: $handle, type: "brand_information"}) {
      ...BrandInformation
    }
  }
  ${BRAND_INFORMATION_FRAGMENT}
` as const;

// Utility function to transform metaobject data to typed interface
export function transformBrandInformationData(metaobject: any): BrandInformation | null {
  if (!metaobject || !metaobject.fields) return null;

  const fields = metaobject.fields.reduce((acc: any, field: any) => {
    acc[field.key] = field.value || field.reference;
    return acc;
  }, {});

  // Check if brand is active
  if (!fields.is_active || fields.is_active !== 'true') return null;

  return {
    id: metaobject.id,
    name: fields.name || '',
    displayName: fields.display_name || undefined,
    logoImage: fields.logo_image ? {
      id: fields.logo_image?.id || '',
      url: fields.logo_image?.image?.url || '',
      altText: fields.logo_image?.image?.altText || fields.name || '',
      width: fields.logo_image?.image?.width,
      height: fields.logo_image?.image?.height,
    } : undefined,
    websiteUrl: fields.website_url || undefined,
    collectionUrl: fields.collection_url || undefined,
    brandColor: fields.brand_color || undefined,
    cssClass: fields.css_class || undefined,
    description: fields.description || undefined,
    isFeatured: fields.is_featured === 'true',
    isActive: fields.is_active === 'true',
    displayOrder: fields.display_order ? parseInt(fields.display_order) : undefined,
  };
}

// Utility function to get active brands sorted by display order
export function getActiveBrands(metaobjects: any[]): BrandInformation[] {
  return metaobjects
    .map(transformBrandInformationData)
    .filter((brand): brand is BrandInformation => brand !== null)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
}

// Utility function to get featured brands only
export function getFeaturedBrands(metaobjects: any[]): BrandInformation[] {
  return getActiveBrands(metaobjects).filter(brand => brand.isFeatured);
}

// Default fallback brands for when metaobjects are not available
export const DEFAULT_BRANDS: BrandInformation[] = [
  {
    id: 'default-nike',
    name: 'Nike',
    displayName: 'NIKE',
    brandColor: '#1a1a1a',
    cssClass: 'brand-nike',
    collectionUrl: '/collections/nike',
    websiteUrl: 'https://www.nike.com',
    isFeatured: true,
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'default-sketcher',
    name: 'Skechers',
    displayName: 'SKETCHER',
    brandColor: '#6b7280',
    cssClass: 'brand-sketcha',
    collectionUrl: '/collections/skechers',
    websiteUrl: 'https://www.skechers.com',
    isFeatured: true,
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'default-reebok',
    name: 'Reebok',
    displayName: 'REEBOK',
    brandColor: '#6b7280',
    cssClass: 'brand-specha',
    collectionUrl: '/collections/reebok',
    websiteUrl: 'https://www.reebok.com',
    isFeatured: true,
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 'default-adidas',
    name: 'Adidas',
    displayName: 'ADIDAS',
    brandColor: '#1a1a1a',
    cssClass: 'brand-adhida',
    collectionUrl: '/collections/adidas',
    websiteUrl: 'https://www.adidas.com',
    isFeatured: true,
    isActive: true,
    displayOrder: 4,
  },
];