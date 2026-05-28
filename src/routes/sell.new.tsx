import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { categories } from "@/lib/listings";
import { ArrowLeft, ArrowRight, Check, ImagePlus, PartyPopper } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/sell/new")({
  component: SellNew,
});

type Condition = "new" | "used" | "refurb";
type Currency = "EUR" | "USD";
type Stock = "in" | "low";

type FormState = {
  category: string;
  title: string;
  brand: string;
  condition: Condition;
  description: string;
  location: string;
  price: string;
  currency: Currency;
  stock: Stock;
};

const initial: FormState = {
  category: "",
  title: "",
  brand: "",
  condition: "new",
  description: "",
  location: "",
  price: "",
  currency: "EUR",
  stock: "in",
};

function SellNew() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initial);
  const [done, setDone] = useState(false);

  const totalSteps = 4;
  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const canContinue =
    (step === 1 && form.category !== "") ||
    (step === 2 && form.title.trim() !== "" && form.brand.trim() !== "" && form.location.trim() !== "") ||
    (step === 3 && form.price.trim() !== "") ||
    step === 4;

  const submit = () => {
    setDone(true);
    toast.success(t("sell.review.published"));
  };

  if (done) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <div className="mx-auto h-14 w-14 rounded-full bg-accent/15 text-accent flex items-center justify-center">
            <PartyPopper className="h-7 w-7" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">
            {t("sell.review.published")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("sell.review.publishedBody")}</p>
          <div className="mt-6 flex justify-center gap-2">
            <Button onClick={() => { setForm(initial); setStep(1); setDone(false); }} variant="outline">
              {t("sell.review.another")}
            </Button>
            <Button onClick={() => navigate({ to: "/browse" })}>
              {t("sell.review.viewListings")}
            </Button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/sell"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("nav.sell")}
        </Link>

        <header className="mt-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {t("sell.step")} {step} {t("sell.of")} {totalSteps}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
            {t("sell.new.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t("sell.new.subtitle")}</p>
        </header>

        {/* Stepper */}
        <ol className="mt-6 flex items-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((n) => (
            <li key={n} className="flex-1">
              <div
                className={cn(
                  "h-1.5 rounded-full transition-colors",
                  n <= step ? "bg-primary" : "bg-border",
                )}
              />
            </li>
          ))}
        </ol>

        <Card className="mt-6 border-border/70">
          <CardContent className="p-6 sm:p-8">
            {step === 1 && (
              <div>
                <h2 className="font-display text-xl font-semibold">{t("sell.step1.title")}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t("sell.step1.subtitle")}</p>
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map((c) => {
                    const active = form.category === c.key;
                    return (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => update("category", c.key)}
                        className={cn(
                          "text-left rounded-xl border p-4 transition",
                          active
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-accent/60 hover:bg-accent/5",
                        )}
                      >
                        <div className="text-2xl">{c.emoji}</div>
                        <div className="mt-2 font-display font-semibold text-sm leading-tight">
                          {t(`cat.${c.key}` as any)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {t(`cat.${c.key}.desc` as any)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-xl font-semibold">{t("sell.step2.title")}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{t("sell.step2.subtitle")}</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="title">{t("sell.field.title")}</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                    placeholder={t("sell.field.title.ph")}
                    className="h-11"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="brand">{t("sell.field.brand")}</Label>
                    <Input
                      id="brand"
                      value={form.brand}
                      onChange={(e) => update("brand", e.target.value)}
                      placeholder={t("sell.field.brand.ph")}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("sell.field.condition")}</Label>
                    <Select value={form.condition} onValueChange={(v) => update("condition", v as Condition)}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">{t("browse.condition.new")}</SelectItem>
                        <SelectItem value="used">{t("browse.condition.used")}</SelectItem>
                        <SelectItem value="refurb">{t("browse.condition.refurb")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="location">{t("sell.field.location")}</Label>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                    placeholder={t("sell.field.location.ph")}
                    className="h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="desc">{t("sell.field.description")}</Label>
                  <Textarea
                    id="desc"
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder={t("sell.field.description.ph")}
                    rows={5}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">{t("sell.field.photos")}</Label>
                  <button
                    type="button"
                    className="w-full rounded-xl border border-dashed border-border bg-secondary/40 p-8 text-center text-sm text-muted-foreground hover:border-accent hover:text-foreground transition"
                  >
                    <ImagePlus className="mx-auto h-6 w-6 mb-2 opacity-70" />
                    {t("sell.field.photos.hint")}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-xl font-semibold">{t("sell.step3.title")}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{t("sell.step3.subtitle")}</p>
                </div>

                <div className="grid sm:grid-cols-[1fr_120px] gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="price">{t("sell.field.price")}</Label>
                    <Input
                      id="price"
                      type="number"
                      inputMode="decimal"
                      value={form.price}
                      onChange={(e) => update("price", e.target.value)}
                      placeholder="0"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("sell.field.currency")}</Label>
                    <Select value={form.currency} onValueChange={(v) => update("currency", v as Currency)}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR €</SelectItem>
                        <SelectItem value="USD">USD $</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>{t("sell.field.stock")}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["in", "low"] as Stock[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => update("stock", s)}
                        className={cn(
                          "rounded-lg border p-3 text-sm font-medium transition",
                          form.stock === s
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:bg-accent/5",
                        )}
                      >
                        {t(`sell.field.stock.${s}` as const)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="font-display text-xl font-semibold">{t("sell.step4.title")}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t("sell.step4.subtitle")}</p>
                <dl className="mt-5 divide-y divide-border/60 text-sm">
                  {[
                    { k: t("sell.field.title"), v: form.title || "—" },
                    { k: t("sell.field.brand"), v: form.brand || "—" },
                    { k: t("listing.spec.category"), v: form.category ? t(`cat.${form.category}` as any) : "—" },
                    { k: t("sell.field.condition"), v: t(`browse.condition.${form.condition}` as const) },
                    { k: t("sell.field.location"), v: form.location || "—" },
                    {
                      k: t("sell.field.price"),
                      v: form.price ? `${form.currency === "EUR" ? "€" : "$"}${Number(form.price).toLocaleString()}` : "—",
                    },
                    { k: t("sell.field.stock"), v: t(`sell.field.stock.${form.stock}` as const) },
                    { k: t("sell.field.description"), v: form.description || "—" },
                  ].map((row) => (
                    <div key={row.k} className="flex justify-between gap-6 py-3">
                      <dt className="text-muted-foreground">{row.k}</dt>
                      <dd className="font-medium text-foreground text-right max-w-[60%]">{row.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("sell.back")}
          </Button>

          {step < totalSteps ? (
            <Button
              onClick={() => setStep((s) => Math.min(totalSteps, s + 1))}
              disabled={!canContinue}
              className="gap-1.5"
            >
              {t("sell.next")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={submit} className="gap-1.5">
              <Check className="h-4 w-4" />
              {t("sell.submit")}
            </Button>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
