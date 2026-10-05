// D-018 / D-019 (Registro decisioni, 5 ottobre 2026).
// D-018: la card "Ti alleni oggi?" si mostra solo a chi ha dichiarato di fare sport.
// D-019: chi dichiara di allenarsi ma non ha uno sport valido del catalogo vede, prima del piano,
// la schermata "Quali sport pratichi?". Un testo salvato non si converte mai da solo: si propone
// lo sport più vicino e l'utente conferma.
import { classifySportSearch, normalizeSportSearch } from "./sportSearchModel.mjs";

const NO_TRAINING_BANDS = new Set(["0"]);

const asArray = (value) => Array.isArray(value)
  ? value
  : (typeof value === "string" && value.trim() ? value.split(",") : []);

export const declaresTraining = (userData = {}) => {
  const sessions = asArray(userData.trainingSessions ?? userData.training_sessions);
  if (sessions.length > 0) return true;
  const band = userData.workoutDaysBand ?? userData.workout_days_band;
  if (band !== undefined && band !== null && String(band).trim() !== "") {
    return !NO_TRAINING_BANDS.has(String(band).trim());
  }
  const days = userData.workoutDays ?? userData.workout_days;
  if (days === undefined || days === null || String(days).trim() === "") return false;
  const text = String(days).trim();
  if (text === "0") return false;
  const first = Number.parseInt(text.split("-")[0], 10);
  return Number.isFinite(first) && first > 0;
};

// rawSports: valori salvati nel profilo (id del catalogo, alias già risolti, oppure testo libero).
export const classifyDeclaredSports = (rawSports = [], catalog = [], legacyIds = new Set()) => {
  const valid = [];
  const invalid = [];
  for (const raw of rawSports) {
    const id = String(raw || "").trim();
    if (!id) continue;
    if (catalog.some((sport) => sport.sport_id === id) || legacyIds.has(id)) {
      if (!valid.includes(id)) valid.push(id);
      continue;
    }
    const text = id.startsWith("custom:") ? id.slice(7) : id;
    const searchText = text.replace(/[_:]+/g, " ").trim();
    const isPlaceholder = ["other", "altro", "unspecified"].includes(normalizeSportSearch(searchText));
    const result = !isPlaceholder && searchText ? classifySportSearch(catalog, searchText) : null;
    invalid.push({
      raw: id,
      text: isPlaceholder ? "" : searchText,
      suggestion: result?.kind === "exact" ? result.sport : (result?.suggestion || null),
    });
  }
  return { valid, invalid };
};

// Restituisce: "loading" | "no_training" | "sport_required" | "eligible".
export const trainingEligibility = ({ userData = {}, rawSports = [], catalog = [], legacyIds = new Set() } = {}) => {
  if (!declaresTraining(userData)) return { status: "no_training", valid: [], invalid: [] };
  if (!Array.isArray(catalog) || catalog.length === 0) return { status: "loading", valid: [], invalid: [] };
  const { valid, invalid } = classifyDeclaredSports(rawSports, catalog, legacyIds);
  if (valid.length === 0 || invalid.length > 0) return { status: "sport_required", valid, invalid };
  return { status: "eligible", valid, invalid };
};
