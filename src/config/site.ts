// Public configuration only. Never put credentials here.
const env = { ...import.meta.env, ...process.env };

function httpsUrl(value: string | undefined, name: string): string {
  if (!value?.trim()) return "";
  const parsed = new URL(value.trim());
  if (parsed.protocol !== "https:" || parsed.username || parsed.password) {
    throw new Error(`${name} must be a public HTTPS URL.`);
  }
  return parsed.href;
}

const configuredOrigin = httpsUrl(env.SITE_URL, "SITE_URL");
const productionUrl = configuredOrigin ? new URL(configuredOrigin).origin : "";
const appStoreUrl = httpsUrl(env.APP_STORE_URL, "APP_STORE_URL");
if (appStoreUrl && new URL(appStoreUrl).hostname !== "apps.apple.com") {
  throw new Error("APP_STORE_URL must point to apps.apple.com.");
}
const supportEmail = env.SUPPORT_EMAIL?.trim() || "";
if (supportEmail && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(supportEmail)) {
  throw new Error("SUPPORT_EMAIL must be a valid email address.");
}
const launchStatus = env.LAUNCH_STATUS || "coming-soon";
if (!["coming-soon", "available"].includes(launchStatus)) {
  throw new Error("LAUNCH_STATUS must be coming-soon or available.");
}
if (launchStatus === "available" && !appStoreUrl) {
  throw new Error("An available app requires APP_STORE_URL.");
}
if (env.VERCEL_ENV === "production" && !productionUrl) {
  throw new Error(
    "Set SITE_URL to the assigned production origin before deploying.",
  );
}

export const site = {
  name: "VidShot",
  productionUrl,
  appStoreUrl,
  supportEmail,
  launchStatus,
  // Index only completed pages on production. Local and preview builds stay noindex.
  indexable: Boolean(productionUrl) && env.VERCEL_ENV === "production",
  googleVerification: env.GOOGLE_SITE_VERIFICATION || "",
  description:
    "Save supported videos, organize your downloads, and watch offline with VidShot for iPhone and iPad.",
};

export const finishedRoutes = [
  "/",
  "/guides/",
  "/guides/save-supported-videos/",
  "/guides/watch-offline/",
  "/guides/organize-downloads/",
];

export const absoluteUrl = (path: string) =>
  site.productionUrl ? new URL(path, `${site.productionUrl}/`).href : undefined;
