// D-031 / D-040 / D-043 (3): domanda sulle condizioni ad alto rischio lato app.
// D-043: Francesco ha approvato una domanda sì/no con la lista mostrata (non più spunte per condizione):
// i controlli sulle chiavi "intro"/"none" e sulle spunte sono riscritti come invarianti sui testi approvati.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import {
  HIGH_RISK_SCREENING_VERSION, HIGH_RISK_CONDITION_KEYS, HIGH_RISK_COPY_LANGUAGES,
  getHighRiskCopy, highRiskAnswerBody, planBlockingCode, HIGH_RISK_ANSWERS,
} from "../src/highRiskScreening.mjs";

// Stesse chiavi e versione del backend (copia fissa; con il repo backend accanto, anche il file vero).
const BACKEND_VERSION = "HIGH_RISK_V1";
assert.equal(HIGH_RISK_SCREENING_VERSION, BACKEND_VERSION);
assert.equal(HIGH_RISK_CONDITION_KEYS.length, 11);
let liveBackendChecked = false;
const backendConfig = path.resolve("..", "dubi-backend-git", "config", "high-risk-screening.js");
if (fs.existsSync(backendConfig)) {
  const backend = createRequire(import.meta.url)(backendConfig);
  assert.equal(backend.HIGH_RISK_SCREENING.version, HIGH_RISK_SCREENING_VERSION);
  assert.deepEqual([...backend.HIGH_RISK_SCREENING.conditions], [...HIGH_RISK_CONDITION_KEYS]);
  liveBackendChecked = true;
}

// Tutte le lingue dell'app hanno tutti i testi e tutte le voci.
const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const appLanguages = [...app.matchAll(/\{ code:"([a-z]{2})", name:/g)].map((m) => m[1]);
assert.ok(appLanguages.length >= 10);
assert.deepEqual([...HIGH_RISK_COPY_LANGUAGES].sort(), [...appLanguages].sort());
const requiredKeys = ["title", "question", "subtitle", "answerNo", "answerYes", "privacy", "confirm", "saving", "required", "error", "settingsLabel", "settingsSub",
  "blockTitle", "blockBody", "blockNext", "blockAck", "blockChange", "bmiTitle", "bmiBody", "bmiLowBody", "bmiChange"];
for (const lang of appLanguages) {
  const copy = getHighRiskCopy(lang);
  for (const key of requiredKeys) assert.ok(typeof copy[key] === "string" && copy[key].trim(), `${lang}.${key}`);
  for (const key of HIGH_RISK_CONDITION_KEYS) assert.ok(copy.conditions[key]?.trim(), `${lang}.conditions.${key}`);
}
// Testi di Francesco (D-031), invariati.
assert.equal(getHighRiskCopy("it").blockTitle, "Per la tua sicurezza, DUBI non può generare automaticamente il piano.");
assert.equal(getHighRiskCopy("en").blockTitle, "For your safety, DUBI cannot generate an automatic plan.");
assert.equal(getHighRiskCopy("it").blockAck, "Ho capito");
assert.equal(getHighRiskCopy("en").blockAck, "I understand");
// Testi della domanda approvati da Francesco (D-043), invariati.
assert.equal(getHighRiskCopy("it").question, "Hai una delle seguenti condizioni oppure segui una dieta terapeutica prescritta da un medico o dietista?");
assert.equal(getHighRiskCopy("it").subtitle, "Se rispondi sì, per la tua sicurezza DUBI non genererà automaticamente calorie, macro o piano alimentare.");
assert.equal(getHighRiskCopy("it").answerNo, "No, nessuna di queste condizioni");
assert.equal(getHighRiskCopy("it").answerYes, "Sì, una o più condizioni");
assert.equal(getHighRiskCopy("en").question, "Do you have any of the following conditions, or are you following a therapeutic diet prescribed by a doctor or registered dietitian?");
assert.equal(getHighRiskCopy("en").subtitle, "If you answer yes, DUBI will not automatically generate calories, macros or a meal plan.");
assert.equal(getHighRiskCopy("en").answerNo, "No, none of these conditions");
assert.equal(getHighRiskCopy("en").answerYes, "Yes, one or more conditions");
for (const lang of appLanguages) {
  const copy = getHighRiskCopy(lang);
  assert.notEqual(copy.answerNo, copy.answerYes, `${lang}: two distinct answers`);
  assert.ok(copy.intro === undefined && copy.none === undefined, `${lang}: old checkbox texts removed`);
}

// Al server solo sì/no + versione; risposta mancante o diversa da "no"/"yes" = errore (mai un "no" di default).
assert.deepEqual([...HIGH_RISK_ANSWERS], ["no", "yes"]);
assert.deepEqual(highRiskAnswerBody("no"), { has_high_risk_condition: false, screening_version: BACKEND_VERSION });
assert.deepEqual(highRiskAnswerBody("yes"), { has_high_risk_condition: true, screening_version: BACKEND_VERSION });
assert.deepEqual(Object.keys(highRiskAnswerBody("yes")).sort(), ["has_high_risk_condition", "screening_version"]);
for (const missing of [null, undefined, ""]) assert.throws(() => highRiskAnswerBody(missing), /HIGH_RISK_ANSWER_MISSING/);
for (const invalid of [true, false, "si", "No", ["pregnancy_or_breastfeeding"], 1]) assert.throws(() => highRiskAnswerBody(invalid), /HIGH_RISK_ANSWER_INVALID/);

assert.equal(planBlockingCode({ error: "HEALTH_PLAN_BLOCKED" }), "HEALTH_PLAN_BLOCKED");
assert.equal(planBlockingCode({ error: "HIGH_RISK_SCREENING_REQUIRED" }), "HIGH_RISK_SCREENING_REQUIRED");
assert.equal(planBlockingCode({ error: "GOAL_UNSAFE_FOR_BMI" }), "GOAL_UNSAFE_FOR_BMI");
assert.equal(planBlockingCode({ error: "NO_SAFE_MATCH" }), null);
assert.equal(planBlockingCode(null), null);

// Collegamenti nell'app: la domanda viene prima di qualsiasi piano; nessun "continua comunque".
const openApp = app.slice(app.indexOf("const openAppWithDailySchedule = async"), app.indexOf("const handleDailyScheduleSubmit"));
assert.ok(openApp.indexOf("fetchHighRiskScreeningStatus()") > 0);
assert.ok(openApp.indexOf("fetchHighRiskScreeningStatus()") < openApp.indexOf("fetchDailyMealScheduleQuestion()"));
assert.match(app, /const blockingCode = planBlockingCode\(payload\);/);
const blockScreen = app.slice(app.indexOf("const HealthPlanBlockedScreen"), app.indexOf("function migrateTodayStatus"));
assert.ok(!/continua comunque|continue anyway/i.test(blockScreen));
assert.match(app, /\{!healthBlockKind && activeTab==="today"/);
assert.match(app, /\{!healthBlockKind && activeTab==="weekly"/);
const screen = app.slice(app.indexOf("const HighRiskScreeningScreen"), app.indexOf("const HealthPlanBlockedScreen"));
assert.match(screen, /useState\(null\)/, "no answer preselected");
assert.match(screen, /copy\.question/); assert.match(screen, /copy\.subtitle/);
assert.match(screen, /HIGH_RISK_CONDITION_KEYS\.map/, "the list is shown");
assert.ok(!/aria-pressed|toggle\(/.test(screen), "no per-condition checkboxes");
const saveFn = app.slice(app.indexOf("const saveHighRiskScreeningAnswer"), app.indexOf("const fetchDailyMealScheduleQuestion"));
assert.ok(!/conditions|selected/.test(saveFn), "the condition list must never be sent");

console.log(JSON.stringify({ test: "frontend-high-risk-screening", failures_total: 0, languages: appLanguages.length, live_backend_checked: liveBackendChecked }, null, 2));
