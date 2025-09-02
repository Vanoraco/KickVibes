/**
 * Category Cards Metaobject Definition and GraphQL Queries
 *
 * This file contains the metaobject definition for category cards
 * and the GraphQL queries to fetch this data from Shopify.
 */

// Metaobject Definition for Shopify Admin
export const CATEGORY_CARDS_METAOBJECT_DEFINITION = {
  type: "category_cards",
  displayName: "Category Cards",
  description: "Category cards for homepage sections",
  fields: [
    {
      key: "title",
      name: "Title",
      description: "Category title/name",
      type: "single_line_text_field",
      required: true,
      validations: {
        max: 50
      }
    },
    {
      key: "description",
      name: "Description",
      description: "Optional category description",
      type: "multi_line_text_field",
      required: false,
      validations: {
        max: 200
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
      key: "background_image",
      name: "Background Image",
      description: "Background image for the category card",
      type: "file_reference",
      required: false,
      validations: {
        file_type_options: ["image"]
      }
    },
    {
      key: "card_size",
      name: "Card Size",
      description: "Size of the category card",
      type: "single_line_text_field",
      required: true,
      validations: {
        choices: ["large", "medium", "small"]
      }
    },
    {
      key: "accent_color",
      name: "Accent Color",
      description: "Accent color for the card (hex code)",
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
      key: "is_active",
      name: "Is Active",
      description: "Whether this category card should be displayed",
      type: "boolean",
      required: true
    },
    {
      key: "display_order",
      name: "Display Order",
      description: "Order in which this card should appear",
      type: "number_integer",
      required: false
    }
  ]
};

// TypeScript interface for the category card data
export interface CategoryCard {
  id: string;
  title: string;
  description?: string;
  buttonText: string;
  buttonUrl: string;
  backgroundImage?: {
    id: string;
    url: string;
    altText: string;
    width?: number;
    height?: number;
  };
  cardSize: 'large' | 'medium' | 'small';
  accentColor?: string;
  cssClass?: string;
  isActive: boolean;
  displayOrder?: number;
}

// GraphQL fragment for category cards
export const CATEGORY_CARDS_FRAGMENT = `#graphql
  fragment CategoryCard on Metaobject {
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

// GraphQL query to fetch all active category cards
export const CATEGORY_CARDS_QUERY = `#graphql
  query CategoryCards($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobjects(type: "category_cards", first: 20) {
      nodes {
        ...CategoryCard
      }
    }
  }
  ${CATEGORY_CARDS_FRAGMENT}
` as const;

// GraphQL query to fetch specific category card by handle
export const CATEGORY_CARD_BY_HANDLE_QUERY = `#graphql
  query CategoryCardByHandle(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: $handle, type: "category_cards"}) {
      ...CategoryCard
    }
  }
  ${CATEGORY_CARDS_FRAGMENT}
` as const;

// Utility function to transform metaobject data to typed interface
export function transformCategoryCardData(metaobject: any): CategoryCard | null {
  if (!metaobject || !metaobject.fields) return null;

  const fields = metaobject.fields.reduce((acc: any, field: any) => {
    acc[field.key] = field.value || field.reference;
    return acc;
  }, {});

  // Check if card is active
  if (!fields.is_active || fields.is_active !== 'true') return null;

  return {
    id: metaobject.id,
    title: fields.title || '',
    description: fields.description || undefined,
    buttonText: fields.button_text || 'View More',
    buttonUrl: fields.button_url || '/',
    backgroundImage: fields.background_image ? {
      id: fields.background_image?.id || '',
      url: fields.background_image?.image?.url || '',
      altText: fields.background_image?.image?.altText || fields.title || '',
      width: fields.background_image?.image?.width,
      height: fields.background_image?.image?.height,
    } : undefined,
    cardSize: (fields.card_size as 'large' | 'medium' | 'small') || 'medium',
    accentColor: fields.accent_color || undefined,
    cssClass: fields.css_class || undefined,
    isActive: fields.is_active === 'true',
    displayOrder: fields.display_order ? parseInt(fields.display_order) : undefined,
  };
}

// Utility function to get active category cards sorted by display order
export function getActiveCategoryCards(metaobjects: any[]): CategoryCard[] {
  return metaobjects
    .map(transformCategoryCardData)
    .filter((card): card is CategoryCard => card !== null)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
}

// Default fallback category cards for when metaobjects are not available
export const DEFAULT_CATEGORY_CARDS: CategoryCard[] = [
  {
    id: 'default-running',
    title: 'RUNNING.',
    buttonText: 'SEE PRODUCT',
    buttonUrl: '/collections/all',
    cardSize: 'large',
    cssClass: 'category-running-bg',
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'default-women',
    title: 'WOMEN',
    buttonText: 'SEE PRODUCT',
    buttonUrl: '/collections/all',
    cardSize: 'medium',
    cssClass: 'category-woman-bg',
    accentColor: '#ff0000',
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'default-men',
    title: 'MEN',
    buttonText: 'SEE PRODUCT',
    buttonUrl: '/collections/all',
    cardSize: 'medium',
    cssClass: 'category-man-bg',
    accentColor: '#ff0000',
    isActive: true,
    displayOrder: 3,
  },
];