import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useI18n, LANGS, type Lang } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { Moon, Sun, Globe } from "lucide-react";

export const Route = createFileRoute("/account/settings")({
  component: AccountSettings,
});

function AccountSettings() {
  const { t, lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-display text-xl font-semibold">{t("account.settings.title")}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t("account.settings.subtitle")}</p>
      </header>

      <Card className="border-border/60">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Globe className="h-4 w-4 text-primary" />
            <Label>{t("lang.label")}</Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code as Lang)}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  lang === l.code
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="uppercase opacity-60 mr-1.5 text-xs">{l.code}</span>
                {l.native}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardContent className="p-6 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              {theme === "dark" ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}
              <Label>{t("account.settings.theme")}</Label>
            </div>
            <p className="text-xs text-muted-foreground">
              {theme === "dark" ? t("account.settings.theme.dark") : t("account.settings.theme.light")}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={toggle} className="gap-2">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {t("theme.toggle")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
