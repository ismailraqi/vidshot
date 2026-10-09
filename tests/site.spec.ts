import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

for (const viewport of [
  { name: "phone", width: 390, height: 844 },
  { name: "tablet", width: 820, height: 1180 },
  { name: "desktop", width: 1440, height: 1000 },
]) {
  test(`${viewport.name}: layout, images, FAQs, navigation`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400)
        errors.push(`${response.status()} ${response.url()}`);
    });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Save it now. Watch it later." }),
    ).toBeVisible();
    await expect(
      page.getByText("Coming soon on the App Store").first(),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const gallery = page.getByRole("region", {
      name: /VidShot iPhone screenshots/,
    });
    await gallery.scrollIntoViewIfNeeded();
    for (let i = 0; i < 10; i++) {
      const image = gallery.locator("img").nth(i);
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
    await gallery.evaluate((element) => (element.scrollLeft = 0));
    const tabletImage = page.getByRole("img", { name: /VidShot on iPad/ });
    await tabletImage.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        tabletImage.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
    });
    await page.evaluate(() => document.fonts.ready);
    await mkdir("reports", { recursive: true });
    await page.screenshot({
      path: `reports/${viewport.name}.png`,
      fullPage: true,
    });
    await page
      .locator("summary")
      .filter({ hasText: "Can I watch without an internet connection?" })
      .click();
    await expect(
      page.getByText("See the offline viewing guide."),
    ).toBeVisible();
    await page.getByText("See the offline viewing guide.").click();
    await expect(
      page.getByRole("heading", {
        name: "How to watch videos offline",
        exact: true,
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("keyboard access, placeholders, guide links and 404", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  const faq = page.locator("details").filter({ hasText: "Can I watch without an internet connection?" });
  await faq.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(faq).toHaveAttribute("open", "");
  const gallery = page.getByRole("region", { name: /VidShot iPhone screenshots/ });
  await gallery.focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => gallery.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
  await page.goto("/guides/");
  for (const slug of [
    "save-supported-videos",
    "watch-offline",
    "organize-downloads",
  ]) {
    await page.locator(`a[href="/guides/${slug}/"]`).click();
    await expect(page.locator("h1")).toBeVisible();
    await page.getByRole("link", { name: "← All guides" }).click();
  }
  for (const path of ["support", "privacy", "terms"]) {
    await page.goto(`/${path}/`);
    await expect(
      page.getByText("Placeholder — publication pending"),
    ).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, follow",
    );
  }
  const response = await page.goto("/a-page-that-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "This one isn’t in the library." }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Back to VidShot/ }).click();
  await expect(page.locator("h1")).toHaveText("Save it now.Watch it later.");
});
