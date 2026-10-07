// D-038 (c): lo stato dell'utente vive sul server, la memoria locale è solo una copia. Più: niente chiamate a
// funzioni inesistenti (rimosse il 23 set, 66d5bf4, ma ancora chiamate: errore in produzione) e niente dati inventati.
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  diffMap, mapPatch, mealTrackingKey, mealTrackingPatch, patchAppState, readAppState,
} from "../src/serverState.mjs";

assert.equal(mealTrackingKey("2026-10-07"), "meal_tracking:2026-10-07");
assert.deepEqual(diffMap({ a: true, b: true }, { a: true, c: false }), { set: { c: false }, unset: ["b"] });
assert.equal(mealTrackingPatch({ meal_status: { pranzo: "done" }, ingredient_checks: {} }, { pranzo: "done" }, {}), null, "no change = no write");
assert.deepEqual(
  mealTrackingPatch({ meal_status: { pranzo: "done" } }, { pranzo: "done", cena: "skip", bogus: "maybe" }, { "cena:0": true }),
  { meal_status: { set: { cena: "skip" }, unset: [] }, ingredient_checks: { set: { "cena:0": true }, unset: [] } },
  "only server-accepted values are sent",
);
assert.deepEqual(mapPatch({ mele: true }, {}), { replace: {} }, "reset empties the server list");
assert.equal(mapPatch({}, {}), null);

const calls = [];
const fetcher = async (url, init = {}) => {
  calls.push({ url, init });
  if (init.method === "PATCH") return { ok: false, status: 400, json: async () => ({ error: "invalid_value" }) };
  return { ok: true, status: 200, json: async () => ({ values: { planning_day: 2, lang: null } }) };
};
assert.deepEqual(await readAppState({ apiBaseUrl: "https://x", token: "t", keys: ["planning_day", "lang"], fetcher }), { planning_day: 2, lang: null });
assert.match(calls[0].url, /\/api\/app-state\?keys=planning_day%2Clang$/);
await assert.rejects(patchAppState({ apiBaseUrl: "https://x", token: "t", key: "planning_day", body: { value: 9 }, fetcher }), /invalid_value/, "server rejection is an explicit error");
await assert.rejects(readAppState({ apiBaseUrl: "https://x", token: "", keys: ["lang"], fetcher }), /missing_token/);

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const section = (start, end) => { const s = app.indexOf(start); assert.ok(s >= 0, start); const e = app.indexOf(end, s + start.length); assert.ok(e > s, end); return app.slice(s, e); };

// Funzioni inesistenti: nessuna chiamata deve restare.
for (const name of ["saveDubiProfile", "loadDubiProfile", "generateDubiCode", "formatSportLabel", "ownedShoppingKey", "shoppingItemBase"]) {
  assert.ok(!new RegExp(`\\b${name}\\s*\\(`).test(app), `${name} is not defined anywhere: it must not be called`);
}
// Dati inventati: la simulazione dell'anomalia ogni 3 giorni non deve tornare.
assert.ok(!/getDate\(\);\s*\r?\n\s*if \(d % 3 !== 0\) return;/.test(app), "no simulated wearable anomaly");

const today = section("const TodayScreen = (", "const getMealMacroAnomaly");
assert.match(today, /readAppState\(\{ apiBaseUrl: API_BASE_URL, token: getAuthToken\(\), keys: \[key\] \}\)/, "meal tracking loaded from the server");
assert.match(today, /mealTrackingPatch\(server, status, ingChecked\)/, "changes sent to the server as a difference");
assert.match(today, /setMealTrackingReload/, "failed save reloads the server state");
const shopping = section("const ShoppingScreen = (", "// ── Lista personalizzata");
assert.match(shopping, /SHOPPING_CHECKED_KEY/);
assert.match(shopping, /mapPatch\(server, checked\)/);
const workout = section("const TodayWorkoutCard = (", "const applyState = async");
assert.ok(!/dubi_today_training_override_/.test(workout) && !/localStorage/.test(workout), "today training override comes only from the server plan");
const martial = section("const LegacyMartialArtsPrompt = (", "const readDateCompletionState");
assert.match(martial, /MARTIAL_ARTS_PROMPT_SEEN_KEY/);
const dubiApp = section("function DUBIApp() {", "const handleAiPlanRefreshFromProgress");
assert.match(dubiApp, /PLANNING_DAY_KEY/);
assert.match(dubiApp, /LANG_STATE_KEY/);
const settings = section("const SettingsScreen = (", "const navSubtitle");
assert.ok(!/localStorage\.setItem\("dubi_planning_day"/.test(settings), "planning day saved through the server");
assert.match(app, /data-testid="onboarding-save-error"/, "onboarding save failure is shown, not thrown");
console.log(JSON.stringify({ test: "frontend-server-state", failures_total: 0 }, null, 2));
