export const routeVisibility = {
  backend: {
    productsApiReady: false,
  },
  header: {
    browse: true,
    sell: false,
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
    listings: false,
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
