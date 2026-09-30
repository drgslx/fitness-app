const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({testDir:'./e2e',testMatch:'food-catalog.spec.cjs',use:{baseURL:'http://127.0.0.1:4184'},webServer:{command:'npm run dev -- --host 127.0.0.1 --port 4184',url:'http://127.0.0.1:4184',reuseExistingServer:false}});
