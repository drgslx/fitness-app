const { defineConfig } = require("@playwright/test");
module.exports = defineConfig({
  testDir: "./e2e", testMatch: ["activity.spec.cjs", "profile.spec.cjs"],
  use: { baseURL: "http://127.0.0.1:4173", headless: true, screenshot: "only-on-failure" },
  webServer: { command: "npm run dev -- --host 127.0.0.1 --port 4173", url: "http://127.0.0.1:4173", reuseExistingServer: !process.env.CI },
});
