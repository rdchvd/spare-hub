import { Link } from "@tanstack/react-router";
import { Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteLayout } from "@/components/site-layout";
import { useI18n } from "@/lib/i18n";

export function ComingSoon({
  embedded = false,
  showBrowse = true,
}: {
  embedded?: boolean;
  showBrowse?: boolean;
}) {
  const { t } = useI18n();

  const content = (
    <Card className="border-border/60">
      <CardContent className="p-10 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Clock3 className="h-5 w-5 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-semibold">{t("comingSoon.title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">{t("comingSoon.body")}</p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button asChild variant="outline">
            <Link to="/">{t("comingSoon.backHome")}</Link>
          </Button>
          {showBrowse ? (
            <Button asChild>
              <Link to="/browse">{t("nav.browse")}</Link>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );

  if (embedded) {
    return <div className="space-y-6">{content}</div>;
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">{content}</section>
    </SiteLayout>
  );
}
