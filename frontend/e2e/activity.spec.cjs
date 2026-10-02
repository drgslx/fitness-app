const { test, expect } = require("@playwright/test");

const today = "2026-09-26";

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

async function mock(page) {
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
  let plans = [];

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
      json = [
        {
          id: 1,
          name: "Sala",
          activity_type: "strength",
          default_duration_minutes: 65,
          default_intensity: "moderate",
          is_system: false,
        },
      ];
    } else if (path.endsWith("/exercises")) {
      json = [];
    } else if (path === "/workout-templates") {
      json = [];
    } else if (path === "/workouts") {
      if (req.method() === "POST") {
        plans.push({
          id: 1,
          completed: false,
          ...req.postDataJSON(),
        });
      }

      json =
        req.method() === "GET"
          ? plans
          : plans.at(-1);
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
  "activity flow uses the existing session endpoint and one duration",
  async ({ page }) => {
    const requests = await mock(page);

    await page.goto(
      "/workouts/sessions/new?activity=strength",
    );

    await expect(
      page.getByLabel("Durata totala (minute)"),
    ).toHaveValue("60");

    await page
      .getByLabel("Sport", {
        exact: true,
      })
      .selectOption("Sala");

    await expect(
      page.getByLabel("Durata totala (minute)"),
    ).toHaveValue("65");

    await page
      .getByLabel(
        "Pasi ai sesiunii inclusi in total",
      )
      .fill("0");

    await expect(
      page.getByText(
        "~210 kcal active peste repaus — estimare",
      ),
    ).toBeVisible();

    await page
      .getByRole("button", {
        name: "Salveaza sesiunea",
        exact: true,
      })
      .click();

    await expect(page).toHaveURL(
      /\/workouts\/sessions$/,
    );

    const saved = requests.find(
      (request) =>
        request.path === "/workouts" &&
        request.method === "POST",
    );

    expect(saved).toBeDefined();

    expect(saved.body).toMatchObject({
      sport_type_id: 1,
      activity_type: "strength",
      duration_minutes: 65,
      steps_included: 0,
      exercises: [],
    });
  },
);