# Verification — 9 October 2026

The initial website verification completed locally and on GitHub, with hosting left pending at the owner’s request. The owner later imported `vidshot-ios` in Vercel and reported a build failure. The configuration repair is recorded below. Search Console submission is still pending.

## Checks

- Astro production build: passed; nine HTML pages and static robots/sitemap endpoints generated.
- TypeScript/Astro checks: 22 files, zero errors, warnings, or hints.
- Dependency audit: zero vulnerabilities, including development dependencies.
- Built-page verification: all nine pages, 31 image elements, local links, unique titles/descriptions, one H1 per page, language, image dimensions/alt text, and indexing metadata passed.
- Production configuration: five complete routes in the sitemap; support/privacy/terms/404 excluded and `noindex`; absolute production canonicals and sharing metadata verified.
- Preview configuration: all pages `noindex`, crawling disallowed, and an empty sitemap. The final local build uses these preview defaults and contains no test hostname.
- App schema: ten confirmed features, iOS/iPadOS, MultimediaApplication, and app name/description. No invented offers, ratings, reviews, publisher, version, or minimum OS.
- Configuration cases: blank coming-soon links, missing App Store link for an available app, invalid App Store domain, invalid email, missing production URL, preview origin behavior, and an available-app URL all behaved as expected.
- Playwright: four tests passed. Phone 390×844, tablet 820×1180, desktop 1440×1000; all ten gallery images and the iPad screenshot loaded; FAQ and guide navigation worked; skip link, FAQ Enter key, gallery arrow key, placeholder metadata, and HTTP 404 were checked.
- Extra width sweep: 320, 360, 375, 600, 768, 820, 1024, and 1280 pixels, with no horizontal document overflow.
- Visual inspection: phone, tablet, and desktop screenshots reviewed. A rotated hero image overflow and two label contrast issues were corrected before final verification.

## Mobile Lighthouse

Lighthouse 13.5.0, Chrome for Testing 156, default simulated mobile throttling, localhost static preview server. Production-mode SEO was tested with the reserved fixture origin `https://vidshot.example`; this is **not** an assigned hosting URL. The fixture build was replaced with the default, excluded-from-indexing preview build afterward.

| Finished page | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Home | 98 | 100 | 100 | 100 |
| Guides index | 100 | 100 | 100 | 100 |
| Save supported videos | 100 | 100 | 100 | 100 |
| Watch offline | 100 | 100 | 100 | 100 |
| Organize downloads | 100 | 100 | 100 | 100 |

The intentionally unindexable preview homepage’s initial SEO score was 66, reflecting its `noindex` tag and disallowed crawling. One offline-guide measurement returned 76 performance with 1,250 ms total blocking time; an isolated repeat returned 100 with zero blocking time. Both JSON reports are retained locally. Lab timing varies, and these measurements do not establish deployed performance.

Reports are in ignored `reports/`: phone/tablet/desktop PNGs and per-page Lighthouse JSON/HTML files. The homepage report is `lighthouse-production.report.html`.

## Remaining launch work

The owner imported the site into `ismailraqis-projects/vidshot-ios`, and the repaired build is live at `https://vidshot-ios.vercel.app`. It uses Astro, `dist`, and Node 24.x, with `main` deploying through Git integration. Vercel supplies the production hostname automatically; `SITE_URL` is an optional override. Commercial-plan eligibility remains the owner’s hosting follow-up.

The App Store link and public contact email still need confirmed information. Privacy and terms now contain pre-launch text, with source/release confirmation described below. Search Console verification and sitemap submission require the owner’s Google account. Google software-app rich-result eligibility also requires verified information that is not currently available; no missing price or rating was invented.

## Vercel import build repair

The first Vercel build failed at commit `8cd5add` because the application required a manually configured `SITE_URL`. Configuration now uses `VERCEL_PROJECT_PRODUCTION_URL` when `SITE_URL` is blank, preserving the stable production origin in both Production and Preview. Individual `VERCEL_URL` deployment hostnames are never used as canonical fallbacks.

`package.json` and its lockfile now pin Node to `24.x`, resolving Vercel’s unbounded-major-version warning. Nine regression cases pass via `npm run test:config`, including production without a manual URL, previews remaining unindexable, explicit domain precedence, and rejecting temporary deployment origins. Astro checks pass for 23 files with zero errors, warnings, or hints. Production and Preview build/HTML verification both pass using only the supplied platform production hostname; the final local build is restored to unindexable defaults.

## Privacy policy and terms

The privacy and terms placeholders were replaced with original, structured policies using VidShot as the company name supplied by the owner. Coverage includes local browser/library data, permissions, download requests, advertising and consent choices, Apple purchases, website hosting, retention/deletion, privacy rights, permitted use, subscriptions, and consumer protections. External provider guidance is linked within the pages.

The available iOS source was inspected read-only. Its branding differs from VidShot, which was disclosed to the owner before proceeding. Treat it as the reference implementation and confirm its SDKs and data flows match the shipping VidShot build. A detailed source audit is retained only in ignored `reports/legal-source-audit.md`; private app code and identifiers are not published with this website. No contact email, registered address, governing jurisdiction, or vault-encryption promise was invented.

Both policies display a pre-launch contact-pending notice while `SUPPORT_EMAIL` is empty. They emit `noindex` and stay out of the production sitemap. A verified configured email removes the notice, supplies mail links, and adds the two policies to production indexing; previews remain unindexable. The support placeholder remains excluded independently.

- Astro checks: 26 files, zero errors, warnings, or hints.
- All nine configuration regression cases passed.
- Production build with contact absent: five sitemap entries; privacy and terms excluded with `noindex`.
- Production build with a test-only contact: seven sitemap entries, indexable policies, visible contact links, and no contact-pending notice.
- Default build restored and verified after fixture checks; no fixture origin or email is published.
- Eight browser tests passed: all existing phone/tablet/desktop flows plus privacy and terms on phone and desktop, every table-of-contents target, keyboard anchor navigation, footer links, contact/support navigation, and horizontal overflow. Policy screenshots were visually inspected and are retained in ignored `reports/`.

On 10 October, the owner supplied the app's Firebase feedback disclosures. The privacy policy now includes those fields, optional reply email, HTTPS transmission, Realtime Database storage, App Check protection, excluded browsing/library/vault data, and deletion after requests are handled. The summary, processing purposes, provider list, and retention sections were updated consistently. This addition is based on the owner's supplied implementation details rather than the earlier reference-source revision. The privacy revision date is now independent of the terms date. Astro checks, the static build, built-page verification, and four policy navigation tests passed after the update.
