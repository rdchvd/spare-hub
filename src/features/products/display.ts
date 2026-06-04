import { listings, type Listing } from "@/lib/listings";
import type { Lang } from "@/lib/i18n";
import type { Product } from "./types";

export type ProductDisplay = {
  id: string;
  product: Product;
  name: string;
  description: string;
  price: number;
  quantity: number;
  stock: "in" | "low";
  mock: Pick<
    Listing,
    | "category"
    | "brand"
    | "condition"
    | "location"
    | "seller"
    | "verified"
    | "rating"
    | "reviews"
    | "emoji"
    | "currency"
  >;
};

export function mockListingForProduct(product: Product): Listing {
  return listings[Math.abs(product.id) % listings.length]!;
}

export function productToDisplay(product: Product): ProductDisplay {
  const mock = mockListingForProduct(product);
  return {
    id: String(product.id),
    product,
    name: product.name,
    description: product.description ?? "",
    price: Number(product.price),
    quantity: product.quantity,
    stock: product.quantity > 5 ? "in" : "low",
    mock: {
      category: mock.category,
      brand: mock.brand,
      condition: mock.condition,
      location: mock.location,
      seller: mock.seller,
      verified: mock.verified,
      rating: mock.rating,
      reviews: mock.reviews,
      emoji: mock.emoji,
      currency: mock.currency,
    },
  };
}

export function productsToDisplay(products: Product[] | null | undefined): ProductDisplay[] {
  if (!Array.isArray(products)) return [];
  return products.map(productToDisplay);
}

export function mockListingToDisplay(listing: Listing, lang: Lang = "en"): ProductDisplay {
  return {
    id: listing.id,
    product: {
      id: 0,
      seller: 0,
      name: listing.title[lang],
      description: "",
      price: String(listing.price),
      quantity: listing.stock === "in" ? 12 : 3,
      created_at: "",
      updated_at: "",
      deleted_at: null,
    },
    name: listing.title[lang],
    description: "",
    price: listing.price,
    quantity: listing.stock === "in" ? 12 : 3,
    stock: listing.stock,
    mock: {
      category: listing.category,
      brand: listing.brand,
      condition: listing.condition,
      location: listing.location,
      seller: listing.seller,
      verified: listing.verified,
      rating: listing.rating,
      reviews: listing.reviews,
      emoji: listing.emoji,
      currency: listing.currency,
    },
  };
}

export function currencySymbol(currency: Listing["currency"]) {
  return currency === "EUR" ? "€" : "$";
}
