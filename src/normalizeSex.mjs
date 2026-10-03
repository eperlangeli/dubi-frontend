export function normalizeSex(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "m" || normalized === "male") return "male";
  if (normalized === "f" || normalized === "female") return "female";
  const code = normalized ? "PROFILE_SEX_INVALID" : "PROFILE_SEX_MISSING";
  const error = new Error(code);
  error.code = code;
  throw error;
}
