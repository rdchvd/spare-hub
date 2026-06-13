import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";
import { SiteLayout } from "@/components/site-layout";
import { useI18n, type Lang } from "@/lib/i18n";
import { routeVisibility } from "@/lib/route-visibility";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Terms of service — Spare Hub" },
      { name: "description", content: "The terms that govern use of Spare Hub for buyers and sellers." },
      { property: "og:title", content: "Terms of service — Spare Hub" },
      { property: "og:description", content: "How buyers and sellers use Spare Hub." },
    ],
  }),
  component: Terms,
});

const content: Record<Lang, { intro: string; sections: { h: string; p: string }[] }> = {
  en: {
    intro:
      "These terms govern your use of Spare Hub. By creating an account or placing a listing, you agree to them.",
    sections: [
      { h: "1. Who can use Spare Hub", p: "You must be 18 or older and able to enter into a binding contract in your country. Businesses must be properly registered." },
      { h: "2. Listings", p: "Sellers are responsible for the accuracy of every listing — title, condition, price, compatibility and stock. Misleading listings will be removed." },
      { h: "3. Transactions", p: "Deals happen directly between buyer and seller. Spare Hub does not take title to any goods and is not a party to the sale." },
      { h: "4. Fees", p: "Listing is free. A small success fee may apply when a deal closes; the rate is shown to sellers before they list." },
      { h: "5. Prohibited content", p: "No counterfeit parts, recalled equipment, dangerous chemicals outside their permitted use, or anything illegal in the buyer's or seller's country." },
      { h: "6. Termination", p: "We may suspend or terminate accounts that violate these terms or harm the marketplace." },
      { h: "7. Liability", p: "Spare Hub is provided as-is. We're not liable for indirect or consequential losses arising from a transaction between users." },
      { h: "8. Changes", p: "We will notify you of material changes by email or in-app." },
      { h: "9. Contact", p: "Questions about these terms: legal@sparehub.example." },
    ],
  },
  uk: {
    intro:
      "Ці умови регулюють використання Spare Hub. Створюючи акаунт або публікуючи оголошення, ви погоджуєтесь із ними.",
    sections: [
      { h: "1. Хто може користуватися Spare Hub", p: "Вам має бути 18+ і ви маєте право укладати договори у своїй країні. Бізнес має бути офіційно зареєстрованим." },
      { h: "2. Оголошення", p: "Продавець відповідає за точність кожного оголошення — назву, стан, ціну, сумісність та наявність. Оманливі оголошення видаляються." },
      { h: "3. Угоди", p: "Угоди укладаються безпосередньо між покупцем і продавцем. Spare Hub не стає власником товару і не є стороною угоди." },
      { h: "4. Комісії", p: "Публікація безкоштовна. За закриту угоду може стягуватися невелика комісія; ставка показується продавцю до публікації." },
      { h: "5. Заборонений контент", p: "Без підробок, відкликаної техніки, небезпечної хімії поза дозволеним використанням і будь-чого незаконного у країні сторін." },
      { h: "6. Припинення", p: "Ми можемо призупинити або закрити акаунти, що порушують ці умови або шкодять маркетплейсу." },
      { h: "7. Відповідальність", p: "Spare Hub надається «як є». Ми не відповідаємо за непрямі збитки від угод між користувачами." },
      { h: "8. Зміни", p: "Про істотні зміни повідомимо електронною поштою або в додатку." },
      { h: "9. Контакти", p: "Питання щодо умов: legal@sparehub.example." },
    ],
  },
};

function Terms() {
  if (!routeVisibility.legalFooter.terms) return <ComingSoon />;
  const { t, lang } = useI18n();
  const c = content[lang];
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          {t("legal.terms.title")}
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
