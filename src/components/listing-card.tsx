import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import type { Listing } from "@/lib/listings";
import { useI18n } from "@/lib/i18n";
import { Link } from "@tanstack/react-router";

const currencySymbol = (c: Listing["currency"]) => (c === "EUR" ? "€" : "$");

export function ListingCard({ listing }: { listing: Listing }) {
  const { t, lang } = useI18n();
  return (
    <Link
      to="/listings/$id"
      params={{ id: listing.id }}
      className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
    >
      <Card className="overflow-hidden border-border/70 transition-all group-hover:border-accent/60 group-hover:shadow-md h-full">
        <div className="aspect-[4/3] bg-gradient-to-br from-secondary to-muted flex items-center justify-center relative">
          <span className="text-6xl select-none transition-transform group-hover:scale-110">
            {listing.emoji}
          </span>
          <div className="absolute top-3 left-3 flex gap-1.5">
            {listing.verified && (
              <Badge
                variant="secondary"
                className="bg-background/90 text-foreground border border-border/60 gap-1 backdrop-blur"
              >
                <BadgeCheck className="h-3 w-3 text-accent" />
                {t("listings.verified")}
              </Badge>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <Badge
              className={
                listing.stock === "in"
                  ? "bg-accent text-accent-foreground"
                  : "bg-[color:var(--gold)] text-[color:var(--gold-foreground)]"
              }
            >
              {listing.stock === "in" ? t("listings.inStock") : t("listings.lowStock")}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium uppercase tracking-wide">{listing.brand}</span>
            <span>·</span>
            <span className="capitalize">
              {t(`browse.condition.${listing.condition}` as const)}
            </span>
          </div>
          <h3 className="mt-1.5 font-display text-base font-semibold leading-snug line-clamp-2 min-h-[2.75rem]">
            {listing.title[lang]}
          </h3>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {listing.location}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-[color:var(--gold)] text-[color:var(--gold)]" />{" "}
              {listing.rating} <span className="opacity-60">({listing.reviews})</span>
            </span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="font-display text-xl font-semibold tracking-tight">
                {currencySymbol(listing.currency)}
                {listing.price.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground truncate max-w-[10rem]">
                {listing.seller}
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="shrink-0"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {t("listings.contact")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
