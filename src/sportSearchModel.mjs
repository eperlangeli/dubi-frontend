export const normalizeSportSearch = (value) => String(value || "")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLocaleLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");

export const POPULAR_SPORT_IDS = [
  "resistance_training", "running", "soccer", "swimming", "cycling_road", "tennis",
  "padel", "crossfit", "yoga", "basketball", "boxing",
];
export const LEGACY_SPORT_ID_ALIASES = Object.freeze({
  football:"soccer", kayak:"canoe_kayak", nordic_ski:"cross_country_ski", sprint:"sprint_track",
  surf:"surfing", equestrian:"horse_riding", baseball:"baseball_softball", cycling:"cycling_road", gym:"resistance_training",
});
// Sinonimi di ricerca (D-019 / D-022): servono solo a trovare e a proporre uno sport del catalogo.
// Non assegnano mai uno sport da soli: l'utente conferma sempre la proposta.
export const SPORT_SEARCH_SYNONYMS = Object.freeze({
  skateboarding: ["skate"],
  calisthenics: ["corpo libero", "a corpo libero", "bodyweight", "street workout"],
});
const searchNames = (sport) => [
  sport.sport_id.replace(/_/g, " "), sport.name_it, sport.name_en,
  ...(SPORT_SEARCH_SYNONYMS[sport.sport_id] || []),
].map(normalizeSportSearch).filter(Boolean);

export const canonicalSportId = (value) => {
  const raw=String(value||"").trim().toLowerCase();
  if(/^custom:[a-z0-9_:-]+$/.test(raw))return raw;
  if(LEGACY_SPORT_ID_ALIASES[raw])return LEGACY_SPORT_ID_ALIASES[raw];
  const key=normalizeSportSearch(value).replace(/\s+/g,"_");
  return LEGACY_SPORT_ID_ALIASES[key]||key;
};

export const isKnownSportId = (sports, sportId, legacySportIds = new Set()) =>
  sports.some(sport => sport.sport_id === sportId) || legacySportIds.has(sportId);

const distance = (a, b) => {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const previous = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = previous;
    }
  }
  return row[b.length];
};

export const searchSports = (sports, query, language = "it") => {
  const q = normalizeSportSearch(query);
  const name = (sport) => language === "it" ? sport.name_it : sport.name_en;
  if (!q) return POPULAR_SPORT_IDS.map((id) => sports.find((sport) => sport.sport_id === id)).filter(Boolean);
  return sports.filter((sport) => searchNames(sport).some((value) => value.includes(q)))
    .sort((a, b) => name(a).localeCompare(name(b), language));
};

export const suggestSport = (sports, query) => {
  const q = normalizeSportSearch(query);
  if (!q) return null;
  const candidates = sports.map((sport) => {
    const names = searchNames(sport);
    const score = Math.max(...names.map((candidate) => {
      if (candidate === q) return 1;
      if (candidate.includes(q) || q.includes(candidate)) {
        const ratio = Math.min(candidate.length, q.length) / Math.max(candidate.length, q.length);
        // Contenimento di una parola intera di almeno 4 lettere ("skate" in "skateboard"): proposta forte.
        return Math.min(candidate.length, q.length) >= 4 ? 0.7 + 0.3 * ratio : ratio;
      }
      return 1 - distance(q, candidate) / Math.max(q.length, candidate.length, 1);
    }));
    return { sport, score };
  }).sort((a, b) => b.score - a.score);
  return candidates[0]?.score >= 0.68 ? candidates[0].sport : null;
};

export const classifySportSearch = (sports, query) => {
  const exact = sports.find((sport) => [sport.sport_id.replace(/_/g, " "), sport.name_it, sport.name_en]
    .some((value) => normalizeSportSearch(value) === normalizeSportSearch(query)));
  // Un sinonimo non è mai "exact": diventa solo una proposta da confermare.
  return exact ? { kind: "exact", sport: exact } : { kind: "unmatched", suggestion: suggestSport(sports, query) };
};
