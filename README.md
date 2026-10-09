# VidShot

A static, English-language Astro website for VidShot on iPhone and iPad. It uses the supplied app icon and screenshots, plain CSS, local Manrope fonts, and no browser JavaScript, backend, database, analytics, or third-party embeds.

## Run locally

Use Node.js 24 (`.nvmrc`), or Node.js 22.19 or newer.

```sh
npm ci
npm run dev
```

```sh
npm run check
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
| `SITE_URL` | Empty until hosting is assigned | Production HTTPS origin for canonicals, social metadata, and sitemap entries. |
| `APP_STORE_URL` | Empty | Verified `https://apps.apple.com/…` listing. |
| `SUPPORT_EMAIL` | Empty | Verified support email, shown only when configured. |
| `LAUNCH_STATUS` | `coming-soon` | Change to `available` only when the verified App Store URL is set. |
| `GOOGLE_SITE_VERIFICATION` | Empty | Optional Search Console HTML verification token. |

An available app without an App Store URL fails the build. An empty contact setting never produces a fabricated address or broken mail link. Production builds on Vercel fail if `SITE_URL` is missing. Do not use a deployment-specific preview hostname as `SITE_URL`.

## Indexing behavior

The home page, guide index, and three guides are complete. They are indexable only when `VERCEL_ENV=production` and `SITE_URL` is configured. Other builds emit `noindex, follow`, disallow crawling in `robots.txt`, and have an empty sitemap. Previews with a production origin configured still use production canonicals.

Support, privacy, terms, and the 404 page always emit `noindex, follow`. Unfinished pages never appear in the sitemap. Vercel headers also set `X-Robots-Tag` for support, privacy, and terms. Production robots permits crawling these pages so crawlers can read their `noindex` instruction.

The app schema contains only confirmed fields and all ten shown features. It omits unknown price, ratings, reviews, version, publisher, and minimum OS version. This is truthful Schema.org markup; it does **not** meet Google’s software-app rich-result requirements without confirmed price and review/rating information. See [Google’s software-app guidance](https://developers.google.com/search/docs/appearance/structured-data/software-app).

## Hosting status

Deployment is pending at the owner’s request. The connected team `ismailraqis-projects` is on Hobby. The site promotes Premium features, so use an eligible Pro or Enterprise team before deploying. [Vercel’s fair-use guidelines](https://vercel.com/docs/limits/fair-use-guidelines) restrict Hobby to non-commercial personal use.

No paid plan has been purchased. No production or preview deployment has been published. Git integration must remain disconnected until the hosting plan is eligible, because connecting it can trigger deployments.

An empty `vidshot` project shell was created under `ismailraqis-projects` while hosting was being checked. It has no connected repository and no deployments.

## Deploy when ready

1. Verify an eligible Vercel team and the intended `vidshot` project. If the project shell was created under Hobby, upgrade that team or transfer/recreate it under the eligible team.
2. Link the local directory to the intended project. Use framework **Astro**, build command **`npm run build`**, output **`dist`**, and Node **24.x**. These build settings are also in `vercel.json`. Keep Git integration disconnected during initial verification.
3. Read the actual assigned production `vercel.app` hostname from the project. Set it as `SITE_URL` for both Preview and Production. Leave App Store and contact settings empty until supplied. Leave `LAUNCH_STATUS=coming-soon`.
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
