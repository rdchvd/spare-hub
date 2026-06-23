import { createFileRoute, Link } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";
import { SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { routeVisibility } from "@/lib/route-visibility";
import { Store, TrendingUp, Users, Zap } from "lucide-react";

export const Route = createFileRoute("/sell/")({
  component: Sell,
});

function Sell() {
  if (!routeVisibility.header.sell) return <ComingSoon />;
  const { t } = useI18n();
  const perks = [
    {
      icon: Users,
      title: "12,000+ active buyers",
      body: "Farms, agronomists and cooperatives looking for parts every week.",
    },
    {
      icon: TrendingUp,
      title: "Free to list",
      body: "No upfront fee — you pay only when you close a deal.",
    },
    {
      icon: Zap,
      title: "Fast onboarding",
      body: "Open a storefront, upload your catalog and start selling in under an hour.",
    },
  ];
  return (
    <SiteLayout>
      <section className="bg-field border-b border-border/60">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 backdrop-blur px-3 py-1 text-xs font-medium text-muted-foreground">
            <Store className="h-3.5 w-3.5" /> {t("nav.sell")}
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold tracking-tight">
            {t("cta.title")}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">{t("cta.body")}</p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <Button
              asChild
              size="lg"
              className="bg-[color:var(--gold)] text-[color:var(--gold-foreground)] hover:bg-[color:var(--gold)]/90"
            >
              <Link to="/sell/new">{t("sell.cta")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/register">{t("cta.button")}</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-3 gap-4">
        {perks.map((p) => (
          <div key={p.title} className="rounded-xl border border-border bg-background p-5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <p.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-3 font-display text-lg font-semibold">{p.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
