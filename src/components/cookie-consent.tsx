import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { Cookie, X } from "lucide-react";

const KEY = "sparehub.cookies";

export function CookieConsent() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem(KEY);
      if (!v) setVisible(true);
    } catch {
      // ignore
    }
  }, []);

  const accept = (value: "all" | "essential") => {
    try {
      window.localStorage.setItem(KEY, value);
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-4 sm:pb-4 pointer-events-none">
      <div
        role="dialog"
        aria-live="polite"
        aria-label={t("cookies.title")}
        className="pointer-events-auto mx-auto max-w-3xl rounded-2xl border border-border bg-background/95 backdrop-blur shadow-lg p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center"
      >
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Cookie className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-sm font-semibold">{t("cookies.title")}</div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("cookies.body")}{" "}
            <Link
              to="/legal/cookies"
              className="underline underline-offset-2 hover:text-foreground"
            >
              {t("cookies.learn")}
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2 sm:flex-col sm:items-stretch lg:flex-row">
          <Button variant="outline" size="sm" onClick={() => accept("essential")}>
            {t("cookies.essential")}
          </Button>
          <Button size="sm" onClick={() => accept("all")}>
            {t("cookies.accept")}
          </Button>
          <button
            type="button"
            onClick={() => accept("essential")}
            aria-label={t("cookies.essential")}
            className="sm:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
