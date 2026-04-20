import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./test",
  testMatch: "**/*.spec.js",
  use: {
    browserName: "chromium",
  },
});
