import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";
import { SiteLayout } from "@/components/site-layout";
import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { routeVisibility } from "@/lib/route-visibility";
import { getSellerBySlug } from "@/lib/listings";
import { mockListingToDisplay } from "@/features/products/display";
import { BadgeCheck, Clock, MapPin, MessageSquare, Phone, Star, Store } from "lucide-react";

export const Route = createFileRoute("/sellers/$slug")({
  loader: ({ params }) => {
    const seller = getSellerBySlug(params.slug);
    if (!seller) throw notFound();
    return { seller };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.seller.name} — Spare Hub` },
          {
            name: "description",
            content: `${loaderData.seller.name} on Spare Hub — ${loaderData.seller.listings.length} listings from ${loaderData.seller.location}.`,
          },
          { property: "og:title", content: `${loaderData.seller.name} — Spare Hub` },
          {
            property: "og:description",
            content: `${loaderData.seller.listings.length} listings from ${loaderData.seller.location}.`,
          },
          { property: "og:type", content: "profile" },
        ]
      : [{ title: "Seller — Spare Hub" }],
  }),
  component: SellerPage,
  notFoundComponent: SellerNotFound,
});

function SellerPage() {
  if (!routeVisibility.backend.productsApiReady) return <ComingSoon showBrowse={false} />;
  const { seller } = Route.useLoaderData();
  const { t, lang } = useI18n();

  return (
    <SiteLayout>
      <section className="border-b border-border/60 bg-field">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
          <div className="h-20 w-20 rounded-2xl bg-primary/10 border border-border flex items-center justify-center">
            <Store className="h-9 w-9 text-primary" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
                {seller.name}
              </h1>
              {seller.verified && (
                <Badge variant="secondary" className="gap-1 border border-border/60">
                  <BadgeCheck className="h-3.5 w-3.5 text-accent" />
                  {t("listings.verified")}
                </Badge>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {seller.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 text-[color:var(--gold)]" />
                {seller.rating.toFixed(1)} · {seller.reviews}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {t("seller.responseTime")}
              </span>
            </div>
          </div>

          <div className="flex gap-2 md:justify-end">
            <Button className="gap-2">
              <MessageSquare className="h-4 w-4" />
              {t("seller.message")}
            </Button>
            <Button variant="outline" size="icon" aria-label={t("seller.contact")}>
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-[1fr_280px]">
        <div>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display text-xl font-semibold">{t("seller.allListings")}</h2>
            <span className="text-sm text-muted-foreground">
              {seller.listings.length} {t("seller.listingsCount")}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {seller.listings.map((l) => (
              <ListingCard key={l.id} listing={mockListingToDisplay(l, lang)} />
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="border-border/60">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t("seller.about")}
              </h3>
              <p className="text-sm text-foreground/90">{t("seller.memberSince")}</p>
              <div className="text-sm text-muted-foreground space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {seller.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-[color:var(--gold)]" />
                  {seller.rating.toFixed(1)} ({seller.reviews})
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </SiteLayout>
  );
}

function SellerNotFound() {
  const { t } = useI18n();
  return (
    <SiteLayout>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">{t("seller.notFound")}</h1>
        <p className="mt-2 text-muted-foreground">{t("seller.notFoundBody")}</p>
        <Button asChild className="mt-6">
          <Link to="/browse">{t("nav.browse")}</Link>
        </Button>
      </div>
    </SiteLayout>
  );
}
