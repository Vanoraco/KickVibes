/**
 * Hero Section Metaobject Definition and GraphQL Queries
 *
 * This file contains the metaobject definition for the main hero section
 * and the GraphQL queries to fetch this data from Shopify.
 */

// Metaobject Definition for Shopify Admin
export const HERO_SECTION_METAOBJECT_DEFINITION = {
  type: "hero_section",
  displayName: "Hero Section",
  description: "Main hero section content for the homepage",
  fields: [
    {
      key: "hero_title",
      name: "Hero Title",
      description: "Main hero title (e.g., KICKVIBES)",
      type: "single_line_text_field",
      required: true,
      validations: {
        max: 50
      }
    },
    {
      key: "hero_subtitle",
      name: "Hero Subtitle",
      description: "Hero subtitle (e.g., COMFY AND TRENDY)",
      type: "single_line_text_field",
      required: true,
      validations: {
        max: 100
      }
    },
    {
      key: "hero_description",
      name: "Hero Description",
      description: "Main hero description text",
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
        max: 30
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
      key: "main_hero_image",
      name: "Main Hero Image",
      description: "Main large hero image (right side)",
      type: "file_reference",
      required: true,
      validations: {
        file_type_options: ["image"]
      }
    },
    {
      key: "main_image_alt_text",
      name: "Main Image Alt Text",
      description: "Alternative text for the main hero image",
      type: "single_line_text_field",
      required: true,
      validations: {
        max: 100
      }
    },
    {
      key: "thumbnail_image_1",
      name: "Thumbnail Image 1",
      description: "First thumbnail image",
      type: "file_reference",
      required: false,
      validations: {
        file_type_options: ["image"]
      }
    },
    {
      key: "thumbnail_1_alt_text",
      name: "Thumbnail 1 Alt Text",
      description: "Alternative text for thumbnail 1",
      type: "single_line_text_field",
      required: false,
      validations: {
        max: 100
      }
    },
    {
      key: "thumbnail_image_2",
      name: "Thumbnail Image 2",
      description: "Second thumbnail image",
      type: "file_reference",
      required: false,
      validations: {
        file_type_options: ["image"]
      }
    },
    {
      key: "thumbnail_2_alt_text",
      name: "Thumbnail 2 Alt Text",
      description: "Alternative text for thumbnail 2",
      type: "single_line_text_field",
      required: false,
      validations: {
        max: 100
      }
    },
    {
      key: "is_active",
      name: "Is Active",
      description: "Whether this hero section should be displayed",
      type: "boolean",
      required: true
    }
  ]
};

// TypeScript interface for the hero section data
export interface HeroSection {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  buttonText: string;
  buttonUrl: string;
  mainHeroImage: {
    id: string;
    url: string;
    altText: string;
    width?: number;
    height?: number;
  };
  mainImageAltText: string;
  thumbnailImage1?: {
    id: string;
    url: string;
    altText: string;
    width?: number;
    height?: number;
  };
  thumbnail1AltText?: string;
  thumbnailImage2?: {
    id: string;
    url: string;
    altText: string;
    width?: number;
    height?: number;
  };
  thumbnail2AltText?: string;
  isActive: boolean;
}

// GraphQL fragment for hero section
export const HERO_SECTION_FRAGMENT = `#graphql
  fragment HeroSection on Metaobject {
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

// GraphQL query to fetch hero section
export const HERO_SECTION_QUERY = `#graphql
  query HeroSection($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobjects(type: "hero_section", first: 5) {
      nodes {
        ...HeroSection
      }
    }
  }
  ${HERO_SECTION_FRAGMENT}
` as const;

// GraphQL query to fetch specific hero section by handle
export const HERO_SECTION_BY_HANDLE_QUERY = `#graphql
  query HeroSectionByHandle(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: $handle, type: "hero_section"}) {
      ...HeroSection
    }
  }
  ${HERO_SECTION_FRAGMENT}
` as const;

// Utility function to transform metaobject data to typed interface
export function transformHeroSectionData(metaobject: any): HeroSection | null {
  if (!metaobject || !metaobject.fields) return null;

  const fields = metaobject.fields.reduce((acc: any, field: any) => {
    acc[field.key] = field.value || field.reference;
    return acc;
  }, {});

  // Check if hero section is active
  if (!fields.is_active || fields.is_active !== 'true') return null;

  return {
    id: metaobject.id,
    heroTitle: fields.hero_title || '',
    heroSubtitle: fields.hero_subtitle || '',
    heroDescription: fields.hero_description || '',
    buttonText: fields.button_text || 'SHOP NOW',
    buttonUrl: fields.button_url || '/collections/all',
    mainHeroImage: {
      id: fields.main_hero_image?.id || '',
      url: fields.main_hero_image?.image?.url || '',
      altText: fields.main_hero_image?.image?.altText || fields.main_image_alt_text || '',
      width: fields.main_hero_image?.image?.width,
      height: fields.main_hero_image?.image?.height,
    },
    mainImageAltText: fields.main_image_alt_text || '',
    thumbnailImage1: fields.thumbnail_image_1 ? {
      id: fields.thumbnail_image_1?.id || '',
      url: fields.thumbnail_image_1?.image?.url || '',
      altText: fields.thumbnail_image_1?.image?.altText || fields.thumbnail_1_alt_text || '',
      width: fields.thumbnail_image_1?.image?.width,
      height: fields.thumbnail_image_1?.image?.height,
    } : undefined,
    thumbnail1AltText: fields.thumbnail_1_alt_text || undefined,
    thumbnailImage2: fields.thumbnail_image_2 ? {
      id: fields.thumbnail_image_2?.id || '',
      url: fields.thumbnail_image_2?.image?.url || '',
      altText: fields.thumbnail_image_2?.image?.altText || fields.thumbnail_2_alt_text || '',
      width: fields.thumbnail_image_2?.image?.width,
      height: fields.thumbnail_image_2?.image?.height,
    } : undefined,
    thumbnail2AltText: fields.thumbnail_2_alt_text || undefined,
    isActive: fields.is_active === 'true',
  };
}

// Utility function to get active hero section (there should typically be only one)
export function getActiveHeroSection(metaobjects: any[]): HeroSection | null {
  const heroSections = metaobjects
    .map(transformHeroSectionData)
    .filter((section): section is HeroSection => section !== null);

  // Return the first active hero section (there should typically be only one)
  return heroSections.length > 0 ? heroSections[0] : null;
}

// Default fallback hero section for when metaobjects are not available
export const DEFAULT_HERO_SECTION: HeroSection = {
  id: 'default-hero-section',
  heroTitle: 'KICKVIBES',
  heroSubtitle: 'COMFY AND TRENDY',
  heroDescription: 'Your destination for the comfiest and trendiest sneakers and shoes in South Africa. Find your perfect pair with our curated collection of styles, blending cutting-edge design with all-day comfort. Step up your street style with KICKVIBES.',
  buttonText: 'SHOP NOW',
  buttonUrl: '/collections/all',
  mainHeroImage: {
    id: 'default-hero-image',
    url: 'https://cdn.shopify.com/s/files/1/0757/9461/2478/files/Sneaker.png?v=1753524891',
    altText: 'KickVibes Sneaker',
  },
  mainImageAltText: 'KickVibes Sneaker',
  thumbnailImage1: {
    id: 'default-thumb-1',
    url: 'https://cdn.shopify.com/s/files/1/0757/9461/2478/files/photo-1549298916-b41d501d3772.jpg?v=1757010182',
    altText: 'KickVibes Black',
  },
  thumbnail1AltText: 'KickVibes Black',
  thumbnailImage2: {
    id: 'default-thumb-2',
    url: 'https://cdn.shopify.com/s/files/1/0757/9461/2478/files/photo-1600185365483-26d7a4cc7519.jpg?v=1757010182',
    altText: 'KickVibes Blue',
  },
  thumbnail2AltText: 'KickVibes Blue',
  isActive: true,
};