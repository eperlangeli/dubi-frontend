import { normalizeSex } from "./normalizeSex.mjs";

export function calculateProfileCalorieTarget({ gender, age, height, weight, tdee, goal }) {
  const sex = normalizeSex(gender);
  const goalAdjustment = { fatLoss: -0.18, maintain: 0, gain: 0.14, definition: -0.14 };
  let calories = Math.round(Number(tdee) * (1 + (goalAdjustment[goal] || 0)));
  const bmr = sex === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  const acsmFloor = sex === "male" ? 1500 : 1200;
  const minCalories = Math.max(Math.round(bmr * 1.1), acsmFloor);
  const calorieFloor = calories < minCalories;
  if (calorieFloor) calories = minCalories;
  return { calories, calorieFloor, minCalories, bmr };
}
