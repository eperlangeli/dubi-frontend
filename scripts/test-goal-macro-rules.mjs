// D-017a / D-033: l'anteprima dell'app usa gli stessi valori del backend.
// BACKEND_VALUES è una copia fissa di dubi-backend config/goal-macro-rules.js (approvata da
// Francesco il 6 ott 2026). Se il backend cambia, si aggiornano insieme backend, app e questa copia.
// Con il repo backend accanto (../dubi-backend-git) il test confronta anche il file vero.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import {
  GOAL_MACRO_RULES, FAT_FRACTION_RANGE, ADULT_SCREENING, PRACTICAL_MIN_CARBS_G,
  requireGoal, bodyMassIndex, toAppGoalStrict, toBackendGoalStrict, goalCalories, goalMacros, maxDailyDeficitKcal, weeklyLossFromProjection,
} from "../src/goalMacroRules.mjs";
import { calculateProfileCalorieTarget } from "../src/planEnergy.mjs";

const BACKEND_VALUES = {
  fat_loss: { calorieMultiplier: 0.8, proteinPerKg: 2.2, carbFraction: 0.40, deficit: true },
  definition: { calorieMultiplier: 0.9, proteinPerKg: 2.2, carbFraction: 0.45, deficit: true },
  gain: { calorieMultiplier: 1.15, proteinPerKg: 1.6, carbFraction: 0.50, deficit: false },
  maintenance: { calorieMultiplier: 1, proteinPerKg: 1.6, carbFraction: 0.45, deficit: false },
};
const BACKEND_FAT_RANGE = { min: 0.25, max: 0.35 };
const BACKEND_SCREENING = { bmi_full_block_below: 17, bmi_no_deficit_below: 18.5, max_weekly_loss_pct_of_weight: 1.0, kcal_per_kg_body_mass: 7700 };

function checkParity(backendRules, backendFat, backendScreening, label) {
  const frontendByBackendKey = Object.fromEntries(Object.values(GOAL_MACRO_RULES).map((rule) => [rule.backendKey, rule]));
  assert.deepEqual(Object.keys(frontendByBackendKey).sort(), Object.keys(backendRules).sort(), `${label}: goal set`);
  for (const [key, rule] of Object.entries(backendRules)) {
    for (const field of ["calorieMultiplier", "proteinPerKg", "carbFraction", "deficit"]) {
      assert.equal(frontendByBackendKey[key][field], rule[field], `${label}: ${key}.${field}`);
    }
  }
  assert.equal(FAT_FRACTION_RANGE.min, backendFat.min, `${label}: fat min`);
  assert.equal(FAT_FRACTION_RANGE.max, backendFat.max, `${label}: fat max`);
  for (const field of Object.keys(BACKEND_SCREENING)) {
    assert.equal(ADULT_SCREENING[field], backendScreening[field], `${label}: screening ${field}`);
  }
}

checkParity(BACKEND_VALUES, BACKEND_FAT_RANGE, BACKEND_SCREENING, "fixed copy");

let liveBackendChecked = false;
const backendConfig = path.resolve("..", "dubi-backend-git", "config", "goal-macro-rules.js");
if (fs.existsSync(backendConfig)) {
  const backend = createRequire(import.meta.url)(backendConfig);
  checkParity(backend.GOAL_MACRO_RULES, backend.FAT_FRACTION_RANGE, backend.ADULT_SCREENING, "live backend");
  // Ogni alias accettato dal backend porta allo stesso obiettivo nell'app.
  for (const [key, aliases] of Object.entries(backend.GOAL_ALIASES)) {
    for (const alias of aliases) assert.equal(toBackendGoalStrict(alias), key, `alias ${alias}`);
  }
  liveBackendChecked = true;
}

// Dati mancanti = errore esplicito, mai un valore di ripiego.
assert.throws(() => requireGoal(""), { code: "PROFILE_GOAL_MISSING" });
assert.throws(() => requireGoal(null), { code: "PROFILE_GOAL_MISSING" });
assert.throws(() => requireGoal("competition_cut"), { code: "PROFILE_GOAL_UNKNOWN" });
assert.throws(() => bodyMassIndex(70, null), { code: "PROFILE_HEIGHT_MISSING" });
assert.throws(() => bodyMassIndex(undefined, 175), { code: "PROFILE_WEIGHT_MISSING" });
assert.throws(() => goalMacros({ calories: 2000, goal: "maintain", weight: 0 }), { code: "PROFILE_WEIGHT_MISSING" });
assert.throws(() => calculateProfileCalorieTarget({ gender: "male", age: 30, height: null, weight: 80, tdee: 2600, goal: "maintain" }), { code: "PROFILE_HEIGHT_MISSING" });
assert.throws(() => calculateProfileCalorieTarget({ gender: "male", age: 30, height: 180, weight: 80, tdee: 2600, goal: undefined }), { code: "PROFILE_GOAL_MISSING" });

// Mappatura obiettivi: nessun mantenimento di ripiego.
for (const [input, expected] of [["fatLoss", "fatLoss"], ["fat_loss", "fatLoss"], ["Dimagrimento", "fatLoss"], ["muscle_gain", "gain"],
  ["maintenance", "maintain"], ["maintain", "maintain"], ["definizione", "definition"]]) {
  assert.equal(toAppGoalStrict(input), expected, input);
}
for (const input of ["", null, undefined, "null", "boh"]) assert.equal(toAppGoalStrict(input), null, String(input));
assert.equal(toBackendGoalStrict("gain"), "gain");
assert.equal(toBackendGoalStrict("fatLoss"), "fat_loss");

// Percentuali per obiettivo.
assert.equal(goalCalories({ tdee: 2500, goal: "maintain", weight: 75 }).calories, 2500);
assert.equal(goalCalories({ tdee: 2500, goal: "gain", weight: 75 }).calories, 2875);
assert.equal(goalCalories({ tdee: 2500, goal: "definition", weight: 75 }).calories, 2250);
assert.equal(goalCalories({ tdee: 2500, goal: "fatLoss", weight: 75 }).calories, 2000);

// Tetto 1% del peso a settimana: 60 kg -> 0,6 kg x 7700 / 7 = 660 kcal/die.
assert.equal(Math.round(maxDailyDeficitKcal(60)), 660);
const capped = goalCalories({ tdee: 4000, goal: "fatLoss", weight: 60 });
assert.equal(capped.rateCapApplied, true);
assert.equal(capped.calories, 3340);
assert.equal(goalCalories({ tdee: 2500, goal: "fatLoss", weight: 90 }).rateCapApplied, false);

// Macro: proteine g/kg, grassi residui sempre nel 25-35% (salvo minimo pratico dei carboidrati).
for (const goal of Object.keys(GOAL_MACRO_RULES)) {
  for (const weight of [50, 65, 80, 100]) {
    for (const calories of [1600, 2000, 2600, 3200]) {
      const macros = goalMacros({ calories, goal, weight });
      assert.equal(macros.protein, Math.round(weight * GOAL_MACRO_RULES[goal].proteinPerKg));
      const fatShare = (macros.fat * 9) / calories;
      if (macros.carbs > PRACTICAL_MIN_CARBS_G) {
        assert.ok(fatShare >= FAT_FRACTION_RANGE.min - 0.01 && fatShare <= FAT_FRACTION_RANGE.max + 0.01, `${goal} ${weight}kg ${calories}kcal fat ${fatShare}`);
      }
      assert.ok(Math.abs(macros.protein * 4 + macros.carbs * 4 + macros.fat * 9 - calories) <= 9, "energy closes");
    }
  }
}

// Pavimento CAL_01 prevale sull'obiettivo.
const floored = calculateProfileCalorieTarget({ gender: "female", age: 30, height: 160, weight: 55, tdee: 1500, goal: "fatLoss" });
assert.equal(floored.calorieFloor, true);
assert.equal(floored.calories, floored.minCalories);

// Ritmo: dal backend; nessuna stima se manca.
assert.equal(weeklyLossFromProjection({ expected_weekly_change_kg: -0.45 }), 0.45);
assert.equal(weeklyLossFromProjection({ expected_weekly_change_kg: 0.2 }), -0.2);
assert.equal(weeklyLossFromProjection({}), null);
assert.equal(weeklyLossFromProjection(null), null);

console.log(JSON.stringify({ test: "frontend-goal-macro-rules", failures_total: 0, live_backend_checked: liveBackendChecked }, null, 2));
