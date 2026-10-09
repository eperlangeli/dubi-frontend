// D-066 (9 ott 2026, test di Enrico):
// 1. gli orari dei pasti mostrati sono quelli del server (prima una serie fissa 08:00, 11:30, 15:00… quando il piano
//    non aveva meal_schedule), in ordine di orario;
// 2. l'avviso "piano aggiornato da un altro dispositivo" si controlla ogni 15 s;
// 3. onboarding con 0 allenamenti: niente durata, intensità, sport e programma;
// 4. 14–17 anni: tre obiettivi con i nomi decisi (D-059/D-060), senza "Definizione" e senza peso obiettivo.
import assert from "node:assert/strict";
import fs from "node:fs";
import { PLAN_VERSION_POLL_MS } from "../src/planVersion.mjs";
import { MINOR_GOAL_IDS, MINOR_GOAL_LANGS, isMinorAge, minorGoalCopy } from "../src/minorGoals.mjs";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");

// 1. Orari
assert.match(app, /time: meal\.scheduled_time \|\| meal\.scheduledTime \|\| times\[index\] \|\| "--:--",/);
assert.match(app, /if \(Array\.isArray\(plan\.meals\)\) return sortMealsByTime\(plan\.meals\);/);
assert.match(app, /const mealTimes = mealTimesFromMeals\.length === meals\.length && meals\.length\n\s+\? mealTimesFromMeals/);
// Ordinamento: stessa funzione dell'app, estratta dal sorgente.
const sortSrc = app.match(/const sortMealsByTime = \(meals\) => meals[\s\S]*?\.map\(\(entry\) => entry\.meal\);/)[0];
const sortMealsByTime = new Function(`${sortSrc}; return sortMealsByTime;`)();
assert.deepEqual(sortMealsByTime([{ scheduled_time: "21:15", t: "d" }, { scheduled_time: "14:15", t: "l" }, { scheduled_time: "17:45", t: "s" }]).map((m) => m.t), ["l", "s", "d"]);

// 2. Controllo delle versioni
assert.equal(PLAN_VERSION_POLL_MS, 15000);

// 3. Onboarding senza allenamenti
assert.match(app, /if \(step === 3 && subStep === 0 && String\(data\.workoutDays\) === '0'\) \{\n\s+setSlideDir\('right'\);\n\s+setStep\(4\);\n\s+setSubStep\(0\);/);
assert.match(app, /\{String\(d\.workoutDays \|\| "0"\) !== "0" && \(<>\n\s+\{\/\* Sport \*\/\}/);
assert.match(app, /const skippedPage = \(prev===3 && String\(data\.workoutDays\)==='0'\) \|\| \(prev===2 && isMinorAge\(data\.age\)\);/);

// 4. Minorenni
assert.deepEqual([...MINOR_GOAL_IDS], ["fatLoss", "gain", "maintain"]);
assert.equal(MINOR_GOAL_LANGS.length, 10);
for (const lang of MINOR_GOAL_LANGS) {
  for (const id of MINOR_GOAL_IDS) {
    const copy = minorGoalCopy(id, lang);
    assert.ok(copy.t.length > 3 && copy.d.length > 3, `${lang}.${id}`);
    assert.ok(!/\d/.test(copy.t + copy.d), `${lang}.${id}: niente numeri o calorie`);
  }
  assert.equal(minorGoalCopy("definition", lang), null, `${lang}: niente Definizione`);
}
assert.equal(minorGoalCopy("fatLoss", "it").t, "Migliorare la forma fisica");
assert.equal(minorGoalCopy("gain", "it").t, "Aumentare la massa muscolare");
assert.equal(minorGoalCopy("maintain", "it").t, "Mantenere il peso");
assert.equal(isMinorAge(17), true); assert.equal(isMinorAge(18), false); assert.equal(isMinorAge(""), false);
assert.match(app, /\(isMinorAge\(d\.age\) \? GOALS\.filter\(g=>minorGoalCopy\(g\.id, lang\)\) : GOALS\)\.map/);
assert.match(app, /if \(step === 2 && subStep === 0 && isMinorAge\(data\.age\)\) \{/);
console.log(JSON.stringify({ test: "test-day-display-onboarding", result: "PASS" }));
