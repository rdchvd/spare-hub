import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  const { t } = useI18n();
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-display text-4xl font-semibold tracking-tight">About Spare Hub</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("footer.tagline")}</p>
        <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none text-foreground/90">
          <p>
            Spare Hub connects farms, agronomists and cooperatives with verified sellers of parts,
            machinery and inputs. We started because finding the right part — at the right price,
            from someone you can trust — should not take a week of phone calls.
          </p>
          <p>
            Every seller on Spare Hub is reviewed before going live. Listings include compatibility
            details so you order the right part the first time. The platform is built to work on
            slow connections, from a phone in the cab — because that's where the work happens.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
