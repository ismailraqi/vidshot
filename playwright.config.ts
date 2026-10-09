import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: process.env.TEST_BASE_URL || "http://127.0.0.1:4321",
    browserName: "chromium",
  },
  webServer: process.env.TEST_BASE_URL
    ? undefined
    : {
        command: "npm run preview -- --host 127.0.0.1 --ignore-lock",
        url: "http://127.0.0.1:4321",
        reuseExistingServer: true,
      },
  reporter: "list",
});
