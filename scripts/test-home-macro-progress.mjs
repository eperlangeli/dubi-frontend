import assert from "node:assert/strict";
import {
  effectiveCompletedIngredientKeys,
  getIngredientMacroContribution,
  macroProgressPercent,
  sumCompletedIngredientMacros,
} from "../src/planConsumptionModel.mjs";

const chicken = {
  checkKey: "lunch:0:2",
  ingredient_name: "Fesa di tacchino",
  selected_quantity_g: 150,
  calories: 165,
  protein: 34.5,
  carbs: 0,
  fat: 2.1,
};

const rice = {
  checkKey: "lunch:1:34",
  ingredient_name: "Riso basmati",
  selected_quantity_g: 80,
  calories: 288,
  protein: 6.1,
  carbs: 62.4,
  fat: 0.7,
};

const targets = {
  protein: 120,
  carbs: 250,
  fat: 70,
};

assert.deepEqual(
  sumCompletedIngredientMacros([chicken, rice], new Set()),
  { calories: 0, protein: 0, carbs: 0, fat: 0 },
  "start state has zero consumed macros"
);

const proteinOnly = sumCompletedIngredientMacros([chicken, rice], new Set([chicken.checkKey]));
assert.equal(proteinOnly.protein, 34.5, "protein-heavy ingredient contributes exact planned protein");
assert.equal(proteinOnly.carbs, 0, "protein-heavy ingredient does not add unrelated carbs");
assert.equal(proteinOnly.fat, 2.1, "protein-heavy ingredient contributes its own fat only");

const proteinAndCarb = sumCompletedIngredientMacros([chicken, rice], new Set([chicken.checkKey, rice.checkKey]));
assert.equal(proteinAndCarb.protein, 40.6, "second completed ingredient adds protein once");
assert.equal(proteinAndCarb.carbs, 62.4, "carb-heavy ingredient contributes exact planned carbs");
assert.equal(proteinAndCarb.fat, 2.8, "fat sums from completed ingredients only");

const carbOnly = sumCompletedIngredientMacros([chicken, rice], new Set([rice.checkKey]));
assert.equal(carbOnly.protein, 6.1, "unchecking first ingredient removes its protein contribution");
assert.equal(carbOnly.carbs, 62.4, "remaining checked ingredient persists after state reload");

assert.equal(macroProgressPercent(proteinAndCarb.protein, targets.protein), 34);
assert.equal(macroProgressPercent(proteinAndCarb.carbs, targets.carbs), 25);
assert.equal(macroProgressPercent(160, targets.protein), 100, "visual progress caps at 100%");

assert.deepEqual(
  getIngredientMacroContribution({ protein_g: 12.34, carbs_g: 56.78, fat_g: 9.01, fiber_g: 2.22, kcal: 350.4 }),
  { calories: 350, protein: 12.3, carbs: 56.8, fat: 9, fiber: 2.2 },
  "V1/API alias fields normalize to the same macro contribution shape"
);

const breakfastItems = [
  { checkKey: "breakfast:0:egg", mealId: "breakfast", protein: 15, carbs: 20, fat: 8, calories: 210 },
];
const lunchItems = [
  { checkKey: "lunch:0:chicken", mealId: "lunch", protein: 35, carbs: 0, fat: 3, calories: 170 },
  { checkKey: "lunch:1:rice", mealId: "lunch", protein: 6, carbs: 60, fat: 1, calories: 280 },
];
const dinnerItems = [
  { checkKey: "dinner:0:cod", mealId: "dinner", protein: 28, carbs: 0, fat: 2, calories: 130 },
];
const dayItems = [...breakfastItems, ...lunchItems, { checkKey: "snack:0:fruit", mealId: "snack", protein: 1, carbs: 25, fat: 0, calories: 100 }, ...dinnerItems];

const twoDoneMealKeys = effectiveCompletedIngredientKeys({
  items: dayItems,
  explicitCompleted: {},
  mealStatus: { breakfast: "done", lunch: "done" },
});
const twoDoneMeals = sumCompletedIngredientMacros(dayItems, twoDoneMealKeys);
const twoDoneMealCount = ["breakfast", "lunch", "snack", "dinner"].filter((mealId) => (
  { breakfast: "done", lunch: "done" }[mealId] === "done"
)).length;
assert.equal(twoDoneMealKeys.size, 3, "two completed meals mark their ingredients effectively complete");
assert.equal(macroProgressPercent(twoDoneMealCount, 4), 50, "meal completion circle can show 2/4 while macros use effective ingredients");
assert.equal(twoDoneMeals.protein, 56, "meal-level Mangiato contributes breakfast and lunch macros without ingredient checkbox writes");

const lunchOnlyKeys = effectiveCompletedIngredientKeys({
  items: dayItems,
  explicitCompleted: {},
  mealStatus: { breakfast: "skip", lunch: "done" },
});
assert.equal(sumCompletedIngredientMacros(dayItems, lunchOnlyKeys).protein, 41, "unmarking breakfast removes its effective macro contribution");

const mixedKeys = effectiveCompletedIngredientKeys({
  items: dayItems,
  explicitCompleted: { "lunch:0:chicken": true },
  mealStatus: { lunch: "done" },
});
assert.equal(sumCompletedIngredientMacros(dayItems, mixedKeys).protein, 41, "meal done plus explicit ingredient completion does not double count");

console.log("Home macro progress tests passed");
