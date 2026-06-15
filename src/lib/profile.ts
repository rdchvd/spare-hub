import { useEffect, useState } from "react";

export const PROFILE_KEY = "sparehub.profile";

export type Profile = {
  displayName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
};

export const emptyProfile: Profile = {
  displayName: "",
  email: "",
  phone: "",
  location: "",
  bio: "",
};

export function readProfile(): Profile {
  if (typeof window === "undefined") return emptyProfile;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return emptyProfile;
    const parsed = JSON.parse(raw) as Partial<Profile>;
    return { ...emptyProfile, ...parsed };
  } catch {
    return emptyProfile;
  }
}

export function writeProfile(p: Profile) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProfile(readProfile());
    setHydrated(true);
  }, []);

  const save = (next: Profile) => {
    setProfile(next);
    writeProfile(next);
  };

  return { profile, setProfile: save, hydrated };
}

export function initials(name: string, email: string) {
  const base = name.trim() || email.trim();
  if (!base) return "SH";
  const parts = base.split(/[\s@]+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase() || base[0].toUpperCase();
}

export function profileDisplayName(first: string, last: string, email: string) {
  return [first, last].filter(Boolean).join(" ") || email.trim() || "";
}
