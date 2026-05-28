import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { useState, type FormEvent } from "react";
import { ShoppingBasket, Store, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/auth-context";
import { ApiError } from "@/features/auth/client";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  const { t } = useI18n();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        role,
      });
      toast.success(t("auth.register.success"));
      navigate({ to: "/account" });
    } catch (err) {
      let msg = t("auth.error.generic");
      if (err instanceof ApiError && err.data && typeof err.data === "object") {
        const data = err.data as Record<string, unknown>;
        const emailError = data.email;
        const detailError = data.detail;

        if (
          Array.isArray(emailError) &&
          typeof emailError[0] === "string" &&
          /already exists/i.test(emailError[0])
        ) {
          msg = t("auth.error.emailExists");
        } else if (typeof detailError === "string") {
          // Keep server detail fallback, but prefer translated known cases.
          msg = detailError;
        }
      }
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title={t("auth.signup.title")}
      subtitle={t("auth.signup.subtitle")}
      footer={
        <>
          {t("auth.have")}{" "}
          <Link to="/login" className="font-medium text-foreground hover:underline">
            {t("nav.signin")}
          </Link>
        </>
      }
      side={
        <>
          <div className="flex items-center gap-2 text-sm uppercase tracking-wider opacity-80">
            <Sparkles className="h-4 w-4" /> {t("hero.eyebrow")}
          </div>
          <div>
            <h2 className="font-display text-3xl xl:text-4xl font-semibold leading-tight">
              {t("cta.title")}
            </h2>
            <p className="mt-4 text-primary-foreground/85 max-w-md">{t("cta.body")}</p>
          </div>
          <div className="text-xs opacity-70">© {new Date().getFullYear()} Spare Hub</div>
        </>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <Label className="mb-2 block">{t("auth.role")}</Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "buyer" as const, icon: ShoppingBasket, label: t("auth.role.buyer") },
              { key: "seller" as const, icon: Store, label: t("auth.role.seller") },
            ].map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key)}
                className={cn(
                  "rounded-lg border p-3 text-left transition",
                  role === r.key
                    ? "border-accent bg-accent/10 ring-1 ring-accent"
                    : "border-border hover:bg-accent/5",
                )}
              >
                <r.icon className="h-4 w-4 mb-1.5 text-accent" />
                <div className="text-sm font-medium leading-tight">{r.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">{t("auth.firstName")}</Label>
            <Input
              id="firstName"
              autoComplete="given-name"
              className="h-11"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">{t("auth.lastName")}</Label>
            <Input
              id="lastName"
              autoComplete="family-name"
              className="h-11"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">{t("auth.phone")}</Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            className="h-11"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            className="h-11"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">{t("auth.password")}</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            className="h-11"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full h-11 text-sm" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {t("auth.submit.signup")}
        </Button>
      </form>
    </AuthShell>
  );
}
