import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";

const origin = (
  process.env.SITE_URL?.trim() ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim()}`
    : "")
).replace(/\/$/, "");
const production = process.env.VERCEL_ENV === "production" && Boolean(origin);
const legalReady = Boolean(process.env.SUPPORT_EMAIL?.trim());
const finished = [
  "index.html",
  "guides/index.html",
  "guides/save-supported-videos/index.html",
  "guides/watch-offline/index.html",
  "guides/organize-downloads/index.html",
  ...(legalReady ? ["privacy/index.html", "terms/index.html"] : []),
];
const unfinished = [
  "support/index.html",
  ...(!legalReady ? ["privacy/index.html", "terms/index.html"] : []),
  "404.html",
];
const titles = new Set();
const descriptions = new Set();
let imageCount = 0;
for (const file of [...finished, ...unfinished]) {
  const html = await readFile(`dist/${file}`, "utf8");
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(
    /<meta name="description" content="([^"]+)"/,
  )?.[1];
  assert.ok(title, `${file}: title required`);
  assert.ok(description, `${file}: description required`);
  assert.ok(!titles.has(title), `${file}: unique title required`);
  assert.ok(
    !descriptions.has(description),
    `${file}: unique description required`,
  );
  titles.add(title);
  descriptions.add(description);
  assert.equal(
    (html.match(/<h1[\s>]/g) || []).length,
    1,
    `${file}: exactly one h1`,
  );
  assert.ok(html.includes('<html lang="en">'), `${file}: language`);
  assert.ok(html.includes('href="#main"'), `${file}: skip link`);
  const shouldIndex = production && finished.includes(file);
  assert.ok(
    html.includes(
      `name="robots" content="${shouldIndex ? "index" : "noindex"}, follow"`,
    ),
    `${file}: indexing status`,
  );
  if (origin) {
    const path =
      file === "index.html"
        ? "/"
        : file === "404.html"
          ? "/404/"
          : `/${file.replace("index.html", "")}`;
    assert.ok(
      html.includes(`rel="canonical" href="${origin}${path}"`),
      `${file}: production canonical`,
    );
  } else
    assert.ok(
      !html.includes('rel="canonical"'),
      `${file}: no fabricated canonical`,
    );
  assert.ok(
    !/href="(?:|#|undefined|null)"/.test(html),
    `${file}: no empty links`,
  );
  if (legalReady && ["privacy/index.html", "terms/index.html"].includes(file)) {
    assert.ok(
      !html.includes("Pre-launch policy") && !html.includes("Draft updated"),
      `${file}: legal document must be complete`,
    );
    assert.ok(
      html.includes(`href="mailto:${process.env.SUPPORT_EMAIL.trim()}"`),
      `${file}: verified contact required`,
    );
  }
  if (legalReady && file === "support/index.html") {
    assert.ok(!html.includes("Placeholder — publication pending"), "Support must provide a finished contact page");
    assert.ok(html.includes(`href="mailto:${process.env.SUPPORT_EMAIL.trim()}"`), "Support contact required");
  }
  for (const tag of html.matchAll(/<img\s[^>]+>/g)) {
    assert.ok(
      /\balt=/.test(tag[0]) &&
        /\bwidth=/.test(tag[0]) &&
        /\bheight=/.test(tag[0]),
      `${file}: image alt and dimensions`,
    );
    imageCount++;
  }
  for (const link of html.matchAll(/(?:href|src)="(\/[^"?#]*)/g)) {
    const path = link[1];
    await access(`dist${path}${path.endsWith("/") ? "index.html" : ""}`);
  }
}
const home = await readFile("dist/index.html", "utf8");
const json = JSON.parse(
  home.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1] ||
    "{}",
);
assert.equal(json["@type"], "MobileApplication");
assert.equal(json.name, "VidShot");
assert.equal(json.featureList?.length, 10);
assert.ok(
  !("aggregateRating" in json) && !("review" in json) && !("offers" in json),
  "No fabricated rating, review, or price",
);
assert.ok(
  home.includes('type="image/avif"') && home.includes('type="image/webp"'),
  "Responsive modern screenshot formats",
);
assert.ok(home.includes('fetchpriority="high"'), "Hero prioritized");
assert.ok(!/<script[^>]+src=/.test(home), "No client JavaScript shipped");
const sitemap = await readFile("dist/sitemap.xml", "utf8");
assert.equal(
  (sitemap.match(/<loc>/g) || []).length,
  production ? finished.length : 0,
  "Only finished production pages in sitemap",
);
assert.ok(
  !/\/(support|404)\/<\/loc>/.test(sitemap) &&
    (legalReady || !/\/(privacy|terms)\/<\/loc>/.test(sitemap)),
  "Unfinished pages excluded",
);
const robots = await readFile("dist/robots.txt", "utf8");
assert.ok(
  robots.includes(
    production ? `Sitemap: ${origin}/sitemap.xml` : "Disallow: /",
  ),
  "Correct robots policy",
);
console.log(
  `Verified ${finished.length + unfinished.length} HTML pages, ${imageCount} images, all local links, metadata, structured data, and ${production ? "production" : "preview"} indexing.`,
);
