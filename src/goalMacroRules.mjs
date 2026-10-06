// Regole degli obiettivi lato app. Copia dei valori di dubi-backend config/goal-macro-rules.js
// (D-017a, D-033; approvazione Francesco 6 ott 2026, D-036). Il backend resta la fonte: l'app
// usa questi valori solo come anteprima quando il piano del server non c'è ancora.
// scripts/test-goal-macro-rules.mjs confronta questi numeri con una copia fissa dei valori backend.
// Nessun valore di ripiego: obiettivo, peso o altezza mancanti = errore esplicito.

export const GOAL_MACRO_RULES = Object.freeze({
  fatLoss: Object.freeze({ backendKey: "fat_loss", calorieMultiplier: 0.8, proteinPerKg: 2.2, carbFraction: 0.40, deficit: true }),
  definition: Object.freeze({ backendKey: "definition", calorieMultiplier: 0.9, proteinPerKg: 2.2, carbFraction: 0.45, deficit: true }),
  gain: Object.freeze({ backendKey: "gain", calorieMultiplier: 1.15, proteinPerKg: 1.6, carbFraction: 0.50, deficit: false }),
  maintain: Object.freeze({ backendKey: "maintenance", calorieMultiplier: 1, proteinPerKg: 1.6, carbFraction: 0.45, deficit: false }),
});

export const FAT_FRACTION_RANGE = Object.freeze({ min: 0.25, max: 0.35 });
export const PRACTICAL_MIN_CARBS_G = 50;

export const ADULT_SCREENING = Object.freeze({
  version: "ADULT_SCREENING_V1",
  bmi_full_block_below: 17,
  bmi_no_deficit_below: 18.5,
  max_weekly_loss_pct_of_weight: 1.0,
  kcal_per_kg_body_mass: 7700,
});

export class GoalRuleError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

export function requireGoal(goal) {
  if (goal === null || goal === undefined || String(goal).trim() === "") {
    throw new GoalRuleError("PROFILE_GOAL_MISSING", "goal is required");
  }
  if (!Object.prototype.hasOwnProperty.call(GOAL_MACRO_RULES, goal)) {
    throw new GoalRuleError("PROFILE_GOAL_UNKNOWN", `unknown goal: ${goal}`, { goal });
  }
  return goal;
}

export function requirePositiveNumber(value, code, field) {
  const number = Number(value);
  if (value === null || value === undefined || value === "" || !Number.isFinite(number) || number <= 0) {
    throw new GoalRuleError(code, `${field} is required`, { field });
  }
  return number;
}

export function bodyMassIndex(weightKg, heightCm) {
  const weight = requirePositiveNumber(weightKg, "PROFILE_WEIGHT_MISSING", "weight");
  const height = requirePositiveNumber(heightCm, "PROFILE_HEIGHT_MISSING", "height");
  return weight / ((height / 100) ** 2);
}

export function maxDailyDeficitKcal(weightKg) {
  const weight = requirePositiveNumber(weightKg, "PROFILE_WEIGHT_MISSING", "weight");
  return (weight * (ADULT_SCREENING.max_weekly_loss_pct_of_weight / 100) * ADULT_SCREENING.kcal_per_kg_body_mass) / 7;
}

// Variazione prevista in kg/settimana (negativo = perdita), stessa formula del backend.
export function expectedWeeklyChangeKg(maintenanceKcal, targetKcal) {
  return ((Number(targetKcal) - Number(maintenanceKcal)) * 7) / ADULT_SCREENING.kcal_per_kg_body_mass;
}

// Calorie dell'obiettivo prima del pavimento, con il tetto di perdita dell'1% del peso a settimana.
export function goalCalories({ tdee, goal, weight }) {
  const rule = GOAL_MACRO_RULES[requireGoal(goal)];
  const maintenance = requirePositiveNumber(tdee, "PROFILE_TDEE_MISSING", "tdee");
  let calories = Math.round(maintenance * rule.calorieMultiplier);
  let rateCapApplied = false;
  if (rule.deficit) {
    const maxDeficit = maxDailyDeficitKcal(weight);
    if (maintenance - calories > maxDeficit) {
      calories = Math.round(maintenance - maxDeficit);
      rateCapApplied = true;
    }
  }
  return { calories, rateCapApplied };
}

// Ripartizione macro come routes/plan.js calculateMacros (senza profilo sport):
// proteine g/kg, carboidrati dalla frazione dell'obiettivo dentro i limiti che lasciano ai grassi il 25-35%.
export function goalMacros({ calories, goal, weight }) {
  const rule = GOAL_MACRO_RULES[requireGoal(goal)];
  const kg = requirePositiveNumber(weight, "PROFILE_WEIGHT_MISSING", "weight");
  const protein = Math.round(kg * rule.proteinPerKg);
  const proteinCalories = protein * 4;
  const desiredCarbs = Math.max(0, Math.round((calories * rule.carbFraction) / 4));
  const carbLowerBound = Math.max(0, Math.ceil((calories - proteinCalories - calories * FAT_FRACTION_RANGE.max) / 4));
  const carbUpperBound = Math.max(carbLowerBound, Math.floor((calories - proteinCalories - calories * FAT_FRACTION_RANGE.min) / 4));
  const carbFloor = PRACTICAL_MIN_CARBS_G <= carbUpperBound ? Math.max(carbLowerBound, PRACTICAL_MIN_CARBS_G) : carbLowerBound;
  const carbs = Math.min(Math.max(desiredCarbs, carbFloor), carbUpperBound);
  const fat = Math.max(0, Math.round((calories - proteinCalories - carbs * 4) / 9));
  return { protein, carbs, fat };
}

// Ritmo previsto dal piano del server (plan.goal_projection). Nessuna stima inventata:
// se il server non l'ha mandato, il valore è null e l'app non giudica l'andamento.
export function weeklyLossFromProjection(projection) {
  const change = Number(projection?.expected_weekly_change_kg);
  if (projection?.expected_weekly_change_kg === null || projection?.expected_weekly_change_kg === undefined || !Number.isFinite(change)) return null;
  return Number((-change).toFixed(2));
}

// Obiettivo dell'app da qualsiasi forma salvata (backend, CSV, vecchie versioni).
// Sconosciuto o mancante = null: nessun "mantenimento" di ripiego.
const GOAL_INPUT_ALIASES = Object.freeze({
  fatLoss: ["fatloss", "fat loss", "fat_loss", "dimagrimento", "perdita grasso", "perdere grasso", "weight loss", "lose weight"],
  gain: ["gain", "muscle", "muscle gain", "muscle_gain", "massa", "massa muscolare", "massa pulita", "aumento muscolare", "bulk", "bulking", "lean bulk"],
  maintain: ["maintain", "maintenance", "mantenimento", "mantenere", "competition"],
  definition: ["definition", "definizione", "cut", "cutting"],
});

export function toAppGoalStrict(value) {
  const key = String(value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
  if (!key || key === "null" || key === "undefined") return null;
  const match = Object.keys(GOAL_INPUT_ALIASES).find((goal) => GOAL_INPUT_ALIASES[goal].some((alias) => alias.replace(/_/g, " ") === key));
  return match || null;
}

export function toBackendGoalStrict(value) {
  const goal = toAppGoalStrict(value);
  return goal ? GOAL_MACRO_RULES[goal].backendKey : null;
}
