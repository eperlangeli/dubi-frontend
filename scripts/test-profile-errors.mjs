// D-063 (9 ott 2026): con un dato del profilo mancante il backend risponde PROFILE_*; l'app spiega quale dato manca e
// porta alle Impostazioni, mai il codice tecnico e mai un valore stimato. Testi in 10 lingue.
import assert from "node:assert/strict";
import fs from "node:fs";
import { PROFILE_DATA_CODES, PROFILE_ERROR_LANGS, noPlanCopy, planErrorCopy, profileDataCode, profileErrorCopy } from "../src/profileErrors.mjs";

// Stessi codici del backend (config/goal-macro-rules.js, routes/plan.js).
assert.deepEqual([...PROFILE_DATA_CODES].sort(), ["PROFILE_AGE_MISSING", "PROFILE_GOAL_MISSING", "PROFILE_GOAL_UNKNOWN", "PROFILE_HEIGHT_MISSING", "PROFILE_WEIGHT_MISSING"]);
assert.deepEqual([...PROFILE_ERROR_LANGS].sort(), ["ar", "de", "en", "es", "fr", "it", "ja", "pt", "ru", "zh"]);

for (const lang of PROFILE_ERROR_LANGS) {
  for (const code of PROFILE_DATA_CODES) {
    const copy = profileErrorCopy(code, lang);
    assert.equal(copy.code, code);
    for (const key of ["title", "body", "action"]) {
      assert.ok(typeof copy[key] === "string" && copy[key].trim().length > 3, `${lang}.${code}.${key}`);
      assert.ok(!/PROFILE_|_MISSING|\d/.test(copy[key]), `${lang}.${code}.${key}: niente codici né numeri`);
    }
  }
  const titles = PROFILE_DATA_CODES.map((code) => profileErrorCopy(code, lang).title);
  assert.equal(new Set(titles).size, titles.length, `${lang}: un testo diverso per ogni dato`);
}
assert.match(profileErrorCopy("PROFILE_WEIGHT_MISSING", "it").title, /peso/);
assert.match(profileErrorCopy("PROFILE_WEIGHT_MISSING", "it").body, /Impostazioni/);
assert.equal(profileErrorCopy("PROFILE_WEIGHT_MISSING", "xx").title, profileErrorCopy("PROFILE_WEIGHT_MISSING", "it").title, "lingua sconosciuta = italiano, come t()");

// Oggi senza piano: messaggio in 10 lingue (mai schermata vuota).
for (const lang of PROFILE_ERROR_LANGS) {
  const copy = noPlanCopy(lang);
  for (const key of ["title", "body", "retry"]) assert.ok(typeof copy[key] === "string" && copy[key].trim().length > 1, `${lang}.noPlan.${key}`);
}
assert.equal(noPlanCopy("xx").title, noPlanCopy("it").title);
// D-064: altri errori del piano: frase chiara in 10 lingue; il codice solo come riferimento piccolo.
for (const lang of PROFILE_ERROR_LANGS) {
  const copy = planErrorCopy(lang);
  for (const key of ["title", "body", "ref"]) assert.ok(typeof copy[key] === "string" && copy[key].trim().length > 3 && !/_/.test(copy[key]), `${lang}.planError.${key}`);
}

// Forme in cui arriva il codice: stringa, Error con message, errore con payload del backend.
assert.equal(profileDataCode(new Error("PROFILE_WEIGHT_MISSING")), "PROFILE_WEIGHT_MISSING");
assert.equal(profileDataCode(Object.assign(new Error("x"), { payload: { error: "PROFILE_HEIGHT_MISSING", field: "height" } })), "PROFILE_HEIGHT_MISSING");
assert.equal(profileDataCode({ error: "PROFILE_GOAL_UNKNOWN" }), "PROFILE_GOAL_UNKNOWN");
// Altri errori non diventano un problema del profilo (né i blocchi di salute, che hanno la loro schermata).
for (const other of ["HEALTH_PLAN_BLOCKED", "MINOR_CLINICAL_PLAN_REQUIRED", "NO_SAFE_MATCH", "daily_schedule_save_failed", "", null, undefined]) {
  assert.equal(profileErrorCopy(other, "it"), null, String(other));
}

// Collegamento nell'app: schermata dell'orario, errore all'avvio, messaggio nelle Impostazioni.
const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
assert.match(app, /import \{ noPlanCopy, planErrorCopy, profileErrorCopy \} from "\.\/profileErrors\.mjs";/);
// Nessun errore del piano mostrato come testo principale: titolo e spiegazione tradotti, codice solo come riferimento.
assert.doesNotMatch(app, /<p role="alert" style=\{\{fontSize:13,color:'#a5342b',marginTop:12\}\}>\{error\}<\/p>/);
assert.doesNotMatch(app, /<p role="alert">\{dailyQuestion\.error\}<\/p>/);
assert.equal((app.match(/\{planErrorCopy\(lang\)\.ref\}: \{(error|dailyQuestion\.error)\}/g) || []).length, 2);
assert.match(app, /const profileCopy = profileErrorCopy\(err, lang\);\n\s+if \(profileCopy\) \{ setProfileIssue\(profileCopy\); setBusy\(false\); return; \}/, "schermata dell'orario");
assert.match(app, /const profileCopy = profileErrorCopy\(dailyQuestion\.error, lang\);/, "errore all'avvio");
// Riscritto come invariante (D-065, fatto cambiato: la schermata riceve anche onAlreadyAnswered).
assert.match(app, /<DailyMealScheduleScreen question=\{dailyQuestion\} onSubmit=\{handleDailyScheduleSubmit\} onOpenProfile=\{openProfileFromPlanError\}.* \/>/);
assert.match(app, /const openProfileFromPlanError = \(\) => \{\n\s+setDailyQuestion\(null\);\n\s+setPlan\(null\);\n\s+pendingTabRef\.current = 'settings';\n\s+setActiveTab\('settings'\);\n\s+setPhase\('app'\);/, "porta alle Impostazioni senza piano");
// L'effetto che all'ingresso nell'app riporta su Oggi rispetta la scheda richiesta.
assert.match(app, /setActiveTab\(pendingTabRef\.current \|\| "today"\);\n\s+pendingTabRef\.current = null;/);
// Oggi e Piano senza piano: messaggio, mai TodayScreen o WeeklyScreen con plan null (si interrompono).
assert.match(app, /\? !plan\n\s+\? <NoPlanNotice onRetry=\{\(\)=>openAppWithDailySchedule\(userData\)\} onOpenSettings=\{\(\)=>setActiveTab\("settings"\)\} \/>\n\s+: <WeeklyScreen/);
assert.match(app, /\? !plan\n\s+\? <NoPlanNotice onRetry=\{\(\)=>openAppWithDailySchedule\(userData\)\} onOpenSettings=\{\(\)=>setActiveTab\("settings"\)\} \/>\n\s+: <TodayScreen/);
assert.match(app, /\{profileErrorCopy\(profileMessage, lang\)\?\.title \|\| profileMessage\}/, "Impostazioni");
// D-065: orario già dato altrove → si entra nel piano salvato, mai l'errore; la domanda aperta si ricontrolla al ritorno.
assert.match(app, /if \(err\?\.message === 'daily_meal_schedule_not_requested' && onAlreadyAnswered\) \{ onAlreadyAnswered\(\); return; \}/);
assert.match(app, /onAlreadyAnswered=\{\(\)=>openAppWithDailySchedule\(userData\)\}/);
assert.match(app, /if \(phase !== 'daily-meal-question' \|\| !userData \|\| dailyQuestion\?\.existing\) return undefined;/);
assert.match(app, /if \(!question\.should_ask && !question\.before_daily_start\) await openAppWithDailySchedule\(userData\);/);
console.log(JSON.stringify({ test: "test-profile-errors", result: "PASS" }));
