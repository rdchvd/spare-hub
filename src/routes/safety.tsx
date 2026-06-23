import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";
import { SiteLayout } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { routeVisibility } from "@/lib/route-visibility";
import { ShieldCheck, Wallet, MessageCircle, Flag } from "lucide-react";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety on Spare Hub — buy and sell with confidence" },
      {
        name: "description",
        content:
          "Verified sellers, on-platform messaging, pay-on-collection rules, and a report flow reviewed within two business days.",
      },
      { property: "og:title", content: "Safety on Spare Hub" },
      {
        property: "og:description",
        content: "Practical guardrails that keep the marketplace trustworthy.",
      },
    ],
  }),
  component: Safety,
});

function Safety() {
  if (!routeVisibility.supportFooter.safety) return <ComingSoon />;
  const { t } = useI18n();
  const tiles = [
    { icon: ShieldCheck, key: "s1" },
    { icon: Wallet, key: "s2" },
    { icon: MessageCircle, key: "s3" },
    { icon: Flag, key: "s4" },
  ] as const;

  return (
    <SiteLayout>
      <section className="border-b border-border/60 bg-field">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
            {t("trust.safety.title")}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">{t("trust.safety.subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 grid gap-4 md:grid-cols-2">
        {tiles.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.key} className="border-border/60">
              <CardContent className="p-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mt-4">
                  {t(`trust.safety.${s.key}.title` as const)}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t(`trust.safety.${s.key}.body` as const)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </SiteLayout>
  );
}
