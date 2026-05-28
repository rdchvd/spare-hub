import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { listings, categories } from "@/lib/listings";
import { ArrowLeft } from "lucide-react";

const CATEGORY_KEYS = categories.map((c) => c.key) as readonly string[];

export const Route = createFileRoute("/c/$category")({
  loader: ({ params }) => {
    if (!CATEGORY_KEYS.includes(params.category)) throw notFound();
    return { category: params.category as (typeof categories)[number]["key"] };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const { t } = useI18n();

  const meta = categories.find((c) => c.key === category)!;
  const items = listings.filter((l) => l.category === category);

  return (
    <SiteLayout>
      <section className="border-b border-border bg-field">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <Link
            to="/browse"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("nav.browse")}
          </Link>
          <div className="mt-4 flex items-center gap-4">
            <div className="text-5xl">{meta.emoji}</div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
                {t(`cat.${category}` as any)}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t(`cat.${category}.desc` as any)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {items.length} {t("category.results")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {items.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl">
            <p className="text-muted-foreground">{t("category.empty")}</p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link to="/browse">{t("nav.browse")}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
