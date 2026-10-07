// D-038 (c): lo stato dell'utente vive sul server (routes/app-state.js del backend) ed è uguale su ogni
// dispositivo. La memoria locale del telefono è solo una copia di ciò che arriva dal server: si legge dal
// server all'apertura, ogni modifica si invia come differenza (unione per chiave sul server, così due
// dispositivi non si cancellano a vicenda) e, se l'invio fallisce, si torna allo stato del server.

export const mealTrackingKey = (date) => `meal_tracking:${date}`;
export const SHOPPING_CHECKED_KEY = "shopping_checked";
export const PLANNING_DAY_KEY = "planning_day";
export const MARTIAL_ARTS_PROMPT_SEEN_KEY = "martial_arts_prompt_seen";
export const LANG_STATE_KEY = "lang";

export async function readAppState({ apiBaseUrl, token, keys, fetcher = fetch }) {
  if (!token) throw new Error("missing_token");
  const response = await fetcher(`${apiBaseUrl}/api/app-state?keys=${encodeURIComponent(keys.join(","))}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(payload.error || "app_state_read_failed"), { status: response.status, payload });
  return payload.values || {};
}

export async function patchAppState({ apiBaseUrl, token, key, body, fetcher = fetch }) {
  if (!token) throw new Error("missing_token");
  const response = await fetcher(`${apiBaseUrl}/api/app-state/${encodeURIComponent(key)}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(payload.error || "app_state_write_failed"), { status: response.status, payload });
  return payload;
}

const asMap = (value) => (value && typeof value === "object" && !Array.isArray(value) ? value : {});

// Differenza fra lo stato del server e quello locale: { set, unset } (chiavi con valore null/undefined = tolte).
export function diffMap(serverValue, localValue) {
  const before = asMap(serverValue);
  const after = asMap(localValue);
  const set = {};
  const unset = [];
  for (const [key, value] of Object.entries(after)) {
    if (value === null || value === undefined) continue;
    if (before[key] !== value) set[key] = value;
  }
  for (const key of Object.keys(before)) {
    if (after[key] === null || after[key] === undefined) unset.push(key);
  }
  return { set, unset };
}

export const isEmptyDiff = (diff) => !Object.keys(diff.set).length && !diff.unset.length;

// Solo i valori ammessi dal server: pasti "done"/"skip", ingredienti e spesa true/false.
export function cleanMealStatus(map) {
  return Object.fromEntries(Object.entries(asMap(map)).filter(([, value]) => value === "done" || value === "skip"));
}
export function cleanBooleanMap(map) {
  return Object.fromEntries(Object.entries(asMap(map)).filter(([, value]) => typeof value === "boolean"));
}

export function mealTrackingPatch(serverValue, localStatus, localChecks) {
  const server = asMap(serverValue);
  const statusDiff = diffMap(server.meal_status, cleanMealStatus(localStatus));
  const checksDiff = diffMap(server.ingredient_checks, cleanBooleanMap(localChecks));
  const body = {};
  if (!isEmptyDiff(statusDiff)) body.meal_status = statusDiff;
  if (!isEmptyDiff(checksDiff)) body.ingredient_checks = checksDiff;
  return Object.keys(body).length ? body : null;
}

export function mapPatch(serverValue, localValue) {
  const local = cleanBooleanMap(localValue);
  if (!Object.keys(local).length && Object.keys(asMap(serverValue)).length) return { replace: {} };
  const diff = diffMap(serverValue, local);
  return isEmptyDiff(diff) ? null : diff;
}
