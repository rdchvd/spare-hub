import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";
import { SiteLayout } from "@/components/site-layout";
import { ListingCard } from "@/components/listing-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { routeVisibility } from "@/lib/route-visibility";
import { listings, categories } from "@/lib/listings";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/browse")({
  component: Browse,
});

type Condition = "new" | "used" | "refurb";
type SortKey = "relevance" | "priceAsc" | "priceDesc" | "newest";

function Browse() {
  if (!routeVisibility.backend.productsApiReady) return <ComingSoon showBrowse={false} />;
  const { t, lang } = useI18n();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [conds, setConds] = useState<Record<Condition, boolean>>({
    new: false,
    used: false,
    refurb: false,
  });
  const [sort, setSort] = useState<SortKey>("relevance");

  const activeConds = (Object.keys(conds) as Condition[]).filter((k) => conds[k]);
  const hasFilters = query !== "" || category !== "all" || activeConds.length > 0;

  const filtered = useMemo(() => {
    let out = listings.filter((l) => {
      if (category !== "all" && l.category !== category) return false;
      if (activeConds.length && !activeConds.includes(l.condition)) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          l.title[lang].toLowerCase().includes(q) ||
          l.brand.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q)
        );
      }
      return true;
    });
    if (sort === "priceAsc") out = [...out].sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") out = [...out].sort((a, b) => b.price - a.price);
    if (sort === "newest") out = [...out].reverse();
    return out;
  }, [query, category, activeConds.join(","), sort, lang]);

  const clear = () => {
    setQuery("");
    setCategory("all");
    setConds({ new: false, used: false, refurb: false });
    setSort("relevance");
  };

  return (
    <SiteLayout>
      <section className="border-b border-border bg-field">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {t("browse.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t("browse.subtitle")}</p>

          <div className="mt-5 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("hero.searchPlaceholder")}
                className="pl-10 h-11 bg-background"
              />
            </div>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="sm:w-56 h-11 bg-background">
                <SelectValue placeholder={t("browse.sort")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">{t("browse.sort.relevance")}</SelectItem>
                <SelectItem value="priceAsc">{t("browse.sort.priceAsc")}</SelectItem>
                <SelectItem value="priceDesc">{t("browse.sort.priceDesc")}</SelectItem>
                <SelectItem value="newest">{t("browse.sort.newest")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          <aside className="space-y-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-display font-semibold">{t("browse.filters")}</h2>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clear} className="ml-auto h-7 text-xs">
                  {t("browse.clear")}
                </Button>
              )}
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
                {t("cats.title")}
              </Label>
              <div className="space-y-1">
                <button
                  onClick={() => setCategory("all")}
                  className={`w-full text-left rounded-md px-2.5 py-1.5 text-sm transition ${
                    category === "all"
                      ? "bg-accent/10 font-medium text-foreground"
                      : "hover:bg-accent/5 text-muted-foreground"
                  }`}
                >
                  {t("browse.category.all")}
                </button>
                {categories.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setCategory(c.key)}
                    className={`w-full text-left flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition ${
                      category === c.key
                        ? "bg-accent/10 font-medium text-foreground"
                        : "hover:bg-accent/5 text-muted-foreground"
                    }`}
                  >
                    <span>{c.emoji}</span>
                    <span className="flex-1">{t(`cat.${c.key}` as const)}</span>
                    <span className="text-xs opacity-60">{c.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
                {t("browse.condition")}
              </Label>
              <div className="space-y-2">
                {(["new", "used", "refurb"] as Condition[]).map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={conds[c]}
                      onCheckedChange={(v) => setConds((p) => ({ ...p, [c]: !!v }))}
                    />
                    {t(`browse.condition.${c}` as const)}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <span>{filtered.length} results</span>
              {category !== "all" && (
                <Badge variant="secondary" className="font-normal">
                  {t(`cat.${category}` as any)}
                </Badge>
              )}
              {activeConds.map((c) => (
                <Badge key={c} variant="secondary" className="font-normal capitalize">
                  {t(`browse.condition.${c}` as const)}
                </Badge>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-border rounded-xl">
                <p className="text-muted-foreground">{t("browse.empty")}</p>
                <Button variant="outline" size="sm" onClick={clear} className="mt-4">
                  {t("browse.clear")}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
