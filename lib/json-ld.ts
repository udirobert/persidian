import { PRODUCTS } from "@/lib/products";
import {
  CONTACT_EMAIL,
  FOUNDER_GITHUB,
  FOUNDER_NAME,
  FOUNDER_X,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    email: CONTACT_EMAIL,
    founder: {
      "@type": "Person",
      name: FOUNDER_NAME,
      sameAs: [FOUNDER_X, FOUNDER_GITHUB],
    },
    sameAs: [FOUNDER_X, FOUNDER_GITHUB, ...PRODUCTS.map((p) => p.repo)],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function productListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Persidian agents",
    itemListElement: PRODUCTS.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: product.name,
        url: `${SITE_URL}${product.entityHref}`,
        applicationCategory: "BusinessApplication",
        description: product.tagline,
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };
}

export function productJsonLd(product: (typeof PRODUCTS)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    url: `${SITE_URL}${product.entityHref}`,
    applicationCategory: "BusinessApplication",
    description: product.tagline,
    creator: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    sameAs: [product.href, product.repo],
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
    },
  };
}
