export const SUPPORTED_PLAN_CHANGE_ACTIONS = Object.freeze([
  "replace_meal",
  "open_settings",
]);

export function isSupportedPlanChange(change) {
  return Boolean(change && SUPPORTED_PLAN_CHANGE_ACTIONS.includes(change.action));
}

export function getMealReplacementErrorKey(error) {
  const code = String(error?.payload?.error || error?.code || error?.message || "");
  if (code === "FROZEN_MEAL_CANNOT_BE_REPLACED") return "plan.error.frozenMeal";
  if (
    code.startsWith("RECIPE_ENGINE_V1_")
    || error?.payload?.generation_status === "NO_SAFE_MATCH"
  ) return "plan.error.noSafeMatch";
  return "plan.error.generate";
}

export async function replaceMealAndCommit({
  date,
  mealId,
  userData,
  requestReplacement,
  mapPlan,
  commitPlan,
}) {
  const payload = await requestReplacement(date, mealId);
  const updatedPlan = mapPlan(payload, userData);
  commitPlan(updatedPlan);
  return updatedPlan;
}
