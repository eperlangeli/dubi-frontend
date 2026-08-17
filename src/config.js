const DEFAULT_API_BASE_URL = "https://dubi-backend.onrender.com";
const VALID_APP_ENVS = new Set(["development", "staging", "production"]);

const normalizeApiBaseUrl = (value) => {
  const raw = String(value || "").trim().replace(/\/+$/, "");
  if (!raw) return DEFAULT_API_BASE_URL;

  try {
    const url = new URL(raw);
    if (!["http:", "https:"].includes(url.protocol)) return DEFAULT_API_BASE_URL;
    return url.toString().replace(/\/+$/, "");
  } catch (_) {
    return DEFAULT_API_BASE_URL;
  }
};

const normalizeAppEnv = (value, mode) => {
  const raw = String(value || mode || "").trim().toLowerCase();
  if (VALID_APP_ENVS.has(raw)) return raw;
  return raw === "prod" ? "production" : "production";
};

export const DUBI_APP_ENV = normalizeAppEnv(
  import.meta.env.VITE_DUBI_APP_ENV,
  import.meta.env.MODE
);

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_DUBI_API_BASE_URL);
export const IS_STAGING_BUILD = DUBI_APP_ENV === "staging";
export const IS_PRODUCTION_BUILD = DUBI_APP_ENV === "production";
