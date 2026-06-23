import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";
import { SiteLayout } from "@/components/site-layout";
import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n";
import { routeVisibility } from "@/lib/route-visibility";
import { listings } from "@/lib/listings";
import { ApiError } from "@/features/auth/client";
import { productQueries, useMyProducts } from "@/features/products/queries";
import {
  currencySymbol,
  mockListingToDisplay,
  productToDisplay,
  productsToDisplay,
} from "@/features/products/display";
import { canManageProducts } from "@/features/products/client";
import { useAuth } from "@/features/auth/auth-context";
import { initials } from "@/lib/profile";
import {
  ArrowLeft,
  BadgeCheck,
  Heart,
  MapPin,
  MessageSquare,
  Pencil,
  Phone,
  Share2,
  Star,
  Trash2,
  Truck,
} from "lucide-react";

export const Route = createFileRoute("/listings/$id")({
  loader: async ({ params, context: { queryClient } }) => {
    const numericId = Number(params.id);
    if (Number.isFinite(numericId)) {
      try {
        const product = await queryClient.fetchQuery(productQueries.detail(numericId));
        const listing = productToDisplay(product);
        const all = await queryClient.ensureQueryData(productQueries.list());
        const related = productsToDisplay(all)
          .filter((l) => l.id !== listing.id && l.mock.category === listing.mock.category)
          .slice(0, 4);
        return { listing, related, mockOnly: false as const };
      } catch (error) {
        if (!(error instanceof ApiError && error.status === 404)) throw error;
      }
    }

    const mock = listings.find((l) => l.id === params.id);
    if (!mock) throw notFound();
    const listing = mockListingToDisplay(mock);
    const related = listings
      .filter((l) => l.id !== mock.id && l.category === mock.category)
      .slice(0, 4)
      .map((l) => mockListingToDisplay(l));
    return { listing, related, mockOnly: true as const };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.listing.name} — Spare Hub` },
          {
            name: "description",
            content: `${loaderData.listing.brand} · ${loaderData.listing.mock.location} · from ${loaderData.listing.sellerName || "Spare Hub"}.`,
          },
        ]
      : [{ title: "Listing — Spare Hub" }],
  }),
  component: ListingDetail,
  notFoundComponent: ListingNotFound,
});

function ListingDetail() {
  if (!routeVisibility.backend.productsApiReady) return <ComingSoon showBrowse={false} />;
  const { listing, related, mockOnly } = Route.useLoaderData();
  const { t } = useI18n();
  const { user } = useAuth();
  const { data: mine = [] } = useMyProducts(canManageProducts(user) && !mockOnly);
  const isOwner = !mockOnly && mine.some((p) => p.id === listing.product.id);
  const { mock } = listing;
  const sellerInitials = initials(listing.sellerName, listing.sellerName);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("listing.back")}
        </Link>

        {isOwner ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link to="/sell/$id/edit" params={{ id: listing.id }}>
                <Pencil className="h-4 w-4" />
                {t("account.listings.actions.edit")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-1.5 text-destructive hover:text-destructive"
            >
              <Link to="/sell/$id/edit" params={{ id: listing.id }} search={{ delete: true }}>
                <Trash2 className="h-4 w-4" />
                {t("products.delete")}
              </Link>
            </Button>
          </div>
        ) : null}

        <div className="mt-6 grid lg:grid-cols-[1.4fr_1fr] gap-8">
          <div>
            <div className="aspect-[4/3] rounded-2xl border border-border/70 bg-gradient-to-br from-secondary to-muted flex items-center justify-center relative overflow-hidden">
              <span className="text-9xl select-none">{mock.emoji}</span>
              <div className="absolute top-4 left-4 flex gap-2">
                {mock.verified && (
                  <Badge
                    variant="secondary"
                    className="bg-background/90 text-foreground border border-border/60 gap-1 backdrop-blur"
                  >
                    <BadgeCheck className="h-3.5 w-3.5 text-accent" />
                    {t("listings.verified")}
                  </Badge>
                )}
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

            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold">{t("listing.description")}</h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {listing.description || t("listing.description.body")}
              </p>
            </section>

            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold">{t("listing.specs")}</h2>
              <dl className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                {[
                  { k: t("listing.spec.brand"), v: listing.brand, mock: false },
                  {
                    k: t("listing.spec.condition"),
                    v: t(`browse.condition.${listing.condition}` as const),
                    mock: false,
                  },
                  {
                    k: t("listing.spec.category"),
                    v: t(`cat.${mock.category}` as const),
                    mock: true,
                  },
                  { k: t("listing.spec.location"), v: mock.location, mock: true },
                  { k: t("sell.field.currency"), v: listing.currency, mock: false },
                  {
                    k: t("products.quantity"),
                    v: String(listing.quantity),
                    mock: false,
                  },
                  {
                    k: t("listing.spec.stock"),
                    v: listing.stock === "in" ? t("listings.inStock") : t("listings.lowStock"),
                    mock: false,
                  },
                  { k: t("listing.spec.sku"), v: listing.id.toUpperCase(), mock: false },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="flex justify-between gap-4 border-b border-border/50 py-2"
                  >
                    <dt className="text-muted-foreground">{row.k}</dt>
                    <dd
                      className={`font-medium text-right ${row.mock ? "text-[color:var(--mock-foreground)] italic" : "text-foreground"}`}
                    >
                      {row.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mt-10 flex items-start gap-3 rounded-xl border border-dashed border-[color:var(--mock)] bg-[color:var(--mock)]/10 p-4">
              <Truck className="h-5 w-5 text-[color:var(--mock-foreground)] shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-sm text-[color:var(--mock-foreground)]">
                  {t("listing.shipping")}
                </div>
                <p className="text-sm text-[color:var(--mock-foreground)]/80 mt-1">
                  {t("listing.shipping.body")}
                </p>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-20 lg:self-start space-y-4">
            <Card className="border-border/70">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium uppercase tracking-wide">{listing.brand}</span>
                  <span>·</span>
                  <Link
                    to="/c/$category"
                    params={{ category: mock.category }}
                    className="text-[color:var(--mock-foreground)] hover:text-foreground"
                  >
                    {t(`cat.${mock.category}` as const)}
                  </Link>
                </div>
                <h1 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight">
                  {listing.name}
                </h1>

                <div className="mt-3 flex items-center gap-4 text-xs text-[color:var(--mock-foreground)]">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {mock.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-[color:var(--gold)] text-[color:var(--gold)]" />
                    {mock.rating}
                    <span className="opacity-60">({mock.reviews})</span>
                  </span>
                </div>

                <div className="mt-5 font-display text-4xl font-semibold tracking-tight">
                  {currencySymbol(listing.currency)}
                  {listing.price.toLocaleString()}
                </div>

                <div className="mt-5 space-y-2">
                  <Button className="w-full h-11 gap-2">
                    <MessageSquare className="h-4 w-4" /> {t("listing.message")}
                  </Button>
                  <Button variant="outline" className="w-full h-11 gap-2">
                    <Phone className="h-4 w-4" /> {t("listing.call")}
                  </Button>
                  <div className="flex gap-2 pt-1">
                    <Button variant="ghost" size="sm" className="flex-1 gap-1.5">
                      <Heart className="h-4 w-4" /> {t("listing.save")}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 gap-1.5">
                      <Share2 className="h-4 w-4" /> {t("listing.share")}
                    </Button>
                  </div>
                </div>

                <Separator className="my-5" />

                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    {t("listing.seller")}
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-semibold">
                      {sellerInitials}
                    </div>
                    <div className="min-w-0">
                      <div
                        className={`font-medium text-sm truncate ${listing.sellerIsPreview ? "text-[color:var(--mock-foreground)]" : "text-foreground"}`}
                      >
                        {listing.sellerName || t("listing.seller")}
                      </div>
                      {listing.sellerIsPreview && mock.verified ? (
                        <div className="text-xs text-accent flex items-center gap-1">
                          <BadgeCheck className="h-3 w-3" /> {t("listings.verified")}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-semibold tracking-tight mb-6">
              {t("listing.related")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}

function ListingNotFound() {
  const { t } = useI18n();
  return (
    <SiteLayout>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">{t("listing.notFound.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("listing.notFound.body")}</p>
        <Button asChild className="mt-6">
          <Link to="/browse">{t("nav.browse")}</Link>
        </Button>
      </div>
    </SiteLayout>
  );
}
