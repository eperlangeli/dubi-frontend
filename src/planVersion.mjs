// D-038 (b): versione del piano giornaliero. La fonte è il server (daily_plans.version, esposta come
// plan_version); qui solo la memoria in sessione delle versioni viste, il confronto e i testi del banner.
// Testo IT dalla decisione D-038 (Enrico, 7 ottobre 2026). Altre lingue: tradotte dalla Regia, in attesa di QA linguistico.

export const PLAN_VERSION_CONFLICT = "PLAN_VERSION_CONFLICT";
// D-066: 15 s (prima 60 s): l'avviso sull'altro dispositivo arriva presto. Solo le versioni, una richiesta leggera.
export const PLAN_VERSION_POLL_MS = 15000;

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

// D-038 (d): piano non allineato ai dati di allenamento (plan_stale dal backend). Aprire l'app non lo
// rigenera: l'utente lo aggiorna con un tocco. Testi della Regia (IT/EN), altre lingue in attesa di QA linguistico.
const STALE_COPY = {
  it: { text: "Questo piano non tiene conto delle ultime modifiche all'allenamento.", action: "Aggiorna il piano", failed: "Non riesco ad aggiornare il piano. Riprova tra poco." },
  en: { text: "This plan does not reflect your latest training changes.", action: "Update plan", failed: "Could not update the plan. Please try again shortly." },
  fr: { text: "Ce plan ne tient pas compte de vos dernières modifications d'entraînement.", action: "Mettre à jour le plan", failed: "Impossible de mettre à jour le plan. Réessayez dans un instant." },
  es: { text: "Este plan no tiene en cuenta tus últimos cambios de entrenamiento.", action: "Actualizar el plan", failed: "No se pudo actualizar el plan. Inténtalo de nuevo en un momento." },
  de: { text: "Dieser Plan berücksichtigt deine letzten Trainingsänderungen nicht.", action: "Plan aktualisieren", failed: "Der Plan konnte nicht aktualisiert werden. Bitte versuche es gleich noch einmal." },
  ar: { text: "لا تأخذ هذه الخطة في الاعتبار آخر تغييرات تمارينك.", action: "تحديث الخطة", failed: "تعذّر تحديث الخطة. حاول مرة أخرى بعد قليل." },
  pt: { text: "Este plano não tem em conta as suas últimas alterações de treino.", action: "Atualizar o plano", failed: "Não foi possível atualizar o plano. Tente novamente daqui a pouco." },
  zh: { text: "此计划未包含你最近的训练更改。", action: "更新计划", failed: "无法更新计划。请稍后再试。" },
  ja: { text: "このプランには最新のトレーニング変更が反映されていません。", action: "プランを更新", failed: "プランを更新できませんでした。しばらくしてからもう一度お試しください。" },
  ru: { text: "Этот план не учитывает ваши последние изменения тренировок.", action: "Обновить план", failed: "Не удалось обновить план. Попробуйте ещё раз чуть позже." },
};

export const PLAN_STALE_COPY_LANGUAGES = Object.freeze(Object.keys(STALE_COPY));

export function getPlanStaleCopy(lang) {
  const copy = STALE_COPY[lang];
  if (!copy) throw new Error(`PLAN_STALE_COPY_MISSING:${lang}`);
  return copy;
}

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
