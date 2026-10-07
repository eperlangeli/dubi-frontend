// D-041 (2), D-042 (2), D-043 (3, 5): testi e dettagli della composizione corporea.
import assert from "node:assert/strict";
import { BODY_COMPOSITION_COPY_LANGUAGES, BODY_FAT_METHODS, getBodyCompositionCopy, bodyCompositionMessage, bodyCompositionDetails, bodyCompositionNotices } from "../src/bodyComposition.mjs";

const LANGS = ["it", "en", "fr", "es", "de", "ar", "pt", "zh", "ja", "ru"];
assert.deepEqual([...BODY_COMPOSITION_COPY_LANGUAGES].sort(), [...LANGS].sort());
const KEYS = ["title", "measured", "estimate", "toRecomposition", "updateMeasurement", "formTitle", "formValue", "formMethod", "formDate", "formSave",
  "scaleEstimate", "conflict", "needTwoReadings", "estimateTag", "lowBodyFat", "expired", "sourceLabel", "dateLabel", "rangeLabel", "deurenberg"];
for (const lang of LANGS) {
  const copy = getBodyCompositionCopy(lang);
  for (const key of KEYS) assert.ok(typeof copy[key] === "string" && copy[key].trim(), `${lang}.${key}`);
  for (const method of BODY_FAT_METHODS) assert.ok(copy.methods[method]?.trim(), `${lang}.methods.${method}`);
  // Le variabili restano: nessuna traduzione perde il valore da mostrare.
  for (const key of ["measured", "scaleEstimate"]) assert.match(copy[key], /\{x\}/, `${lang}.${key}`);
  for (const v of ["{x}", "{y}", "{z}"]) assert.ok(copy.estimate.includes(v), `${lang}.estimate ${v}`);
}
assert.throws(() => getBodyCompositionCopy("xx"), /BODY_COMPOSITION_COPY_MISSING/);

// Testi approvati da Francesco (7 ottobre 2026), parola per parola.
const it = getBodyCompositionCopy("it"); const en = getBodyCompositionCopy("en");
assert.equal(it.scaleEstimate, "La bilancia o il wearable stima il tuo grasso corporeo al {x}%. Questo valore può variare in base a idratazione, orario e dispositivo: lo consideriamo una stima, non una misurazione clinica.");
assert.equal(en.scaleEstimate, "Your scale or wearable estimates your body fat at {x}%. This value can vary with hydration, timing and device, so DUBI treats it as an estimate rather than a clinical measurement.");
assert.equal(it.conflict, "I dati sulla composizione corporea non sono coerenti tra loro. Prima di applicare un surplus calorico, aggiorna la misurazione o inserisci un dato ottenuto con un metodo più affidabile.");
assert.equal(en.conflict, "Your body-composition data are not consistent. Before applying a calorie surplus, update the measurement or enter a value obtained with a more reliable method.");
assert.equal(it.needTwoReadings, "Misura ogni circonferenza due volte, nelle stesse condizioni, senza stringere il metro. DUBI utilizzerà la media delle due misurazioni.");
assert.equal(en.needTwoReadings, "Measure each circumference twice under the same conditions, without tightening the tape. DUBI will use the average of the two measurements.");
assert.equal(it.estimateTag, "Stima indicativa, non misurazione clinica.");
assert.equal(en.estimateTag, "Indicative estimate, not a clinical measurement.");
assert.equal(it.lowBodyFat, "Il valore indicato è molto basso. Per la tua sicurezza DUBI non può creare automaticamente un piano di dimagrimento o definizione. Ti consigliamo di verificare la composizione corporea con un professionista.");
assert.equal(en.lowBodyFat, "The reported value is very low. For your safety, DUBI cannot automatically create a fat-loss or definition plan. We recommend verifying your body composition with a qualified professional.");
assert.equal(it.title, "Prima di impostare un surplus, controlliamo la composizione corporea.");
assert.equal(it.toRecomposition, "Passa a ricomposizione");
assert.equal(en.toRecomposition, "Switch to body recomposition");

const estimate = { value_pct: 31.2, range_low_pct: 26.2, range_high_pct: 36.2 };
assert.equal(bodyCompositionMessage({ status: "SURPLUS_NOT_RECOMMENDED", basis: "DEURENBERG", estimate }, "it"),
  "DUBI stima una percentuale di grasso di circa 31,2%, con un intervallo indicativo di 26,2–36,2%. È una stima basata su BMI, età e sesso, non una misurazione diretta.");
assert.equal(bodyCompositionMessage({ status: "SURPLUS_NOT_RECOMMENDED", basis: "MEASUREMENT", estimate, measurement: { value_pct: 27, method: "DEXA_OR_CLINICAL" } }, "it"),
  "La percentuale di grasso indicata è 27%. In questa situazione un surplus calorico potrebbe aumentare soprattutto la massa grassa. DUBI non avvia la fase massa e propone un percorso di ricomposizione a mantenimento.");
assert.equal(bodyCompositionMessage({ status: "DATA_CONFLICT", estimate }, "en"), en.conflict);
assert.equal(bodyCompositionMessage({ status: "LOW_BODY_FAT_BLOCK", basis: "MEASUREMENT", estimate, measurement: { value_pct: 5.5, method: "DEXA_OR_CLINICAL" } }, "it"), it.lowBodyFat);
assert.equal(bodyCompositionMessage({ status: "CAUTION", basis: "SCALE_OR_WEARABLE", estimate, measurement: { value_pct: 29, method: "SCALE_OR_WEARABLE" } }, "it"),
  "La bilancia o il wearable stima il tuo grasso corporeo al 29%. Questo valore può variare in base a idratazione, orario e dispositivo: lo consideriamo una stima, non una misurazione clinica.");
assert.deepEqual(bodyCompositionNotices({ notices: [{ code: "BODY_COMPOSITION_MEASUREMENT_EXPIRED" }] }, "it"), [it.expired]);

const rows = bodyCompositionDetails({ estimate, measurement: { value_pct: 30, method: "SCALE_OR_WEARABLE", measured_at: "2026-10-01", range_low_pct: 25, range_high_pct: 35, is_estimate: true } }, "it", "2026-10-07");
assert.equal(rows.length, 2);
for (const row of rows) { assert.ok(row.value && row.source && row.date && row.range); assert.equal(row.estimateTag, it.estimateTag); }
const dexa = bodyCompositionDetails({ estimate, measurement: { value_pct: 22, method: "DEXA_OR_CLINICAL", measured_at: "2026-09-30", range_low_pct: null, range_high_pct: null, is_estimate: false } }, "en", "2026-10-07");
assert.equal(dexa[0].estimateTag, null);
assert.equal(dexa[1].estimateTag, en.estimateTag);

console.log(JSON.stringify({ test: "frontend-body-composition-copy", failures_total: 0, languages: LANGS.length }, null, 2));
