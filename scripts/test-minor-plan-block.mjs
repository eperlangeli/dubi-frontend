// D-032 / D-058 (Francesco, 9 ott 2026): per i 14–17 anni nessun piano automatico.
// Il codice del backend apre la schermata dedicata (mai un piano né il calcolo locale di riserva), con i testi in 10 lingue.
import assert from "node:assert/strict";
import fs from "node:fs";
import { PLAN_BLOCKING_CODES, planBlockingCode, getHighRiskCopy, HIGH_RISK_COPY_LANGUAGES } from "../src/highRiskScreening.mjs";

assert.ok(PLAN_BLOCKING_CODES.includes("MINOR_CLINICAL_PLAN_REQUIRED"));
assert.equal(planBlockingCode({ error: "MINOR_CLINICAL_PLAN_REQUIRED", nutrition_targets: null, recipe_plan: null }), "MINOR_CLINICAL_PLAN_REQUIRED");
assert.equal(HIGH_RISK_COPY_LANGUAGES.length, 10);
for (const lang of HIGH_RISK_COPY_LANGUAGES) {
  const copy = getHighRiskCopy(lang);
  for (const key of ["minorTitle", "minorBody", "minorNext", "blockAck"]) {
    assert.ok(typeof copy[key] === "string" && copy[key].trim().length > 10 || key === "blockAck", `${lang}.${key}`);
  }
  assert.ok(!/\d{3,4}\s?kcal/i.test(copy.minorBody), `${lang}: nessun numero di calorie`);
}
assert.match(getHighRiskCopy("it").minorTitle, /meno di 18 anni/);

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
assert.match(app, /code === 'MINOR_CLINICAL_PLAN_REQUIRED'\) \{ setHealthBlockKind\('minor'\); setPhase\('health-blocked'\)/);
assert.match(app, /const isMinor = kind === "minor";/);
assert.match(app, /isMinor \? copy\.minorTitle/);
assert.match(app, /planBlockingCode\(error\?\.payload\) \|\| planBlockingCode\(\{ error: error\?\.code \}\)\) throw error;/, "nessun calcolo locale di riserva per un piano bloccato");
console.log(JSON.stringify({ test: "test-minor-plan-block", result: "PASS" }));
