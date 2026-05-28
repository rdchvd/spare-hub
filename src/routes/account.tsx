import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteLayout } from "@/components/site-layout";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/features/auth/auth-context";
import { User, ListChecks, Heart, Settings, Loader2 } from "lucide-react";

export const Route = createFileRoute("/account")({
  component: AccountLayout,
});

function initialsFrom(first: string, last: string, email: string) {
  const base = `${first} ${last}`.trim() || email.trim();
  if (!base) return "SH";
  const parts = base.split(/[\s@]+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase() || base[0].toUpperCase();
}

function AccountLayout() {
  const { t } = useI18n();
  const { status, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "unauthenticated") {
      navigate({ to: "/login", search: { redirect: "/account" } });
    }
  }, [status, navigate]);

  const nav = [
    { to: "/account", label: t("account.nav.profile"), icon: User, exact: true },
    { to: "/account/listings", label: t("account.nav.listings"), icon: ListChecks },
    { to: "/account/favorites", label: t("account.nav.favorites"), icon: Heart },
    { to: "/account/settings", label: t("account.nav.settings"), icon: Settings },
  ];

  if (status !== "authenticated" || !user) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      </SiteLayout>
    );
  }

  const name =
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    user.user?.email ||
    t("account.guest");
  const sub = user.user?.email || t("account.noEmail");

  return (
    <SiteLayout>
      <section className="border-b border-border/60 bg-field">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 border border-border flex items-center justify-center font-display text-lg font-semibold text-primary">
            {initialsFrom(user.first_name, user.last_name, user.user?.email ?? "")}
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight truncate">
              {name}
            </h1>
            <p className="text-sm text-muted-foreground truncate">{sub}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid gap-6 md:grid-cols-[220px_1fr]">
        <aside>
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.exact ?? false }}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/10 hover:text-foreground whitespace-nowrap"
                  activeProps={{ className: "bg-accent/10 text-foreground" }}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </SiteLayout>
  );
}
