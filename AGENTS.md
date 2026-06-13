# AGENTS.md — Instructions for AI coding agents working on Spare Hub

This file is the contract every AI agent (Lovable, Cursor, Claude Code,
Codex, etc.) must follow when modifying this repository. The
human-readable version with rationale lives in `docs/BRANDBOOK.md`. If
the two ever disagree, **`docs/BRANDBOOK.md` wins** — update this file
to match, then proceed.

Treat every rule below as a hard constraint, not a suggestion.

---

## 0. Product context (one paragraph)

Spare Hub is a marketplace for agronomy parts (tractor parts, irrigation,
sprayers, harvest gear, seeds, workshop tools). Users are farmers,
agronomists, and cooperatives, aged 30–50, often on mobile in the field.
The product must feel **earthy, premium, calm, and trustworthy** — never
cute, neon, or hype-y.

---

## 1. Naming — non-negotiable

- The product is **`Spare Hub`** (two words, capital S, capital H).
- Forbidden spellings: `SpareHub`, `Sparehub`, `SPAREHUB`, `spare-hub`,
  `Spare-Hub`.
- The slug `sparehub` (lowercase, one word) is only for storage keys,
  env vars, package names, URL slugs.
- The previous name **`AgroMarket`** must not exist anywhere in the
  codebase. If you find it, replace it in the same change.

---

## 2. Colors — use tokens, never hex

- **All colors come from CSS variables defined in `src/styles.css`.**
- In components, use Tailwind semantic classes that resolve to tokens:
  `bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`,
  `bg-card`, `border-border`, `text-muted-foreground`, `bg-accent`,
  `bg-[color:var(--gold)]`, `text-[color:var(--gold-foreground)]`, etc.
- **Never** write classes like `bg-emerald-700`, `text-white`,
  `bg-[#0d7a5f]`, `text-gray-500`. Tailwind's named-color palette is
  off-limits in this project.
- **Never** add new colors to a component. If a new shade is needed,
  add a new token to `src/styles.css` (light + dark) first, then use it.
- The palette is **Emerald Prestige**. Reference hex (for non-web assets
  only — PDFs, decks, social images):
  `#064e3b` deep emerald · `#0d7a5f` emerald · `#c9a84c` gold ·
  `#f5f0e0` cream · `#0e1f1a` forest night.
- Light theme = emerald on cream. Dark theme = cream on forest, with
  **gold (`--primary` in dark)** as the primary CTA color.
- Gold is reserved for the seller CTA and high-conversion buttons. Never
  use gold for body text on light theme (fails contrast).

---

## 3. Typography — use the two project fonts

- Display / headings → `Space Grotesk` via `--font-display` or the
  `.font-display` class. All `h1`–`h6` get it automatically.
- Body / UI → `DM Sans` via `--font-sans`. It is the default on
  `html, body` — do not re-declare it on components.
- **Do not import or use other fonts** (Inter, Poppins, Roboto, system
  serifs, etc.) without first updating `src/styles.css` and
  `docs/BRANDBOOK.md`.
- Heading tracking is `-0.02em` (already set). Do not override.

---

## 4. Logo — use the existing asset


- Header and footer already render the logo + wordmark via
  `src/components/site-layout.tsx`. Do not duplicate that chrome
  elsewhere.
- Do **not** regenerate or replace the logo, recolor it, add shadows,
  rotate it, or place it on a busy photographic background. If the user
  asks for a new logo, do it as a deliberate, scoped task and update
  this file + the brandbook in the same change.

---

## 5. Internationalization — every string, every locale

- Spare Hub ships in **English and Ukrainian** (`en`, `uk`).
- All user-facing copy is read through `useI18n().t("key")` from
  `src/lib/i18n.tsx`.
- **When you add or change a user-facing string, you must update both
  locales in the same edit.** Never hardcode a string in JSX.
- Keys use dotted namespaces (`hero.title`, `auth.signin.title`, etc.).
  Keep the dictionary alphabetized within each namespace.
- The product name `Spare Hub` is **not** translated.
- Storage key for language preference is `sparehub.lang` — don't
  introduce another.

---

## 6. Theming — two themes, always tokens

- The app supports **light** and **dark**. Logic lives in
  `src/lib/theme.tsx`. Storage key is `sparehub.theme`.
- The `.dark` class on `<html>` activates dark tokens.
- Every component you write must look correct in both themes **without**
  conditionals on the theme value. If a component needs different
  behavior per theme, add a token, don't branch on the theme.

---

## 7. Layout & components

- Default container: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`.
- Default radius: `0.75rem` (token). Cards use `rounded-xl` /
  `rounded-2xl`. Don't introduce one-off radii.
- Cards: `border border-border/60` (or `/70`) + optional `shadow-sm`.
  No large drop shadows, no neon glows.
- Primary site layout is a **card grid** (2 → 3 → 4 columns responsive).
  Use it for listings, categories, and search results.
- Use `lucide-react` for icons. Inline icons are `h-4 w-4`, standalone
  `h-5 w-5`, stroke inherits `currentColor`.

---

## 8. Voice & copy rules

- Short, specific, honest. Active voice. Plain English.
- **No exclamation marks** outside system errors.
- Use the project's terminology:
  - Product: **Spare Hub** (not "the platform", "the site").
  - A product page: **listing** (not "item", "product", "ad").
  - **Sign in / Create account** (not "Log in / Register").
- Concrete numbers beat vague claims ("850+ verified sellers" >
  "trusted by many").

---

## 9. Source-of-truth files — single owner per concern

| Concern | The only file allowed to define it |
|---|---|
| Design tokens (colors, radii, fonts) | `src/styles.css` |
| Translations | `src/lib/i18n.tsx` |
| Theme switching | `src/lib/theme.tsx` |
| Site chrome (header, footer) | `src/components/site-layout.tsx` |
| Brand assets | `src/assets/` |
| Brandbook (human) | `docs/BRANDBOOK.md` |
| Agent rules (this file) | `AGENTS.md` |

Do not create parallel implementations of any of these.

---

## 10. Tech stack constraints

- The project runs on **TanStack Start** with file-based routing in
  `src/routes/`. Do not introduce `src/pages/`, React Router DOM, or a
  single-file page switcher.
- Routes use `createFileRoute(...)({ component })`. Server logic uses
  `createServerFn` (when added). No `useEffect` + `fetch` for initial
  data — use loaders + TanStack Query.
- Backend is **not yet wired up**. When it is, prefer **Lovable Cloud**
  (managed Supabase). Do not bring in Firebase, Prisma against an
  external DB, or custom Express servers without explicit user approval.
- `localStorage` keys are namespaced `sparehub.*`. Never use bare keys
  like `theme` or `lang`.

---

## 11. Definition of done — checklist for every change

Before declaring a task complete, verify:

- [ ] No hardcoded color values (hex, `rgb()`, named Tailwind colors).
- [ ] No hardcoded user-facing strings — every literal goes through `t(...)`.
- [ ] Both locales (`en`, `uk`) updated for new strings.
- [ ] Works in both light and dark themes.
- [ ] No occurrence of `AgroMarket` reintroduced.
- [ ] Product name written as "Spare Hub" (two words).
- [ ] Fonts limited to `Space Grotesk` (display) and `DM Sans` (body).
- [ ] Icons from `lucide-react` only.
- [ ] Build passes (the harness runs it — do not run it manually).

If any item fails, fix it in the same change before declaring done.

---

## 12. When in doubt

1. Read `docs/BRANDBOOK.md` for the rationale.
2. Read the files listed in §9.
3. If the user's request conflicts with this file, ask them — don't
   silently override the brand.
