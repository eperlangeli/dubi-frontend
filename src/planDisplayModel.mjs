export const RECIPE_ENGINE_V1 = "recipe_engine_v1";

export function isRecipeEngineV1Meal(meal) {
  return Boolean(
    meal &&
    (meal.engineVersion === RECIPE_ENGINE_V1 ||
      meal.engine_version === RECIPE_ENGINE_V1 ||
      meal.ingredientMeal?.engine_version === RECIPE_ENGINE_V1 ||
      meal.authoringKey ||
      meal.authoring_key)
  );
}

export function getMealDisplayModel({ entry, meal, fallbackLabel }) {
  const recipeName =
    meal?.recipeName ||
    meal?.recipe_name ||
    meal?.ingredientMeal?.recipe_name ||
    meal?.ingredientMeal?.recipeName ||
    "";
  const authoringKey =
    meal?.authoringKey ||
    meal?.authoring_key ||
    meal?.ingredientMeal?.authoring_key ||
    "";
  const slotLabel = fallbackLabel || entry?.label || entry?.id || "";
  const isV1 = isRecipeEngineV1Meal(meal) && Boolean(authoringKey) && Boolean(recipeName);

  return {
    isV1,
    title: slotLabel,
    subtitle: "",
    dishName: isV1 ? recipeName : "",
    authoringKey: authoringKey || null,
    recipeName: recipeName || null,
  };
}
