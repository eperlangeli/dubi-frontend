import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const app = readFileSync(resolve(here, "../src/App.jsx"), "utf8");

const forbiddenClientPaths = [
  "/api/ai/swaps",
  "fetchIngredientSwapsFromBackend",
  "saveIngredientSwapToBackend",
  "applyIngredientSwap",
  "doSwap",
  "getDisplayMealItem",
  "swapOpen",
  "shoppingPrompt",
  "meal.alts",
  "weekly.alts",
  "replacement_ingredient",
];
for (const token of forbiddenClientPaths) {
  assert.equal(app.includes(token), false, `ingredient swap path remains in frontend: ${token}`);
}

assert.equal(/tap an ingredient and choose from the pre-balanced alternatives/i.test(app), false);
assert.equal(/nella schermata piano, tocca un ingrediente/i.test(app), false);
assert.equal(app.includes("optimizeWeeklyPlanQuality"), false);
assert.match(app, /const displayName = splitIngredientDisplay\(item\)\.name;/);
assert.match(app, /onClick=\{\(\)=>setIngModal\(item\)\}/);
assert.match(app, /replaceIngredientPlanMeal\(todayDateKey, change\.mealId\)/);

const obsoleteIngredientSuggestionPhrases = [
  "Can I swap chicken for fish?",
  "Posso sostituire il pollo con il pesce?",
  "Puis-je remplacer le poulet par du poisson ?",
  "Puedo cambiar pollo por pescado?",
  "Kann ich Huhn durch Fisch ersetzen?",
  "هل أستطيع استبدال الدجاج بالسمك؟",
  "Posso trocar frango por peixe?",
  "鸡肉可以换成鱼吗？",
  "鶏肉を魚に替えられますか？",
  "Можно заменить курицу рыбой?",
];
for (const phrase of obsoleteIngredientSuggestionPhrases) {
  assert.equal(app.includes(phrase), false, `obsolete translated ingredient-swap prompt remains: ${phrase}`);
}

const planFixture = {
  engine_version: "recipe_engine_v1",
  meals: [{
    meal_type: "lunch",
    authoring_key: "v16_verified_lunch",
    ingredients: [{ ingredient_id: 44, ingredient_name: "Merluzzo", selected_quantity_g: 150 }],
  }],
};
const staleSwapRows = [{ swap_key: "0-pranzo-0", replacement_ingredient: "Tahina - 15 g" }];
const renderedIngredients = planFixture.meals.flatMap((meal) => meal.ingredients);
assert.deepEqual(renderedIngredients, [{
  ingredient_id: 44,
  ingredient_name: "Merluzzo",
  selected_quantity_g: 150,
}]);
assert.equal(renderedIngredients.some((item) => staleSwapRows.some((row) => row.replacement_ingredient === item.ingredient_name)), false);

console.log(JSON.stringify({
  test: "v1-ingredient-swaps-disabled",
  client_swap_paths: "removed",
  displayed_plan_source: "recipe ingredients only",
  historical_swap_fixture: "ignored",
  meal_replacement_route: "preserved",
  failures_total: 0,
}, null, 2));
