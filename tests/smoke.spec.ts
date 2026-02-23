import { test, expect } from '@playwright/test';

const routes = [
  { path: '/', title: 'Threadmark' },
  { path: '/eu-merchant', title: 'EU Shopify Merchants' },
  { path: '/mid-market', title: 'Mid-Market Brands' },
  { path: '/thanks', title: 'Thanks' },
  { path: '/privacy', title: 'Privacy Policy' },
];

for (const route of routes) {
  test(`${route.path} loads and has correct title`, async ({ page }) => {
    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(new RegExp(route.title));
  });
}

test('404 page returns 404 status', async ({ page }) => {
  const response = await page.goto('/nonexistent-page');
  expect(response?.status()).toBe(404);
});

test('/eu-merchant has waitlist form', async ({ page }) => {
  await page.goto('/eu-merchant');
  const form = page.locator('form[name="waitlist-eu-merchant"]');
  await expect(form).toBeVisible();
  await expect(form.locator('input[type="email"]')).toBeVisible();
  await expect(form.locator('button[type="submit"]')).toBeVisible();
});

test('/mid-market has waitlist form', async ({ page }) => {
  await page.goto('/mid-market');
  const form = page.locator('form[name="waitlist-mid-market"]');
  await expect(form).toBeVisible();
  await expect(form.locator('input[name="email"]')).toBeVisible();
  await expect(form.locator('input[name="name"]')).toBeVisible();
  await expect(form.locator('button[type="submit"]')).toBeVisible();
});

test('privacy link is in footer on all pages', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route.path);
    const privacyLink = page.locator('footer a[href="/privacy"]');
    await expect(privacyLink).toBeVisible();
  }
});

test('header has no navigation links beyond logo', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route.path);
    const headerLinks = await page.locator('header nav a').all();
    expect(
      headerLinks.length,
      `Header on ${route.path} should only have logo link`
    ).toBe(1);
    const href = await headerLinks[0].getAttribute('href');
    expect(href).toBe('/');
  }
});

test('/eu-merchant primary CTA is waitlist', async ({ page }) => {
  await page.goto('/eu-merchant');
  const heroCta = page.locator('.hero-cta');
  const primaryBtn = heroCta.locator('.btn-primary');
  await expect(primaryBtn).toBeVisible();
  const href = await primaryBtn.getAttribute('href');
  expect(href).toBe('#waitlist');
});

test('/mid-market primary CTA is calendar booking', async ({ page }) => {
  await page.goto('/mid-market');
  const heroCta = page.locator('.hero-cta');
  const primaryBtn = heroCta.locator('.btn-primary');
  await expect(primaryBtn).toBeVisible();
  const href = await primaryBtn.getAttribute('href');
  expect(href).toContain('calendly.com');
});

test('landing page heroes have audience label and concise copy', async ({
  page,
}) => {
  const landingPages = ['/eu-merchant', '/mid-market'];
  for (const path of landingPages) {
    await page.goto(path);
    const audience = page.locator('.hero .hero-audience');
    await expect(audience, `${path} should have audience label`).toBeVisible();
    const sub = page.locator('.hero .hero-sub');
    const text = await sub.textContent();
    const sentences =
      text
        ?.trim()
        .split(/[.!?]+/)
        .filter(Boolean) || [];
    expect(
      sentences.length,
      `${path} hero subheading should be 1-2 sentences`
    ).toBeLessThanOrEqual(2);
  }
});

test('primary CTA is visually larger than secondary in hero', async ({
  page,
}) => {
  const landingPages = ['/eu-merchant', '/mid-market'];
  for (const path of landingPages) {
    await page.goto(path);
    const primaryBtn = page.locator('.hero-cta .btn-primary');
    await expect(primaryBtn).toHaveClass(/btn-lg/);
  }
});

test('text-heavy sections are constrained to readable width', async ({
  page,
}) => {
  const sections = [
    {
      path: '/eu-merchant',
      selectors: ['.hero', '.how-section', '.faq-section', '.waitlist-section'],
    },
    {
      path: '/mid-market',
      selectors: [
        '.hero',
        '.not-a-fit-section',
        '.faq-section',
        '.waitlist-section',
      ],
    },
  ];
  for (const { path, selectors } of sections) {
    await page.goto(path);
    for (const selector of selectors) {
      const el = page.locator(selector);
      const box = await el.boundingBox();
      expect(box, `${selector} on ${path} should exist`).toBeTruthy();
      expect(
        box!.width,
        `${selector} on ${path} should be ≤ 640px`
      ).toBeLessThanOrEqual(640);
    }
  }
});

test('sections have consistent vertical spacing', async ({ page }) => {
  const landingPages = ['/eu-merchant', '/mid-market'];
  for (const path of landingPages) {
    await page.goto(path);
    const sections = await page.locator('main > section').all();
    expect(
      sections.length,
      `${path} should have multiple sections`
    ).toBeGreaterThan(2);
    for (const section of sections) {
      const paddingTop = await section.evaluate(
        (el) => getComputedStyle(el).paddingTop
      );
      const ptValue = parseFloat(paddingTop);
      expect(
        ptValue,
        `Section on ${path} should have ≥ 48px top padding`
      ).toBeGreaterThanOrEqual(48);
    }
  }
});

test('primary CTA uses accent color consistently across pages', async ({
  page,
}) => {
  const pagesWithPrimaryCta = ['/eu-merchant', '/mid-market', '/thanks'];
  const expectedColor = 'rgb(10, 153, 137)';
  for (const path of pagesWithPrimaryCta) {
    await page.goto(path);
    const btn = page.locator('.btn-primary').first();
    const bgColor = await btn.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    expect(bgColor, `Primary CTA on ${path} should use accent color`).toBe(
      expectedColor
    );
  }
});

test('both landing pages have 3-step how-it-works section', async ({
  page,
}) => {
  const landingPages = ['/eu-merchant', '/mid-market'];
  for (const path of landingPages) {
    await page.goto(path);
    const section = page.locator('.how-section');
    await expect(
      section,
      `${path} should have how-it-works section`
    ).toBeVisible();
    const steps = await section.locator('.steps li').all();
    expect(steps.length, `${path} should have exactly 3 steps`).toBe(3);
    for (const step of steps) {
      const title = step.locator('strong');
      await expect(title).toBeVisible();
      const desc = step.locator('p');
      const text = await desc.textContent();
      const sentences =
        text
          ?.trim()
          .split(/[.!?]+/)
          .filter(Boolean) || [];
      expect(
        sentences.length,
        `Each step on ${path} should be one sentence`
      ).toBeLessThanOrEqual(1);
    }
  }
});

test('both landing pages have outcome-based benefits section', async ({
  page,
}) => {
  const jargonTerms =
    /\b(dashboard|api|integration|webhook|json|pdf|rbac|role-based)\b/i;
  const landingPages = ['/eu-merchant', '/mid-market'];
  for (const path of landingPages) {
    await page.goto(path);
    const section = page.locator('.benefits-section');
    await expect(section, `${path} should have benefits section`).toBeVisible();
    const heading = section.locator('h2');
    await expect(heading).toBeVisible();
    const items = await section.locator('.benefits-list li').all();
    expect(items.length, `${path} should have 3 benefit items`).toBe(3);
    const sectionText = await section.textContent();
    expect(
      sectionText,
      `${path} benefits should not contain technical jargon`
    ).not.toMatch(jargonTerms);
  }
});

test('trust signal is positioned above waitlist section', async ({ page }) => {
  const landingPages = ['/eu-merchant', '/mid-market'];
  for (const path of landingPages) {
    await page.goto(path);
    const trust = page.locator('.trust-section');
    await expect(trust, `${path} should have trust section`).toBeVisible();
    const paragraphs = await trust.locator('p').all();
    expect(
      paragraphs.length,
      `${path} trust signal should be one paragraph`
    ).toBe(1);
    const trustBox = await trust.boundingBox();
    const waitlistBox = await page.locator('.waitlist-section').boundingBox();
    expect(
      trustBox!.y,
      `${path} trust section should be above waitlist`
    ).toBeLessThan(waitlistBox!.y);
  }
});

test('bottom CTA section has large primary button and reassurance text', async ({
  page,
}) => {
  await page.goto('/eu-merchant');
  const euBtn = page.locator('.waitlist-section .btn-primary');
  await expect(euBtn).toHaveClass(/btn-lg/);
  const euReassurance = page.locator('.waitlist-section .form-reassurance');
  await expect(euReassurance).toBeVisible();

  await page.goto('/mid-market');
  const mmBtn = page.locator('.waitlist-section .btn-primary.btn-lg');
  await expect(mmBtn).toBeVisible();
  const mmReassurance = page.locator('.waitlist-section .form-reassurance');
  await expect(mmReassurance).toBeVisible();
});

test('no broken internal links', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route.path);
    const links = await page.locator('a[href^="/"]').all();
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href) {
        const response = await page.request.get(href);
        expect(response.status(), `Broken link: ${href} on ${route.path}`).toBe(
          200
        );
      }
    }
  }
});
