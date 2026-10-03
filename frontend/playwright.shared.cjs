// Every entry point uses the same preview process and discovers each suite once.
module.exports = {
  testDir: "./e2e",
  testMatch: ["**/*.spec.cjs", "**/*.spec.js"],
  workers: 2,
  timeout: 90000,
  use: {
    baseURL: "http://127.0.0.1:4184",
    headless: true,
    screenshot: "only-on-failure",
  },
  webServer: {
    // Avoid the extra npm wrapper; CI owns and shuts down this preview process.
    command: "node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4184 --strictPort",
    url: "http://127.0.0.1:4184",
    reuseExistingServer: false,
  },
};
