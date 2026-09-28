export const normalizeLegacyGoal = (goal) =>
  String(goal || "").trim().toLowerCase() === "competition" ? "maintain" : goal;

export const fallbackTdee = ({ gender, age, height, weight, workoutDays, workoutIntensity }) => {
  const male = gender === "M" || String(gender).toLowerCase() === "male";
  const bmr = male
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  const baseActivity = Math.round(bmr * 0.2);
  const sessionKcal = {
    light: 250, leggera: 250, low: 250,
    moderate: 450, moderata: 450,
    high: 650, alta: 650,
    very_high: 850, molto_alta: 850,
  };
  const normalizedDays = Number.parseInt(String(workoutDays ?? 0).split("-")[0], 10) || 0;
  const perSession = sessionKcal[String(workoutIntensity || "moderate").toLowerCase()] || 450;
  const trainingActivity = normalizedDays > 0
    ? Math.round((perSession * Math.min(normalizedDays, 7)) / 7)
    : 0;
  return Math.round(bmr + baseActivity + trainingActivity);
};
