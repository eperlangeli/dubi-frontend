const VALID_ENVS = new Set(["development", "staging", "production"]);
const DEFAULT_API_BASE_URL = "https://dubi-backend.onrender.com";

function fail(message) {
  console.error(`DUBI config error: ${message}`);
  process.exit(1);
}

const appEnv = (process.env.VITE_DUBI_APP_ENV || process.env.NODE_ENV || "production").trim().toLowerCase();
const explicitApiBaseUrl = process.env.VITE_DUBI_API_BASE_URL;
const apiBaseUrl = (explicitApiBaseUrl || DEFAULT_API_BASE_URL).trim();

if (!VALID_ENVS.has(appEnv)) {
  fail(`VITE_DUBI_APP_ENV must be one of ${Array.from(VALID_ENVS).join(", ")}. Received: ${appEnv}`);
}

let parsed;
try {
  parsed = new URL(apiBaseUrl);
} catch (_) {
  fail(`VITE_DUBI_API_BASE_URL must be a valid URL. Received: ${apiBaseUrl}`);
}

if (!["http:", "https:"].includes(parsed.protocol)) {
  fail(`VITE_DUBI_API_BASE_URL must use http or https. Received: ${parsed.protocol}`);
}

if (appEnv === "production" && parsed.protocol !== "https:") {
  fail("Production builds must use an https API URL.");
}

if (appEnv === "staging" && !explicitApiBaseUrl) {
  fail("Staging builds must set VITE_DUBI_API_BASE_URL explicitly to avoid using production data.");
}

console.log(`DUBI config ok: ${appEnv} -> ${parsed.origin}`);
