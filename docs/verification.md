# Verification — 9 October 2026

The website is complete locally. GitHub is the source repository; hosting is intentionally pending at the owner’s request. No Vercel deployment or Search Console submission has been performed.

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

Use an eligible commercial Vercel plan, assign the actual production hostname to `SITE_URL`, verify a hosted preview and staged production build, then publish and connect Git integration. The empty `ismailraqis-projects/vidshot` project uses Node 24.x but has no connected repository or deployments. Build settings are prepared in `vercel.json`.

App Store, support contact, privacy, and terms still need confirmed information. Search Console verification and sitemap submission require an actual live origin and the owner’s Google account. Google software-app rich-result eligibility also requires verified information that is not currently available; no missing price or rating was invented.
