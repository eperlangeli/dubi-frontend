import assert from "node:assert/strict";
import {
  buildWeeklyPlanCache,
  getMealDisplayModel,
  selectWeeklyPlanForDate,
  shouldFetchWeeklyPlanForDate,
} from "../src/planDisplayModel.mjs";

const slotCases = [
  ["breakfast", "Colazione"],
  ["lunch", "Pranzo"],
  ["snack", "Spuntino"],
  ["dinner", "Cena"],
];

for (const [slotId, slotLabel] of slotCases) {
  const meal = {
    engineVersion: "recipe_engine_v1",
    authoringKey: `v16_${slotId}_recipe`,
    recipeName: `${slotLabel} V16 recipe name`,
    items: [
      { name: `${slotLabel} component A`, quantity: 40, unit: "g" },
      { name: `${slotLabel} component B`, quantity: 60, unit: "g" },
    ],
  };

  const todayDisplay = getMealDisplayModel({
    entry: { id: slotId, label: slotLabel },
    meal,
    fallbackLabel: slotLabel,
  });
  const weeklyDisplay = getMealDisplayModel({
    entry: { id: slotId, label: slotLabel },
    meal,
    fallbackLabel: slotLabel,
  });

  assert.equal(todayDisplay.isV1, true);
  assert.equal(todayDisplay.title, slotLabel);
  assert.equal(todayDisplay.dishName, `${slotLabel} V16 recipe name`);
  assert.equal(todayDisplay.recipeName, `${slotLabel} V16 recipe name`);
  assert.equal(todayDisplay.authoringKey, `v16_${slotId}_recipe`);
  assert.equal(meal.items[0].name, `${slotLabel} component A`);
  assert.equal(meal.items[1].quantity, 60);

  assert.deepEqual(weeklyDisplay, todayDisplay);
  assert.notEqual(todayDisplay.title, todayDisplay.dishName);
}

const legacyDisplay = getMealDisplayModel({
  entry: { id: "snack", label: "Spuntino" },
  meal: {
    items: ["Bowl di yogurt e banana", "Cocco in scaglie", "Semi di lino"],
  },
  fallbackLabel: "Spuntino",
});

assert.equal(legacyDisplay.isV1, false);
assert.equal(legacyDisplay.title, "Spuntino");
assert.equal(legacyDisplay.dishName, "");
assert.equal(legacyDisplay.recipeName, null);
assert.equal(legacyDisplay.authoringKey, null);

const makeV1Plan = (date, recipeName, ingredientName) => ({
  planDate: date,
  ingredientPlan: {
    engine_version: "recipe_engine_v1",
    date,
    meals: [
      {
        mealType: "lunch",
        engine_version: "recipe_engine_v1",
        authoring_key: `v16_${date}`,
        recipe_name: recipeName,
        ingredients: [{ name: ingredientName, quantity_g: 100 }],
      },
    ],
  },
});

const weeklyPlans = [
  makeV1Plan("2026-09-14", "Monday V16 recipe", "Monday component"),
  makeV1Plan("2026-09-15", "Tuesday V16 recipe", "Tuesday component"),
  makeV1Plan("2026-09-16", "Wednesday V16 recipe", "Wednesday component"),
  makeV1Plan("2026-09-17", "Thursday V16 recipe", "Thursday component"),
  makeV1Plan("2026-09-18", "Friday V16 recipe", "Friday component"),
  makeV1Plan("2026-09-19", "Saturday V16 recipe", "Saturday component"),
  makeV1Plan("2026-09-20", "Sunday V16 recipe", "Sunday component"),
];
const staleLegacyCurrentPlan = {
  planDate: "2026-09-14",
  meals: {
    lunch: {
      items: ["Bowl di yogurt e banana", "Cocco in scaglie"],
    },
  },
};
const initialCache = buildWeeklyPlanCache([weeklyPlans[0]], staleLegacyCurrentPlan, "2026-09-14");
assert.equal(initialCache["2026-09-14"].planDate, "2026-09-14");
assert.equal(shouldFetchWeeklyPlanForDate({
  weeklyPlanCache: initialCache,
  selectedDate: "2026-09-14",
  selectedPlan: initialCache["2026-09-14"],
  loadingPlanDates: {},
}), false);
assert.equal(shouldFetchWeeklyPlanForDate({
  weeklyPlanCache: initialCache,
  selectedDate: "2026-09-17",
  selectedPlan: null,
  loadingPlanDates: {},
}), true);
assert.equal(shouldFetchWeeklyPlanForDate({
  weeklyPlanCache: initialCache,
  selectedDate: "2026-09-17",
  selectedPlan: null,
  loadingPlanDates: {"2026-09-17": true},
}), false);

const thursdayPlan = selectWeeklyPlanForDate({
  weeklyPlans,
  selectedDate: "2026-09-17",
  currentPlan: staleLegacyCurrentPlan,
  todayDate: "2026-09-14",
});
assert.equal(thursdayPlan.planDate, "2026-09-17");
assert.equal(thursdayPlan.ingredientPlan.meals[0].recipe_name, "Thursday V16 recipe");
assert.equal(thursdayPlan.ingredientPlan.meals[0].ingredients[0].name, "Thursday component");
assert.notDeepEqual(thursdayPlan, staleLegacyCurrentPlan);

const fetchedCache = {...initialCache, "2026-09-17": thursdayPlan};
assert.equal(shouldFetchWeeklyPlanForDate({
  weeklyPlanCache: fetchedCache,
  selectedDate: "2026-09-17",
  selectedPlan: thursdayPlan,
  loadingPlanDates: {},
}), false);

const fridayPlan = selectWeeklyPlanForDate({
  weeklyPlans,
  selectedDate: "2026-09-18",
  currentPlan: thursdayPlan,
  todayDate: "2026-09-14",
});
assert.equal(fridayPlan.planDate, "2026-09-18");
assert.equal(fridayPlan.ingredientPlan.meals[0].recipe_name, "Friday V16 recipe");
assert.equal(fridayPlan.ingredientPlan.meals[0].ingredients[0].name, "Friday component");
assert.notEqual(fridayPlan.ingredientPlan.meals[0].recipe_name, thursdayPlan.ingredientPlan.meals[0].recipe_name);
assert.equal(shouldFetchWeeklyPlanForDate({
  weeklyPlanCache: fetchedCache,
  selectedDate: "2026-09-18",
  selectedPlan: null,
  loadingPlanDates: {},
}), true);

const refetchedThursday = selectWeeklyPlanForDate({
  weeklyPlans: fetchedCache,
  selectedDate: "2026-09-17",
  currentPlan: staleLegacyCurrentPlan,
  todayDate: "2026-09-14",
});
assert.equal(refetchedThursday.ingredientPlan.meals[0].recipe_name, "Thursday V16 recipe");
assert.equal(refetchedThursday.ingredientPlan.meals[0].ingredients[0].name, "Thursday component");

const missingFuturePlan = selectWeeklyPlanForDate({
  weeklyPlans: [],
  selectedDate: "2026-09-17",
  currentPlan: staleLegacyCurrentPlan,
  todayDate: "2026-09-14",
});
assert.equal(missingFuturePlan, null);

console.log("V1 plan rendering tests passed");
