import { defineConfig } from "@playwright/test";
import shared from "./playwright.shared.cjs";

export default defineConfig({
  ...shared,
  testMatch: ["food-catalog.spec.cjs", "food-experience.spec.cjs"],
});
