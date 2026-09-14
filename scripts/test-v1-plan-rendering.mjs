import assert from "node:assert/strict";
import { getMealDisplayModel } from "../src/planDisplayModel.mjs";

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

console.log("V1 plan rendering tests passed");
