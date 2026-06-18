export const routeVisibility = {
  backend: {
    productsApiReady: true,
    /** Nested seller on product list/detail responses — flip when backend ships. */
    productSellerInApi: false,
  },
  header: {
    /** Browse lives on home + footer — not in the top bar. */
    browse: false,
    sell: true,
    about: false,
  },
  supportFooter: {
    howItWorks: false,
    safety: false,
    help: false,
  },
  legalFooter: {
    terms: false,
    privacy: false,
    cookies: false,
  },
  accountTabs: {
    profile: true,
    listings: true,
    favorites: false,
    settings: true,
  },
  sitemap: {
    sell: false,
    about: false,
    howItWorks: false,
    safety: false,
    help: false,
    legal: false,
  },
} as const;
