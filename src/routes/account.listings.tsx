import { createFileRoute, Link } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { routeVisibility } from "@/lib/route-visibility";
import { useMyProducts } from "@/features/products/queries";
import { useSellerGuard } from "@/features/products/use-seller-guard";
import { currencySymbol, productsToDisplay } from "@/features/products/display";
import { ListChecks, Loader2, Pencil, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/account/listings")({
  component: MyListings,
});

function MyListings() {
  if (!routeVisibility.accountTabs.listings) return <ComingSoon embedded />;
  const { t } = useI18n();
  const { ready } = useSellerGuard("/account/listings");
  const { data, isLoading, isError } = useMyProducts(ready);

  if (!ready) {
    return (
      <div className="flex justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const listings = productsToDisplay(data ?? []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-border/60 p-8 text-center text-sm text-muted-foreground">
        {t("products.error.forbidden")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold">{t("account.listings.title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("account.listings.subtitle")}</p>
        </div>
        <Button
          asChild
          className="gap-2 bg-[color:var(--gold)] text-[color:var(--gold-foreground)] hover:bg-[color:var(--gold)]/90 shrink-0"
        >
          <Link to="/sell/new">
            <Plus className="h-4 w-4" />
            {t("sell.cta")}
          </Link>
        </Button>
      </header>

      {listings.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="p-10 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ListChecks className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold">
              {t("account.listings.emptyTitle")}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              {t("account.listings.emptyBody")}
            </p>
            <Button
              asChild
              className="mt-5 gap-2 bg-[color:var(--gold)] text-[color:var(--gold-foreground)] hover:bg-[color:var(--gold)]/90"
            >
              <Link to="/sell/new">
                <Plus className="h-4 w-4" />
                {t("sell.cta")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <Card key={listing.id} className="border-border/60">
              <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center text-2xl shrink-0">
                    {listing.mock.emoji}
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-semibold truncate">{listing.name}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium">
                        {currencySymbol(listing.currency)}
                        {listing.price.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">
                        {t("products.quantity")}: {listing.quantity}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[color:var(--mock-foreground)] border-[color:var(--mock)]"
                      >
                        {t(`cat.${listing.mock.category}` as const)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground truncate">
                      {listing.brand} ·{" "}
                      <span className="text-[color:var(--mock-foreground)]">
                        {listing.mock.location}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/listings/$id" params={{ id: listing.id }}>
                      {t("account.listings.actions.view")}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="gap-1.5">
                    <Link to="/sell/$id/edit" params={{ id: listing.id }}>
                      <Pencil className="h-3.5 w-3.5" />
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
                      <Trash2 className="h-3.5 w-3.5" />
                      {t("account.listings.actions.delete")}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
