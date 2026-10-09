# VidShot

A static, English-language Astro website for VidShot on iPhone and iPad. It uses the supplied app icon and screenshots, plain CSS, local Manrope fonts, and no browser JavaScript, backend, database, analytics, or third-party embeds.

## Run locally

Use Node.js 24 (`.nvmrc` and `package.json` pin the major version).

```sh
npm ci
npm run dev
```

```sh
npm run check
npm run test:config
npm run build
npm run verify
npx playwright install chromium
npm run test:browser
npm run preview
```

The build generates responsive AVIF and WebP screenshots, favicons, an Apple touch icon, a sharing card, `robots.txt`, and `sitemap.xml`. Original artwork stays in `Images/`; only optimized images used by the site are published in `dist/`.

## Content and configuration

- Home: `src/pages/index.astro`.
- Confirmed screenshot features: `src/data/features.ts`.
- Three Markdown guides: `src/pages/guides/`.
- Configuration and finished sitemap routes: `src/config/site.ts`.
- Shared metadata, header, and footer: `src/layouts/Base.astro`.
- Styling: `src/styles/global.css`.

Copy `.env.example` to `.env` for local configuration. All values below are public settings, not secrets.

| Setting | Initial value | Purpose |
| --- | --- | --- |
| `SITE_URL` | Optional on Vercel | Production HTTPS origin override for canonicals, social metadata, and sitemap entries. Vercel defaults to its supplied stable production hostname. Required on other hosts. |
| `APP_STORE_URL` | Empty | Verified `https://apps.apple.com/…` listing. |
| `SUPPORT_EMAIL` | Empty | Verified support email, shown only when configured. |
| `LAUNCH_STATUS` | `coming-soon` | Change to `available` only when the verified App Store URL is set. |
| `GOOGLE_SITE_VERIFICATION` | Empty | Optional Search Console HTML verification token. |

An available app without an App Store URL fails the build. An empty contact setting never produces a fabricated address or broken mail link. When `SITE_URL` is blank, Vercel builds use `https://` plus `VERCEL_PROJECT_PRODUCTION_URL`, which points to the stable production hostname even in previews. See [Vercel’s system-variable documentation](https://vercel.com/docs/environment-variables/system-environment-variables#vercel_project_production_url). Do not use `VERCEL_URL` or a deployment-specific preview hostname as the production origin.

If both production settings are missing, a production build fails with instructions to set `SITE_URL` or enable **Settings → Environment Variables → Enable access to System Environment Variables**. A manual `SITE_URL` is also useful to keep a preferred canonical domain if the project later gains additional domains.

## Indexing behavior

The home page, guide index, and three guides are complete. They are indexable only when `VERCEL_ENV=production` and a production origin is available through either setting. Other builds emit `noindex, follow`, disallow crawling in `robots.txt`, and have an empty sitemap. Previews with a production origin configured still use production canonicals.

Support, privacy, terms, and the 404 page always emit `noindex, follow`. Unfinished pages never appear in the sitemap. Vercel headers also set `X-Robots-Tag` for support, privacy, and terms. Production robots permits crawling these pages so crawlers can read their `noindex` instruction.

The app schema contains only confirmed fields and all ten shown features. It omits unknown price, ratings, reviews, version, publisher, and minimum OS version. This is truthful Schema.org markup; it does **not** meet Google’s software-app rich-result requirements without confirmed price and review/rating information. See [Google’s software-app guidance](https://developers.google.com/search/docs/appearance/structured-data/software-app).

## Hosting status

The initial handoff left deployment pending. The owner subsequently imported the repository as **`vidshot-ios`**. Its first build failed because `SITE_URL` was unset; the site now falls back to Vercel’s supplied production hostname. Redeploy the latest `main` commit to apply that fix.

The connected team `ismailraqis-projects` was last checked on Hobby. The site promotes Premium features, so commercial hosting eligibility still needs an appropriate plan. [Vercel’s fair-use guidelines](https://vercel.com/docs/limits/fair-use-guidelines) restrict Hobby to non-commercial personal use. No paid plan has been purchased by the agent.

An earlier empty `vidshot` project shell was created under `ismailraqis-projects` while hosting was being checked. The imported project being repaired is **`vidshot-ios`**.

## Deploy when ready

1. Verify an eligible Vercel team and the intended `vidshot` project. If the project shell was created under Hobby, upgrade that team or transfer/recreate it under the eligible team.
2. Link the local directory to the intended project. Use framework **Astro**, build command **`npm run build`**, output **`dist`**, and Node **24.x**. These build settings are also in `vercel.json`. Keep Git integration disconnected during initial verification.
3. Enable access to Vercel System Environment Variables. The production origin is then supplied automatically; optionally set `SITE_URL` for both Preview and Production to override it with the preferred production hostname. Leave App Store and contact settings empty until supplied. Leave `LAUNCH_STATUS=coming-soon`.
4. Create a CLI preview deployment (`vercel deploy`), then verify page rendering, images, internal links, the 404 response, production canonicals, `noindex` tags, disallowed preview crawling, and an empty preview sitemap. Use authenticated `vercel curl` for protected previews; preserve deployment protection.
5. Stage a production build without assigning its domain (`vercel deploy --prod --skip-domain`). Check that build with production canonicals, five sitemap entries, crawlable `robots.txt`, and placeholder `noindex` metadata. Promote only the verified production deployment.
6. Check the public production URL after promotion. Then connect `ismailraqi/vidshot` through Vercel’s Git integration and set **`main`** as the production branch. Connecting the repository may trigger a new build, so do this only after the current commit has been verified. Subsequent `main` pushes deploy automatically; other branches create previews.

Vercel supplies `VERCEL_ENV`; do not manually override it in hosted Preview settings. Local production checks can set it explicitly using a **test-only** origin. Restore a local preview build afterward so a test origin is not accidentally published.

## Before the app launches

Publish the actual privacy policy and terms, and provide a verified support contact. Replace each placeholder deliberately. For completed support/policy pages, remove the placeholder wrapper, remove its `noindex` flag and Vercel header exclusion, and add its route to `finishedRoutes`. Merely adding an email does not complete the support page.

Set the verified App Store URL and switch `LAUNCH_STATUS` to `available` together. Review guide instructions against the released app. Do not add compatibility claims, pricing, ratings, or OS requirements without verification.

After production is live, add a URL-prefix property for the actual origin in [Google Search Console](https://search.google.com/search-console). The owner must authenticate their Google account. Supply the HTML verification token through `GOOGLE_SITE_VERIFICATION`, redeploy, verify ownership, then submit `/sitemap.xml`. Monitor indexing and search performance. Rankings and rich results are not guaranteed.

## Verification artifacts

`npm run verify` checks every built page for unique metadata, semantic headings, local links, image attributes, canonicals, indexing rules, and truthful app schema. Playwright covers phone/tablet/desktop layouts, all ten gallery image loads, FAQ interaction, guides, keyboard skip navigation, placeholders, and the 404.

Playwright screenshots and Lighthouse reports are generated in the ignored `reports/` directory. See `docs/verification.md` for measured results and limitations.
