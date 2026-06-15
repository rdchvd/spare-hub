import { Link, useNavigate } from "@tanstack/react-router";
import { Moon, Sun, Globe, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { useState } from "react";
import { useTheme } from "@/lib/theme";
import { useI18n, LANGS, type Lang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-context";
import { routeVisibility } from "@/lib/route-visibility";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const { t, lang, setLang } = useI18n();
  const { status, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isAuthed = status === "authenticated";
  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ") || user.user?.email
    : "";

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/" });
  };

  const navLinks = [
    ...(routeVisibility.backend.productsApiReady && routeVisibility.header.browse
      ? [{ to: "/browse", label: t("nav.browse") }]
      : []),
    ...(routeVisibility.header.sell ? [{ to: "/sell", label: t("nav.sell") }] : []),
    ...(routeVisibility.header.about ? [{ to: "/about", label: t("nav.about") }] : []),
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <BrandLogo className="h-9 w-9 text-primary transition group-hover:scale-105" />
          <span className="font-display text-lg font-semibold tracking-tight">Spare Hub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent/10 hover:text-foreground"
              activeProps={{ className: "text-foreground bg-accent/10" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 hidden sm:inline-flex"
                aria-label={t("lang.label")}
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium uppercase">{lang}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>{t("lang.label")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {LANGS.map((l) => (
                <DropdownMenuItem
                  key={l.code}
                  onClick={() => setLang(l.code as Lang)}
                  className={lang === l.code ? "font-semibold" : ""}
                >
                  <span className="mr-2 text-xs uppercase opacity-60">{l.code}</span>
                  {l.native}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={toggle} aria-label={t("theme.toggle")}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <div className="hidden sm:flex items-center gap-2 ml-2">
            {isAuthed ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <UserIcon className="h-4 w-4" />
                    <span className="max-w-[140px] truncate">{displayName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="truncate">{user?.user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account">{t("nav.account")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("auth.signout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">{t("nav.signin")}</Link>
                </Button>
                <Button asChild size="sm" className="shadow-sm">
                  <Link to="/register">{t("nav.signup")}</Link>
                </Button>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent/10"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-2">
              {isAuthed ? (
                <>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to="/account" onClick={() => setOpen(false)}>
                      {t("nav.account")}
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      setOpen(false);
                      void handleLogout();
                    }}
                  >
                    {t("auth.signout")}
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to="/login" onClick={() => setOpen(false)}>
                      {t("nav.signin")}
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link to="/register" onClick={() => setOpen(false)}>
                      {t("nav.signup")}
                    </Link>
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 pt-2">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code as Lang)}
                  className={`rounded-md border px-2.5 py-1 text-xs uppercase ${
                    lang === l.code
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {l.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border bg-background mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <BrandLogo className="h-8 w-8 text-primary" title="" />
            <span className="font-display text-base font-semibold">Spare Hub</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">{t("footer.tagline")}</p>
        </div>
        <div className="text-sm">
          <div className="font-medium mb-2">{t("footer.product")}</div>
          <ul className="space-y-1.5 text-muted-foreground">
            {routeVisibility.backend.productsApiReady && routeVisibility.header.browse ? (
              <li>
                <Link to="/browse" className="hover:text-foreground">
                  {t("nav.browse")}
                </Link>
              </li>
            ) : null}
            {routeVisibility.header.sell ? (
              <li>
                <Link to="/sell" className="hover:text-foreground">
                  {t("nav.sell")}
                </Link>
              </li>
            ) : null}
            {routeVisibility.header.about ? (
              <li>
                <Link to="/about" className="hover:text-foreground">
                  {t("nav.about")}
                </Link>
              </li>
            ) : null}
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-medium mb-2">{t("footer.support")}</div>
          <ul className="space-y-1.5 text-muted-foreground">
            {routeVisibility.supportFooter.howItWorks ? (
              <li>
                <Link to="/how-it-works" className="hover:text-foreground">
                  {t("nav.howItWorks")}
                </Link>
              </li>
            ) : null}
            {routeVisibility.supportFooter.safety ? (
              <li>
                <Link to="/safety" className="hover:text-foreground">
                  {t("nav.safety")}
                </Link>
              </li>
            ) : null}
            {routeVisibility.supportFooter.help ? (
              <li>
                <Link to="/help" className="hover:text-foreground">
                  {t("nav.help")}
                </Link>
              </li>
            ) : null}
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-medium mb-2">{t("footer.legal")}</div>
          <ul className="space-y-1.5 text-muted-foreground">
            {routeVisibility.legalFooter.terms ? (
              <li>
                <Link to="/legal/terms" className="hover:text-foreground">
                  {t("nav.terms")}
                </Link>
              </li>
            ) : null}
            {routeVisibility.legalFooter.privacy ? (
              <li>
                <Link to="/legal/privacy" className="hover:text-foreground">
                  {t("nav.privacy")}
                </Link>
              </li>
            ) : null}
            {routeVisibility.legalFooter.cookies ? (
              <li>
                <Link to="/legal/cookies" className="hover:text-foreground">
                  {t("nav.cookies")}
                </Link>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Spare Hub. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
