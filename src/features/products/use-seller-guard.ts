import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/features/auth/auth-context";
import { canManageProducts } from "@/features/products/client";

export function useSellerGuard(redirectPath: string) {
  const { status, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "unauthenticated") {
      navigate({ to: "/login", search: { redirect: redirectPath } });
      return;
    }
    if (status === "authenticated" && !canManageProducts(user)) {
      navigate({ to: "/account" });
    }
  }, [status, user, navigate, redirectPath]);

  return {
    ready: status === "authenticated" && canManageProducts(user),
    user,
  };
}
