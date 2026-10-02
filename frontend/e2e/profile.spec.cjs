const { test, expect } = require("@playwright/test");
const today = "2026-09-26";
const baseProfile = {
  sex: "male", birth_date: "1996-01-01", height_cm: 176, activity_level: "moderate",
  goal: "maintain", deficit_percent: 10, surplus_percent: 10, target_weight_kg: null,
  pregnant_or_breastfeeding: false, auto_calories: true, timezone: "Europe/Bucharest",
};
const missing = { available: false, reason: "Completeaza profilul si adauga o greutate masurata.", warnings: [], options: [] };

async function setup(page, existing = false) {
  const state = { today, profile: existing ? { ...baseProfile } : null, weights: [],
    recommendation: missing, active_goal: null, weight_change_kg: null };
  const requests = [];
  await page.route("**/api/v1/energy", (route) => route.fulfill({ json: { available: false, reason: "Completeaza profilul" } }));
  // Test-only module interception: no authentication bypass exists in application code.
  await page.route(/\/src\/auth\.jsx(?:\?.*)?$/, (route) => route.fulfill({ contentType: "application/javascript", body: `
    const user = { uid: "test-user", email: "ana@example.test", displayName: "Ana", getIdToken: async () => "test-token" };
    export const auth = { currentUser: user };
    export const useAuth = () => ({ user, admin: false, loading: false });
    export const AuthProvider = ({ children }) => children;
  ` }));
  await page.route(/\/api\/v1\/profile(?:\/[^?]*)?(?:\?.*)?$/, async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (path.endsWith("/summary")) return route.fulfill({ json: {
      sessions: 3, sports: [{ name: "Sala", sessions: 3 }], entries: 6, logged_days: 2,
      calories: 4100, average_calories: 2050, average_difference: -100, days_with_target: 2,
    } });
    if (request.method() === "PUT") {
      const payload = request.postDataJSON();
      requests.push({ path, payload });
      if (path.endsWith("/weights")) {
        state.weights = [{ id: 1, ...payload }];
        state.recommendation = {
          available: true, effective_goal: "maintain", weight_day: payload.day,
          resting_kcal: 1775, maintenance_kcal: 2751, target_kcal: 2751,
          adjustment_percent: 0, warnings: [], options: [{ percent: 0, calories: 2751, allowed: true }],
        };
        state.active_goal = { calories: 2751, protein: 0, source: "profile", effective_from: today };
      } else state.profile = payload;
    }
    if (request.method() === "DELETE") {
      state.weights = [];
      state.recommendation = missing;
      state.active_goal = null;
    }
    return route.fulfill({ json: state });
  });
  return requests;
}

test("profile goal controls, save, weight correction, deletion and navigation", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const requests = await setup(page);
  await page.goto("/profile");
  await expect(page.getByRole("heading", { name: "Profilul meu", exact: true })).toBeVisible();
  await page.getByLabel("Sex folosit in calcul").selectOption("male");
  await page.getByLabel("Data nasterii").fill("1996-01-01");
  await page.getByLabel("Inaltime (cm)").fill("176");
  await page.getByLabel("Activitate initiala (doar fallback)").selectOption("light");
  await expect(page.getByLabel("Deficit caloric")).toHaveCount(0);
  await expect(page.getByLabel("Surplus caloric")).toHaveCount(0);
  await page.getByLabel("Obiectiv", { exact: true }).selectOption("lose");
  await page.getByLabel("Deficit caloric").selectOption("20");
  await expect(page.getByLabel("Surplus caloric")).toHaveCount(0);
  await page.getByLabel("Obiectiv", { exact: true }).selectOption("gain");
  await expect(page.getByLabel("Deficit caloric")).toHaveCount(0);
  await page.getByLabel("Surplus caloric").selectOption("15");
  await page.getByLabel("Obiectiv", { exact: true }).selectOption("maintain");
  await page.getByRole("button", { name: "Salveaza profilul", exact: true }).click();
  await page.getByRole("button", { name: "Greutate și progres", exact: true }).click();
  await expect(page.getByRole("button", { name: "Salveaza greutatea" })).toBeVisible();
  expect(requests[0].payload).toMatchObject({ goal: "maintain", deficit_percent: 20, surplus_percent: 15, activity_level: "light", height_cm: 176 });
  await page.getByLabel("Greutate (kg)", { exact: true }).fill("82");
  await page.getByRole("button", { name: "Salveaza greutatea" }).click();
  await expect(page.getByRole("cell", { name: "82 kg", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Editeaza", exact: true }).click();
  await expect(page.getByLabel("Greutate (kg)", { exact: true })).toHaveValue("82");
  await page.getByLabel("Greutate (kg)", { exact: true }).fill("81");
  await page.getByRole("button", { name: "Salveaza greutatea" }).click();
  await expect(page.getByRole("cell", { name: "81 kg", exact: true })).toBeVisible();
  page.on("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Sterge", exact: true }).click();
  await expect(page.getByRole("button", { name: "Editeaza", exact: true })).toHaveCount(0);
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Conectare", exact: true })).toHaveCount(0);
  await page.getByRole("link", { name: "Profil", exact: true }).last().click();
  await expect(page).toHaveURL(/\/profile$/);
  expect(errors).toEqual([]);
});

test("compact mobile layout and errors preserve unsaved inputs", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await setup(page, true);
  await page.goto("/profile");
  await expect(page.getByLabel("Inaltime (cm)")).toHaveValue("176");
  await page.getByLabel("Inaltime (cm)").fill("180");
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(page.getByLabel("Inaltime (cm)")).toHaveValue("180");
  await page.route("**/api/v1/profile", (route) => route.fulfill({ status: 503, json: { detail: "Serviciu indisponibil" } }));
  await page.getByRole("button", { name: "Salveaza profilul", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Serviciu indisponibil");
  await expect(page.getByLabel("Inaltime (cm)")).toHaveValue("180");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});


test("tabs preserve drafts without additional requests", async ({ page }) => {
  await setup(page, true);
  const reads = [];
  page.on("request", r => { if (r.method() === "GET" && r.url().includes("/api/v1/")) reads.push(r.url()); });
  await page.goto("/profile");
  await expect(page.getByText("Sala: 3 sesiuni", { exact: true })).toBeVisible();
  await expect(page.locator("#profile-panel-energy")).toContainText("Completeaza profilul");
  await page.getByLabel("Inaltime (cm)").fill("181");
  const before = reads.length;
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.getByRole("button", { name: "Energia și activitatea zilnică", exact: true }).click();
    await expect(page.locator("#profile-panel-energy")).toBeVisible();
    await expect(page.locator("#profile-panel-personal")).toBeHidden();
    await page.getByRole("button", { name: "Greutate și progres", exact: true }).click();
    await page.getByLabel("Greutate (kg)", { exact: true }).fill("79.5");
    await page.getByRole("button", { name: "Date personale și obiectiv", exact: true }).click();
    await expect(page.getByLabel("Inaltime (cm)")).toHaveValue("181");
    await page.getByRole("button", { name: "Greutate și progres", exact: true }).click();
    await expect(page.getByLabel("Greutate (kg)", { exact: true })).toHaveValue("79.5");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  expect(reads.length).toBe(before);
});
