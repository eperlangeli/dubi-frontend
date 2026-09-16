const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const roundTenth = (value) => Math.round(toNumber(value) * 10) / 10;

const pickMacro = (item, keys) => {
  for (const source of [
    item,
    item?.macros,
    item?.totalMacros,
    item?.scaled_macros,
    item?.selected_macros,
    item?.nutrition,
  ]) {
    if (!source || typeof source !== 'object') continue;
    for (const key of keys) {
      if (source[key] !== undefined && source[key] !== null) return source[key];
    }
  }
  return undefined;
};

export const getIngredientMacroContribution = (item = {}) => ({
  calories: Math.round(toNumber(pickMacro(item, ['calories', 'cal', 'kcal']))),
  protein: roundTenth(pickMacro(item, ['protein', 'protein_g', 'p'])),
  carbs: roundTenth(pickMacro(item, ['carbs', 'carbs_g', 'c'])),
  fat: roundTenth(pickMacro(item, ['fats', 'fat', 'fat_g', 'f'])),
  fiber: roundTenth(pickMacro(item, ['fiber', 'fiber_g'])),
});

export const toggleIngredientCompletion = (explicitCompleted = {}, checkKey) => {
  const key = String(checkKey || '');
  if (!key) return { ...explicitCompleted };
  const next = { ...explicitCompleted };
  if (next[key]) delete next[key];
  else next[key] = true;
  return next;
};

export const sumCompletedIngredientMacros = (items = [], completedKeys = new Set()) => (
  items.reduce((acc, item) => {
    if (!completedKeys.has(item.checkKey)) return acc;
    const macros = getIngredientMacroContribution(item);
    return {
      calories: acc.calories + macros.calories,
      protein: roundTenth(acc.protein + macros.protein),
      carbs: roundTenth(acc.carbs + macros.carbs),
      fat: roundTenth(acc.fat + macros.fat),
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
);

export const effectiveCompletedIngredientKeys = ({
  items = [],
  explicitCompleted = {},
  mealStatus = {},
} = {}) => {
  const completed = new Set();

  items.forEach((item) => {
    if (!item?.checkKey) return;
    if (explicitCompleted[item.checkKey] || mealStatus[item.mealId] === 'done') {
      completed.add(item.checkKey);
    }
  });

  return completed;
};

export const macroProgressPercent = (consumed, target) => {
  const targetValue = toNumber(target);
  if (targetValue <= 0) return 0;
  return Math.min(100, Math.round((toNumber(consumed) / targetValue) * 100));
};
