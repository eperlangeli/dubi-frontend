// D-063 (9 ott 2026): il backend risponde con un codice esplicito quando nel profilo manca un dato necessario al
// piano (D-017a: nessun valore di ripiego). L'app non mostra mai il codice tecnico: spiega quale dato manca e porta
// alle Impostazioni, dove l'utente lo completa. Nessun dato viene stimato o inventato.
// Testi della Regia: IT/EN da far rileggere alla sezione 4; le altre 8 lingue da QA linguistico prima del lancio.

export const PROFILE_DATA_CODES = Object.freeze([
  "PROFILE_AGE_MISSING",
  "PROFILE_HEIGHT_MISSING",
  "PROFILE_WEIGHT_MISSING",
  "PROFILE_GOAL_MISSING",
  "PROFILE_GOAL_UNKNOWN",
]);

const COPY = Object.freeze({
  it: {
    PROFILE_AGE_MISSING: "Manca la tua età nel profilo.",
    PROFILE_HEIGHT_MISSING: "Manca la tua altezza nel profilo.",
    PROFILE_WEIGHT_MISSING: "Manca il tuo peso nel profilo.",
    PROFILE_GOAL_MISSING: "Manca il tuo obiettivo nel profilo.",
    PROFILE_GOAL_UNKNOWN: "L'obiettivo salvato nel profilo non è valido.",
    body: "Senza questo dato DUBI non può calcolare il piano. Completalo nelle Impostazioni.",
    action: "Completa il profilo",
  },
  en: {
    PROFILE_AGE_MISSING: "Your age is missing from your profile.",
    PROFILE_HEIGHT_MISSING: "Your height is missing from your profile.",
    PROFILE_WEIGHT_MISSING: "Your weight is missing from your profile.",
    PROFILE_GOAL_MISSING: "Your goal is missing from your profile.",
    PROFILE_GOAL_UNKNOWN: "The goal saved in your profile is not valid.",
    body: "DUBI cannot calculate your plan without it. Complete it in Settings.",
    action: "Complete your profile",
  },
  fr: {
    PROFILE_AGE_MISSING: "Ton âge manque dans ton profil.",
    PROFILE_HEIGHT_MISSING: "Ta taille manque dans ton profil.",
    PROFILE_WEIGHT_MISSING: "Ton poids manque dans ton profil.",
    PROFILE_GOAL_MISSING: "Ton objectif manque dans ton profil.",
    PROFILE_GOAL_UNKNOWN: "L'objectif enregistré dans ton profil n'est pas valide.",
    body: "Sans cette donnée, DUBI ne peut pas calculer ton plan. Complète-la dans les Réglages.",
    action: "Compléter le profil",
  },
  es: {
    PROFILE_AGE_MISSING: "Falta tu edad en el perfil.",
    PROFILE_HEIGHT_MISSING: "Falta tu altura en el perfil.",
    PROFILE_WEIGHT_MISSING: "Falta tu peso en el perfil.",
    PROFILE_GOAL_MISSING: "Falta tu objetivo en el perfil.",
    PROFILE_GOAL_UNKNOWN: "El objetivo guardado en tu perfil no es válido.",
    body: "Sin este dato, DUBI no puede calcular tu plan. Complétalo en Ajustes.",
    action: "Completar el perfil",
  },
  de: {
    PROFILE_AGE_MISSING: "In deinem Profil fehlt dein Alter.",
    PROFILE_HEIGHT_MISSING: "In deinem Profil fehlt deine Größe.",
    PROFILE_WEIGHT_MISSING: "In deinem Profil fehlt dein Gewicht.",
    PROFILE_GOAL_MISSING: "In deinem Profil fehlt dein Ziel.",
    PROFILE_GOAL_UNKNOWN: "Das in deinem Profil gespeicherte Ziel ist ungültig.",
    body: "Ohne diese Angabe kann DUBI deinen Plan nicht berechnen. Ergänze sie in den Einstellungen.",
    action: "Profil vervollständigen",
  },
  ar: {
    PROFILE_AGE_MISSING: "عمرك غير موجود في ملفك الشخصي.",
    PROFILE_HEIGHT_MISSING: "طولك غير موجود في ملفك الشخصي.",
    PROFILE_WEIGHT_MISSING: "وزنك غير موجود في ملفك الشخصي.",
    PROFILE_GOAL_MISSING: "هدفك غير موجود في ملفك الشخصي.",
    PROFILE_GOAL_UNKNOWN: "الهدف المحفوظ في ملفك الشخصي غير صالح.",
    body: "لا يستطيع DUBI حساب خطتك بدون هذه المعلومة. أكملها في الإعدادات.",
    action: "أكمل ملفك الشخصي",
  },
  pt: {
    PROFILE_AGE_MISSING: "Falta a tua idade no perfil.",
    PROFILE_HEIGHT_MISSING: "Falta a tua altura no perfil.",
    PROFILE_WEIGHT_MISSING: "Falta o teu peso no perfil.",
    PROFILE_GOAL_MISSING: "Falta o teu objetivo no perfil.",
    PROFILE_GOAL_UNKNOWN: "O objetivo guardado no teu perfil não é válido.",
    body: "Sem este dado, o DUBI não consegue calcular o teu plano. Completa-o nas Definições.",
    action: "Completar o perfil",
  },
  zh: {
    PROFILE_AGE_MISSING: "你的个人资料中缺少年龄。",
    PROFILE_HEIGHT_MISSING: "你的个人资料中缺少身高。",
    PROFILE_WEIGHT_MISSING: "你的个人资料中缺少体重。",
    PROFILE_GOAL_MISSING: "你的个人资料中缺少目标。",
    PROFILE_GOAL_UNKNOWN: "你个人资料中保存的目标无效。",
    body: "没有这项信息，DUBI 无法计算你的计划。请在设置中补充。",
    action: "完善个人资料",
  },
  ja: {
    PROFILE_AGE_MISSING: "プロフィールに年齢が入力されていません。",
    PROFILE_HEIGHT_MISSING: "プロフィールに身長が入力されていません。",
    PROFILE_WEIGHT_MISSING: "プロフィールに体重が入力されていません。",
    PROFILE_GOAL_MISSING: "プロフィールに目標が入力されていません。",
    PROFILE_GOAL_UNKNOWN: "プロフィールに保存された目標が無効です。",
    body: "この情報がないと、DUBIはプランを計算できません。設定で入力してください。",
    action: "プロフィールを入力する",
  },
  ru: {
    PROFILE_AGE_MISSING: "В профиле не указан возраст.",
    PROFILE_HEIGHT_MISSING: "В профиле не указан рост.",
    PROFILE_WEIGHT_MISSING: "В профиле не указан вес.",
    PROFILE_GOAL_MISSING: "В профиле не указана цель.",
    PROFILE_GOAL_UNKNOWN: "Цель, сохранённая в профиле, недействительна.",
    body: "Без этих данных DUBI не может рассчитать план. Заполните их в настройках.",
    action: "Заполнить профиль",
  },
});

export const PROFILE_ERROR_LANGS = Object.freeze(Object.keys(COPY));

// Codice del profilo da un errore o da un payload del backend (`{ error: "PROFILE_…" }`), altrimenti null.
export function profileDataCode(value) {
  const code = typeof value === "string" ? value : (value?.payload?.error || value?.error || value?.code || value?.message || null);
  return PROFILE_DATA_CODES.includes(code) ? code : null;
}

// Testi per un codice del profilo nella lingua dell'app; una lingua senza testi usa l'italiano (stessa regola di t()).
// Codice non del profilo: null (il chiamante mostra il suo messaggio).
export function profileErrorCopy(value, lang) {
  const code = profileDataCode(value);
  if (!code) return null;
  const copy = COPY[lang] || COPY.it;
  return { code, title: copy[code], body: copy.body, action: copy.action };
}

// D-063: Oggi e Piano senza un piano (per esempio dopo un dato del profilo mancante) mostrano questo messaggio,
// mai una schermata vuota né un piano di ripiego.
const NO_PLAN_COPY = Object.freeze({
  it: { title: "Il piano di oggi non è disponibile.", body: "Controlla il profilo nelle Impostazioni, poi riprova.", retry: "Riprova" },
  en: { title: "Today’s plan is not available.", body: "Check your profile in Settings, then try again.", retry: "Try again" },
  fr: { title: "Le plan du jour n'est pas disponible.", body: "Vérifie ton profil dans les Réglages, puis réessaie.", retry: "Réessayer" },
  es: { title: "El plan de hoy no está disponible.", body: "Revisa tu perfil en Ajustes y vuelve a intentarlo.", retry: "Reintentar" },
  de: { title: "Der heutige Plan ist nicht verfügbar.", body: "Prüfe dein Profil in den Einstellungen und versuche es erneut.", retry: "Erneut versuchen" },
  ar: { title: "خطة اليوم غير متاحة.", body: "تحقق من ملفك الشخصي في الإعدادات، ثم حاول مرة أخرى.", retry: "حاول مرة أخرى" },
  pt: { title: "O plano de hoje não está disponível.", body: "Verifica o teu perfil nas Definições e tenta novamente.", retry: "Tentar novamente" },
  zh: { title: "今天的计划暂不可用。", body: "请在设置中检查你的个人资料，然后重试。", retry: "重试" },
  ja: { title: "今日のプランは利用できません。", body: "設定でプロフィールを確認してから、もう一度お試しください。", retry: "再試行" },
  ru: { title: "План на сегодня недоступен.", body: "Проверьте профиль в настройках и попробуйте снова.", retry: "Повторить" },
});

export function noPlanCopy(lang) {
  return NO_PLAN_COPY[lang] || NO_PLAN_COPY.it;
}

// D-064: qualsiasi altro errore nel preparare il piano del giorno: frase chiara; il codice resta solo come riferimento
// piccolo per l'assistenza, mai come messaggio.
const PLAN_ERROR_COPY = Object.freeze({
  it: { title: "Non riesco a preparare il piano adesso.", body: "Riprova tra poco. Se succede ancora, scegli un altro orario.", ref: "Riferimento per l'assistenza" },
  en: { title: "I can’t prepare your plan right now.", body: "Try again shortly. If it happens again, choose a different time.", ref: "Support reference" },
  fr: { title: "Je ne peux pas préparer ton plan pour le moment.", body: "Réessaie dans un instant. Si cela se reproduit, choisis un autre horaire.", ref: "Référence pour l'assistance" },
  es: { title: "Ahora no puedo preparar tu plan.", body: "Inténtalo de nuevo en un momento. Si vuelve a pasar, elige otra hora.", ref: "Referencia para soporte" },
  de: { title: "Ich kann deinen Plan gerade nicht erstellen.", body: "Versuche es gleich noch einmal. Wenn es wieder passiert, wähle eine andere Uhrzeit.", ref: "Referenz für den Support" },
  ar: { title: "لا أستطيع إعداد خطتك الآن.", body: "حاول مرة أخرى بعد قليل. إذا تكرر ذلك، اختر وقتًا آخر.", ref: "مرجع للدعم" },
  pt: { title: "Não consigo preparar o teu plano agora.", body: "Tenta novamente daqui a pouco. Se voltar a acontecer, escolhe outra hora.", ref: "Referência para o suporte" },
  zh: { title: "现在无法生成你的计划。", body: "请稍后重试。如果再次出现，请选择其他时间。", ref: "支持参考" },
  ja: { title: "今はプランを作成できません。", body: "少し待ってからもう一度お試しください。再び起きる場合は、別の時間を選んでください。", ref: "サポート用の参照" },
  ru: { title: "Сейчас не удаётся подготовить план.", body: "Попробуйте ещё раз чуть позже. Если это повторится, выберите другое время.", ref: "Код для поддержки" },
});

export function planErrorCopy(lang) {
  return PLAN_ERROR_COPY[lang] || PLAN_ERROR_COPY.it;
}
