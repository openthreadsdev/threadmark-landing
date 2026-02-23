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

## Testing

Install Playwright browsers (first time only):

```sh
npm run test:install
```

Run the smoke tests:

```sh
npm run test
```

## Deployment

Deployed automatically to Netlify. Configuration is in `netlify.toml`.

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Forms:** Netlify Forms (no backend required)
