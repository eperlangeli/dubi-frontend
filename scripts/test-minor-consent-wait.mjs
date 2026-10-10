// D-073 (Enrico, 10 ott 2026): il link del consenso vale 10 minuti e resta valido finché il genitore sceglie o scade.
// Il minore che ricarica l'app torna alla schermata di attesa senza nuovi invii; la schermata controlla da sola lo stato
// (sola lettura di /me) e mostra fino a quando vale il link, oppure che è scaduto. Testi in 10 lingue.
import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8").replace(/\r\n/g, "\n");
const copyBlock = app.slice(app.indexOf("const MINOR_COPY = {"), app.indexOf("const getMinorCopy"));
for (const key of ["reviewing", "expiredNote"]) {
  const count = (copyBlock.match(new RegExp(`"?${key}"?:"[^"]{6,}"`, "g")) || []).length;
  assert.equal(count, 10, `${key} in 10 lingue`);
}
const validUntil = [...copyBlock.matchAll(/"?validUntil"?:\(?t\)?=>`([^`]+)`/g)].map((m) => m[1]);
assert.equal(validUntil.length, 10, "validUntil in 10 lingue");
for (const text of validUntil) assert(text.includes("${t}") && text.includes("10"), `validUntil con orario e 10 minuti: ${text}`);
assert(!/7 giorni|7 days|7 jours|7 días|7 Tagen|7 أيام|7 dias|7 天|7 日|7 дней/.test(copyBlock), "nessuna durata di 7 giorni nei testi");

const screen = app.slice(app.indexOf("const MinorScreen ="), app.indexOf("const ResetPasswordScreen"));
// Nessun invio automatico: la richiesta parte solo da handleSubmit (pulsanti).
assert.equal((screen.match(/requestParentalConsentEmail\(/g) || []).length, 1);
assert.equal((app.match(/requestParentalConsentEmail\(/g) || []).length, 1);
// Controllo automatico dello stato mentre si aspetta: ogni 10 s e al ritorno sull'app, solo lettura.
assert.match(screen, /setInterval\(poll, 10000\)/);
assert.match(screen, /addEventListener\("visibilitychange", onVisible\)/);
assert.match(screen, /if \(status === "approved"\) \{ finishApproved\(user\); return; \}/);
assert.match(screen, /if \(status === "denied"\) \{ setDenied\(true\); return; \}/);
assert.match(screen, /setLinkExpired\(status === "expired"\)/);
// Scadenza mostrata e aggiornata dopo un invio.
assert.match(screen, /setExpiresAt\(result\.expires_at \|\| null\)/);
assert.match(screen, /linkExpired \? copy\.expiredNote : \(expiresAt \? copy\.validUntil\(formatLinkTime\(expiresAt\)\)/);
assert.match(app, /parentalConsentExpiresAt: data\.parental_consent_expires_at \?\? data\.parentalConsentExpiresAt \?\? null/);
console.log(JSON.stringify({ test: "test-minor-consent-wait", result: "PASS" }));
