const { defineConfig } = require("@playwright/test");
const shared = require("./playwright.shared.cjs");

module.exports = defineConfig(shared);
