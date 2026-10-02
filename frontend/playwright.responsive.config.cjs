const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
 testDir: './e2e',
 testMatch: ['food-catalog.spec.cjs', 'food-experience.spec.cjs', 'profile.spec.cjs', 'activity.spec.cjs', 'responsive.spec.cjs'],
 workers: 2,
 timeout: 90000,
 use: { baseURL: 'http://127.0.0.1:4184', screenshot: 'only-on-failure' },
 webServer: { command: 'npm run dev -- --host 127.0.0.1 --port 4184', url: 'http://127.0.0.1:4184', reuseExistingServer: false }
});
