// D-072 (Enrico, 10 ott 2026): il minore che ha sbagliato l'email del genitore la corregge dall'app e il link parte
// all'indirizzo giusto. Controlli sul codice della schermata del consenso (MinorScreen) e sui testi in 10 lingue.
import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8").replace(/\r\n/g, "\n");
const start = app.indexOf("const MINOR_COPY = {");
const end = app.indexOf("const getMinorCopy");
const copyBlock = app.slice(start, end);
const langs = [...copyBlock.matchAll(/\n  "?([a-z]{2})"?: ?\{/g)].map((m) => m[1]);
assert.deepEqual(langs.sort(), ["ar", "de", "en", "es", "fr", "it", "ja", "pt", "ru", "zh"]);
for (const key of ["changeEmail", "changeEmailHint"]) {
  const count = (copyBlock.match(new RegExp(`"?${key}"?:"[^"]{6,}"`, "g")) || []).length;
  assert.equal(count, 10, `${key} in 10 lingue`);
}

const screen = app.slice(app.indexOf("const MinorScreen ="), app.indexOf("const ResetPasswordScreen"));
// In attesa con un'email già inviata: si apre la schermata di attesa, con il pulsante per correggere l'email.
// D-073 (fatto cambiato): la stessa schermata si apre anche quando il link è scaduto ("expired"), per reinviarlo.
assert.match(screen, /useState\(\(consentStatus === "pending" \|\| consentStatus === "expired"\) && Boolean\(userData\?\.guardian_email \|\| userData\?\.guardianEmail\)\)/);
assert.match(screen, /onClick=\{\(\) => \{ setSubmitted\(false\); setEditingEmail\(true\); setError\(""\); \}\}/);
assert.match(screen, /\{copy\.changeEmail\}/);
assert.match(screen, /editingEmail && <p[^>]*>\{copy\.changeEmailHint\}<\/p>/);
// Nome ed email restano nei campi (nome dal profilo, D-072).
assert.match(screen, /useState\(userData\?\.guardian_name \|\| userData\?\.guardianName \|\| ""\)/);
assert.match(app, /guardianName: data\.guardian_name \?\? data\.guardianName \?\? null,/);
// Limite di 60 s del server: l'app mostra l'attesa invece di un codice tecnico.
assert.match(screen, /result\.error === "consent_request_too_soon" && result\.retryAfterSeconds > 0/);
assert.match(app, /retryAfterSeconds:Number\(data\.retry_after_seconds\) \|\| 0/);
console.log(JSON.stringify({ test: "test-minor-consent-edit", result: "PASS" }));
