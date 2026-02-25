# Threadmark Landing — Project Overview

This document helps Claude understand the Threadmark landing page project for more effective assistance.

## What This Project Is

**Threadmark** is a compliance infrastructure product for modern commerce. This repo is a set of **static landing pages** for Threadmark — a marketing site that:

- Presents two audience paths: **EU Shopify Merchants** and **Mid-Market Brands**
- Collects waitlist signups via Netlify Forms (no backend)
- Links to Calendly for booking calls
- Deploys to Netlify

## Related Projects & Organisation

- **Organisation**: OpenThreads
- **OpenThreads website**: `~/Projects/openthreads.dev`
- **Threadmark product**: `~/Projects/threadmark` — the main Threadmark project; refer there for product details and broader context.

## Tech Stack

| Layer     | Technology                                                      |
| --------- | --------------------------------------------------------------- |
| Framework | [Astro](https://astro.build) 5.x                                |
| Output    | Static (`output: 'static'`)                                     |
| Styling   | Scoped CSS in `.astro` files, CSS custom properties for theming |
| Forms     | Netlify Forms (`data-netlify="true"`)                           |
| Hosting   | Netlify                                                         |
| Testing   | Playwright (Chromium only)                                      |
| Linting   | ESLint + Prettier                                               |
| Hooks     | Husky + lint-staged                                             |

## Project Structure

```
src/
├── config.ts           # Site config (accent colors, Calendly URL, conversion goals)
├── components/
│   ├── Header.astro   # Logo + theme toggle (light/dark)
│   └── Footer.astro  # Copyright + Privacy link
├── layouts/
│   └── BaseLayout.astro  # HTML shell, meta tags, fonts, global styles, Header/Footer
└── pages/
    ├── index.astro       # Home: chooser between EU merchant / mid-market
    ├── eu-merchant.astro # EU Shopify merchants landing
    ├── mid-market.astro  # Mid-market brands landing
    ├── thanks.astro      # Post-form thank-you page
    ├── privacy.astro     # Privacy policy
    └── 404.astro         # Not found

public/
├── favicon.svg
└── fonts/               # Inter (latin + latin-ext) woff2

tests/
└── smoke.spec.ts        # Playwright smoke tests
```

## Key Conventions

### Design System

- **Colors**: CSS custom properties in `BaseLayout.astro` — `--color-accent`, `--color-bg`, `--color-text`, etc.
- **Themes**: Light/dark via `data-theme` on `<html>`. Persisted in `localStorage`.
- **Typography**: Inter (variable font), loaded from `/fonts/`.
- **Layout**: `.container` max-width 72rem, `.dot-grid-bg` for hero backgrounds.

### Conversion Goals (from `src/config.ts`)

- **EU Merchant**: Primary CTA = waitlist form (`#waitlist`), secondary = Calendly
- **Mid-Market**: Primary CTA = Calendly, secondary = waitlist form

### Forms

- `waitlist-eu-merchant`: email only
- `waitlist-mid-market`: name, email, company
- Both POST to `/thanks` via Netlify Forms

### Code Style

- **ESLint**: Import/export sorting (simple-import-sort), object keys sorted alphabetically (natural order)
- **Prettier**: Formatting
- **lint-staged**: Runs on staged files before commit

## Scripts

| Command                | Purpose                                |
| ---------------------- | -------------------------------------- |
| `npm run dev`          | Dev server at http://localhost:4321    |
| `npm run build`        | Type check + build → `dist/`           |
| `npm run preview`      | Serve production build locally         |
| `npm run check`        | Astro type check                       |
| `npm run lint`         | ESLint                                 |
| `npm run lint:fix`     | ESLint with auto-fix                   |
| `npm run format`       | Prettier write                         |
| `npm run format:check` | Prettier check (CI)                    |
| `npm run test`         | Playwright smoke tests                 |
| `npm run test:install` | Install Playwright browsers (Chromium) |

## CI & Deployment

- **GitHub Actions** (`.github/workflows/ci.yml`): On push/PR to `main` — type check, lint, format check, build, smoke tests
- **Netlify** (`netlify.toml`): Build `npm run build`, publish `dist/`, security headers (X-Frame-Options, etc.)

## Smoke Tests (Playwright)

`tests/smoke.spec.ts` verifies:

- All routes return 200 and correct titles
- 404 for unknown paths
- Waitlist forms present and visible
- Privacy link in footer on all pages
- Header has only logo link
- EU merchant primary CTA = waitlist; mid-market primary CTA = Calendly
- Hero audience labels, readable widths, consistent spacing
- Accent color on primary CTAs
- 3-step how-it-works, benefits section, trust signal above waitlist
- No broken internal links

## When Making Changes

1. **New pages**: Add to `BaseLayout` usage, add route to `tests/smoke.spec.ts` `routes` array, add smoke test if needed.
2. **Config changes**: Update `src/config.ts`; conversion goals affect CTA behavior.
3. **Styling**: Use existing CSS variables; keep `.container` and section spacing consistent.
4. **Forms**: Use `data-netlify="true"` and `name` matching `form-name` hidden input; register form in Netlify dashboard.
5. **Pre-commit**: Husky runs lint, format, type check — use `git commit --no-verify` when necessary. **Pre-push**: Runs smoke tests — use `git push --no-verify` when necessary.
