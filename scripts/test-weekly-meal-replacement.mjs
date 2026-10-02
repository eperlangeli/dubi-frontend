import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  getMealReplacementErrorKey,
  isSupportedPlanChange,
  replaceMealAndCommit,
} from "../src/meal-replacement.mjs";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const moduleSource = await readFile(new URL("../src/meal-replacement.mjs", import.meta.url), "utf8");
const failures = [];
const check = async (name, fn) => {
  try {
    await fn();
  } catch (error) {
    failures.push({ name, error: error.message });
  }
};

await check("weekly_card_opens_confirmation", () => {
  assert.match(app, /data-testid=\{[^}]*weekly-replace-meal-[^}]*\}/);
  assert.match(app, /setReplaceMealDialog\(\{ date: selectedDate, mealId: engineMealType, label \}\)/);
  assert.match(app, /role="dialog" aria-modal="true"[^>]*data-testid="weekly-replace-confirmation"/);
  assert.match(app, /weekly\.replace\.description/);
});

await check("confirmation_uses_shared_request_normalize_commit_path", () => {
  assert.match(app, /replaceIngredientPlanMeal\(date, mealId\)/);
  assert.match(app, /requestReplacement: replaceIngredientPlanMeal/);
  assert.match(app, /mapPlan: mapIngredientPlanToFrontend/);
  assert.match(app, /await replaceMealAndCommit\(/);
  assert.match(app, /plan\/ingredient-plan\/replace-meal/);
  assert.match(moduleSource, /const payload = await requestReplacement\(date, mealId\);[\s\S]*const updatedPlan = mapPlan\(payload, userData\);[\s\S]*commitPlan\(updatedPlan\);/);
});

await check("confirm_posts_selected_date_and_meal_type_and_commits_only_success", async () => {
  let committed = null;
  let request;
  const payload = { date: "2026-10-04", engine_version: "recipe_engine_v1" };
  const mapped = { date: payload.date, meals: [{ meal_type: "dinner", recipe_name: "Safe complete recipe" }] };
  const result = await replaceMealAndCommit({
    date: "2026-10-04",
    mealId: "dinner",
    userData: { dietaryStyle: "omnivore" },
    requestReplacement: async (date, mealType) => {
      request = { date, mealType };
      return payload;
    },
    mapPlan: (raw) => {
      assert.equal(raw, payload);
      return mapped;
    },
    commitPlan: (next) => { committed = next; },
  });
  assert.deepEqual(request, { date: "2026-10-04", mealType: "dinner" });
  assert.equal(result, mapped);
  assert.equal(committed, mapped);
});

await check("frozen_and_no_safe_match_fail_without_plan_mutation", async () => {
  for (const [error, expectedKey] of [
    [{ code: "FROZEN_MEAL_CANNOT_BE_REPLACED" }, "plan.error.frozenMeal"],
    [{ code: "RECIPE_ENGINE_V1_NO_SAFE_MATCH", payload: { generation_status: "NO_SAFE_MATCH" } }, "plan.error.noSafeMatch"],
  ]) {
    let commitCount = 0;
    await assert.rejects(replaceMealAndCommit({
      date: "2026-10-04",
      mealId: "dinner",
      userData: {},
      requestReplacement: async () => { throw error; },
      mapPlan: (raw) => raw,
      commitPlan: () => { commitCount += 1; },
    }));
    assert.equal(getMealReplacementErrorKey(error), expectedKey);
    assert.equal(commitCount, 0);
  }
  assert.match(app, /getMealReplacementErrorKey\(error\)/);
});

await check("no_client_frozen_state_inference", () => {
  const handler = app.match(/const confirmMealReplacement = useCallback\(async \(\) => \{([\s\S]*?)\n  \}, \[replaceMealDialog/);
  assert(handler, "weekly confirmation handler exists");
  assert.doesNotMatch(handler[1], /readDateCompletionState|localStorage|status\[/);
});

await check("only_server_supported_plan_change_actions_take_effect", () => {
  const obsolete = [
    ["skip", "meal"].join("_"),
    ["light", "day"].join("_"),
    ["restaurant", "note"].join("_"),
    ["regenerate", "plan"].join("_"),
    ["profile", "change"].join("_"),
    ["allergy", "change"].join("_"),
    ["goal", "change"].join("_"),
    ["shift", "times"].join("_"),
  ];
  for (const action of obsolete) assert.equal(isSupportedPlanChange({ action }), false, action);
  assert.equal(isSupportedPlanChange({ action: "replace_meal" }), true);
  assert.equal(isSupportedPlanChange({ action: "open_settings" }), true);
  assert.match(app, /const settingsActions = \["open_settings"\]/);
  assert.match(app, /if \(!isSupportedPlanChange\(planChange\)\) return/);
  for (const action of obsolete) assert.equal(moduleSource.includes(action), false, action);
});

await check("translations_cover_all_ten_locales", () => {
  for (const key of [
    "weekly.replace.button", "weekly.replace.title", "weekly.replace.description",
    "weekly.replace.confirm", "weekly.replace.cancel", "weekly.replace.loading",
    "weekly.replace.success", "weekly.replace.frozen", "weekly.replace.noSafe", "weekly.replace.error",
  ]) {
    assert.equal(app.split(`"${key}":`).length - 1, 10, key);
  }
  assert.match(app, /const ASK_DUBI_SUPPORTED_SUGGESTIONS = \{[\s\S]*?ru:[\s\S]*?\};/);
});

await check("no_obsolete_frontend_action_branches_or_prompts", () => {
  for (const obsolete of [
    ["skip", "meal"].join("_"), ["light", "day"].join("_"), ["restaurant", "note"].join("_"),
    ["regenerate", "plan"].join("_"), ["profile", "change"].join("_"), ["allergy", "change"].join("_"),
    ["goal", "change"].join("_"), ["shift", "times"].join("_"),
  ]) assert.equal(app.includes(obsolete), false, obsolete);
  assert.doesNotMatch(app, /I woke up late, skipping breakfast|Can't have lunch today|salto la colazione|Non riesco a fare pranzo oggi/);
});

console.log(JSON.stringify({
  test: "weekly-meal-replacement",
  cases: [
    "weekly_card_opens_confirmation",
    "confirmation_uses_shared_request_normalize_commit_path",
    "confirm_posts_selected_date_and_meal_type_and_commits_only_success",
    "frozen_and_no_safe_match_fail_without_plan_mutation",
    "no_client_frozen_state_inference",
    "only_server_supported_plan_change_actions_take_effect",
    "translations_cover_all_ten_locales",
    "no_obsolete_frontend_action_branches_or_prompts",
  ].map((name) => ({ name, result: failures.some((failure) => failure.name === name) ? "FAIL" : "PASS" })),
  failures,
  failures_total: failures.length,
}, null, 2));

if (failures.length) process.exitCode = 1;
