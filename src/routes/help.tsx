import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";
import { SiteLayout } from "@/components/site-layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useI18n } from "@/lib/i18n";
import { routeVisibility } from "@/lib/route-visibility";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help centre — Spare Hub" },
      {
        name: "description",
        content:
          "Pricing, regions, verification and returns — quick answers for buyers and sellers.",
      },
      { property: "og:title", content: "Help centre — Spare Hub" },
      { property: "og:description", content: "Common questions answered in plain language." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Is Spare Hub free to use?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes — browsing and messaging are free. Sellers only pay a small fee when a deal closes.",
              },
            },
            {
              "@type": "Question",
              name: "Which countries do you operate in?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Spain, Ukraine, France, Italy and several US states today.",
              },
            },
            {
              "@type": "Question",
              name: "How do I know a seller is genuine?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Look for the verified badge — we've checked their licence and at least three references.",
              },
            },
            {
              "@type": "Question",
              name: "What if the part isn't what was described?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Talk to the seller, then open a report. Verified sellers honour returns within 14 days.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: Help,
});

function Help() {
  if (!routeVisibility.supportFooter.help) return <ComingSoon />;
  const { t } = useI18n();
  const qa = [
    { q: "trust.help.q1", a: "trust.help.a1" },
    { q: "trust.help.q2", a: "trust.help.a2" },
    { q: "trust.help.q3", a: "trust.help.a3" },
    { q: "trust.help.q4", a: "trust.help.a4" },
  ] as const;

  return (
    <SiteLayout>
      <section className="border-b border-border/60 bg-field">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
            {t("trust.help.title")}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">{t("trust.help.subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <Accordion type="single" collapsible className="w-full">
          {qa.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger className="text-left font-medium">{t(item.q)}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{t(item.a)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="mt-8 text-sm text-muted-foreground">{t("trust.help.contact")}</p>
      </section>
    </SiteLayout>
  );
}
