import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";

export function MockFieldShell({ label, children }: { label: string; children: ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="rounded-xl border border-dashed border-[color:var(--mock)] bg-[color:var(--mock)]/15 p-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-[color:var(--mock-foreground)]">{label}</Label>
        <Badge
          variant="outline"
          className="text-[10px] uppercase tracking-wide border-[color:var(--mock)] text-[color:var(--mock-foreground)]"
        >
          {t("products.mock.badge")}
        </Badge>
      </div>
      {children}
      <p className="text-xs text-[color:var(--mock-foreground)]/80">{t("products.mock.hint")}</p>
    </div>
  );
}

export const mockFieldClass =
  "bg-[color:var(--mock)]/10 text-[color:var(--mock-foreground)] border-[color:var(--mock)]/40 placeholder:text-[color:var(--mock-foreground)]/50";
