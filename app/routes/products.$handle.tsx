import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import { useLoaderData, type MetaFunction } from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {Breadcrumb, generateProductBreadcrumbs} from '~/components/Breadcrumb';
import {RelatedProducts, generateMockRelatedProducts} from '~/components/RelatedProducts';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;
  const breadcrumbItems = generateProductBreadcrumbs(title, product.handle);

  return (
    <div className="enhanced-product-details">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />

      <main id="main-content" className="enhanced-product">
        {/* Enhanced Product Image Section */}
        <section
          className="enhanced-product-image-section"
          aria-label="Product images"
        >
          <ProductImage image={selectedVariant?.image} />
        </section>

        {/* Enhanced Product Information Section */}
        <section
          className="enhanced-product-info"
          aria-label="Product information"
        >
          {/* Brand and Title */}
          <div className="enhanced-product-brand" aria-label="Brand">
            {product.vendor || 'Premium Brand'}
          </div>
          <h1 className="enhanced-product-title">{title}</h1>

          {/* Enhanced Price Section */}
          <div className="enhanced-product-price-section" aria-label="Product pricing">
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
          </div>

          {/* Product Form with Enhanced Styling */}
          <div className="enhanced-product-options" aria-label="Product options and purchase">
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
            />
          </div>

          {/* Enhanced Description */}
          <div className="enhanced-product-description">
            <h2 className="enhanced-product-description-title">Description</h2>
            <div
              className="enhanced-product-description-content"
              dangerouslySetInnerHTML={{__html: descriptionHtml}}
              aria-label="Product description"
            />
          </div>

          {/* Product Specifications */}
          <div className="enhanced-product-specs">
            <h2 className="enhanced-product-specs-title">Specifications</h2>
            <dl className="enhanced-product-specs-grid" aria-label="Product specifications">
              <div className="enhanced-product-spec-item">
                <dt className="enhanced-product-spec-label">Brand</dt>
                <dd className="enhanced-product-spec-value">{product.vendor || 'Premium Brand'}</dd>
              </div>
              <div className="enhanced-product-spec-item">
                <dt className="enhanced-product-spec-label">SKU</dt>
                <dd className="enhanced-product-spec-value">{selectedVariant?.sku || 'N/A'}</dd>
              </div>
              <div className="enhanced-product-spec-item">
                <dt className="enhanced-product-spec-label">Availability</dt>
                <dd className="enhanced-product-spec-value">
                  <span
                    className={selectedVariant?.availableForSale ? 'in-stock' : 'out-of-stock'}
                    aria-label={selectedVariant?.availableForSale ? 'Product is in stock' : 'Product is out of stock'}
                  >
                    {selectedVariant?.availableForSale ? 'In Stock' : 'Out of Stock'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </main>

      {/* Related Products Section */}
      <RelatedProducts
        products={generateMockRelatedProducts(4)}
        title="You might also like"
      />

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
