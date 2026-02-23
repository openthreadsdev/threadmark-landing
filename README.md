# Threadmark Landing

Website for Threadmark, built with [Astro](https://astro.build) and deployed to [Netlify](https://www.netlify.com).

## Setup

```sh
npm install
```

## Development

```sh
npm run dev
```

The dev server starts at `http://localhost:4321`.

## Build

```sh
npm run build
```

Output is written to `dist/`.

## Preview

Preview the production build locally:

```sh
npm run preview
```

## Linting

```sh
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix where possible
```

ESLint enforces import/export sorting (alphabetically) and object key sorting (alphabetically, natural order).

## Formatting

```sh
npm run format        # Format all files
npm run format:check  # Check formatting (used in CI)
```

## Testing

Install Playwright browsers (first time only):

```sh
npm run test:install
```

Run the smoke tests (verifies pages render and key UI elements):

```sh
npm run test
```

## Pre-commit hooks

Husky runs the following on every commit:

- Lint and format staged files (via lint-staged)
- Type check (`astro check`)
- Format check
- Full lint
- Smoke tests

To bypass (e.g. WIP commits): `git commit --no-verify`

## CI

GitHub Actions runs on push and PR to `main`:

- Type check, lint, format check
- Build
- Smoke tests (Playwright)

## Deployment

Deployed automatically to Netlify. Configuration is in `netlify.toml`.

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Forms:** Netlify Forms (no backend required)
