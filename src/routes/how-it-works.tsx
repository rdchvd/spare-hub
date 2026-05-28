import { createFileRoute, Link } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";
import { SiteLayout } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { routeVisibility } from "@/lib/route-visibility";
import { Search, MessageSquare, HandshakeIcon, Star } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How Spare Hub works — the marketplace for agronomy" },
      { name: "description", content: "Search verified sellers, talk directly, agree the deal, rate the experience. Spare Hub keeps it simple." },
      { property: "og:title", content: "How Spare Hub works" },
      { property: "og:description", content: "Search, talk, agree, rate. Four steps that keep agronomy buying honest." },
    ],
  }),
  component: HowItWorks,
});

function HowItWorks() {
  if (!routeVisibility.supportFooter.howItWorks) return <ComingSoon />;
  const { t } = useI18n();
  const steps = [
    { icon: Search, key: "b1" },
    { icon: MessageSquare, key: "b2" },
    { icon: HandshakeIcon, key: "b3" },
    { icon: Star, key: "b4" },
  ] as const;

  return (
    <SiteLayout>
      <section className="border-b border-border/60 bg-field">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
            {t("trust.howItWorks.title")}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">{t("trust.howItWorks.subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 grid gap-4 md:grid-cols-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={s.key} className="border-border/60">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-muted-foreground">0{i + 1}</div>
                    <h3 className="font-display text-lg font-semibold mt-0.5">
                      {t(`trust.howItWorks.${s.key}.title` as const)}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t(`trust.howItWorks.${s.key}.body` as const)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-16 flex flex-wrap items-center justify-center gap-2">
        <Button asChild size="lg">
          <Link to="/browse">{t("nav.browse")}</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/sell">{t("nav.sell")}</Link>
        </Button>
      </section>
    </SiteLayout>
  );
}
