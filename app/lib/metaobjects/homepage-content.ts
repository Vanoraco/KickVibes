/**
 * Homepage Content Metaobject Definition and GraphQL Queries
 *
 * This file contains the metaobject definition for homepage promotional content
 * and the GraphQL queries to fetch this data from Shopify.
 */

// Metaobject Definition for Shopify Admin
export const HOMEPAGE_CONTENT_METAOBJECT_DEFINITION = {
  type: "homepage_content",
  displayName: "Homepage Content",
  description: "Content for homepage promotional sections",
  fields: [
    {
      key: "title",
      name: "Title",
      description: "Main promotional title (supports line breaks with \\n)",
      type: "single_line_text_field",
      required: true,
      validations: {
        max: 100
      }
    },
    {
      key: "description",
      name: "Description",
      description: "Promotional description text",
      type: "multi_line_text_field",
      required: true,
      validations: {
        max: 500
      }
    },
    {
      key: "button_text",
      name: "Button Text",
      description: "Call-to-action button text",
      type: "single_line_text_field",
      required: true,
      validations: {
        max: 20
      }
    },
    {
      key: "button_url",
      name: "Button URL",
      description: "URL for the call-to-action button",
      type: "url",
      required: true
    },
    {
      key: "featured_image",
      name: "Featured Image",
      description: "Main promotional image",
      type: "file_reference",
      required: true,
      validations: {
        file_type_options: ["image"]
      }
    },
    {
      key: "image_alt_text",
      name: "Image Alt Text",
      description: "Alternative text for the featured image",
      type: "single_line_text_field",
      required: true,
      validations: {
        max: 100
      }
    },
    {
      key: "is_active",
      name: "Is Active",
      description: "Whether this content should be displayed",
      type: "boolean",
      required: true
    },
    {
      key: "display_order",
      name: "Display Order",
      description: "Order in which this content should appear",
      type: "number_integer",
      required: false
    }
  ]
};

// TypeScript interface for the homepage content data
export interface HomepageContent {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  featuredImage: {
    id: string;
    url: string;
    altText: string;
    width?: number;
    height?: number;
  };
  imageAltText: string;
  isActive: boolean;
  displayOrder?: number;
}

// GraphQL fragment for homepage content
export const HOMEPAGE_CONTENT_FRAGMENT = `#graphql
  fragment HomepageContent on Metaobject {
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

// GraphQL query to fetch all active homepage content
export const HOMEPAGE_CONTENT_QUERY = `#graphql
  query HomepageContent($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobjects(type: "homepage_content", first: 10) {
      nodes {
        ...HomepageContent
      }
    }
  }
  ${HOMEPAGE_CONTENT_FRAGMENT}
` as const;

// GraphQL query to fetch specific homepage content by handle
export const HOMEPAGE_CONTENT_BY_HANDLE_QUERY = `#graphql
  query HomepageContentByHandle(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: $handle, type: "homepage_content"}) {
      ...HomepageContent
    }
  }
  ${HOMEPAGE_CONTENT_FRAGMENT}
` as const;

// Utility function to transform metaobject data to typed interface
export function transformHomepageContentData(metaobject: any): HomepageContent | null {
  if (!metaobject || !metaobject.fields) return null;

  const fields = metaobject.fields.reduce((acc: any, field: any) => {
    acc[field.key] = field.value || field.reference;
    return acc;
  }, {});

  // Check if content is active
  if (!fields.is_active || fields.is_active !== 'true') return null;

  return {
    id: metaobject.id,
    title: fields.title || '',
    description: fields.description || '',
    buttonText: fields.button_text || 'Learn More',
    buttonUrl: fields.button_url || '/',
    featuredImage: {
      id: fields.featured_image?.id || '',
      url: fields.featured_image?.image?.url || '',
      altText: fields.featured_image?.image?.altText || fields.image_alt_text || '',
      width: fields.featured_image?.image?.width,
      height: fields.featured_image?.image?.height,
    },
    imageAltText: fields.image_alt_text || '',
    isActive: fields.is_active === 'true',
    displayOrder: fields.display_order ? parseInt(fields.display_order) : undefined,
  };
}

// Utility function to get active homepage content sorted by display order
export function getActiveHomepageContent(metaobjects: any[]): HomepageContent[] {
  return metaobjects
    .map(transformHomepageContentData)
    .filter((content): content is HomepageContent => content !== null)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
}

// Default fallback content for when metaobjects are not available
export const DEFAULT_HOMEPAGE_CONTENT: HomepageContent = {
  id: 'default',
  title: 'MAKES YOURSELF KEEP\nSPORTY & STYLISH',
  description: 'We believe that great style shouldn\'t break the bank. Our selection brings you quality, comfort, and the hottest trends from around the world, all at prices that make sense for the South African consumer.',
  buttonText: 'SHOP NOW',
  buttonUrl: '/collections/all',
  featuredImage: {
    id: 'default-image',
    url: 'https://cdn.shopify.com/s/files/1/0757/9461/2478/files/proshoe.webp?v=1753864297',
    altText: 'Sporty & Stylish Sneakers',
  },
  imageAltText: 'Sporty & Stylish Sneakers',
  isActive: true,
  displayOrder: 1,
};