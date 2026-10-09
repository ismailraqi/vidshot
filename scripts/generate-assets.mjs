import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

await mkdir("public", { recursive: true });
const icon = "Images/AppIcon/appicon-yellow-bar-1024.png";
await Promise.all([
  ...[
    [32, "favicon-32.png"],
    [192, "favicon-192.png"],
    [180, "apple-touch-icon.png"],
  ].map(([size, file]) =>
    sharp(icon).resize(size, size).png().toFile(`public/${file}`),
  ),
  sharp(icon)
    .resize(80, 80)
    .webp({ quality: 85 })
    .toFile("public/brand-icon.webp"),
]);
// Code-native sharing card; the supplied app icon remains the only raster artwork.
const card = Buffer.from(
  `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#fffdf7"/><circle cx="1090" cy="130" r="300" fill="#ffdc4d"/><rect x="63" y="305" width="740" height="41" fill="#ffdc4d"/><g fill="#21231f" font-family="Arial,sans-serif"><text x="66" y="120" font-size="32" font-weight="700">VidShot.</text><text x="60" y="250" font-size="89" font-weight="700">Save it now.</text><text x="60" y="342" font-size="89" font-weight="700">Watch it later.</text><text x="66" y="435" font-size="28">Save supported videos. Watch offline.</text><text x="66" y="533" font-size="22">For iPhone &amp; iPad</text></g></svg>`,
);
const socialIcon = await sharp(icon).resize(225, 225).png().toBuffer();
await sharp(card)
  .composite([{ input: socialIcon, left: 910, top: 315 }])
  .png()
  .toFile("public/social-card.png");
await writeFile(
  "public/site.webmanifest",
  JSON.stringify(
    {
      name: "VidShot",
      short_name: "VidShot",
      start_url: "/",
      display: "browser",
      background_color: "#fffdf7",
      theme_color: "#ffdc4d",
      icons: [{ src: "/favicon-192.png", sizes: "192x192", type: "image/png" }],
    },
    null,
    2,
  ),
);
console.log("Generated app favicons, brand icon, and sharing card.");
