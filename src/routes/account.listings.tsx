import { createFileRoute, Link } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { routeVisibility } from "@/lib/route-visibility";
import { ListChecks, Plus } from "lucide-react";

export const Route = createFileRoute("/account/listings")({
  component: MyListings,
});

function MyListings() {
  if (!routeVisibility.accountTabs.listings) return <ComingSoon embedded />;
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-display text-xl font-semibold">{t("account.listings.title")}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t("account.listings.subtitle")}</p>
      </header>
      <Card className="border-border/60">
        <CardContent className="p-10 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ListChecks className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold">{t("account.listings.emptyTitle")}</h3>
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
    </div>
  );
}
