/**
 * Site Settings Metaobject Definition and GraphQL Queries
 *
 * This file contains the metaobject definition for site settings
 * and the GraphQL queries to fetch this data from Shopify.
 */

// Metaobject Definition for Shopify Admin
export const SITE_SETTINGS_METAOBJECT_DEFINITION = {
  type: "site_settings",
  displayName: "Site Settings",
  description: "Global site settings including logos, contact info, and social links",
  fields: [
    {
      key: "site_name",
      name: "Site Name",
      description: "Name of the website/brand",
      type: "single_line_text_field",
      required: true,
      validations: {
        max: 100
      }
    },
    {
      key: "site_description",
      name: "Site Description",
      description: "Brief description of the website/brand",
      type: "multi_line_text_field",
      required: false,
      validations: {
        max: 300
      }
    },
    {
      key: "logo_image",
      name: "Logo Image",
      description: "Main site logo",
      type: "file_reference",
      required: false,
      validations: {
        file_type_options: ["image"]
      }
    },
    {
      key: "logo_alt_text",
      name: "Logo Alt Text",
      description: "Alternative text for the logo",
      type: "single_line_text_field",
      required: false,
      validations: {
        max: 100
      }
    },
    {
      key: "favicon",
      name: "Favicon",
      description: "Site favicon",
      type: "file_reference",
      required: false,
      validations: {
        file_type_options: ["image"]
      }
    },
    {
      key: "contact_email",
      name: "Contact Email",
      description: "Main contact email address",
      type: "single_line_text_field",
      required: false,
      validations: {
        max: 100
      }
    },
    {
      key: "contact_phone",
      name: "Contact Phone",
      description: "Main contact phone number",
      type: "single_line_text_field",
      required: false,
      validations: {
        max: 50
      }
    },
    {
      key: "contact_address",
      name: "Contact Address",
      description: "Physical address",
      type: "multi_line_text_field",
      required: false,
      validations: {
        max: 200
      }
    },
    {
      key: "social_instagram",
      name: "Instagram URL",
      description: "Instagram profile URL",
      type: "url",
      required: false
    },
    {
      key: "social_facebook",
      name: "Facebook URL",
      description: "Facebook page URL",
      type: "url",
      required: false
    },
    {
      key: "social_twitter",
      name: "Twitter URL",
      description: "Twitter profile URL",
      type: "url",
      required: false
    },
    {
      key: "social_youtube",
      name: "YouTube URL",
      description: "YouTube channel URL",
      type: "url",
      required: false
    },
    {
      key: "social_tiktok",
      name: "TikTok URL",
      description: "TikTok profile URL",
      type: "url",
      required: false
    },
    {
      key: "copyright_text",
      name: "Copyright Text",
      description: "Copyright notice text",
      type: "single_line_text_field",
      required: false,
      validations: {
        max: 200
      }
    },
    {
      key: "footer_description",
      name: "Footer Description",
      description: "Description text for footer",
      type: "multi_line_text_field",
      required: false,
      validations: {
        max: 300
      }
    },
    {
      key: "navigation_items",
      name: "Navigation Items",
      description: "Custom navigation items (JSON format: [{\"title\": \"Home\", \"url\": \"/\"}])",
      type: "multi_line_text_field",
      required: false,
      validations: {
        max: 1000
      }
    }
  ]
};

// TypeScript interface for the site settings data
export interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription?: string;
  logoImage?: {
    id: string;
    url: string;
    altText: string;
    width?: number;
    height?: number;
  };
  logoAltText?: string;
  favicon?: {
    id: string;
    url: string;
    altText: string;
  };
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  socialInstagram?: string;
  socialFacebook?: string;
  socialTwitter?: string;
  socialYoutube?: string;
  socialTiktok?: string;
  copyrightText?: string;
  footerDescription?: string;
  navigationItems?: Array<{
    title: string;
    url: string;
  }>;
}

// GraphQL fragment for site settings
export const SITE_SETTINGS_FRAGMENT = `#graphql
  fragment SiteSettings on Metaobject {
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

// GraphQL query to fetch site settings
export const SITE_SETTINGS_QUERY = `#graphql
  query SiteSettings($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobjects(type: "site_settings", first: 5) {
      nodes {
        ...SiteSettings
      }
    }
  }
  ${SITE_SETTINGS_FRAGMENT}
` as const;

// GraphQL query to fetch specific site settings by handle
export const SITE_SETTINGS_BY_HANDLE_QUERY = `#graphql
  query SiteSettingsByHandle(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: $handle, type: "site_settings"}) {
      ...SiteSettings
    }
  }
  ${SITE_SETTINGS_FRAGMENT}
` as const;

// Utility function to transform metaobject data to typed interface
export function transformSiteSettingsData(metaobject: any): SiteSettings | null {
  if (!metaobject || !metaobject.fields) return null;

  const fields = metaobject.fields.reduce((acc: any, field: any) => {
    acc[field.key] = field.value || field.reference;
    return acc;
  }, {});

  // Parse navigation items from JSON
  let navigationItems: Array<{ title: string; url: string }> = [];
  if (fields.navigation_items) {
    try {
      navigationItems = JSON.parse(fields.navigation_items);
    } catch (error) {
      console.warn('Failed to parse navigation items JSON:', error);
    }
  }

  return {
    id: metaobject.id,
    siteName: fields.site_name || '',
    siteDescription: fields.site_description || undefined,
    logoImage: fields.logo_image ? {
      id: fields.logo_image?.id || '',
      url: fields.logo_image?.image?.url || '',
      altText: fields.logo_image?.image?.altText || fields.logo_alt_text || '',
      width: fields.logo_image?.image?.width,
      height: fields.logo_image?.image?.height,
    } : undefined,
    logoAltText: fields.logo_alt_text || undefined,
    favicon: fields.favicon ? {
      id: fields.favicon?.id || '',
      url: fields.favicon?.image?.url || '',
      altText: fields.favicon?.image?.altText || 'Favicon',
    } : undefined,
    contactEmail: fields.contact_email || undefined,
    contactPhone: fields.contact_phone || undefined,
    contactAddress: fields.contact_address || undefined,
    socialInstagram: fields.social_instagram || undefined,
    socialFacebook: fields.social_facebook || undefined,
    socialTwitter: fields.social_twitter || undefined,
    socialYoutube: fields.social_youtube || undefined,
    socialTiktok: fields.social_tiktok || undefined,
    copyrightText: fields.copyright_text || undefined,
    footerDescription: fields.footer_description || undefined,
    navigationItems: navigationItems.length > 0 ? navigationItems : undefined,
  };
}

// Utility function to get site settings (there should typically be only one)
export function getSiteSettings(metaobjects: any[]): SiteSettings | null {
  const settings = metaobjects
    .map(transformSiteSettingsData)
    .filter((settings): settings is SiteSettings => settings !== null);

  // Return the first settings (there should typically be only one)
  return settings.length > 0 ? settings[0] : null;
}

// Default fallback site settings for when metaobjects are not available
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 'default-site-settings',
  siteName: 'KickVibes',
  siteDescription: 'Discover the latest and greatest in premium sneaker fashion. From limited editions to everyday essentials, we bring you the best kicks from top brands worldwide.',
  logoImage: {
    id: 'default-logo',
    url: 'https://cdn.shopify.com/s/files/1/0757/9461/2478/files/logo.png?v=1753520942',
    altText: 'KickVibes',
  },
  logoAltText: 'KickVibes',
  contactEmail: 'info@kickvibes.com',
  contactPhone: '+27 11 123 4567',
  contactAddress: 'Cape Town, South Africa',
  socialInstagram: 'https://instagram.com/kickvibes',
  socialFacebook: 'https://facebook.com/kickvibes',
  socialTwitter: 'https://twitter.com/kickvibes',
  socialYoutube: 'https://youtube.com/kickvibes',
  socialTiktok: 'https://tiktok.com/@kickvibes',
  copyrightText: 'KickVibes. All rights reserved.',
  footerDescription: 'Discover the latest and greatest in premium sneaker fashion. From limited editions to everyday essentials, we bring you the best kicks from top brands worldwide.',
  navigationItems: [
    { title: 'HOME', url: '/' },
    { title: 'SHOP', url: '/collections/all' },
    { title: 'CONTACT US', url: '/contact' },
  ],
};