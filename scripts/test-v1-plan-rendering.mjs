import assert from "node:assert/strict";
import { getMealDisplayModel } from "../src/planDisplayModel.mjs";

const v1Meal = {
  engineVersion: "recipe_engine_v1",
  authoringKey: "pilot04_snack_boiled_egg_grapefruit_plate",
  recipeName: "Crostino di segale con uovo sodo e crema di avocado",
  items: [
    { name: "Pane di segale", quantity: 40, unit: "g" },
    { name: "Uovo sodo", quantity: 60, unit: "g" },
  ],
};

const v1Display = getMealDisplayModel({
  entry: { id: "snack", label: "Spuntino" },
  meal: v1Meal,
  fallbackLabel: "Spuntino",
});

assert.equal(v1Display.isV1, true);
assert.equal(v1Display.title, "Crostino di segale con uovo sodo e crema di avocado");
assert.equal(v1Display.subtitle, "Spuntino");
assert.notEqual(v1Display.title, "Pane di segale");
assert.notEqual(v1Display.title, "Spuntino");

const legacyDisplay = getMealDisplayModel({
  entry: { id: "snack", label: "Spuntino" },
  meal: {
    items: ["Bowl di yogurt e banana", "Cocco in scaglie", "Semi di lino"],
  },
  fallbackLabel: "Spuntino",
});

assert.equal(legacyDisplay.isV1, false);
assert.equal(legacyDisplay.title, "Spuntino");
assert.equal(legacyDisplay.subtitle, "");

console.log("V1 plan rendering tests passed");
