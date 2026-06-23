import { createFileRoute, Link } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { routeVisibility } from "@/lib/route-visibility";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/account/favorites")({
  component: Favorites,
});

function Favorites() {
  if (!routeVisibility.accountTabs.favorites) return <ComingSoon embedded />;
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-display text-xl font-semibold">{t("account.favorites.title")}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t("account.favorites.subtitle")}</p>
      </header>
      <Card className="border-border/60">
        <CardContent className="p-10 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold">
            {t("account.favorites.emptyTitle")}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            {t("account.favorites.emptyBody")}
          </p>
          <Button asChild variant="outline" className="mt-5">
            <Link to="/browse">{t("nav.browse")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
