export const trainingChangeMessage = ({ state, calorieDelta = 0, warning = null } = {}) => {
  if (warning === 'late_session') return 'Ti alleni fra poco: non aggiungo un pasto pre-workout completo. Se ti va, scegli uno spuntino leggero a basso contenuto di grassi.';
  if (warning === 'unallocated_energy') return 'Ti sei allenato più del previsto; oggi non riesco a recuperare tutta l’energia entro la fine della giornata.';
  const amount = Math.round(Math.abs(Number(calorieDelta) || 0));
  if (state === 'rest') return `Oggi non ti alleni, quindi il fabbisogno scende di circa ${amount} kcal, tolgo i pasti pre e post allenamento e ricalcolo il resto. I pasti che hai già fatto restano come sono.`;
  if (Number(calorieDelta) > 0) return `Oggi ti alleni, quindi il fabbisogno aumenta di circa ${amount} kcal e ricalcolo i pasti restanti. I pasti che hai già fatto restano come sono.`;
  return 'L’orario o lo sport dell’allenamento è cambiato. Aggiorno i pasti non ancora fatti; quelli già fatti restano come sono.';
};

export const allPastMealsAnswered = (pastMeals = [], answers = {}) => pastMeals
  .filter((meal) => meal.status !== 'logged')
  .every((meal) => Object.prototype.hasOwnProperty.call(answers, meal.meal_type));

export const confirmationFromSelection = (meal, selectedIds) => ({
  meal_type: meal.meal_type,
  ingredients_consumed: (meal.ingredients || []).filter((ingredient) => selectedIds.has(String(ingredient.ingredient_id ?? ingredient.id ?? ''))).map((ingredient) => ({
    ingredient_id: ingredient.ingredient_id ?? ingredient.id,
    name: ingredient.name || ingredient.ingredient_name,
    portion_g: ingredient.selected_quantity_g ?? ingredient.portion_g ?? ingredient.portionG ?? 0,
    calories: ingredient.calories ?? 0,
    protein: ingredient.protein ?? 0,
    carbs: ingredient.carbs ?? 0,
    fat: ingredient.fat ?? 0,
  })),
});
