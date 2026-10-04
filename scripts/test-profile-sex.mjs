import assert from "node:assert/strict";
import fs from "node:fs";
import { normalizeSex } from "../src/normalizeSex.mjs";
import { fallbackTdee, normalizeLegacyGoal } from "../src/nutritionFallback.mjs";
import { calculateProfileCalorieTarget } from "../src/planEnergy.mjs";

const maleFloorCheck = calculateProfileCalorieTarget({
  gender: "male", age: 30, height: 175, weight: 80, tdee: 1800, goal: "fatLoss"
});
assert.equal(maleFloorCheck.minCalories, Math.round(maleFloorCheck.bmr));
assert.equal(maleFloorCheck.calories, Math.round(maleFloorCheck.bmr));

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") { row.push(field); field = ""; }
    else if (char === "\n") { row.push(field.replace(/\r$/, "")); if (row.some(Boolean)) rows.push(row); row = []; field = ""; }
    else field += char;
  }
  if (field || row.length) { row.push(field.replace(/\r$/, "")); rows.push(row); }
  const headers = rows.shift();
  return rows.map((values) => Object.fromEntries(headers.map((key, index) => [key, values[index] ?? ""])));
}

for (const [value, expected] of [["M", "male"], ["m", "male"], ["male", "male"], ["F", "female"], ["f", "female"], ["female", "female"]]) {
  assert.equal(normalizeSex(value), expected);
}
for (const value of ["", null, undefined]) assert.throws(() => normalizeSex(value), { code: "PROFILE_SEX_MISSING" });
for (const value of ["x", "other"]) assert.throws(() => normalizeSex(value), { code: "PROFILE_SEX_INVALID" });
assert.throws(() => fallbackTdee({ gender: null, age: 30, height: 170, weight: 70 }), { code: "PROFILE_SEX_MISSING" });
assert.throws(() => calculateProfileCalorieTarget({ gender: "other", age: 30, height: 170, weight: 70, tdee: 2000, goal: "maintain" }), { code: "PROFILE_SEX_INVALID" });

const csvPath = process.env.DUBI_PROFILE_CSV || "C:\\Users\\perla\\Documents\\DUBI\\export_profili_20261003.csv";
assert.ok(fs.existsSync(csvPath), `private profile CSV must stay outside the repository: ${csvPath}`);
const profiles = parseCsv(fs.readFileSync(csvPath, "utf8"));
assert.equal(profiles.length, 100);

const intensityKcal = {
  light: 250, leggera: 250, low: 250,
  moderate: 450, moderata: 450,
  high: 650, alta: 650,
  very_high: 850, molto_alta: 850
};
const goalAdjustment = { fatLoss: -0.18, maintain: 0, gain: 0.14, definition: -0.14 };
const frontendOldTdee = (profile, gender) => {
  const male = gender === "M" || String(gender).toLowerCase() === "male";
  const bmr = male
    ? 10 * Number(profile.weight) + 6.25 * Number(profile.height) - 5 * Number(profile.age) + 5
    : 10 * Number(profile.weight) + 6.25 * Number(profile.height) - 5 * Number(profile.age) - 161;
  const baseActivity = Math.round(bmr * 0.2);
  const days = Number.parseInt(String(profile.workout_days ?? 0).split("-")[0], 10) || 0;
  const perSession = intensityKcal[String(profile.workout_intensity || "moderate").toLowerCase()] || 450;
  const training = days > 0 ? Math.round((perSession * Math.min(days, 7)) / 7) : 0;
  return Math.round(bmr + baseActivity + training);
};

let backendIndependentFrontendMismatches = 0;
let calculableProfiles = 0;
let incompleteProfiles = 0;
for (const profile of profiles) {
  const sex = normalizeSex(profile.gender);
  const oldGender = profile.gender === "female" || profile.gender === "F" ? "F" : "M";
  const tdeeBefore = frontendOldTdee(profile, oldGender);
  const tdeeAfter = fallbackTdee({
    gender: sex, age: Number(profile.age), height: Number(profile.height), weight: Number(profile.weight),
    workoutDays: profile.workout_days, workoutIntensity: profile.workout_intensity
  });
  const goal = normalizeLegacyGoal(profile.goal) || "maintain";
  const beforeBmr = oldGender === "M"
    ? 10 * Number(profile.weight) + 6.25 * Number(profile.height) - 5 * Number(profile.age) + 5
    : 10 * Number(profile.weight) + 6.25 * Number(profile.height) - 5 * Number(profile.age) - 161;
  const beforeCalories = Math.max(
    Math.round(tdeeBefore * (1 + (goalAdjustment[goal] || 0))),
    Math.round(beforeBmr * 1.0),
    oldGender === "M" ? 1500 : 1200
  );
  const afterCalories = calculateProfileCalorieTarget({
    gender: sex, age: Number(profile.age), height: Number(profile.height), weight: Number(profile.weight), tdee: tdeeAfter, goal
  }).calories;
  if ([Number(profile.age), Number(profile.height), Number(profile.weight)].every((value) => Number.isFinite(value) && value > 0)) calculableProfiles += 1;
  else incompleteProfiles += 1;
  if (!Object.is(beforeCalories, afterCalories)) backendIndependentFrontendMismatches += 1;
}
assert.equal(backendIndependentFrontendMismatches, 0);
console.log(JSON.stringify({
  test: "frontend-profile-sex",
  failures_total: 0,
  accepted_values: 6,
  missing_invalid_values_rejected: 5,
  missing_sex_calorie_calculation_blocked: true,
  real_profiles_checked: profiles.length,
  profiles_with_calculable_calorie_targets: calculableProfiles,
  profiles_without_complete_numeric_inputs: incompleteProfiles,
  calorie_mismatches: backendIndependentFrontendMismatches
}, null, 2));
