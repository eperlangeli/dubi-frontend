import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { allPastMealsAnswered, confirmationFromSelection, trainingChangeMessage } from '../src/trainingChangeConfirmation.mjs';

const past = [
  { meal_type: 'breakfast', status: 'needs_confirmation' },
  { meal_type: 'lunch', status: 'needs_confirmation' },
  { meal_type: 'dinner', status: 'logged' },
];
assert.equal(allPastMealsAnswered(past, { breakfast: [] }), false, 'an unanswered past meal cannot be skipped');
assert.equal(allPastMealsAnswered(past, { breakfast: [], lunch: [] }), true, 'an explicit empty selection is an explicit skipped meal');
assert.equal(allPastMealsAnswered([{ meal_type: 'breakfast', status: 'logged' }], {}), true, 'recorded meals are already answered');

const ingredients = [
  { ingredient_id: 34, name: 'Cous cous', selected_quantity_g: 75, calories: 280, protein: 9, carbs: 58, fat: 1, fiber: 4 },
  { ingredient_id: 58, name: 'Pollo', selected_quantity_g: 120, calories: 190, protein: 35, carbs: 0, fat: 4, fiber: 0 },
];
const partial = confirmationFromSelection({ meal_type: 'lunch', ingredients }, new Set(['58']));
assert.deepEqual(partial.ingredients_consumed.map(item => item.ingredient_id), [58]);
assert.equal(partial.ingredients_consumed[0].calories, 190);
assert.equal(partial.ingredients_consumed[0].portion_g, 120);

assert.equal(trainingChangeMessage({ state: 'rest', calorieDelta: -600 }), 'Oggi non ti alleni, quindi il fabbisogno scende di circa 600 kcal, tolgo i pasti pre e post allenamento e ricalcolo il resto. I pasti che hai già fatto restano come sono.');
assert.equal(trainingChangeMessage({ state: 'training', calorieDelta: 600 }), 'Oggi ti alleni, quindi il fabbisogno aumenta di circa 600 kcal e ricalcolo i pasti restanti. I pasti che hai già fatto restano come sono.');
assert.equal(trainingChangeMessage({ warning: 'unallocated_energy' }), 'Ti sei allenato più del previsto; oggi non riesco a recuperare tutta l’energia entro la fine della giornata.');
assert.equal(trainingChangeMessage({ warning: 'late_session' }), 'Ti alleni fra poco: non aggiungo un pasto pre-workout completo. Se ti va, scegli uno spuntino leggero a basso contenuto di grassi.');

const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
assert(app.includes('await previewTodayTrainingState(normalized)'));
assert(app.includes('disabled={saving||!allPastMealsAnswered(changeReview.past_meals,mealAnswers)'));
assert(app.includes('data-testid="training-change-review"'));
assert(app.includes('confirmationFromSelection(meal,partialIngredientIds)'));
assert(app.includes('await saveTodayTrainingState({...normalizedOverride,confirmations})'));

console.log(JSON.stringify({
  test: 'training-change-confirmation-flow',
  explicit_answer_gate: 'PASS',
  partial_ingredient_consumption: 'PASS',
  logged_meals_need_no_answer: 'PASS',
  direction_messages: 'PASS',
  app_wires_preview_before_update: 'PASS',
  failures_total: 0,
}, null, 2));
