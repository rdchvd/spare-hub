export type Listing = {
  id: string;
  title: { en: string; es: string; uk: string };
  category: "tractor" | "irrigation" | "sprayers" | "harvest" | "seeds" | "tools";
  brand: string;
  condition: "new" | "used" | "refurb";
  price: number;
  currency: "USD" | "EUR";
  location: string;
  seller: string;
  verified: boolean;
  stock: "in" | "low";
  rating: number;
  reviews: number;
  emoji: string;
};

export const listings: Listing[] = [
  {
    id: "l-1001",
    title: {
      en: "John Deere 6M hydraulic pump — OEM",
      es: "Bomba hidráulica John Deere 6M — OEM",
      uk: "Гідронасос John Deere 6M — OEM",
    },
    category: "tractor",
    brand: "John Deere",
    condition: "new",
    price: 1240,
    currency: "EUR",
    location: "Lleida, ES",
    seller: "AgriParts Iberia",
    verified: true,
    stock: "in",
    rating: 4.8,
    reviews: 126,
    emoji: "🚜",
  },
  {
    id: "l-1002",
    title: {
      en: "Drip irrigation kit — 1 hectare, Netafim",
      es: "Kit de riego por goteo — 1 ha, Netafim",
      uk: "Комплект крапельного поливу — 1 га, Netafim",
    },
    category: "irrigation",
    brand: "Netafim",
    condition: "new",
    price: 890,
    currency: "EUR",
    location: "Murcia, ES",
    seller: "Riego del Sur",
    verified: true,
    stock: "in",
    rating: 4.9,
    reviews: 88,
    emoji: "💧",
  },
  {
    id: "l-1003",
    title: {
      en: "Case IH Magnum 340 — 2019, 3,200 h",
      es: "Case IH Magnum 340 — 2019, 3.200 h",
      uk: "Case IH Magnum 340 — 2019, 3 200 м/г",
    },
    category: "harvest",
    brand: "Case IH",
    condition: "used",
    price: 92500,
    currency: "EUR",
    location: "Vinnytsia, UA",
    seller: "PoleAgro Coop",
    verified: true,
    stock: "low",
    rating: 4.7,
    reviews: 41,
    emoji: "🌾",
  },
  {
    id: "l-1004",
    title: {
      en: "Sprayer nozzles set — TeeJet AIXR (24×)",
      es: "Set de boquillas — TeeJet AIXR (24 uds)",
      uk: "Набір форсунок — TeeJet AIXR (24 шт)",
    },
    category: "sprayers",
    brand: "TeeJet",
    condition: "new",
    price: 148,
    currency: "USD",
    location: "Iowa, US",
    seller: "PrairieParts",
    verified: true,
    stock: "in",
    rating: 4.9,
    reviews: 312,
    emoji: "💨",
  },
  {
    id: "l-1005",
    title: {
      en: "Certified hybrid maize seed — 25 kg",
      es: "Semilla de maíz híbrido certificada — 25 kg",
      uk: "Сертифіковане насіння кукурудзи — 25 кг",
    },
    category: "seeds",
    brand: "Pioneer",
    condition: "new",
    price: 215,
    currency: "EUR",
    location: "Cherkasy, UA",
    seller: "SeedHouse",
    verified: true,
    stock: "in",
    rating: 4.8,
    reviews: 204,
    emoji: "🌽",
  },
  {
    id: "l-1006",
    title: {
      en: "Diagnostic scanner — CAN-bus for AG machinery",
      es: "Escáner de diagnóstico — CAN-bus agrícola",
      uk: "Діагностичний сканер — CAN-bus для агротехніки",
    },
    category: "tools",
    brand: "Texa",
    condition: "refurb",
    price: 1490,
    currency: "EUR",
    location: "Milan, IT",
    seller: "OfficinaMobile",
    verified: true,
    stock: "low",
    rating: 4.6,
    reviews: 57,
    emoji: "🔧",
  },
  {
    id: "l-1007",
    title: {
      en: "Centrifugal water pump 7.5 kW",
      es: "Bomba centrífuga de agua 7,5 kW",
      uk: "Відцентровий водяний насос 7,5 кВт",
    },
    category: "irrigation",
    brand: "Grundfos",
    condition: "new",
    price: 720,
    currency: "EUR",
    location: "Sevilla, ES",
    seller: "HidroCampo",
    verified: true,
    stock: "in",
    rating: 4.7,
    reviews: 92,
    emoji: "🚿",
  },
  {
    id: "l-1008",
    title: {
      en: "Engine oil filter — multi-fit (10×)",
      es: "Filtro de aceite — multimarca (10 uds)",
      uk: "Масляний фільтр — універсальний (10 шт)",
    },
    category: "tractor",
    brand: "Donaldson",
    condition: "new",
    price: 89,
    currency: "USD",
    location: "Texas, US",
    seller: "Lone Star Ag",
    verified: false,
    stock: "in",
    rating: 4.5,
    reviews: 24,
    emoji: "🧰",
  },
  {
    id: "l-1009",
    title: {
      en: "Round baler New Holland Roll-Belt 150",
      es: "Empacadora New Holland Roll-Belt 150",
      uk: "Прес-підбирач New Holland Roll-Belt 150",
    },
    category: "harvest",
    brand: "New Holland",
    condition: "used",
    price: 28400,
    currency: "EUR",
    location: "Toulouse, FR",
    seller: "AgriOccitanie",
    verified: true,
    stock: "low",
    rating: 4.8,
    reviews: 18,
    emoji: "🌾",
  },
];

export const categories = [
  { key: "tractor", emoji: "🚜", count: 1280 },
  { key: "irrigation", emoji: "💧", count: 642 },
  { key: "sprayers", emoji: "💨", count: 318 },
  { key: "harvest", emoji: "🌾", count: 410 },
  { key: "seeds", emoji: "🌽", count: 902 },
  { key: "tools", emoji: "🔧", count: 555 },
] as const;

export function slugifySeller(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type Seller = {
  slug: string;
  name: string;
  location: string;
  verified: boolean;
  rating: number;
  reviews: number;
  listings: Listing[];
};

export function getSellers(): Seller[] {
  const map = new Map<string, Seller>();
  for (const l of listings) {
    const slug = slugifySeller(l.seller);
    if (!map.has(slug)) {
      map.set(slug, {
        slug,
        name: l.seller,
        location: l.location,
        verified: l.verified,
        rating: l.rating,
        reviews: l.reviews,
        listings: [],
      });
    }
    map.get(slug)!.listings.push(l);
  }
  // Average rating and total reviews per seller
  for (const s of map.values()) {
    const totalReviews = s.listings.reduce((a, l) => a + l.reviews, 0);
    const weighted =
      s.listings.reduce((a, l) => a + l.rating * l.reviews, 0) /
      Math.max(totalReviews, 1);
    s.rating = Math.round(weighted * 10) / 10;
    s.reviews = totalReviews;
    s.verified = s.listings.every((l) => l.verified);
  }
  return Array.from(map.values());
}

export function getSellerBySlug(slug: string): Seller | undefined {
  return getSellers().find((s) => s.slug === slug);
}
