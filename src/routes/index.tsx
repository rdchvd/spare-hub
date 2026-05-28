import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { listings, categories } from "@/lib/listings";
import { ArrowRight, Search, ShieldCheck, Wrench, Signal, BadgeCheck, MapPin } from "lucide-react";
import heroField from "@/assets/hero-field.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { t } = useI18n();

  const featured = listings.slice(0, 8);
  const spotlight = listings[2]; // editorial spotlight

  const trustItems = [
    { icon: ShieldCheck, key: "t1" as const },
    { icon: Wrench, key: "t2" as const },
    { icon: Signal, key: "t3" as const },
  ];

  // Subtle parallax on the hero image
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <SiteLayout>
      {/* Editorial hero — full-bleed photograph + layered depth */}
      <section
        ref={heroRef}
        className="relative overflow-hidden border-b border-border/60 bg-[color:var(--primary)]"
      >
        {/* Background photograph */}
        <div className="absolute inset-0">
          <img
            src={heroField}
            alt=""
            aria-hidden="true"
            width={1920}
            height={1080}
            className="h-full w-full object-cover object-center will-change-transform"
            style={{ transform: `translate3d(0, ${scrollY * 0.15}px, 0) scale(1.05)` }}
          />
          {/* Emerald veil — left-to-right for readable copy */}
          <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--primary)] via-[color:var(--primary)]/85 to-[color:var(--primary)]/30" />
          {/* Bottom fade into page */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
          {/* Grain — subtle paper texture */}
          <div
            className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-20 md:pt-20 md:pb-28">
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            {/* Left: editorial copy */}
            <div className="md:col-span-7 text-[color:var(--primary-foreground)]">
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--primary-foreground)]/20 bg-[color:var(--primary-foreground)]/10 backdrop-blur px-3 py-1 text-xs font-medium animate-fade-in">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
                {t("hero.eyebrow")}
              </div>
              <h1
                className="mt-5 font-display font-semibold leading-[0.95] tracking-[-0.03em] text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] animate-fade-in"
                style={{ animationDelay: "60ms", animationFillMode: "both" }}
              >
                {t("hero.title")}
              </h1>
              <p
                className="mt-5 max-w-xl text-base md:text-lg text-[color:var(--primary-foreground)]/85 animate-fade-in"
                style={{ animationDelay: "120ms", animationFillMode: "both" }}
              >
                {t("hero.subtitle")}
              </p>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-7 flex gap-2 max-w-xl rounded-2xl bg-background/95 backdrop-blur p-1.5 shadow-2xl ring-1 ring-[color:var(--primary-foreground)]/10 animate-fade-in"
                style={{ animationDelay: "180ms", animationFillMode: "both" }}
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={t("hero.searchPlaceholder")}
                    className="pl-10 h-12 text-base border-0 shadow-none focus-visible:ring-0 bg-transparent"
                  />
                </div>
                <Button asChild size="lg" className="h-12 px-6">
                  <Link to="/browse">{t("hero.searchCta")}</Link>
                </Button>
              </form>

              <dl
                className="mt-10 grid grid-cols-3 gap-6 max-w-lg border-t border-[color:var(--primary-foreground)]/15 pt-6 animate-fade-in"
                style={{ animationDelay: "240ms", animationFillMode: "both" }}
              >
                {[
                  { v: "850+", k: "hero.stat.sellers" as const },
                  { v: "12k+", k: "hero.stat.parts" as const },
                  { v: "22", k: "hero.stat.regions" as const },
                ].map((s) => (
                  <div key={s.k}>
                    <dd className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
                      {s.v}
                    </dd>
                    <dt className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[color:var(--primary-foreground)]/65">
                      {t(s.k)}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>

            {/* Right: floating spotlight card — layered depth */}
            <div className="md:col-span-5 hidden md:block">
              <div
                className="relative ml-auto max-w-sm animate-fade-in"
                style={{ animationDelay: "320ms", animationFillMode: "both" }}
              >
                {/* Back card (depth) */}
                <div className="absolute -top-6 -right-3 h-full w-full rounded-2xl bg-[color:var(--gold)]/20 backdrop-blur-sm border border-[color:var(--gold)]/30" />
                <div className="absolute top-3 -left-4 h-full w-full rounded-2xl bg-[color:var(--primary-foreground)]/5 backdrop-blur-sm border border-[color:var(--primary-foreground)]/10" />

                {/* Front spotlight card */}
                <Link
                  to="/listings/$id"
                  params={{ id: spotlight.id }}
                  className="relative block rounded-2xl bg-background/95 backdrop-blur border border-border/40 shadow-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)] animate-pulse" />
                    {t("hero.spotlight")}
                  </div>
                  <div className="mt-4 flex items-start gap-4">
                    <div className="h-20 w-20 rounded-xl bg-secondary flex items-center justify-center text-4xl shrink-0">
                      {spotlight.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-base font-semibold leading-tight line-clamp-2">
                        {spotlight.title.en}
                      </div>
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {spotlight.location}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <div className="font-display text-2xl font-semibold tracking-tight">
                        €{spotlight.price.toLocaleString()}
                      </div>
                      <div className="mt-0.5 inline-flex items-center gap-1 text-xs text-[color:var(--accent)]">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        {spotlight.seller}
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground/80">
                      {t("hero.viewListing")} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories — small card grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
              {t("cats.title")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{t("cats.subtitle")}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((c) => (
            <Link key={c.key} to="/c/$category" params={{ category: c.key }} className="group">


              <Card className="h-full border-border/70 transition-all hover:border-accent/60 hover:shadow-sm hover:-translate-y-0.5">
                <CardContent className="p-4">
                  <div className="text-3xl mb-2">{c.emoji}</div>
                  <div className="font-display font-semibold text-sm leading-tight">
                    {t(`cat.${c.key}` as const)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {t(`cat.${c.key}.desc` as const)}
                  </div>
                  <div className="text-xs text-accent mt-2 font-medium">
                    {c.count.toLocaleString()}+
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured listings — primary card grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
              {t("listings.title")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{t("listings.subtitle")}</p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/browse">
              {t("listings.viewAll")} <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>

        <div className="sm:hidden mt-6 flex justify-center">
          <Button asChild variant="outline">
            <Link to="/browse">{t("listings.viewAll")}</Link>
          </Button>
        </div>
      </section>

      {/* Trust */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
            {t("trust.title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {trustItems.map(({ icon: Icon, key }) => (
              <div key={key} className="rounded-xl bg-background border border-border/70 p-5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold">{t(`trust.${key}.title` as const)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(`trust.${key}.body` as const)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl bg-primary text-primary-foreground p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
              {t("cta.title")}
            </h2>
            <p className="mt-2 text-primary-foreground/85">{t("cta.body")}</p>
          </div>
          <Button asChild size="lg" className="bg-[color:var(--gold)] text-[color:var(--gold-foreground)] hover:bg-[color:var(--gold)]/90 shrink-0">
            <Link to="/register">{t("cta.button")}</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
