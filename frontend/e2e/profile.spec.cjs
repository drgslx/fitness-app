const { test, expect } = require("@playwright/test");
const today = "2026-09-26";
const baseProfile = {
  sex: "male", birth_date: "1996-01-01", height_cm: 176, activity_level: "moderate",
  goal: "maintain", deficit_percent: 10, surplus_percent: 10, target_weight_kg: null,
  pregnant_or_breastfeeding: false, auto_calories: true, timezone: "Europe/Bucharest",
};
const missing = { available: false, reason: "Completeaza profilul si adauga o greutate masurata.", warnings: [], options: [] };

async function setup(page, existing = false, overrides = {}, mockAuth = true, activity = {}) {
  const state = { today, profile: existing ? { ...baseProfile, ...overrides } : null, weights: [],
    recommendation: missing, active_goal: null, weight_change_kg: null,
    activity_summary: { source: "initial_fallback", activity_level: overrides.activity_level || baseProfile.activity_level,
      eligible_sessions_7: 0, start: "2026-09-20", end: today, min_duration_minutes: 15, ...activity } };
  const requests = [];
  await page.route("**/api/v1/energy", (route) => route.fulfill({ json: { available: false, reason: "Completeaza profilul" } }));
  // Test-only module interception: no authentication bypass exists in application code.
  if (mockAuth) await page.route(/\/src\/auth\.jsx(?:\?.*)?$/, (route) => route.fulfill({ contentType: "application/javascript", body: `
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
      } else {
        state.profile = payload;
        if (state.activity_summary.source === "initial_fallback") state.activity_summary.activity_level = payload.activity_level;
      }
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
  await page.getByLabel("Nivel de activitate ales manual").selectOption("light");
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
  await expect(page.getByRole("button", { name: "Editeaza profilul", exact: true })).toBeVisible();
  await expect(page.getByLabel("Obiectiv", { exact: true })).toBeDisabled();
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
  await expect(page.getByLabel("Inaltime (cm)")).toBeDisabled();
  await page.getByRole("button", { name: "Editeaza profilul", exact: true }).click();
  await page.getByLabel("Obiectiv", { exact: true }).selectOption("lose");
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(page.getByLabel("Obiectiv", { exact: true })).toHaveValue("lose");
  await page.route("**/api/v1/profile", (route) => route.fulfill({ status: 503, json: { detail: "Serviciu indisponibil" } }));
  await page.getByRole("button", { name: "Salveaza profilul", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Serviciu indisponibil");
  await expect(page.getByLabel("Obiectiv", { exact: true })).toHaveValue("lose");
  await expect(page.getByRole("button", { name: "Salveaza profilul", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});


test("tabs preserve drafts without additional requests", async ({ page }) => {
  await setup(page, true);
  const reads = [];
  page.on("request", r => { if (r.method() === "GET" && r.url().includes("/api/v1/")) reads.push(r.url()); });
  await page.goto("/profile");
  await expect(page.getByText("Sala: 3 sesiuni", { exact: true })).toBeVisible();
  await expect(page.locator("#profile-panel-energy")).toContainText("Completeaza profilul");
  await page.getByRole("button", { name: "Editeaza profilul", exact: true }).click();
  await page.getByLabel("Obiectiv", { exact: true }).selectOption("gain");
  const before = reads.length;
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.getByRole("button", { name: "Energia și activitatea zilnică", exact: true }).click();
    await expect(page.locator("#profile-panel-energy")).toBeVisible();
    await expect(page.locator("#profile-panel-personal")).toBeHidden();
    await page.getByRole("button", { name: "Greutate și progres", exact: true }).click();
    await page.getByLabel("Greutate (kg)", { exact: true }).fill("79.5");
    await page.getByRole("button", { name: "Date personale și obiectiv", exact: true }).click();
    await expect(page.getByLabel("Obiectiv", { exact: true })).toHaveValue("gain");
    await page.getByRole("button", { name: "Greutate și progres", exact: true }).click();
    await expect(page.getByLabel("Greutate (kg)", { exact: true })).toHaveValue("79.5");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  expect(reads.length).toBe(before);
});

test("saved adult profile locks personal data and cancel restores the saved goal", async ({ page }) => {
  const requests = await setup(page, true);
  await page.goto("/profile");
  await expect(page.getByRole("button", { name: "Editeaza profilul", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Salveaza profilul", exact: true })).toHaveCount(0);
  await page.screenshot({ path: test.info().outputPath("profile-readonly.png"), fullPage: true });
  await page.getByRole("button", { name: "Editeaza profilul", exact: true }).click();
  for (const label of ["Sex folosit in calcul", "Data nasterii", "Inaltime (cm)"])
    await expect(page.getByLabel(label)).toBeDisabled();
  await page.getByLabel("Obiectiv", { exact: true }).selectOption("lose");
  await page.getByLabel("Deficit caloric").selectOption("15");
  await page.getByRole("button", { name: "Anuleaza", exact: true }).click();
  await expect(page.getByLabel("Obiectiv", { exact: true })).toHaveValue("maintain");
  await expect(page.getByLabel("Obiectiv", { exact: true })).toBeDisabled();
  expect(requests).toEqual([]);
  await page.getByRole("button", { name: "Editeaza profilul", exact: true }).click();
  await page.getByLabel("Obiectiv", { exact: true }).selectOption("gain");
  await page.getByLabel("Surplus caloric").selectOption("15");
  await page.getByLabel("Sarcina sau alaptare", { exact: false }).check();
  await page.getByLabel("Sincronizeaza automat tinta calorica in jurnal").uncheck();
  await page.getByRole("button", { name: "Salveaza profilul", exact: true }).click();
  await expect(page.getByRole("button", { name: "Editeaza profilul", exact: true })).toBeVisible();
  expect(requests[0].payload).toMatchObject({ ...baseProfile, goal: "gain", surplus_percent: 15, pregnant_or_breastfeeding: true, auto_calories: false });
});

test("a minor can update height while identity stays locked", async ({ page }) => {
  const requests = await setup(page, true, { birth_date: "2010-09-26" });
  await page.goto("/profile");
  await expect(page.getByLabel("Inaltime (cm)")).toBeDisabled();
  await page.getByRole("button", { name: "Editeaza profilul", exact: true }).click();
  await expect(page.getByLabel("Inaltime (cm)")).toBeEnabled();
  await expect(page.getByLabel("Data nasterii")).toBeDisabled();
  await expect(page.getByLabel("Nivel de activitate ales manual")).toBeEnabled();
  await page.getByLabel("Inaltime (cm)").fill("180");
  await page.getByRole("button", { name: "Salveaza profilul", exact: true }).click();
  await expect(page.getByRole("button", { name: "Editeaza profilul", exact: true })).toBeVisible();
  expect(requests[0].payload).toMatchObject({ birth_date: "2010-09-26", height_cm: 180 });
});

test("height becomes locked on the eighteenth birthday", async ({ page }) => {
  await setup(page, true, { birth_date: "2008-09-26" });
  await page.goto("/profile");
  await page.getByRole("button", { name: "Editeaza profilul", exact: true }).click();
  await expect(page.getByLabel("Inaltime (cm)")).toBeDisabled();
});

test("manual activity can be saved without eligible sessions and identity stays locked", async ({ page }) => {
  const requests = await setup(page, true);
  await page.goto("/profile");
  await page.getByRole("button", { name: "Editeaza profilul", exact: true }).click();
  await expect(page.getByLabel("Nivel de activitate ales manual")).toBeEnabled();
  await expect(page.getByLabel("Sex folosit in calcul")).toBeDisabled();
  await expect(page.getByLabel("Data nasterii")).toBeDisabled();
  await expect(page.getByLabel("Inaltime (cm)")).toBeDisabled();
  await expect(page.getByLabel("Activitatea din ultimele 7 zile")).toContainText("0 antrenamente finalizate de peste 15 minute");
  await page.getByLabel("Nivel de activitate ales manual").selectOption("high");
  await page.getByRole("button", { name: "Salveaza profilul", exact: true }).click();
  await expect(page.getByRole("button", { name: "Editeaza profilul", exact: true })).toBeVisible();
  await expect(page.getByLabel("Nivel de activitate ales manual")).toHaveValue("high");
  await expect(page.getByLabel("Activitatea din ultimele 7 zile")).toContainText("Nivel ales manual: Foarte activ");
  expect(requests[0].payload).toMatchObject({ ...baseProfile, activity_level: "high" });
});

test("automatic session level locks activity without replacing saved manual preference", async ({ page }) => {
  const requests = await setup(page, true, { activity_level: "high" }, true, {
    source: "sessions", activity_level: "light", eligible_sessions_7: 2,
  });
  await page.goto("/profile");
  await page.getByRole("button", { name: "Editeaza profilul", exact: true }).click();
  await expect(page.getByLabel("Nivel de activitate ales manual")).toBeDisabled();
  await expect(page.getByLabel("Nivel de activitate ales manual")).toHaveValue("high");
  const summary = page.getByLabel("Activitatea din ultimele 7 zile");
  await expect(summary).toContainText("Nivel stabilit automat: Usor activ — 1–2 antrenamente");
  await expect(summary).toContainText("2 antrenamente finalizate de peste 15 minute");
  await expect(summary).toContainText("2026-09-20 – 2026-09-26");
  await expect(page.getByText("Baza: nivelul stabilit dupa antrenamentele din ultimele 7 zile", { exact: true })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: test.info().outputPath("profile-automatic-activity.png"), fullPage: true });
  await page.getByLabel("Obiectiv", { exact: true }).selectOption("gain");
  await page.getByRole("button", { name: "Salveaza profilul", exact: true }).click();
  await expect(page.getByRole("button", { name: "Editeaza profilul", exact: true })).toBeVisible();
  expect(requests[0].payload.activity_level).toBe("high");
  expect(requests[0].payload.goal).toBe("gain");
});

test("daily activity average remains the recommendation source ahead of session classification", async ({ page }) => {
  await setup(page, true);
  await page.route("**/api/v1/profile", route => route.fulfill({ json: {
    today, profile: baseProfile, weights: [], active_goal: null,
    recommendation: { ...missing, maintenance_source: "activity_average" },
    activity_summary: { source: "sessions", activity_level: "light", eligible_sessions_7: 2,
      start: "2026-09-20", end: today, min_duration_minutes: 15 },
    edit_permissions: { sex: false, birth_date: false, height_cm: false, activity_level: false, goal: true },
  } }));
  await page.goto("/profile");
  await expect(page.getByLabel("Activitatea din ultimele 7 zile")).toContainText("Nivel stabilit automat: Usor activ");
  await expect(page.getByText("Baza: media activitatii inregistrate", { exact: true })).toBeVisible();
  await expect(page.getByText("Baza: nivelul stabilit dupa antrenamentele din ultimele 7 zile", { exact: true })).toHaveCount(0);
});

test("manual activity becomes editable again when the seven day session window empties", async ({ page }) => {
  await setup(page, true, { activity_level: "high" }, true, {
    source: "sessions", activity_level: "light", eligible_sessions_7: 2,
  });
  await page.goto("/profile");
  await page.getByRole("button", { name: "Editeaza profilul", exact: true }).click();
  await expect(page.getByLabel("Nivel de activitate ales manual")).toBeDisabled();
  await page.route("**/api/v1/profile", route => route.fulfill({ json: {
    today, profile: { ...baseProfile, activity_level: "high" }, weights: [],
    recommendation: missing, active_goal: null,
    activity_summary: { source: "initial_fallback", activity_level: "high", eligible_sessions_7: 0,
      start: "2026-09-20", end: today, min_duration_minutes: 15 },
    edit_permissions: { sex: false, birth_date: false, height_cm: false, activity_level: true, goal: true },
  } }));
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(page.getByLabel("Nivel de activitate ales manual")).toBeEnabled();
  await expect(page.getByLabel("Nivel de activitate ales manual")).toHaveValue("high");
  await expect(page.getByLabel("Activitatea din ultimele 7 zile")).toContainText("Nivel ales manual: Foarte activ");
  await expect(page.getByLabel("Data nasterii")).toBeDisabled();
});

test("a new eligible session discards a manual activity draft while preserving the goal draft", async ({ page }) => {
  const requests = await setup(page, true);
  await page.goto("/profile");
  await page.getByRole("button", { name: "Editeaza profilul", exact: true }).click();
  await page.getByLabel("Nivel de activitate ales manual").selectOption("very_high");
  await page.getByLabel("Obiectiv", { exact: true }).selectOption("gain");
  await page.route("**/api/v1/profile", route => {
    if (route.request().method() !== "GET") return route.fallback();
    return route.fulfill({ json: {
      today, profile: baseProfile, weights: [], recommendation: missing, active_goal: null,
      activity_summary: { source: "sessions", activity_level: "light", eligible_sessions_7: 1,
        start: "2026-09-20", end: today, min_duration_minutes: 15 },
      edit_permissions: { sex: false, birth_date: false, height_cm: false, activity_level: false, goal: true },
    } });
  });
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(page.getByLabel("Nivel de activitate ales manual")).toBeDisabled();
  await expect(page.getByLabel("Nivel de activitate ales manual")).toHaveValue("moderate");
  await expect(page.getByLabel("Obiectiv", { exact: true })).toHaveValue("gain");
  await page.getByRole("button", { name: "Salveaza profilul", exact: true }).click();
  await expect(page.getByRole("button", { name: "Editeaza profilul", exact: true })).toBeVisible();
  expect(requests[0].payload).toMatchObject({ activity_level: "moderate", goal: "gain" });
});

async function setupSignup(page, existing = false) {
  const requests = await setup(page, existing, {}, false);
  await page.route(/\/src\/auth\.jsx(?:\?.*)?$/, (route) => route.fulfill({
    contentType: "application/javascript", body: `
      import React from "/node_modules/.vite/deps/react.js";
      let state = { user: null, admin: false, loading: false };
      const listeners = new Set();
      export const auth = { currentUser: null };
      export function setTestUser(user) {
        auth.currentUser = user;
        state = { ...state, user };
        listeners.forEach(listener => listener());
      }
      export const useAuth = () => React.useSyncExternalStore(
        listener => { listeners.add(listener); return () => listeners.delete(listener); },
        () => state
      );
      export const AuthProvider = ({ children }) => children;
    `,
  }));
  await page.route(/\/node_modules\/\.vite\/deps\/firebase_auth\.js(?:\?.*)?$/, (route) => route.fulfill({
    contentType: "application/javascript", body: `
      import { setTestUser } from "/src/auth.jsx";
      function login(action) {
        window.firebaseCalls = [...(window.firebaseCalls || []), action];
        const user = { uid: "signup-user", email: "ana@example.test", getIdToken: async () => "signup-token" };
        setTestUser(user);
        return Promise.resolve({ user });
      }
      export const createUserWithEmailAndPassword = () => login("create");
      export const signInWithEmailAndPassword = () => login("login");
      export const signInWithPopup = () => login("google");
      export class GoogleAuthProvider {}
      export const signOut = async () => setTestUser(null);
    `,
  }));
  return requests;
}

async function fillSignup(page, confirmation = "secret123") {
  await page.goto("/login");
  await page.getByRole("button", { name: "Creeaza un cont", exact: true }).click();
  await page.getByLabel("Email", { exact: true }).fill("ana@example.test");
  await page.getByLabel("Parola", { exact: true }).fill("secret123");
  await page.getByLabel("Confirma parola", { exact: true }).fill(confirmation);
  await page.getByLabel("Sex").selectOption("female");
  await page.getByLabel("Data nasterii").fill("2000-04-14");
  await page.getByLabel("Inaltime (cm)").fill("168");
  await page.getByLabel("Nivel de activitate").selectOption("light");
  await page.getByLabel("Obiectiv", { exact: true }).selectOption("gain");
}

test("signup rejects different passwords before creating a Firebase account", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const requests = await setupSignup(page);
  await fillSignup(page, "different123");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Inregistrare", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveText("Parolele nu coincid.");
  expect(await page.evaluate(() => window.firebaseCalls || [])).toEqual([]);
  expect(requests).toEqual([]);
});

test("signup waits for profile persistence before redirecting after auth changes", async ({ page }) => {
  await setupSignup(page);
  await fillSignup(page);
  await page.screenshot({ path: test.info().outputPath("signup.png"), fullPage: true });
  let captured;
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  await page.route("**/api/v1/profile", async (route) => {
    if (route.request().method() !== "PUT") return route.fallback();
    captured = { payload: route.request().postDataJSON(), token: route.request().headers().authorization };
    await gate;
    await route.fallback();
  });
  await page.getByRole("button", { name: "Inregistrare", exact: true }).click();
  await expect.poll(() => captured).toBeTruthy();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("button", { name: "Se salveaza...", exact: true })).toBeDisabled();
  expect(captured.payload).toMatchObject({ sex: "female", birth_date: "2000-04-14", height_cm: 168, activity_level: "light", goal: "gain", auto_calories: true });
  expect(captured.payload).not.toHaveProperty("password");
  expect(captured.payload).not.toHaveProperty("email");
  expect(captured.token).toBe("Bearer signup-token");
  release();
  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByLabel("Inaltime (cm)")).toHaveValue("168");
  await expect(page.getByLabel("Inaltime (cm)")).toBeDisabled();
  expect(await page.evaluate(() => window.firebaseCalls)).toEqual(["create"]);
});

test("failed signup profile save retries without creating another account", async ({ page }) => {
  const requests = await setupSignup(page);
  await fillSignup(page);
  let first = true;
  await page.route("**/api/v1/profile", (route) => {
    if (route.request().method() === "PUT" && first) {
      first = false;
      return route.fulfill({ status: 503, json: { detail: "Serviciu indisponibil" } });
    }
    return route.fallback();
  });
  await page.getByRole("button", { name: "Inregistrare", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Contul a fost creat, dar profilul nu a putut fi salvat");
  await expect(page).toHaveURL(/\/login$/);
  await page.getByRole("button", { name: "Reincearca salvarea profilului", exact: true }).click();
  await expect(page).toHaveURL(/\/profile$/);
  expect(requests[0].payload).toMatchObject({ sex: "female", height_cm: 168, activity_level: "light", goal: "gain" });
  expect(await page.evaluate(() => window.firebaseCalls)).toEqual(["create"]);
});

test("new Google account opens initial profile setup", async ({ page }) => {
  await setupSignup(page);
  await page.goto("/login");
  await page.getByRole("button", { name: "Continua cu Google", exact: true }).click();
  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByLabel("Sex folosit in calcul")).toBeEnabled();
  await expect(page.getByRole("button", { name: "Salveaza profilul", exact: true })).toBeVisible();
});

test("existing Google account keeps the homepage landing", async ({ page }) => {
  await setupSignup(page, true);
  await page.goto("/login");
  await page.getByRole("button", { name: "Continua cu Google", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
});
