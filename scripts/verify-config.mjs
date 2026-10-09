import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const configKeys = [
  "SITE_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
  "VERCEL_URL",
  "VERCEL_ENV",
  "APP_STORE_URL",
  "SUPPORT_EMAIL",
  "LAUNCH_STATUS",
];
const cleanEnv = { ...process.env };
for (const key of configKeys) delete cleanEnv[key];
const cases = [
  {
    name: "local defaults have no fabricated origin",
    env: {},
    origin: "",
    indexable: false,
  },
  {
    name: "production uses Vercel's stable hostname without SITE_URL",
    env: {
      VERCEL_ENV: "production",
      VERCEL_PROJECT_PRODUCTION_URL: "vidshot-test.example",
      VERCEL_URL: "temporary-preview.example",
    },
    origin: "https://vidshot-test.example",
    indexable: true,
  },
  {
    name: "preview canonicals use production while indexing stays disabled",
    env: {
      VERCEL_ENV: "preview",
      VERCEL_PROJECT_PRODUCTION_URL: "vidshot-test.example",
      VERCEL_URL: "temporary-preview.example",
    },
    origin: "https://vidshot-test.example",
    indexable: false,
  },
  {
    name: "blank SITE_URL still uses the platform hostname",
    env: {
      SITE_URL: "  ",
      VERCEL_ENV: "production",
      VERCEL_PROJECT_PRODUCTION_URL: "vidshot-test.example",
    },
    origin: "https://vidshot-test.example",
    indexable: true,
  },
  {
    name: "explicit SITE_URL overrides the platform hostname",
    env: {
      SITE_URL: "https://custom-domain.example/",
      VERCEL_ENV: "production",
      VERCEL_PROJECT_PRODUCTION_URL: "vidshot-test.example",
    },
    origin: "https://custom-domain.example",
    indexable: true,
  },
  {
    name: "temporary deployment hostname is never a production fallback",
    env: { VERCEL_ENV: "production", VERCEL_URL: "temporary-preview.example" },
    error: /Set SITE_URL/,
  },
  {
    name: "missing all production origins still fails clearly",
    env: { VERCEL_ENV: "production" },
    error: /System Environment Variables/,
  },
  {
    name: "invalid explicit origin is rejected",
    env: { SITE_URL: "http://custom-domain.example" },
    error: /HTTPS URL/,
  },
  {
    name: "available app requires a verified App Store URL",
    env: { LAUNCH_STATUS: "available" },
    error: /requires APP_STORE_URL/,
  },
];

for (const scenario of cases) {
  const result = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      'const { site } = await import("./src/config/site.ts"); console.log(JSON.stringify(site));',
    ],
    {
      encoding: "utf8",
      env: { ...cleanEnv, ...scenario.env },
    },
  );
  if (scenario.error) {
    assert.notEqual(result.status, 0, scenario.name);
    assert.match(result.stderr, scenario.error, scenario.name);
  } else {
    assert.equal(result.status, 0, `${scenario.name}: ${result.stderr}`);
    const site = JSON.parse(result.stdout);
    assert.equal(site.productionUrl, scenario.origin, scenario.name);
    assert.equal(site.indexable, scenario.indexable, scenario.name);
    assert.equal(site.appStoreUrl, "", scenario.name);
    assert.equal(site.supportEmail, "", scenario.name);
  }
  console.log(`PASS ${scenario.name}`);
}
