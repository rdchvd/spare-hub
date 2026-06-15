import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";
import { SiteLayout } from "@/components/site-layout";
import { useI18n, type Lang } from "@/lib/i18n";
import { routeVisibility } from "@/lib/route-visibility";

export const Route = createFileRoute("/legal/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie policy — Spare Hub" },
      {
        name: "description",
        content: "The small set of cookies Spare Hub uses, and how to control them.",
      },
      { property: "og:title", content: "Cookie policy — Spare Hub" },
      {
        property: "og:description",
        content: "Essential, preference and analytics cookies — explained plainly.",
      },
    ],
  }),
  component: Cookies,
});

const content: Record<
  Lang,
  { intro: string; rows: { name: string; purpose: string; type: string }[] }
> = {
  en: {
    intro: "We keep cookies minimal. Here's the full list and what each one does.",
    rows: [
      { name: "sparehub.lang", purpose: "Remember your language", type: "Preference" },
      { name: "sparehub.theme", purpose: "Remember light/dark theme", type: "Preference" },
      { name: "sparehub.cookies", purpose: "Remember your cookie choice", type: "Essential" },
      {
        name: "sparehub.profile",
        purpose: "Store your profile draft on this device",
        type: "Essential",
      },
    ],
  },
  es: {
    intro: "Usamos las cookies al mínimo. Esta es la lista completa y qué hace cada una.",
    rows: [
      { name: "sparehub.lang", purpose: "Recordar tu idioma", type: "Preferencia" },
      { name: "sparehub.theme", purpose: "Recordar tema claro/oscuro", type: "Preferencia" },
      { name: "sparehub.cookies", purpose: "Recordar tu elección de cookies", type: "Esencial" },
      {
        name: "sparehub.profile",
        purpose: "Guardar el borrador de tu perfil en este dispositivo",
        type: "Esencial",
      },
    ],
  },
  uk: {
    intro: "Ми використовуємо cookies по мінімуму. Ось повний перелік і що кожен з них робить.",
    rows: [
      { name: "sparehub.lang", purpose: "Пам'ятати вашу мову", type: "Налаштування" },
      { name: "sparehub.theme", purpose: "Пам'ятати світлу/темну тему", type: "Налаштування" },
      { name: "sparehub.cookies", purpose: "Пам'ятати ваш вибір щодо cookies", type: "Необхідний" },
      {
        name: "sparehub.profile",
        purpose: "Зберегти чернетку профілю на цьому пристрої",
        type: "Необхідний",
      },
    ],
  },
};

function Cookies() {
  if (!routeVisibility.legalFooter.cookies) return <ComingSoon />;
  const { t, lang } = useI18n();
  const c = content[lang];
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          {t("legal.cookies.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("legal.lastUpdated")}: 2026-05-01</p>
        <p className="mt-6 text-foreground/90">{c.intro}</p>
        <div className="mt-8 overflow-hidden rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Purpose</th>
                <th className="px-4 py-3 font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r) => (
                <tr key={r.name} className="border-t border-border/60">
                  <td className="px-4 py-3 font-mono text-xs">{r.name}</td>
                  <td className="px-4 py-3 text-foreground/85">{r.purpose}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </SiteLayout>
  );
}
