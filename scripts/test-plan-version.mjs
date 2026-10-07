// D-038 (b): versione del piano nell'app. La fonte è il server; l'app ricorda le versioni viste, le manda
// con ogni modifica (expected_version), le ricontrolla e su differenza o 409 mostra il banner in tutte le lingue.
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  PLAN_STALE_COPY_LANGUAGES, PLAN_VERSION_COPY_LANGUAGES, changedPlanDates, getPlanStaleCopy, expectedVersionBody, getPlanUpdatedCopy, isPlanVersionConflict,
  knownPlanVersionRange, notifyPlanVersionConflict, onPlanVersionConflict, rememberPlanVersion, resetPlanVersionsForTest,
} from "../src/planVersion.mjs";

resetPlanVersionsForTest();
assert.deepEqual(expectedVersionBody("2026-10-07"), {}, "no version known = no expected_version (never invented)");
rememberPlanVersion("2026-10-07", 12);
rememberPlanVersion("2026-10-08", "15");
rememberPlanVersion("2026-10-09", undefined);
rememberPlanVersion("not-a-date", 3);
assert.deepEqual(expectedVersionBody("2026-10-07"), { expected_version: 12 });
assert.deepEqual(knownPlanVersionRange(), { from: "2026-10-07", to: "2026-10-08", dates: ["2026-10-07", "2026-10-08"] });
assert.deepEqual(changedPlanDates({ "2026-10-07": 12, "2026-10-08": 15 }), []);
assert.deepEqual(changedPlanDates({ "2026-10-07": 13, "2026-10-08": 15 }), ["2026-10-07"]);
assert.deepEqual(changedPlanDates({ "2026-10-07": 12 }), ["2026-10-08"], "a plan that disappeared counts as changed");
assert.equal(isPlanVersionConflict(409, { error: "PLAN_VERSION_CONFLICT" }), true);
assert.equal(isPlanVersionConflict(409, { error: "PAST_MEALS_CONFIRMATION_REQUIRED" }), false);
let heard = 0;
const off = onPlanVersionConflict(() => { heard += 1; });
notifyPlanVersionConflict({});
off();
notifyPlanVersionConflict({});
assert.equal(heard, 1);

const appLanguages = [...fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8")
  .match(/const LANGUAGES = \[([\s\S]*?)\];/)[1].matchAll(/code:"([a-z]+)"/g)].map((m) => m[1]);
assert.deepEqual([...PLAN_VERSION_COPY_LANGUAGES].sort(), [...appLanguages].sort(), "banner text in every app language");
assert.equal(getPlanUpdatedCopy("it"), "Il tuo piano è stato aggiornato da un altro dispositivo. Tocca per aggiornare.");
assert.throws(() => getPlanUpdatedCopy("xx"), /PLAN_VERSION_COPY_MISSING/);

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const section = (start, end) => { const s = app.indexOf(start); assert.ok(s >= 0, start); return app.slice(s, app.indexOf(end, s)); };
assert.match(section("async function generateIngredientPlan", "const ENGINE_MEAL_TYPE_BY_UI_SLOT"), /\.\.\.expectedVersionBody\(today\)/);
assert.match(section("async function replaceIngredientPlanMeal", "async function previewTodayTrainingState"), /expectedVersionBody\(date\)/);
assert.match(section("async function saveTodayTrainingState", "const fetchCurrentIngredientPlanFromBackend"), /expectedVersionBody\(date\)/);
for (const name of ["async function generateIngredientPlan", "async function replaceIngredientPlanMeal", "async function saveTodayTrainingState", "const saveDailyMealScheduleAnswer"]) {
  assert.match(section(name, "\n}"), /notifyPlanVersionConflict/, `${name} raises the banner on 409`);
}
assert.match(app, /\/plan\/plan-versions\?from=/);
assert.match(app, /setInterval\(checkPlanVersions, PLAN_VERSION_POLL_MS\)/);
assert.match(app, /CapacitorApp\.addListener\("resume", checkPlanVersions\)/);
assert.match(app, /data-testid="plan-updated-elsewhere"/);
// D-038 (d): piano non allineato segnalato dal backend; l'app non lo rigenera aprendolo, lo aggiorna su tocco;
// dopo il cambio dell'allenamento usa il piano già rigenerato dal backend (nessuna seconda rigenerazione).
assert.deepEqual([...PLAN_STALE_COPY_LANGUAGES].sort(), [...appLanguages].sort(), "stale notice in every app language");
for (const lang of PLAN_STALE_COPY_LANGUAGES) {
  const copy = getPlanStaleCopy(lang);
  assert.ok(copy.text && copy.action && copy.failed, `stale copy complete for ${lang}`);
}
assert.match(app, /planStale: ingredientPlan\?\.plan_stale === true,/);
assert.match(app, /<PlanStaleNotice plan=\{plan\} userData=\{userData\} setPlan=\{setPlan\} lang=\{lang\}\/>/);
const staleNotice = section("const PlanStaleNotice", "const TodayScreen");
assert.match(staleNotice, /onClick=\{refresh\}/);
assert.match(staleNotice, /generateIngredientPlan\(\{ date, reason: "plan_stale_refresh" \}\)/);
const applyState = section("const applyState = async", "const persistState = async");
assert.match(applyState, /planAfterServerRefresh\(savedState, todayIso, persistedOverride\)/);
assert.ok(!/generateAiPlanFromBackend\(/.test(applyState), "training change does not regenerate twice");
const refreshHelper = section("async function planAfterServerRefresh", "const fetchCurrentIngredientPlanFromBackend");
for (const status of ["REGENERATED", "STALE_DOUBLE_SESSION", "FAILED", "NO_PLAN"]) assert.match(refreshHelper, new RegExp(status));
assert.match(section("const confirmScheduledTraining = async", "const updateDraft"), /plan_refresh/);
console.log(JSON.stringify({ test: "frontend-plan-version", failures_total: 0 }, null, 2));
