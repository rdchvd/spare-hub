import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";
import { SiteLayout } from "@/components/site-layout";
import { useI18n, type Lang } from "@/lib/i18n";
import { routeVisibility } from "@/lib/route-visibility";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy — Spare Hub" },
      { name: "description", content: "What data we collect, why we collect it, and how we keep it safe." },
      { property: "og:title", content: "Privacy policy — Spare Hub" },
      { property: "og:description", content: "Clear, plain-language privacy practices for buyers and sellers." },
    ],
  }),
  component: Privacy,
});

const content: Record<Lang, { intro: string; sections: { h: string; p: string }[] }> = {
  en: {
    intro: "Your data belongs to you. We only collect what's needed to run the marketplace, and we never sell it.",
    sections: [
      { h: "What we collect", p: "Account details (name, email, optional phone), listings you publish, messages you send through the platform, and basic usage analytics." },
      { h: "Why we collect it", p: "To authenticate you, deliver messages, show relevant listings, prevent fraud and improve the service." },
      { h: "Who we share with", p: "Service providers that host our infrastructure and send transactional email. Never with advertisers." },
      { h: "Retention", p: "Account data is retained while your account is active. Closed accounts are deleted within 30 days, except where law requires otherwise." },
      { h: "Your rights", p: "Access, correction, deletion and export — write to privacy@sparehub.example and we'll respond within 30 days." },
      { h: "Cookies", p: "See our cookie policy for the small set of cookies we use." },
    ],
  },
  uk: {
    intro: "Ваші дані належать вам. Ми збираємо лише необхідне для роботи маркетплейсу і ніколи їх не продаємо.",
    sections: [
      { h: "Що ми збираємо", p: "Дані акаунта (ім'я, email, телефон за бажанням), ваші оголошення, повідомлення на платформі та базову аналітику використання." },
      { h: "Навіщо ми це збираємо", p: "Щоб ідентифікувати вас, доставляти повідомлення, показувати релевантні оголошення, запобігати шахрайству і покращувати сервіс." },
      { h: "З ким ми ділимось", p: "Постачальники, які хостять інфраструктуру й надсилають транзакційні листи. Ніколи з рекламодавцями." },
      { h: "Зберігання", p: "Дані зберігаються поки ваш акаунт активний. Закриті акаунти видаляються протягом 30 днів, окрім випадків, передбачених законом." },
      { h: "Ваші права", p: "Доступ, виправлення, видалення та експорт — напишіть на privacy@sparehub.example, ми відповімо протягом 30 днів." },
      { h: "Cookies", p: "Див. політику cookies про невеликий набір, який ми використовуємо." },
    ],
  },
};

function Privacy() {
  if (!routeVisibility.legalFooter.privacy) return <ComingSoon />;
  const { t, lang } = useI18n();
  const c = content[lang];
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          {t("legal.privacy.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("legal.lastUpdated")}: 2026-05-01
        </p>
        <p className="mt-6 text-foreground/90">{c.intro}</p>
        <div className="mt-8 space-y-6">
          {c.sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-lg font-semibold">{s.h}</h2>
              <p className="mt-2 text-foreground/85">{s.p}</p>
            </section>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
