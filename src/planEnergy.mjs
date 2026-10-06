import { normalizeSex } from "./normalizeSex.mjs";
import { goalCalories, requirePositiveNumber } from "./goalMacroRules.mjs";

// Anteprima app: obiettivo (D-017a) con tetto di ritmo (D-033), poi pavimento CAL_01
// (max tra BMR x 1,0 e 1500/1200 kcal), come il backend.
export function calculateProfileCalorieTarget({ gender, age, height, weight, tdee, goal }) {
  const sex = normalizeSex(gender);
  const kg = requirePositiveNumber(weight, "PROFILE_WEIGHT_MISSING", "weight");
  const cm = requirePositiveNumber(height, "PROFILE_HEIGHT_MISSING", "height");
  const years = requirePositiveNumber(age, "PROFILE_AGE_MISSING", "age");
  const { calories: goalTarget, rateCapApplied } = goalCalories({ tdee, goal, weight: kg });
  const bmr = sex === "male"
    ? 10 * kg + 6.25 * cm - 5 * years + 5
    : 10 * kg + 6.25 * cm - 5 * years - 161;
  const acsmFloor = sex === "male" ? 1500 : 1200;
  const minCalories = Math.max(Math.round(bmr * 1.0), acsmFloor);
  const calorieFloor = goalTarget < minCalories;
  const calories = calorieFloor ? minCalories : goalTarget;
  return { calories, calorieFloor, minCalories, bmr, rateCapApplied, goalTarget };
}
