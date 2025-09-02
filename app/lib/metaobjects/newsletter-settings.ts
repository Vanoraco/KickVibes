/**
 * Newsletter Settings Metaobject Definition and GraphQL Queries
 *
 * This file contains the metaobject definition for newsletter settings
 * and the GraphQL queries to fetch this data from Shopify.
 */

// Metaobject Definition for Shopify Admin
export const NEWSLETTER_SETTINGS_METAOBJECT_DEFINITION = {
  type: "newsletter_settings",
  displayName: "Newsletter Settings",
  description: "Configuration for newsletter subscription forms and messaging",
  fields: [
    {
      key: "title",
      name: "Title",
      description: "Main newsletter section title",
      type: "single_line_text_field",
      required: true,
      validations: {
        max: 100
      }
    },
    {
      key: "description",
      name: "Description",
      description: "Newsletter description/subtitle",
      type: "multi_line_text_field",
      required: true,
      validations: {
        max: 300
      }
    },
    {
      key: "placeholder_text",
      name: "Placeholder Text",
      description: "Placeholder text for email input field",
      type: "single_line_text_field",
      required: false,
      validations: {
        max: 50
      }
    },
    {
      key: "button_text",
      name: "Button Text",
      description: "Subscribe button text",
      type: "single_line_text_field",
      required: true,
      validations: {
        max: 30
      }
    },
    {
      key: "loading_text",
      name: "Loading Text",
      description: "Text shown while subscribing",
      type: "single_line_text_field",
      required: false,
      validations: {
        max: 30
      }
    },
    {
      key: "privacy_text",
      name: "Privacy Text",
      description: "Privacy notice text below the form",
      type: "multi_line_text_field",
      required: false,
      validations: {
        max: 200
      }
    },
    {
      key: "success_title",
      name: "Success Title",
      description: "Title shown after successful subscription",
      type: "single_line_text_field",
      required: true,
      validations: {
        max: 50
      }
    },
    {
      key: "success_message",
      name: "Success Message",
      description: "Message shown after successful subscription",
      type: "multi_line_text_field",
      required: true,
      validations: {
        max: 300
      }
    },
    {
      key: "error_message",
      name: "Error Message",
      description: "Message shown when subscription fails",
      type: "multi_line_text_field",
      required: false,
      validations: {
        max: 200
      }
    },
    {
      key: "background_color",
      name: "Background Color",
      description: "Background color for the newsletter section",
      type: "color",
      required: false
    },
    {
      key: "text_color",
      name: "Text Color",
      description: "Text color for the newsletter section",
      type: "color",
      required: false
    },
    {
      key: "button_color",
      name: "Button Color",
      description: "Background color for the subscribe button",
      type: "color",
      required: false
    },
    {
      key: "is_active",
      name: "Is Active",
      description: "Whether the newsletter section should be displayed",
      type: "boolean",
      required: true
    },
    {
      key: "show_privacy_text",
      name: "Show Privacy Text",
      description: "Whether to show the privacy notice",
      type: "boolean",
      required: false
    },
    {
      key: "api_endpoint",
      name: "API Endpoint",
      description: "Newsletter subscription API endpoint",
      type: "url",
      required: false
    }
  ]
};

// TypeScript interface for the newsletter settings data
export interface NewsletterSettings {
  id: string;
  title: string;
  description: string;
  placeholderText?: string;
  buttonText: string;
  loadingText?: string;
  privacyText?: string;
  successTitle: string;
  successMessage: string;
  errorMessage?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  isActive: boolean;
  showPrivacyText: boolean;
  apiEndpoint?: string;
}

// GraphQL fragment for newsletter settings
export const NEWSLETTER_SETTINGS_FRAGMENT = `#graphql
  fragment NewsletterSettings on Metaobject {
    id
    handle
    type
    fields {
      key
      value
    }
  }
` as const;

// GraphQL query to fetch newsletter settings
export const NEWSLETTER_SETTINGS_QUERY = `#graphql
  query NewsletterSettings($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobjects(type: "newsletter_settings", first: 10) {
      nodes {
        ...NewsletterSettings
      }
    }
  }
  ${NEWSLETTER_SETTINGS_FRAGMENT}
` as const;

// GraphQL query to fetch specific newsletter settings by handle
export const NEWSLETTER_SETTINGS_BY_HANDLE_QUERY = `#graphql
  query NewsletterSettingsByHandle(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: $handle, type: "newsletter_settings"}) {
      ...NewsletterSettings
    }
  }
  ${NEWSLETTER_SETTINGS_FRAGMENT}
` as const;

// Utility function to transform metaobject data to typed interface
export function transformNewsletterSettingsData(metaobject: any): NewsletterSettings | null {
  if (!metaobject || !metaobject.fields) return null;

  const fields = metaobject.fields.reduce((acc: any, field: any) => {
    acc[field.key] = field.value;
    return acc;
  }, {});

  // Check if newsletter is active
  if (!fields.is_active || fields.is_active !== 'true') return null;

  return {
    id: metaobject.id,
    title: fields.title || '',
    description: fields.description || '',
    placeholderText: fields.placeholder_text || undefined,
    buttonText: fields.button_text || 'Subscribe',
    loadingText: fields.loading_text || undefined,
    privacyText: fields.privacy_text || undefined,
    successTitle: fields.success_title || 'Thank you!',
    successMessage: fields.success_message || 'You have been successfully subscribed.',
    errorMessage: fields.error_message || undefined,
    backgroundColor: fields.background_color || undefined,
    textColor: fields.text_color || undefined,
    buttonColor: fields.button_color || undefined,
    isActive: fields.is_active === 'true',
    showPrivacyText: fields.show_privacy_text === 'true',
    apiEndpoint: fields.api_endpoint || undefined,
  };
}

// Utility function to get active newsletter settings
export function getActiveNewsletterSettings(metaobjects: any[]): NewsletterSettings | null {
  const activeSettings = metaobjects
    .map(transformNewsletterSettingsData)
    .filter((settings): settings is NewsletterSettings => settings !== null);

  // Return the first active settings (there should typically be only one)
  return activeSettings.length > 0 ? activeSettings[0] : null;
}

// Default fallback newsletter settings for when metaobjects are not available
export const DEFAULT_NEWSLETTER_SETTINGS: NewsletterSettings = {
  id: 'default-newsletter',
  title: 'Stay Updated',
  description: 'Get notified about new releases and exclusive offers.',
  placeholderText: 'Enter your email',
  buttonText: 'Subscribe',
  loadingText: 'Subscribing...',
  privacyText: 'We respect your privacy. Unsubscribe at any time.',
  successTitle: 'Thank you!',
  successMessage: 'You\'ve been successfully subscribed to our newsletter.',
  errorMessage: 'Something went wrong. Please try again.',
  isActive: true,
  showPrivacyText: true,
};