const { test, expect } = require("@playwright/test");

const today = "2026-09-26";
const sport = {
  id: 73,
  name: "Sala",
  activity_type: "strength",
  default_duration_minutes: 65,
  default_intensity: "moderate",
  is_system: false,
};

const types = [
  {
    key: "strength",
    label: "Sala / forta",
    category: "strength",
    duration_minutes: 60,
  },
  {
    key: "muay_thai",
    label: "Muay Thai",
    category: "sport",
    duration_minutes: 90,
  },
];

async function mock(page, initialPlans = []) {
  // Mock Firebase auth module for E2E tests.
  await page.route(
    /\/src\/auth\.jsx(?:\?.*)?$/,
    (route) =>
      route.fulfill({
        contentType: "application/javascript",
        body: `
          const user = {
            uid: "test-user",
            email: "ana@example.test",
            getIdToken: async () => "test-token"
          };

          export const auth = {
            currentUser: user
          };

          export const useAuth = () => ({
            user,
            admin: false,
            loading: false
          });

          export const AuthProvider = ({ children }) => children;
        `,
      }),
  );

  const requests = [];

  let observation = null;
  let plans = initialPlans;
  let nextSessionId = 201;

  const makeEnergy = () => {
    const day = {
      day: today,
      available: true,
      mode: observation ? "recorded" : "fallback",
      complete: Boolean(observation?.complete),

      observation,

      resting_kcal: 1790,

      steps: observation?.steps ?? null,

      walking_net_kcal: observation ? 0 : null,

      workout_net_kcal: 0,

      other_baseline_kcal: 179,

      thermic_kcal: 219,

      estimated_kcal: 2188,

      sessions: [],

      training_minutes: 0,

      issues: [],

      stale_weight: false,
    };

    return {
      available: true,

      today: day,

      days: [day],

      week: {
        complete_days: observation?.complete ? 1 : 0,

        average_maintenance_kcal: observation?.complete
          ? 2188
          : null,

        average_steps: observation?.steps ?? null,

        sessions: 0,

        training_minutes: 0,
      },

      coverage: {
        level: observation
          ? "improving"
          : "basic",

        complete_days_28: observation?.complete
          ? 1
          : 0,
      },
    };
  };

  /*
   * Catch every backend API request used by these tests.
   *
   * This prevents Vite from forwarding requests to the real backend
   * while GitHub Actions is running the frontend E2E suite.
   */
  await page.route("**/api/v1/**", async (route) => {
    const req = route.request();

    const url = new URL(req.url());

    const path = url.pathname.replace("/api/v1", "");

    let json;

    if (req.method() !== "GET") {
      requests.push({
        path,
        method: req.method(),
        body: req.postDataJSON(),
      });
    }

    if (path === "/energy") {
      json = makeEnergy();
    } else if (path.startsWith("/daily-activity")) {
      observation =
        req.method() === "DELETE"
          ? null
          : req.postDataJSON();

      json = makeEnergy();
    } else if (path === "/activity-types") {
      json = types;
    } else if (path === "/energy/preview") {
      json = {
        net_kcal: 210,
      };
    } else if (path === "/sport-types") {
      json = [sport];
    } else if (path.endsWith("/exercises")) {
      json = [];
    } else if (path === "/workout-templates") {
      json = [];
    } else if (path === "/workouts") {
      if (req.method() === "POST") {
        plans.push({
          id: nextSessionId++,
          completed: false,
          ...req.postDataJSON(),
        });
      }

      json =
        req.method() === "GET"
          ? plans.filter(plan => plan.day >= url.searchParams.get("start") && plan.day <= url.searchParams.get("end")).map((plan) => ({ ...plan,
              has_completion: Boolean(plan.completed),
              completed: Boolean(plan.completed) && plan.day <= today,
              can_complete: plan.day <= today,
            }))
          : plans.at(-1);
    } else if (/^\/workouts\/\d+\/completion$/.test(path)) {
      const plan = plans.find((item) => item.id === Number(path.split("/")[2]));
      if (req.method() === "DELETE") {
        Object.assign(plan, { completed: false, duration_minutes: null, intensity: null });
        return route.fulfill({ status: 204 });
      }
      Object.assign(plan, req.postDataJSON(), { completed: true });
      json = { id: plan.id, workout_id: plan.id, snapshot: { ...plan } };
    } else if (path === "/profile") {
      json = {
        today,

        profile: {
          sex: "male",
          birth_date: "1997-01-01",
          height_cm: 176,
          activity_level: "sedentary",
          goal: "maintain",
          auto_calories: true,
        },

        weights: [],

        recommendation: {
          available: false,
          reason: "Adauga greutatea",
          options: [],
          warnings: [],
        },

        active_goal: null,

        weight_change_kg: null,
      };
    } else if (path === "/profile/summary") {
      json = {
        sessions: 0,
        sports: [],
        entries: 0,
        logged_days: 0,
        calories: 0,
        average_calories: null,
        average_difference: null,
        days_with_target: 0,
      };
    } else {
      return route.fulfill({
        status: 404,
        json: {
          detail: `Unexpected ${path}`,
        },
      });
    }

    return route.fulfill({
      json,
    });
  });

  return requests;
}

test(
  "daily steps preserve zero, explain model, delete and remain compact on mobile",
  async ({ page }) => {
    await page.setViewportSize({
      width: 390,
      height: 844,
    });

    const errors = [];

    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    const requests = await mock(page);

    await page.goto("/profile");

    /*
     * Activity controls now live in the second profile tab.
     *
     * Previously the test expected "+ Adauga activitate"
     * to be visible immediately after opening /profile.
     */
    await page
      .getByRole("button", {
        name: "Energia și activitatea zilnică",
        exact: true,
      })
      .click();

    await expect(
      page.locator("#profile-panel-energy"),
    ).toBeVisible();

    await page
      .getByRole("button", {
        name: "+ Adauga activitate",
        exact: true,
      })
      .click();

    await page
      .getByRole("button", {
        name: "Mers / pasi",
        exact: true,
      })
      .click();

    await expect(
      page.getByLabel("Pasi inregistrati"),
    ).toBeFocused();

    await page
      .getByLabel("Pasi inregistrati")
      .fill("0");

    await page
      .getByLabel("Ce includ pasii?")
      .selectOption("outside_workouts");

    await page
      .getByLabel("Am completat pasii", {
        exact: false,
      })
      .check();

    await page
      .getByRole("button", {
        name: "Salveaza activitatea zilei",
        exact: true,
      })
      .click();

    await expect(
      page.getByText(
        "1/7 zile complete; minimum 4 pentru planificare",
      ),
    ).toBeVisible();

    const savedActivity = requests.find((request) =>
      request.path.startsWith("/daily-activity"),
    );

    expect(savedActivity).toBeDefined();

    expect(savedActivity.body).toEqual({
      steps: 0,
      steps_scope: "outside_workouts",
      complete: true,
    });

    await page
      .getByText("Cum se calculeaza?", {
        exact: true,
      })
      .click();

    await expect(
      page.getByRole("link", {
        name: "Studiul Mifflin–St Jeor",
      }),
    ).toBeVisible();

    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          window.innerWidth,
      ),
    ).toBe(true);

    page.on("dialog", (dialog) =>
      dialog.accept(),
    );

    await page
      .getByRole("button", {
        name: "Sterge pasii zilei",
      })
      .click();

    await expect(
      page.getByLabel("Pasi inregistrati"),
    ).toHaveValue("");

    expect(errors).toEqual([]);
  },
);

test(
  "duration and intensity are collected only on completion and can be corrected",
  async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const requests = await mock(page);

    await page.goto(
      "/workouts/sessions/new?activity=strength",
    );

    await expect(page.getByLabel("Durata totala (minute)")).toHaveCount(0);
    await expect(page.getByLabel("Intensitate medie")).toHaveCount(0);
    await page.getByLabel("Data", { exact: true }).fill(today);

    await page
      .getByLabel("Sport", {
        exact: true,
      })
      .selectOption("Sala");

    await page
      .getByLabel(
        "Pasi ai sesiunii inclusi in total",
      )
      .fill("0");

    const createdResponse = page.waitForResponse(response =>
      new URL(response.url()).pathname === "/api/v1/workouts" && response.request().method() === "POST");
    await page
      .getByRole("button", {
        name: "Salveaza sesiunea",
        exact: true,
      })
      .click();

    const created = await (await createdResponse).json();
    await expect(page).toHaveURL(new RegExp(`/workouts/sessions\\?day=${today}$`));
    await expect(page.getByLabel("Saptamana care contine")).toHaveValue(created.day);
    const session = page.locator("details").filter({ has: page.locator("summary", { hasText: created.title }) });
    await expect(session.locator("summary time")).toHaveText(created.day);

    const saved = requests.find(
      (request) =>
        request.path === "/workouts" &&
        request.method === "POST",
    );

    expect(saved).toBeDefined();

    const accordion = page.locator("details[name='week-sessions']");
    await expect(accordion).toHaveCount(1);
    await expect(page.getByText("Sesiune fara exercitii individuale.", { exact: true })).toBeHidden();
    await accordion.locator("summary").click();
    await expect(page.getByText("Sesiune fara exercitii individuale.", { exact: true })).toBeVisible();
    await accordion.locator("summary").click();
    await expect(page.getByText("Sesiune fara exercitii individuale.", { exact: true })).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    expect(saved.body).toMatchObject({
      sport_type_id: sport.id,
      day: today,
      activity_type: "strength",
      steps_included: 0,
      exercises: [],
    });
    expect(saved.body).not.toHaveProperty("duration_minutes");
    expect(saved.body).not.toHaveProperty("intensity");

    await page.getByRole("button", { name: "Executat", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate((element) => element.getBoundingClientRect().width <= window.innerWidth)).toBe(true);
    await expect(dialog.getByLabel("Cate minute a durat antrenamentul?")).toHaveValue("");
    await dialog.getByRole("button", { name: "Anuleaza", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    expect(requests.filter((request) => request.path.endsWith("/completion"))).toHaveLength(0);
    await expect(page.getByText("Planificat", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Executat", exact: true }).click();
    // Required fields keep the session planned until both answers are provided.
    await dialog.getByRole("button", { name: "Confirma executarea" }).click();
    await expect(dialog).toBeVisible();
    expect(requests.filter((request) => request.path.endsWith("/completion"))).toHaveLength(0);
    await dialog.getByLabel("Cate minute a durat antrenamentul?").fill("45");
    await dialog.getByLabel("Cum a fost sesiunea?").selectOption("high");
    await dialog.getByRole("button", { name: "Confirma executarea" }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByText("1 / 1 executate", { exact: true })).toBeVisible();
    const completed = requests.find((request) => request.path.endsWith("/completion"));
    expect(completed.body).toEqual({ duration_minutes: 45, intensity: "high" });
    await expect(page.getByText("45 min · Ridicata", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Durata si intensitate" }).click();
    await expect(dialog.getByLabel("Cate minute a durat antrenamentul?")).toHaveValue("45");
    await dialog.getByLabel("Cate minute a durat antrenamentul?").fill("60");
    await dialog.getByLabel("Cum a fost sesiunea?").selectOption("very_high");
    await dialog.getByRole("button", { name: "Salveaza detaliile" }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByText("60 min · Foarte ridicata", { exact: true })).toBeVisible();
    await expect(page.getByText("1 / 1 executate", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Anuleaza", exact: true }).click();
    await expect(page.getByText("Planificat", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Executat", exact: true }).click();
    await expect(dialog.getByLabel("Cate minute a durat antrenamentul?")).toHaveValue("");
    await expect(dialog.getByLabel("Cum a fost sesiunea?")).toHaveValue("");
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  },
);

test("future execution is disabled and legacy future completions can be cancelled", async ({ page }) => {
  const requests = await mock(page, [
    { id: 1, day: today, title: "Azi", sport: "Sala", exercises: [], completed: false },
    { id: 2, day: "2026-09-27", title: "Maine", sport: "Box", exercises: [], completed: false },
    { id: 3, day: "2026-09-27", title: "Executare veche", sport: "Box", exercises: [], completed: true,
      duration_minutes: 60, intensity: "high" },
  ]);
  await page.goto(`/workouts/sessions?day=${today}`);
  const current = page.getByRole("article", { name: `Sesiune Azi din ${today}`, exact: true });
  const future = page.getByRole("article", { name: "Sesiune Maine din 2026-09-27", exact: true });
  await expect(current.getByRole("button", { name: "Executat", exact: true })).toBeEnabled();
  await expect(future.getByRole("button", { name: "Executat", exact: true })).toBeDisabled();
  await expect(future.getByText("Planificat", { exact: true })).toBeVisible();
  await expect(future.getByText(/Executarea va fi disponibila din 2026-09-27/)).toBeVisible();
  const old = page.getByRole("article", { name: "Sesiune Executare veche din 2026-09-27", exact: true });
  await expect(old.getByText("Planificat", { exact: true })).toBeVisible();
  await old.getByRole("button", { name: "Anuleaza", exact: true }).click();
  await expect(old.getByRole("button", { name: "Executat", exact: true })).toBeDisabled();
  expect(requests.filter((request) => request.method === "PUT" && request.path.endsWith("/completion"))).toHaveLength(0);
});
