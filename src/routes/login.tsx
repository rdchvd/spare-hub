import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useI18n } from "@/lib/i18n";
import { BadgeCheck, ShieldCheck, Tractor, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { ApiError } from "@/features/auth/client";
import { toast } from "sonner";

type LoginSearch = { redirect?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: Login,
});

function Login() {
  const { t } = useI18n();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate({ to: redirect ?? "/account" });
    } catch (err) {
      const msg =
        err instanceof ApiError && err.status === 401
          ? t("auth.error.invalid")
          : t("auth.error.generic");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title={t("auth.signin.title")}
      subtitle={t("auth.signin.subtitle")}
      footer={
        <>
          {t("auth.noaccount")}{" "}
          <Link to="/register" className="font-medium text-foreground hover:underline">
            {t("nav.signup")}
          </Link>
        </>
      }
      side={
        <>
          <div className="flex items-center gap-2 text-sm uppercase tracking-wider opacity-80">
            <Tractor className="h-4 w-4" /> Spare Hub
          </div>
          <div>
            <h2 className="font-display text-3xl xl:text-4xl font-semibold leading-tight">
              {t("hero.title")}
            </h2>
            <p className="mt-4 text-primary-foreground/85 max-w-md">{t("hero.subtitle")}</p>
            <ul className="mt-8 space-y-3 text-sm">
              <li className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[color:var(--gold)]" /> {t("trust.t1.title")}</li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[color:var(--gold)]" /> {t("trust.t2.title")}</li>
            </ul>
          </div>
          <div className="text-xs opacity-70">© {new Date().getFullYear()} Spare Hub</div>
        </>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@farm.com"
            className="h-11"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t("auth.password")}</Label>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
              {t("auth.forgot")}
            </a>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            className="h-11"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox id="remember" defaultChecked /> {t("auth.remember")}
        </label>
        <Button type="submit" className="w-full h-11 text-sm" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {t("auth.submit.signin")}
        </Button>
      </form>
    </AuthShell>
  );
}
