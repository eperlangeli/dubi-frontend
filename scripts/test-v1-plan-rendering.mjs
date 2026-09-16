import assert from "node:assert/strict";
import {
  buildWeeklyPlanCache,
  cacheWeeklyPlanFetchResult,
  finishWeeklyPlanLoading,
  getMealDisplayModel,
  getWeeklyPlanFetchDate,
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
  assert.equal(todayDisplay.workoutLabel, null);
  assert.equal(todayDisplay.workoutBadgeText, null);
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

const preWorkoutDisplay = getMealDisplayModel({
  entry: { id: "pre_workout", label: "Pre workout" },
  meal: {
    engineVersion: "recipe_engine_v1",
    authoringKey: "v16_pre_workout_recipe",
    recipeName: "Cream of rice with banana",
    workout_relation: "PRE",
    items: [{ name: "Crema di riso", quantity: 50, unit: "g" }],
  },
  fallbackLabel: "Pre workout",
});
assert.equal(preWorkoutDisplay.title, "Pre workout");
assert.equal(preWorkoutDisplay.dishName, "Cream of rice with banana");
assert.equal(preWorkoutDisplay.workoutLabel, "PRE");
assert.equal(preWorkoutDisplay.workoutBadgeText, "PRE WORKOUT");

const postWorkoutDisplay = getMealDisplayModel({
  entry: { id: "post_workout", label: "Post workout" },
  meal: {
    engineVersion: "recipe_engine_v1",
    authoringKey: "v16_post_workout_recipe",
    recipeName: "Rice and cod bowl",
    workoutRelation: "POST",
    items: [{ name: "Merluzzo", quantity: 150, unit: "g" }],
  },
  fallbackLabel: "Post workout",
});
assert.equal(postWorkoutDisplay.title, "Post workout");
assert.equal(postWorkoutDisplay.dishName, "Rice and cod bowl");
assert.equal(postWorkoutDisplay.workoutLabel, "POST");
assert.equal(postWorkoutDisplay.workoutBadgeText, "POST WORKOUT");

const noneWorkoutDisplay = getMealDisplayModel({
  entry: { id: "pre_workout", label: "Pre workout" },
  meal: {
    engineVersion: "recipe_engine_v1",
    authoringKey: "v16_none_workout_recipe",
    recipeName: "Plain snack",
    workout_relation: "NONE",
    items: [{ name: "Banana", quantity: 120, unit: "g" }],
  },
  fallbackLabel: "Pre workout",
});
assert.equal(noneWorkoutDisplay.title, "Pre workout");
assert.equal(noneWorkoutDisplay.dishName, "Plain snack");
assert.equal(noneWorkoutDisplay.workoutLabel, null);
assert.equal(noneWorkoutDisplay.workoutBadgeText, null);

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
assert.equal(getWeeklyPlanFetchDate({
  weeklyPlanCache: initialCache,
  selectedDate: "2026-09-17",
  selectedPlan: null,
  loadingPlanDates: {},
}), "2026-09-17");
assert.equal(shouldFetchWeeklyPlanForDate({
  weeklyPlanCache: initialCache,
  selectedDate: "2026-09-17",
  selectedPlan: null,
  loadingPlanDates: {"2026-09-17": true},
}), false);
assert.equal(getWeeklyPlanFetchDate({
  weeklyPlanCache: initialCache,
  selectedDate: "2026-09-17",
  selectedPlan: null,
  loadingPlanDates: {"2026-09-17": true},
}), null);

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
const successCache = cacheWeeklyPlanFetchResult(initialCache, "2026-09-17", thursdayPlan);
const successLoading = finishWeeklyPlanLoading({"2026-09-17": true}, "2026-09-17");
assert.equal(successCache["2026-09-17"].ingredientPlan.meals[0].recipe_name, "Thursday V16 recipe");
assert.deepEqual(successLoading, {});
assert.equal(shouldFetchWeeklyPlanForDate({
  weeklyPlanCache: fetchedCache,
  selectedDate: "2026-09-17",
  selectedPlan: thursdayPlan,
  loadingPlanDates: {},
}), false);
assert.equal(getWeeklyPlanFetchDate({
  weeklyPlanCache: fetchedCache,
  selectedDate: "2026-09-17",
  selectedPlan: thursdayPlan,
  loadingPlanDates: {},
}), null);

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
assert.equal(getWeeklyPlanFetchDate({
  weeklyPlanCache: fetchedCache,
  selectedDate: "2026-09-18",
  selectedPlan: null,
  loadingPlanDates: {},
}), "2026-09-18");

const clickFetches = [];
let clickCache = {...initialCache};
for (const selectedDate of ["2026-09-15", "2026-09-16", "2026-09-18"]) {
  const selectedPlan = selectWeeklyPlanForDate({
    weeklyPlans: clickCache,
    selectedDate,
    currentPlan: staleLegacyCurrentPlan,
    todayDate: "2026-09-14",
  });
  const fetchDate = getWeeklyPlanFetchDate({
    weeklyPlanCache: clickCache,
    selectedDate,
    selectedPlan,
    loadingPlanDates: {},
  });
  clickFetches.push(fetchDate);
  clickCache = cacheWeeklyPlanFetchResult(clickCache, selectedDate, makeV1Plan(selectedDate, `${selectedDate} V16 recipe`, `${selectedDate} component`));
}
assert.deepEqual(clickFetches, ["2026-09-15", "2026-09-16", "2026-09-18"]);
assert.equal(getWeeklyPlanFetchDate({
  weeklyPlanCache: clickCache,
  selectedDate: "2026-09-16",
  selectedPlan: selectWeeklyPlanForDate({
    weeklyPlans: clickCache,
    selectedDate: "2026-09-16",
    currentPlan: staleLegacyCurrentPlan,
    todayDate: "2026-09-14",
  }),
  loadingPlanDates: {},
}), null);

const refetchedThursday = selectWeeklyPlanForDate({
  weeklyPlans: fetchedCache,
  selectedDate: "2026-09-17",
  currentPlan: staleLegacyCurrentPlan,
  todayDate: "2026-09-14",
});
assert.equal(refetchedThursday.ingredientPlan.meals[0].recipe_name, "Thursday V16 recipe");
assert.equal(refetchedThursday.ingredientPlan.meals[0].ingredients[0].name, "Thursday component");

const failureCache = cacheWeeklyPlanFetchResult(initialCache, "2026-09-20", null);
const failureLoading = finishWeeklyPlanLoading({"2026-09-20": true}, "2026-09-20");
assert.equal(Object.prototype.hasOwnProperty.call(failureCache, "2026-09-20"), true);
assert.equal(failureCache["2026-09-20"], null);
assert.deepEqual(failureLoading, {});
assert.equal(shouldFetchWeeklyPlanForDate({
  weeklyPlanCache: failureCache,
  selectedDate: "2026-09-20",
  selectedPlan: null,
  loadingPlanDates: failureLoading,
}), false);

const productionTopLevelResponse = {
  date: "2026-09-15",
  engine_version: "recipe_engine_v1",
  generation_status: "SUCCESS",
  meals: [
    { meal_type: "breakfast", recipe_name: "Breakfast real V16", authoring_key: "v16_breakfast", ingredients: [{ name: "Breakfast component", quantity_g: 80 }] },
    { meal_type: "lunch", recipe_name: "Lunch real V16", authoring_key: "v16_lunch", ingredients: [{ name: "Lunch component", quantity_g: 120 }] },
    { meal_type: "snack", recipe_name: "Snack real V16", authoring_key: "v16_snack", ingredients: [{ name: "Snack component", quantity_g: 60 }] },
    { meal_type: "dinner", recipe_name: "Dinner real V16", authoring_key: "v16_dinner", ingredients: [{ name: "Dinner component", quantity_g: 140 }] },
  ],
};
const productionPlanCache = cacheWeeklyPlanFetchResult({}, "2026-09-15", {
  planDate: "2026-09-15",
  ingredientPlanDate: "2026-09-15",
  ingredientPlan: productionTopLevelResponse,
});
const productionSelectedPlan = selectWeeklyPlanForDate({
  weeklyPlans: productionPlanCache,
  selectedDate: "2026-09-15",
  currentPlan: staleLegacyCurrentPlan,
  todayDate: "2026-09-14",
});
assert.equal(productionSelectedPlan.planDate, "2026-09-15");
assert.equal(productionSelectedPlan.ingredientPlan, productionTopLevelResponse);
assert.deepEqual(
  productionSelectedPlan.ingredientPlan.meals.map((meal) => meal.meal_type),
  ["breakfast", "lunch", "snack", "dinner"]
);
assert.equal(productionSelectedPlan.ingredientPlan.meals[1].recipe_name, "Lunch real V16");
assert.equal(productionSelectedPlan.ingredientPlan.meals[1].ingredients[0].name, "Lunch component");
assert.notDeepEqual(productionSelectedPlan, staleLegacyCurrentPlan);

const missingFuturePlan = selectWeeklyPlanForDate({
  weeklyPlans: [],
  selectedDate: "2026-09-17",
  currentPlan: staleLegacyCurrentPlan,
  todayDate: "2026-09-14",
});
assert.equal(missingFuturePlan, null);

console.log("V1 plan rendering tests passed");
