import { Link } from "@tanstack/react-router";
import { Moon, Sun, Globe } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { useTheme } from "@/lib/theme";
import { useI18n, LANGS, type Lang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  side,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  side: React.ReactNode;
}) {
  const { theme, toggle } = useTheme();
  const { t, lang, setLang } = useI18n();

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Form side */}
      <div className="flex flex-col">
        <header className="flex items-center justify-between px-6 lg:px-10 py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandLogo className="h-9 w-9 text-primary" />
            <span className="font-display text-lg font-semibold">Spare Hub</span>
          </Link>
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5" aria-label={t("lang.label")}>
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium uppercase">{lang}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {LANGS.map((l) => (
                  <DropdownMenuItem key={l.code} onClick={() => setLang(l.code as Lang)}>
                    <span className="mr-2 text-xs uppercase opacity-60">{l.code}</span>
                    {l.native}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" onClick={toggle} aria-label={t("theme.toggle")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-6 lg:px-10 py-6">
          <div className="w-full max-w-md">
            <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-7">{children}</div>
            <div className="mt-6 text-sm text-muted-foreground">{footer}</div>
            <p className="mt-8 text-xs text-muted-foreground">{t("auth.terms")}</p>
          </div>
        </div>
      </div>

      {/* Brand side */}
      <div className="hidden lg:flex relative bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, color-mix(in oklab, var(--gold) 40%, transparent), transparent 50%), radial-gradient(circle at 80% 70%, color-mix(in oklab, var(--accent) 60%, transparent), transparent 55%)",
          }}
        />
        <div className="relative flex flex-col justify-between p-10 xl:p-14 w-full">
          {side}
        </div>
      </div>
    </div>
  );
}
