import { Link } from 'react-router';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`product-breadcrumb ${className}`} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          {item.href ? (
            <Link 
              to={item.href} 
              className="breadcrumb-link"
              aria-label={`Go to ${item.label}`}
            >
              {item.label}
            </Link>
          ) : (
            <span className="breadcrumb-current" aria-current="page">
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <span className="product-breadcrumb-separator" aria-hidden="true">
              /
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

// Helper function to generate breadcrumb items for product pages
export function generateProductBreadcrumbs(
  productTitle: string,
  productHandle?: string,
  collectionHandle?: string,
  collectionTitle?: string
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
  ];

  if (collectionHandle && collectionTitle) {
    items.push({
      label: collectionTitle,
      href: `/collections/${collectionHandle}`,
    });
  } else {
    items.push({
      label: 'Products',
      href: '/products',
    });
  }

  items.push({
    label: productTitle,
  });

  return items;
}
