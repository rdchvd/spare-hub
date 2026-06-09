# Spare Hub — Brandbook

**Last updated:** 2026-05-26
**Owners:** product + design
**Status:** Living document. When the product changes, update this file first, then the code.

---

## 1. Brand essence

**Spare Hub** is a trustworthy, no-nonsense marketplace for agronomy parts —
tractor components, irrigation, sprayers, harvest gear, seeds, and workshop
tools. Buyers and sellers are farmers, agronomists, and cooperatives, mostly
aged 30–50, often working from a phone in the field.

| Attribute | We are | We are not |
|---|---|---|
| Tone | Practical, calm, expert | Cute, salesy, hype-y |
| Voice | Plain language, short sentences | Marketing jargon, exclamation marks |
| Look | Earthy, premium, tech-quiet | Cartoony, neon, "AI-generated" |
| Density | Generous whitespace, scannable | Cluttered dashboards |

**One-line positioning:** *An honest marketplace for agronomy — the right
part, the first time, from sellers you can trust.*

---

## 2. Naming

- **Product name:** `Spare Hub` (two words, capital S, capital H).
- **Never** write: `SpareHub`, `Sparehub`, `SPAREHUB`, `spare-hub`, `Spare-Hub`.
- **Domain / handle slug:** `sparehub` (lowercase, one word) — used only in
  storage keys, env vars, package names, URL slugs.
- **Legacy name to remove on sight:** `AgroMarket` / `agromarket`. If you
  see it anywhere, replace it.

---

## 3. Logo

The mark is a deep-emerald gear with a sprouting leaf integrated into one
of the teeth, with a small gold accent at the leaf tip — gear (parts, tech)
meets leaf (agronomy, growth).

- **Source file:** `src/assets/spare-hub-logo.png` (transparent PNG, 1024×1024).
- **Import in code:** `import logoUrl from "@/assets/spare-hub-logo.png";`
- **Always pair the mark with the wordmark "Spare Hub"** in the header,
  footer, and auth shell. Mark-only is allowed for favicons, app icons,
  loading states, and image overlays.
- **Minimum size:** 24×24 px. Below that, use a simplified favicon variant.
- **Clear space:** keep padding ≥ the inner ring of the gear on all sides.
- **Do not** recolor, rotate, add gradients, add drop shadows, or place on
  a busy photo. On photography, place on a solid emerald or cream pill.
- **Background safety:**
  - Light backgrounds → mark as-is.
  - Dark backgrounds → mark as-is (the gear reads on dark already).
  - Photographic backgrounds → emerald `--primary` pill behind the mark.

---

## 4. Color system

The palette is **Emerald Prestige**: deep emerald + warm cream + muted
gold. Tokens are defined in `src/styles.css` in `oklch`. **Never hardcode
colors in components.** Use semantic Tailwind classes (`bg-primary`,
`text-foreground`, etc.) that resolve to the tokens.

### Source hex (for non-web assets: PDFs, decks, print)

| Role | Hex | Notes |
|---|---|---|
| Deep Emerald | `#064e3b` | Primary in light theme |
| Emerald | `#0d7a5f` | Accent, links, focus rings |
| Gold | `#c9a84c` | Primary in dark theme, CTA accent |
| Cream | `#f5f0e0` | Background in light theme |
| Forest Night | `#0e1f1a` | Background in dark theme |
| Ink | `#0a1f17` | Foreground on light |

### Semantic tokens (use these in code)

| Token | Light meaning | Dark meaning |
|---|---|---|
| `--background` | warm cream | deep forest night |
| `--foreground` | emerald ink | cream |
| `--primary` | deep emerald | gold |
| `--accent` | mid emerald | mid emerald (brighter) |
| `--gold` / `--gold-foreground` | gold + emerald ink | same |
| `--muted` / `--muted-foreground` | subtle cream / soft ink | subtle forest / soft cream |
| `--border` | warm hairline | translucent white 10% |
| `--ring` | mid emerald | gold |
| `--destructive` | warm red | warm red |

### Usage rules

- **Primary CTAs** use `bg-primary text-primary-foreground`.
- **Gold is the "deal-closer" accent** — use it for the seller CTA card and
  high-conversion buttons only. Never use it for body text or icons in the
  light theme (poor contrast on cream).
- **Light theme** stays warm and high-contrast: emerald on cream.
- **Dark theme** flips the hierarchy: cream on forest with gold as the
  primary CTA color.
- **Hero / earthy texture:** the `bg-field` class composes emerald + gold
  radial gradients over the background. Use it on the landing hero only.

---

## 5. Typography

- **Display / headings:** `Space Grotesk` — geometric, slightly tech.
  Loaded via `--font-display`. Apply with `.font-display` or any `h1–h6`.
- **Body / UI:** `DM Sans` — humanist, calm, very legible at small sizes.
  Loaded via `--font-sans`. It's the default on `html, body`.
- **Letter-spacing:** headings ship with `-0.02em` tracking; do not change.
- **Numerals:** DM Sans tabular figures aren't on by default — wrap
  price tables in `font-variant-numeric: tabular-nums` when alignment matters.
- **Type scale** (Tailwind defaults are fine; canonical sizes):

| Use | Class | Notes |
|---|---|---|
| Hero H1 | `font-display text-4xl md:text-5xl font-semibold` | Once per page |
| Section H2 | `font-display text-2xl md:text-3xl font-semibold` | |
| Card title | `font-display text-base font-semibold` | |
| Body | `text-base` (16px) | Default |
| Small / caption | `text-sm text-muted-foreground` | |
| Eyebrow / label | `text-xs uppercase tracking-wide text-muted-foreground` | |

---

## 6. Layout & components

- **Container:** `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`.
- **Radius:** default `--radius: 0.75rem`. Cards use `rounded-xl` or
  `rounded-2xl`. Buttons inherit `--radius-md`.
- **Borders:** use `border-border` / `border-border/60` — never raw colors.
- **Shadows:** keep restrained (`shadow-sm` for cards, no large drop shadows).
- **Card grid is the primary layout** — landing categories, featured
  listings, and browse all use a responsive card grid (2 → 3 → 4 columns).
- **Spacing rhythm:** sections use `py-12` (md+) with `mb-6` between
  header and grid.

---

## 7. Iconography

- Library: **`lucide-react`** only. No emoji-as-icon in production UI
  (the category cards' emoji is a deliberate, isolated exception and may
  be replaced with `lucide` icons in a future pass).
- Size: `h-4 w-4` inline, `h-5 w-5` standalone, stroke width default.
- Color: inherit (`currentColor`). Never set hex.

---

## 8. Voice & copy

- **Short. Specific. Honest.** "Find genuine tractor parts" — not
  "Discover the future of agriculture."
- **No exclamation marks** outside of system errors.
- **Active voice.** "Sellers list parts" — not "Parts are listed by sellers."
- **Numbers earn trust.** Use concrete stats ("850+ verified sellers")
  over vague claims ("trusted by many").
- **Localization:** every user-facing string lives in `src/lib/i18n.tsx`
  under all three locales (`en`, `es`, `uk`). Never hardcode user-facing
  text in JSX. When adding a string, add it to all three dictionaries
  in the same edit.

### Required terminology

| Concept | Use | Don't use |
|---|---|---|
| The product | Spare Hub | AgroMarket, the platform, the site |
| A product page | listing | item, product, ad, post |
| A buyer/seller account | account | profile, user |
| Sign up | "Create account" | "Register now", "Join" |
| Sign in | "Sign in" | "Log in", "Login" |

---

## 9. Imagery

- Photography: real machinery in real conditions — dusty, working, lit by
  daylight. Avoid stock-style "smiling farmer holding tablet."
- Crop tight on mechanical parts; show texture.
- Apply a subtle warm tone (cream highlights) rather than cool blue.
- Never overlay text on a busy area of the image without a scrim.

---

## 10. Accessibility

- WCAG AA minimum on all text.
- Primary on background and gold on emerald are both verified AA.
- Gold on cream is **not** AA — never use gold for body text in light theme.
- Always provide `alt` on images. Decorative logos in the footer use `alt=""`.
- Focus rings use `--ring` and must remain visible — do not remove the
  default focus outline.

---

## 11. Internationalization

Spare Hub ships in **English (en)**, **Spanish (es)**, and **Ukrainian
(uk)**. Language is persisted in `localStorage` under `sparehub.lang` and
set on `<html lang>`.

When adding any user-facing string:

1. Add the key + translation to all three locales in `src/lib/i18n.tsx`.
2. Use the `t("key")` accessor — never inline literal strings in JSX.
3. Names of the product ("Spare Hub") are **not** translated.

---

## 12. Theming

- Two themes: **light** (default) and **dark**.
- Persisted in `localStorage` under `sparehub.theme` via `src/lib/theme.tsx`.
- Toggle lives in the site header. The `.dark` class on `<html>` activates
  dark tokens.
- Components must work in both themes without conditionals — use tokens.

---

## 13. File & code conventions

- Brand assets live in `src/assets/`.
- Design tokens live in `src/styles.css` only.
- Translations live in `src/lib/i18n.tsx` only.
- Theme logic lives in `src/lib/theme.tsx` only.
- Layout chrome (header, footer) lives in `src/components/site-layout.tsx`.
- Never add a second source of truth for any of the above.

---

See also: **`AGENTS.md`** at the repo root — the same rules in a form
optimized for AI coding agents.
