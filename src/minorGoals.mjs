// D-059 / D-060 (Enrico, 9 ott 2026): per i 14–17 anni gli obiettivi sono tre, con nomi propri; "Definizione" non c'è.
// "Migliorare la forma fisica" sostituisce "Perdere grasso" (stessa chiave salvata, D-059). Oggi per i 14–17 anni non c'è
// un piano automatico (D-058): i testi non promettono calorie né risultati.
// Testi della Regia: IT da far rileggere alla sezione 5; le altre 9 lingue da QA linguistico.

export const MINOR_ADULT_AGE = 18;
export const MINOR_GOAL_IDS = Object.freeze(["fatLoss", "gain", "maintain"]);

const COPY = Object.freeze({
  it: {
    fatLoss: { t: "Migliorare la forma fisica", d: "Mangiare meglio e sentirti in forma, senza diete restrittive" },
    gain: { t: "Aumentare la massa muscolare", d: "Sostenere crescita e allenamento con un'alimentazione adeguata" },
    maintain: { t: "Mantenere il peso", d: "Restare in equilibrio mentre cresci" },
  },
  en: {
    fatLoss: { t: "Improve your fitness", d: "Eat better and feel fit, without restrictive diets" },
    gain: { t: "Build muscle", d: "Support growth and training with adequate nutrition" },
    maintain: { t: "Maintain your weight", d: "Stay balanced while you grow" },
  },
  fr: {
    fatLoss: { t: "Améliorer ta forme physique", d: "Mieux manger et te sentir en forme, sans régime restrictif" },
    gain: { t: "Développer ta masse musculaire", d: "Soutenir croissance et entraînement avec une alimentation adaptée" },
    maintain: { t: "Maintenir ton poids", d: "Rester en équilibre pendant ta croissance" },
  },
  es: {
    fatLoss: { t: "Mejorar tu forma física", d: "Comer mejor y sentirte en forma, sin dietas restrictivas" },
    gain: { t: "Aumentar la masa muscular", d: "Apoyar el crecimiento y el entrenamiento con una alimentación adecuada" },
    maintain: { t: "Mantener el peso", d: "Mantener el equilibrio mientras creces" },
  },
  de: {
    fatLoss: { t: "Fitness verbessern", d: "Besser essen und dich fit fühlen, ohne strenge Diäten" },
    gain: { t: "Muskelmasse aufbauen", d: "Wachstum und Training mit passender Ernährung unterstützen" },
    maintain: { t: "Gewicht halten", d: "Im Gleichgewicht bleiben, während du wächst" },
  },
  ar: {
    fatLoss: { t: "تحسين لياقتك البدنية", d: "تناول طعام أفضل والشعور بالنشاط، دون حميات صارمة" },
    gain: { t: "زيادة الكتلة العضلية", d: "دعم النمو والتدريب بتغذية مناسبة" },
    maintain: { t: "الحفاظ على الوزن", d: "البقاء في توازن أثناء نموك" },
  },
  pt: {
    fatLoss: { t: "Melhorar a forma física", d: "Comer melhor e sentir-te em forma, sem dietas restritivas" },
    gain: { t: "Aumentar a massa muscular", d: "Apoiar o crescimento e o treino com uma alimentação adequada" },
    maintain: { t: "Manter o peso", d: "Manter o equilíbrio enquanto cresces" },
  },
  zh: {
    fatLoss: { t: "提升身体素质", d: "吃得更好、感觉更有活力，不做严格节食" },
    gain: { t: "增加肌肉量", d: "用合适的饮食支持成长和训练" },
    maintain: { t: "保持体重", d: "在成长中保持平衡" },
  },
  ja: {
    fatLoss: { t: "体力・コンディションを高める", d: "厳しい食事制限なしで、よりよく食べて元気に過ごす" },
    gain: { t: "筋肉量を増やす", d: "成長とトレーニングを適切な食事で支える" },
    maintain: { t: "体重を維持する", d: "成長しながらバランスを保つ" },
  },
  ru: {
    fatLoss: { t: "Улучшить физическую форму", d: "Питаться лучше и чувствовать себя в форме без строгих диет" },
    gain: { t: "Набрать мышечную массу", d: "Поддержать рост и тренировки правильным питанием" },
    maintain: { t: "Сохранить вес", d: "Оставаться в равновесии, пока растёшь" },
  },
});

export const MINOR_GOAL_LANGS = Object.freeze(Object.keys(COPY));

export function isMinorAge(age) {
  const value = Number(age);
  return Number.isFinite(value) && value > 0 && value < MINOR_ADULT_AGE;
}

// Testi dell'obiettivo per un 14–17enne; lingua sconosciuta = italiano (come t()). Obiettivo non previsto: null.
export function minorGoalCopy(goalId, lang) {
  if (!MINOR_GOAL_IDS.includes(goalId)) return null;
  return (COPY[lang] || COPY.it)[goalId];
}
