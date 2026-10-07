// D-038 (b): versione del piano giornaliero. La fonte è il server (daily_plans.version, esposta come
// plan_version); qui solo la memoria in sessione delle versioni viste, il confronto e i testi del banner.
// Testo IT dalla decisione D-038 (Enrico, 7 ottobre 2026). Altre lingue: tradotte dalla Regia, in attesa di QA linguistico.

export const PLAN_VERSION_CONFLICT = "PLAN_VERSION_CONFLICT";
export const PLAN_VERSION_POLL_MS = 60000;

const COPY = {
  it: "Il tuo piano è stato aggiornato da un altro dispositivo. Tocca per aggiornare.",
  en: "Your plan was updated on another device. Tap to refresh.",
  fr: "Votre plan a été mis à jour sur un autre appareil. Touchez pour actualiser.",
  es: "Tu plan se ha actualizado desde otro dispositivo. Toca para actualizar.",
  de: "Dein Plan wurde auf einem anderen Gerät aktualisiert. Tippe zum Aktualisieren.",
  ar: "تم تحديث خطتك من جهاز آخر. اضغط للتحديث.",
  pt: "O seu plano foi atualizado noutro dispositivo. Toque para atualizar.",
  zh: "你的计划已在另一台设备上更新。点按以刷新。",
  ja: "プランが別のデバイスで更新されました。タップして更新してください。",
  ru: "Ваш план был обновлён на другом устройстве. Нажмите, чтобы обновить.",
};

export const PLAN_VERSION_COPY_LANGUAGES = Object.freeze(Object.keys(COPY));

export function getPlanUpdatedCopy(lang) {
  const text = COPY[lang];
  if (!text) throw new Error(`PLAN_VERSION_COPY_MISSING:${lang}`);
  return text;
}

const knownVersions = new Map();
const conflictListeners = new Set();

const isIsoDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));

// Registra la versione restituita dal server per quel giorno (dopo ogni lettura o scrittura riuscita).
export function rememberPlanVersion(date, version) {
  if (!isIsoDate(date)) return;
  const value = Number(version);
  if (Number.isInteger(value) && value > 0) knownVersions.set(String(date), value);
}

export function knownPlanVersion(date) {
  return knownVersions.get(String(date));
}

// Campo da aggiungere al corpo di una modifica: la versione su cui l'app ha basato la modifica.
export function expectedVersionBody(date) {
  const version = knownPlanVersion(date);
  return version === undefined ? {} : { expected_version: version };
}

export function knownPlanVersionRange() {
  const dates = [...knownVersions.keys()].sort();
  if (!dates.length) return null;
  return { from: dates[0], to: dates[dates.length - 1], dates };
}

// Giorni noti la cui versione sul server è diversa (o il cui piano non c'è più).
export function changedPlanDates(serverVersions = {}, dates = [...knownVersions.keys()]) {
  return dates.filter((date) => knownVersions.has(date) && serverVersions[date] !== knownVersions.get(date));
}

export function isPlanVersionConflict(status, payload) {
  return Number(status) === 409 && payload?.error === PLAN_VERSION_CONFLICT;
}

export function onPlanVersionConflict(listener) {
  conflictListeners.add(listener);
  return () => conflictListeners.delete(listener);
}

export function notifyPlanVersionConflict(detail = {}) {
  for (const listener of conflictListeners) {
    try { listener(detail); } catch (error) { console.error("plan version listener failed:", error); }
  }
}

export function resetPlanVersionsForTest() {
  knownVersions.clear();
  conflictListeners.clear();
}
