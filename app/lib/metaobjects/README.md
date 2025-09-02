# Metaobjects Setup Guide

This directory contains metaobject definitions and GraphQL queries for managing dynamic content in your Shopify store.

## 1. Homepage Content Metaobject

### Setup in Shopify Admin

1. **Navigate to Settings > Custom data > Metaobjects**
2. **Click "Add definition"**
3. **Configure the metaobject:**
   - **Type:** `homepage_content`
   - **Name:** `Homepage Content`
   - **Description:** `Content for homepage promotional sections`

4. **Add the following fields:**

   | Field Key | Field Name | Type | Required | Description |
   |-----------|------------|------|----------|-------------|
   | `title` | Title | Single line text | Yes | Main promotional title (supports line breaks with \n) |
   | `description` | Description | Multi-line text | Yes | Promotional description text |
   | `button_text` | Button Text | Single line text | Yes | Call-to-action button text |
   | `button_url` | Button URL | URL | Yes | URL for the call-to-action button |
   | `featured_image` | Featured Image | File reference | Yes | Main promotional image |
   | `image_alt_text` | Image Alt Text | Single line text | Yes | Alternative text for the featured image |
   | `is_active` | Is Active | Boolean | Yes | Whether this content should be displayed |
   | `display_order` | Display Order | Number (integer) | No | Order in which this content should appear |

5. **Save the metaobject definition**

### Creating Content Entries

1. **Go to Content > Metaobjects > Homepage Content**
2. **Click "Add entry"**
3. **Fill in the fields:**
   - **Title:** `MAKES YOURSELF KEEP\nSPORTY & STYLISH` (use \n for line breaks)
   - **Description:** Your promotional text
   - **Button Text:** `SHOP NOW`
   - **Button URL:** `/collections/all`
   - **Featured Image:** Upload your promotional image
   - **Image Alt Text:** Descriptive alt text for accessibility
   - **Is Active:** `true`
   - **Display Order:** `1`

4. **Save the entry**

### Usage in Code

```tsx
import { HOMEPAGE_CONTENT_QUERY, getActiveHomepageContent } from '~/lib/metaobjects/homepage-content';

// In your loader function
export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context;

  const homepageContentData = await storefront.query(HOMEPAGE_CONTENT_QUERY);
  const homepageContent = getActiveHomepageContent(homepageContentData.metaobjects.nodes);

  return {
    homepageContent: homepageContent[0] // Get the first active content
  };
}

// In your component
export default function HomePage() {
  const { homepageContent } = useLoaderData<typeof loader>();

  return (
    <div>
      <PromoSection homepageContent={homepageContent} />
    </div>
  );
}
```

### Benefits

- **Content Management:** Non-technical users can update promotional content through Shopify Admin
- **Multilingual Support:** Content can be localized for different markets
- **Version Control:** Easy to create multiple versions and toggle between them
- **Scheduling:** Can be combined with Shopify's scheduling features
- **Fallback:** Graceful fallback to default content if metaobjects are unavailable

## 2. Category Cards Metaobject

### Setup in Shopify Admin

1. **Navigate to Settings > Custom data > Metaobjects**
2. **Click "Add definition"**
3. **Configure the metaobject:**
   - **Type:** `category_cards`
   - **Name:** `Category Cards`
   - **Description:** `Category cards for homepage sections`

4. **Add the following fields:**

   | Field Key | Field Name | Type | Required | Description |
   |-----------|------------|------|----------|-------------|
   | `title` | Title | Single line text | Yes | Category title/name |
   | `description` | Description | Multi-line text | No | Optional category description |
   | `button_text` | Button Text | Single line text | Yes | Call-to-action button text |
   | `button_url` | Button URL | URL | Yes | URL for the call-to-action button |
   | `background_image` | Background Image | File reference | No | Background image for the category card |
   | `card_size` | Card Size | Single line text | Yes | Size of the category card (large/medium/small) |
   | `accent_color` | Accent Color | Color | No | Accent color for the card |
   | `css_class` | CSS Class | Single line text | No | Additional CSS class for styling |
   | `is_active` | Is Active | Boolean | Yes | Whether this category card should be displayed |
   | `display_order` | Display Order | Number (integer) | No | Order in which this card should appear |

5. **Save the metaobject definition**

### Creating Category Card Entries

1. **Go to Content > Metaobjects > Category Cards**
2. **Click "Add entry"** for each category
3. **Example entries:**

   **Running Category:**
   - **Title:** `RUNNING.`
   - **Button Text:** `SEE PRODUCT`
   - **Button URL:** `/collections/running`
   - **Card Size:** `large`
   - **CSS Class:** `category-running-bg`
   - **Is Active:** `true`
   - **Display Order:** `1`

   **Women Category:**
   - **Title:** `WOMEN`
   - **Button Text:** `SEE PRODUCT`
   - **Button URL:** `/collections/women`
   - **Card Size:** `medium`
   - **CSS Class:** `category-woman-bg`
   - **Accent Color:** `#ff0000`
   - **Is Active:** `true`
   - **Display Order:** `2`

4. **Save each entry**

## 3. Brand Information Metaobject

### Setup in Shopify Admin

1. **Navigate to Settings > Custom data > Metaobjects**
2. **Click "Add definition"**
3. **Configure the metaobject:**
   - **Type:** `brand_information`
   - **Name:** `Brand Information`
   - **Description:** `Brand information for logos, names, and links`

4. **Add the following fields:**

   | Field Key | Field Name | Type | Required | Description |
   |-----------|------------|------|----------|-------------|
   | `name` | Brand Name | Single line text | Yes | Name of the brand |
   | `display_name` | Display Name | Single line text | No | Name as it should appear on the website |
   | `logo_image` | Logo Image | File reference | No | Brand logo image |
   | `website_url` | Website URL | URL | No | Official brand website URL |
   | `collection_url` | Collection URL | URL | No | URL to the brand's collection on your store |
   | `brand_color` | Brand Color | Color | No | Primary brand color |
   | `css_class` | CSS Class | Single line text | No | Additional CSS class for styling |
   | `description` | Description | Multi-line text | No | Brief description of the brand |
   | `is_featured` | Is Featured | Boolean | No | Whether this brand should be featured prominently |
   | `is_active` | Is Active | Boolean | Yes | Whether this brand should be displayed |
   | `display_order` | Display Order | Number (integer) | No | Order in which this brand should appear |

5. **Save the metaobject definition**

### Creating Brand Entries

1. **Go to Content > Metaobjects > Brand Information**
2. **Click "Add entry"** for each brand
3. **Example entries:**

   **Nike Brand:**
   - **Brand Name:** `Nike`
   - **Display Name:** `NIKE`
   - **Collection URL:** `/collections/nike`
   - **Website URL:** `https://www.nike.com`
   - **Brand Color:** `#1a1a1a`
   - **CSS Class:** `brand-nike`
   - **Is Featured:** `true`
   - **Is Active:** `true`
   - **Display Order:** `1`

   **Adidas Brand:**
   - **Brand Name:** `Adidas`
   - **Display Name:** `ADIDAS`
   - **Collection URL:** `/collections/adidas`
   - **Website URL:** `https://www.adidas.com`
   - **Brand Color:** `#1a1a1a`
   - **CSS Class:** `brand-adhida`
   - **Is Featured:** `true`
   - **Is Active:** `true`
   - **Display Order:** `2`

4. **Save each entry**

## 4. Product Filters Metaobject

### Setup in Shopify Admin

1. **Navigate to Settings > Custom data > Metaobjects**
2. **Click "Add definition"**
3. **Configure the metaobject:**
   - **Type:** `product_filters`
   - **Name:** `Product Filters`
   - **Description:** `Configuration for product filtering options`

4. **Add the following fields:**

   | Field Key | Field Name | Type | Required | Description |
   |-----------|------------|------|----------|-------------|
   | `filter_type` | Filter Type | Single line text | Yes | Type of filter (size, color, material, etc.) |
   | `filter_name` | Filter Name | Single line text | Yes | Display name for the filter |
   | `filter_options` | Filter Options | Multi-line text | Yes | Available options for this filter (one per line) |
   | `default_options` | Default Options | Multi-line text | No | Default selected options (one per line) |
   | `min_value` | Minimum Value | Number (decimal) | No | Minimum value for range filters |
   | `max_value` | Maximum Value | Number (decimal) | No | Maximum value for range filters |
   | `step_value` | Step Value | Number (decimal) | No | Step increment for range filters |
   | `filter_style` | Filter Style | Single line text | No | How the filter should be displayed |
   | `is_collapsible` | Is Collapsible | Boolean | No | Whether this filter section can be collapsed |
   | `is_expanded_default` | Is Expanded by Default | Boolean | No | Whether this filter section is expanded by default |
   | `is_active` | Is Active | Boolean | Yes | Whether this filter should be displayed |
   | `display_order` | Display Order | Number (integer) | No | Order in which this filter should appear |

5. **Save the metaobject definition**

### Creating Filter Entries

1. **Go to Content > Metaobjects > Product Filters**
2. **Click "Add entry"** for each filter
3. **Example entries:**

   **Size Filter:**
   - **Filter Type:** `size`
   - **Filter Name:** `Size`
   - **Filter Options:** (one per line)
     ```
     6
     6.5
     7
     7.5
     8
     8.5
     9
     9.5
     10
     10.5
     11
     11.5
     12
     ```
   - **Filter Style:** `size_grid`
   - **Is Collapsible:** `true`
   - **Is Expanded by Default:** `true`
   - **Is Active:** `true`
   - **Display Order:** `1`

   **Price Range Filter:**
   - **Filter Type:** `price_range`
   - **Filter Name:** `Price Range`
   - **Minimum Value:** `500`
   - **Maximum Value:** `3000`
   - **Step Value:** `50`
   - **Filter Style:** `range`
   - **Is Collapsible:** `true`
   - **Is Expanded by Default:** `true`
   - **Is Active:** `true`
   - **Display Order:** `2`

4. **Save each entry**

## 5. Newsletter Settings Metaobject

### Setup in Shopify Admin

1. **Navigate to Settings > Custom data > Metaobjects**
2. **Click "Add definition"**
3. **Configure the metaobject:**
   - **Type:** `newsletter_settings`
   - **Name:** `Newsletter Settings`
   - **Description:** `Configuration for newsletter subscription forms and messaging`

4. **Add the following fields:**

   | Field Key | Field Name | Type | Required | Description |
   |-----------|------------|------|----------|-------------|
   | `title` | Title | Single line text | Yes | Main newsletter section title |
   | `description` | Description | Multi-line text | Yes | Newsletter description/subtitle |
   | `placeholder_text` | Placeholder Text | Single line text | No | Placeholder text for email input field |
   | `button_text` | Button Text | Single line text | Yes | Subscribe button text |
   | `loading_text` | Loading Text | Single line text | No | Text shown while subscribing |
   | `privacy_text` | Privacy Text | Multi-line text | No | Privacy notice text below the form |
   | `success_title` | Success Title | Single line text | Yes | Title shown after successful subscription |
   | `success_message` | Success Message | Multi-line text | Yes | Message shown after successful subscription |
   | `error_message` | Error Message | Multi-line text | No | Message shown when subscription fails |
   | `background_color` | Background Color | Color | No | Background color for the newsletter section |
   | `text_color` | Text Color | Color | No | Text color for the newsletter section |
   | `button_color` | Button Color | Color | No | Background color for the subscribe button |
   | `is_active` | Is Active | Boolean | Yes | Whether the newsletter section should be displayed |
   | `show_privacy_text` | Show Privacy Text | Boolean | No | Whether to show the privacy notice |
   | `api_endpoint` | API Endpoint | URL | No | Newsletter subscription API endpoint |

5. **Save the metaobject definition**

### Creating Newsletter Settings Entry

1. **Go to Content > Metaobjects > Newsletter Settings**
2. **Click "Add entry"**
3. **Fill in the fields:**
   - **Title:** `Stay Updated`
   - **Description:** `Get notified about new releases and exclusive offers.`
   - **Placeholder Text:** `Enter your email`
   - **Button Text:** `Subscribe`
   - **Loading Text:** `Subscribing...`
   - **Privacy Text:** `We respect your privacy. Unsubscribe at any time.`
   - **Success Title:** `Thank you!`
   - **Success Message:** `You've been successfully subscribed to our newsletter.`
   - **Error Message:** `Something went wrong. Please try again.`
   - **Background Color:** (optional custom color)
   - **Text Color:** (optional custom color)
   - **Button Color:** (optional custom color)
   - **Is Active:** `true`
   - **Show Privacy Text:** `true`
   - **API Endpoint:** (optional newsletter service endpoint)

4. **Save the entry**

## 6. Site Settings Metaobject

### Setup in Shopify Admin

1. **Navigate to Settings > Custom data > Metaobjects**
2. **Click "Add definition"**
3. **Configure the metaobject:**
   - **Type:** `site_settings`
   - **Name:** `Site Settings`
   - **Description:** `Global site settings including logos, contact info, and social links`

4. **Add the following fields:**

   | Field Key | Field Name | Type | Required | Description |
   |-----------|------------|------|----------|-------------|
   | `site_name` | Site Name | Single line text | Yes | Name of the website/brand |
   | `site_description` | Site Description | Multi-line text | No | Brief description of the website/brand |
   | `logo_image` | Logo Image | File reference | No | Main site logo |
   | `logo_alt_text` | Logo Alt Text | Single line text | No | Alternative text for the logo |
   | `favicon` | Favicon | File reference | No | Site favicon |
   | `contact_email` | Contact Email | Single line text | No | Main contact email address |
   | `contact_phone` | Contact Phone | Single line text | No | Main contact phone number |
   | `contact_address` | Contact Address | Multi-line text | No | Physical address |
   | `social_instagram` | Instagram URL | URL | No | Instagram profile URL |
   | `social_facebook` | Facebook URL | URL | No | Facebook page URL |
   | `social_twitter` | Twitter URL | URL | No | Twitter profile URL |
   | `social_youtube` | YouTube URL | URL | No | YouTube channel URL |
   | `social_tiktok` | TikTok URL | URL | No | TikTok profile URL |
   | `copyright_text` | Copyright Text | Single line text | No | Copyright notice text |
   | `footer_description` | Footer Description | Multi-line text | No | Description text for footer |
   | `navigation_items` | Navigation Items | Multi-line text | No | Custom navigation items (JSON format) |

5. **Save the metaobject definition**

### Creating Site Settings Entry

1. **Go to Content > Metaobjects > Site Settings**
2. **Click "Add entry"**
3. **Fill in the fields:**
   - **Site Name:** `KickVibes`
   - **Site Description:** `Discover the latest and greatest in premium sneaker fashion...`
   - **Logo Image:** Upload your site logo
   - **Logo Alt Text:** `KickVibes`
   - **Contact Email:** `info@kickvibes.com`
   - **Contact Phone:** `+27 11 123 4567`
   - **Contact Address:** `Cape Town, South Africa`
   - **Instagram URL:** `https://instagram.com/kickvibes`
   - **Facebook URL:** `https://facebook.com/kickvibes`
   - **Twitter URL:** `https://twitter.com/kickvibes`
   - **YouTube URL:** `https://youtube.com/kickvibes`
   - **TikTok URL:** `https://tiktok.com/@kickvibes`
   - **Copyright Text:** `KickVibes. All rights reserved.`
   - **Footer Description:** Your footer description text
   - **Navigation Items:** (JSON format)
     ```json
     [
       {"title": "HOME", "url": "/"},
       {"title": "SHOP", "url": "/collections/all"},
       {"title": "CONTACT US", "url": "/contact"}
     ]
     ```

4. **Save the entry**

## 7. Hero Section Metaobject

### Setup in Shopify Admin

1. **Navigate to Settings > Custom data > Metaobjects**
2. **Click "Add definition"**
3. **Configure the metaobject:**
   - **Type:** `hero_section`
   - **Name:** `Hero Section`
   - **Description:** `Main hero section content for the homepage`

4. **Add the following fields:**

   | Field Key | Field Name | Type | Required | Description |
   |-----------|------------|------|----------|-------------|
   | `hero_title` | Hero Title | Single line text | Yes | Main hero title (e.g., KICKVIBES) |
   | `hero_subtitle` | Hero Subtitle | Single line text | Yes | Hero subtitle (e.g., COMFY AND TRENDY) |
   | `hero_description` | Hero Description | Multi-line text | Yes | Main hero description text |
   | `button_text` | Button Text | Single line text | Yes | Call-to-action button text |
   | `button_url` | Button URL | URL | Yes | URL for the call-to-action button |
   | `main_hero_image` | Main Hero Image | File reference | Yes | Main large hero image (right side) |
   | `main_image_alt_text` | Main Image Alt Text | Single line text | Yes | Alternative text for the main hero image |
   | `thumbnail_image_1` | Thumbnail Image 1 | File reference | No | First thumbnail image |
   | `thumbnail_1_alt_text` | Thumbnail 1 Alt Text | Single line text | No | Alternative text for thumbnail 1 |
   | `thumbnail_image_2` | Thumbnail Image 2 | File reference | No | Second thumbnail image |
   | `thumbnail_2_alt_text` | Thumbnail 2 Alt Text | Single line text | No | Alternative text for thumbnail 2 |
   | `is_active` | Is Active | Boolean | Yes | Whether this hero section should be displayed |

5. **Save the metaobject definition**

### Creating Hero Section Entry

1. **Go to Content > Metaobjects > Hero Section**
2. **Click "Add entry"**
3. **Fill in the fields:**
   - **Hero Title:** `KICKVIBES`
   - **Hero Subtitle:** `COMFY AND TRENDY`
   - **Hero Description:** `Your destination for the comfiest and trendiest sneakers and shoes in South Africa. Find your perfect pair with our curated collection of styles, blending cutting-edge design with all-day comfort. Step up your street style with KICKVIBES.`
   - **Button Text:** `SHOP NOW`
   - **Button URL:** `/collections/all`
   - **Main Hero Image:** Upload your main hero sneaker image
   - **Main Image Alt Text:** `KickVibes Sneaker`
   - **Thumbnail Image 1:** Upload first thumbnail image
   - **Thumbnail 1 Alt Text:** `KickVibes Black`
   - **Thumbnail Image 2:** Upload second thumbnail image
   - **Thumbnail 2 Alt Text:** `KickVibes Blue`
   - **Is Active:** `true`

4. **Save the entry**