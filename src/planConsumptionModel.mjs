const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const roundTenth = (value) => Math.round(toNumber(value) * 10) / 10;

export const getIngredientMacroContribution = (item = {}) => ({
  calories: Math.round(toNumber(item.calories ?? item.cal ?? item.kcal)),
  protein: roundTenth(item.protein ?? item.protein_g ?? item.p),
  carbs: roundTenth(item.carbs ?? item.carbs_g ?? item.c),
  fat: roundTenth(item.fats ?? item.fat ?? item.fat_g ?? item.f),
  fiber: roundTenth(item.fiber ?? item.fiber_g),
});

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
