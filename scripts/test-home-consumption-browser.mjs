import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = 4179;
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", String(port)], {
  cwd: process.cwd(),
  stdio: ["ignore", "pipe", "pipe"],
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const waitForServer = async () => {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch (_) {}
    await sleep(125);
  }
  throw new Error("Vite preview did not start");
};

const readMacro = async (page, id) => Number((await page.getByTestId(`${id}-value`).textContent()).match(/[\d.]+/)?.[0] || 0);
const readKcal = async (page) => Number((await page.getByTestId("consumed-kcal").textContent()).match(/[\d.]+/)?.[0] || 0);
const readWidth = async (page, id) => page.getByTestId(`${id}-fill`).evaluate(element => element.style.width);

let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const firstDate = "2026-09-21";
  const secondDate = "2026-09-22";
  const preview = date => `${baseUrl}/?_home_consumption_preview=1&_test_date=${date}`;

  await page.goto(preview(firstDate));
  await page.getByTestId("meal-toggle-colazione").waitFor();
  await page.getByTestId("today-training-question").waitFor();
  assert.equal(await readKcal(page), 0);
  assert.equal(await readMacro(page, "macro-protein"), 0);

  await page.getByTestId("meal-toggle-colazione").click();
  await page.getByTestId("ingredient-check-colazione-0").click();
  assert.equal(await readKcal(page), 228, "real ingredient click must add exact V1 kcal");
  assert.equal(await readMacro(page, "macro-protein"), 8);
  assert.equal(await readMacro(page, "macro-carbs"), 38);
  assert.equal(await readMacro(page, "macro-fat"), 4);
  assert.notEqual(await readWidth(page, "macro-protein"), "0%", "protein bar must visibly advance");
  assert.notEqual(await readWidth(page, "macro-carbs"), "0%", "carb bar must visibly advance");
  assert.notEqual(await readWidth(page, "macro-fat"), "0%", "fat bar must visibly advance");

  await page.getByTestId("ingredient-check-colazione-0").click();
  assert.equal(await readKcal(page), 0, "uncheck must remove kcal immediately");
  assert.equal(await readMacro(page, "macro-protein"), 0);
  assert.equal(await readMacro(page, "macro-carbs"), 0);
  assert.equal(await readMacro(page, "macro-fat"), 0);

  await page.getByTestId("ingredient-check-colazione-0").click();
  await page.getByTestId("meal-done-colazione").click();
  assert.equal(await readKcal(page), 320, "meal done must union ingredients without double counting the checked item");
  assert.equal(await readMacro(page, "macro-protein"), 15);
  assert.equal(await readMacro(page, "macro-carbs"), 48);
  assert.equal(await readMacro(page, "macro-fat"), 7);
  await page.reload();
  await page.getByTestId("meal-toggle-colazione").waitFor();
  assert.equal(await readKcal(page), 320, "reload must hydrate exact completion state");
  assert.equal(await readMacro(page, "macro-protein"), 15);
  await page.getByTestId("meal-toggle-colazione").click();
  await page.getByTestId("ingredient-check-colazione-0").click();
  assert.equal(await readKcal(page), 92, "unchecking one ingredient from a completed meal must remove it immediately");
  assert.equal(await readMacro(page, "macro-protein"), 7);
  await page.getByTestId("ingredient-check-colazione-0").click();
  await page.getByTestId("meal-done-colazione").click();
  assert.equal(await readKcal(page), 320);
  await page.getByTestId("workout-badge-snack").waitFor();
  assert.equal((await page.getByTestId("workout-badge-snack").textContent()).trim(), "PRE WORKOUT");
  assert.equal((await page.getByTestId("workout-badge-cena").textContent()).trim(), "POST WORKOUT");

  await page.goto(preview(secondDate));
  await page.getByTestId("meal-toggle-colazione").waitFor();
  assert.equal(await readKcal(page), 0, "completion state must be isolated by date");
  assert.equal(await readMacro(page, "macro-protein"), 0);

  await page.goto(preview(firstDate));
  await page.getByTestId("meal-toggle-colazione").waitFor();
  assert.equal(await readKcal(page), 320, "returning to the first date must restore only that date's state");

  await page.goto(`${baseUrl}/?_weekly_workout_preview=1&_test_date=${firstDate}`);
  await page.getByTestId("plan-workout-badge-snack").waitFor();
  assert.equal((await page.getByTestId("plan-workout-badge-snack").textContent()).trim(), "PRE WORKOUT");
  assert.equal((await page.getByTestId("plan-workout-badge-cena").textContent()).trim(), "POST WORKOUT");

  const workoutContext = await browser.newContext();
  await workoutContext.addInitScript(() => localStorage.setItem("dubi_auth_token", "browser-test-token"));
  const workoutPage = await workoutContext.newPage();
  let savedOnboarding = null;
  let trainingStatePayload = null;
  let generationPayload = null;
  const responsePlan = {
    date:firstDate,
    engine_version:"recipe_engine_v1",
    generation_status:"SUCCESS",
    meals:[
      {meal_type:"breakfast",recipe_name:"Porridge V16",authoring_key:"preview_breakfast",workout_relation:"NONE",ingredients:[{ingredient_id:1,ingredient_name:"Avena",selected_quantity_g:60,calories:228,protein:8,carbs:38,fat:4}],totalCalories:228,totalMacros:{protein:8,carbs:38,fat:4}},
      {meal_type:"lunch",recipe_name:"Bowl V16",authoring_key:"preview_lunch",workout_relation:"NONE",ingredients:[{ingredient_id:2,ingredient_name:"Riso",selected_quantity_g:80,calories:288,protein:6,carbs:62,fat:1}],totalCalories:288,totalMacros:{protein:6,carbs:62,fat:1}},
      {meal_type:"snack",recipe_name:"Snack V16",authoring_key:"preview_snack",workout_relation:"PRE",ingredients:[{ingredient_id:3,ingredient_name:"Banana",selected_quantity_g:120,calories:107,protein:1.3,carbs:27,fat:.4}],totalCalories:107,totalMacros:{protein:1.3,carbs:27,fat:.4}},
      {meal_type:"dinner",recipe_name:"Cena V16",authoring_key:"preview_dinner",workout_relation:"POST",ingredients:[{ingredient_id:4,ingredient_name:"Merluzzo",selected_quantity_g:180,calories:148,protein:32,carbs:0,fat:2}],totalCalories:148,totalMacros:{protein:32,carbs:0,fat:2}},
    ],
    daySummary:{totalCalories:771,totalProtein:47.3,totalCarbs:127,totalFat:7.4},
  };
  let servedPlan = responsePlan;
  await workoutPage.route("https://dubi-backend.onrender.com/**", async route => {
    const request = route.request();
    const url = request.url();
    if (url.endsWith("/api/onboarding/save")) {
      savedOnboarding = JSON.parse(request.postData() || "{}");
      return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({success:true})});
    }
    if (url.endsWith("/plan/ingredient-plan/training-state")) {
      trainingStatePayload = JSON.parse(request.postData() || "{}");
      return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({
        date:firstDate,
        daily_training_override:trainingStatePayload,
        nutrition_context_stale:true,
      })});
    }
    if (url.endsWith("/plan/ingredient-plan/generate")) {
      generationPayload = JSON.parse(request.postData() || "{}");
      if ((generationPayload.daily_training_override?.sessions || []).length > 1) {
        return route.fulfill({status:409,contentType:"application/json",body:JSON.stringify({error:"RECIPE_ENGINE_V1_DOUBLE_SESSION_RULE_NOT_IMPLEMENTED",controlled_failure:true})});
      }
      const isRest = generationPayload.daily_training_override?.state === "rest";
      servedPlan = {
        ...responsePlan,
        has_training:!isRest,
        daily_training_override:generationPayload.daily_training_override,
        nutrition_context_stale:false,
        meals:responsePlan.meals.map(meal=>isRest?{...meal,workout_relation:"NONE"}:meal),
      };
      return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(servedPlan)});
    }
    if (url.includes(`/plan/ingredient-plan/${firstDate}`)) {
      return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(servedPlan)});
    }
    return route.fulfill({status:404,contentType:"application/json",body:"{}"});
  });
  await workoutPage.goto(preview(firstDate));
  await workoutPage.getByTestId("today-workout-card").waitFor();
  await workoutPage.getByTestId("today-training-question").waitFor();
  await workoutPage.getByTestId("today-training-no").click();
  await workoutPage.getByText("Oggi non ti alleni").waitFor();
  await workoutPage.getByText(/rest day/).waitFor();
  assert.equal(trainingStatePayload?.state,"rest","NO must persist an explicit rest-day override");
  assert.equal(generationPayload?.daily_training_override?.state,"rest");
  assert.equal(await workoutPage.locator('[data-testid^="workout-badge-"]').count(),0,"rest-day regeneration must expose no PRE/POST labels");
  await workoutPage.getByRole("button", {name:"Modifica"}).click();
  await workoutPage.getByLabel("Sport allenamento di oggi 1").selectOption("powerlifting");
  await workoutPage.getByLabel("Orario allenamento di oggi 1").fill("20:00");
  await workoutPage.getByLabel("Durata allenamento di oggi 1").fill("75");
  await workoutPage.getByTestId("save-today-workout").click();
  await workoutPage.getByText("20:00 · 75 min").waitFor();
  assert.equal(trainingStatePayload?.sessions?.[0]?.start_time, "20:00", "exact edited start time must reach daily override payload");
  assert.equal(trainingStatePayload?.sessions?.[0]?.duration_min, 75, "exact edited duration must reach daily override payload");
  assert.equal(trainingStatePayload?.sessions?.[0]?.sport_id, "powerlifting");
  assert.equal(savedOnboarding, null, "Modifica solo oggi must not silently change the weekly routine");
  assert.equal(generationPayload?.date, firstDate, "workout edit must regenerate the affected exact date");
  assert.equal(generationPayload?.daily_training_override?.state, "training");

  await workoutPage.getByRole("button", {name:"Modifica"}).click();
  await workoutPage.getByTestId("add-today-workout").click();
  await workoutPage.getByLabel("Sport allenamento di oggi 2").selectOption("running");
  await workoutPage.getByLabel("Orario allenamento di oggi 2").fill("22:00");
  await workoutPage.getByLabel("Durata allenamento di oggi 2").fill("30");
  await workoutPage.getByTestId("save-today-workout").click();
  await workoutPage.getByText(/Sessions saved/).waitFor();
  assert.equal(trainingStatePayload?.sessions?.length,2,"two independent daily sessions must be persisted");
  assert.equal(trainingStatePayload?.sessions?.[1]?.sport_id,"running","daily session 2 must preserve the selected secondary sport");
  assert.equal(generationPayload?.daily_training_override?.sessions?.length,2,"multi-session generation must receive both sessions before controlled fail-closed");
  await workoutContext.close();

  console.log("Home real browser consumption test passed");
} finally {
  await browser?.close();
  server.kill();
}
