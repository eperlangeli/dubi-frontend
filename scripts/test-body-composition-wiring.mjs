// D-041 / D-042 / D-043: nell'app la regola sul grasso corporeo arriva solo dal backend.
// Le vecchie regole locali (HARD 2 "BF essenziale + cut", HARD 3 "BF alta + gain") non devono tornare:
// la sola stima non blocca e non forza mai il dimagrimento. L'avviso usa i testi approvati.
import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const safety = app.slice(app.indexOf("function runSafetyChecks(data)"), app.indexOf("return { findings, bmi, bf, bfCat };"));
assert.ok(safety.length > 0);
assert.ok(!/bf_essenziale_cut|bf_alta_gain/.test(safety), "old body-fat rules removed");
assert.ok(!/bfCat\.risk/.test(safety), "no local body-fat gate");
assert.ok(!/recommendedGoal: "fatLoss"/.test(safety), "never forces fat loss");
assert.match(app, /bodyComposition: ingredientPlan\?\.body_composition \|\| null,/);
assert.match(app, /<BodyCompositionNotice assessment=\{plan\?\.bodyComposition\} lang=\{lang\}\/>/);
const notice = app.slice(app.indexOf("const BodyCompositionNotice"), app.indexOf("// D-031 / D-040 / D-043 (3)"));
assert.match(notice, /bodyCompositionMessage\(assessment, lang\)/);
assert.match(notice, /bodyCompositionDetails\(/);
assert.match(notice, /row\.estimateTag/);
assert.match(notice, /copy\.sourceLabel/);
console.log(JSON.stringify({ test: "frontend-body-composition-wiring", failures_total: 0 }, null, 2));
