import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { declaresTraining, classifyDeclaredSports, trainingEligibility } from '../src/trainingEligibilityModel.mjs';

const catalog = [
  { sport_id: 'running', name_it: 'Corsa', name_en: 'Running' },
  { sport_id: 'skateboarding', name_it: 'Skateboard', name_en: 'Skateboarding' },
  { sport_id: 'calisthenics', name_it: 'Calisthenics', name_en: 'Calisthenics' },
  { sport_id: 'boxing', name_it: 'Boxe', name_en: 'Boxing' },
];
const legacy = new Set(['martial_arts']);

// declaresTraining: banda, numero, routine; "0" e vuoto = non si allena
assert.equal(declaresTraining({ workout_days_band: '3-4' }), true);
assert.equal(declaresTraining({ workout_days_band: '0' }), false);
assert.equal(declaresTraining({ workoutDays: '1-2' }), true);
assert.equal(declaresTraining({ workout_days: 0 }), false);
assert.equal(declaresTraining({ workout_days: 4 }), true);
assert.equal(declaresTraining({}), false);
assert.equal(declaresTraining({ workout_days_band: '0', training_sessions: [{ day_of_week: 1 }] }), true);

// D-018: chi non si allena non vede la card e non vede la schermata sport
assert.equal(trainingEligibility({ userData: { workout_days_band: '0' }, rawSports: [], catalog, legacyIds: legacy }).status, 'no_training');
// catalogo non ancora caricato: nessuna decisione
assert.equal(trainingEligibility({ userData: { workout_days_band: '3-4' }, rawSports: [], catalog: [] }).status, 'loading');
// D-019: si allena senza sport -> schermata
assert.equal(trainingEligibility({ userData: { workout_days_band: '3-4' }, rawSports: [], catalog, legacyIds: legacy }).status, 'sport_required');
// sport valido -> card
assert.equal(trainingEligibility({ userData: { workout_days_band: '3-4' }, rawSports: ['running'], catalog, legacyIds: legacy }).status, 'eligible');
// legacy martial_arts resta valido (ha la sua richiesta una tantum)
assert.equal(trainingEligibility({ userData: { workout_days_band: '1-2' }, rawSports: ['martial_arts'], catalog, legacyIds: legacy }).status, 'eligible');

// testo libero: mai convertito da solo, solo proposto
const skate = trainingEligibility({ userData: { workout_days_band: '3-4' }, rawSports: ['skate'], catalog, legacyIds: legacy });
assert.equal(skate.status, 'sport_required');
assert.deepEqual(skate.valid, []);
assert.equal(skate.invalid[0].raw, 'skate');
assert.equal(skate.invalid[0].text, 'skate');
assert.equal(skate.invalid[0].suggestion?.sport_id, 'skateboarding');

// un testo non riconosciuto accanto a uno valido blocca comunque: va chiarito
const mixed = classifyDeclaredSports(['running', 'corpo_libero_a_casa'], catalog, legacy);
assert.deepEqual(mixed.valid, ['running']);
assert.equal(mixed.invalid[0].text, 'corpo libero a casa');
assert.equal(mixed.invalid[0].suggestion?.sport_id, 'calisthenics');
assert.equal(trainingEligibility({ userData: { workout_days_band: '3-4' }, rawSports: ['running', 'corpo_libero_a_casa'], catalog, legacyIds: legacy }).status, 'sport_required');

// custom: e "other" sono non validi; other senza testo, nessun suggerimento
const custom = classifyDeclaredSports(['custom:muay_thai', 'other'], catalog, legacy);
assert.equal(custom.valid.length, 0);
assert.equal(custom.invalid[0].text, 'muay thai');
assert.equal(custom.invalid[1].text, '');
assert.equal(custom.invalid[1].suggestion, null);

// collegamenti in App.jsx
const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
assert(app.includes('from "./trainingEligibilityModel.mjs"'), 'App must use the eligibility model');
assert(app.includes('data-testid="sport-required-screen"'), 'D-019 screen must exist');
assert(app.includes('Quali sport pratichi?'), 'D-019 approved title');
assert(app.includes('Per costruire il tuo piano, DUBI ha bisogno di sapere quali sport pratichi.'), 'D-019 approved text');
assert(app.includes('Non pratico sport'), 'D-019 opt-out');
assert(/eligibility\.status\s*===\s*"eligible"\s*&&\s*<TodayWorkoutCard/.test(app), 'D-018: card only when eligible');
// D-022: nessuno sport personalizzato nel selettore
assert(!app.includes('CUSTOM_MAPPING_REQUIRED'), 'D-022: no custom sport mapping in picker');
assert(!app.includes('Salva sport da valutare'), 'D-022: no custom sport save');
assert(!app.includes('descrivi il tuo sport'), 'D-022: no free-text sport description');

// D-018: l'assistente apre solo la schermata dell'allenamento
const { SUPPORTED_PLAN_CHANGE_ACTIONS, isSupportedPlanChange } = await import('../src/meal-replacement.mjs');
assert(SUPPORTED_PLAN_CHANGE_ACTIONS.includes('open_training_card'));
assert.equal(isSupportedPlanChange({ action: 'set_sport' }), false);
assert(app.includes('planChange.action === "open_training_card"'), 'assistant action handled');
assert(app.includes('onOpenTrainingCard={openTrainingCardFromAssistant}'), 'assistant wired to TodayScreen');
assert(app.includes('mode="activate"'), 'activation screen for users without declared training');
assert(app.includes('data-testid="sport-activation-routine"'), 'activation asks days, duration and intensity');
// nessuna risposta preselezionata nella schermata di attivazione (D-011 B)
assert(app.includes('const [daysBand,setDaysBand]=useState("");'));
assert(app.includes('const [duration,setDuration]=useState("");'));
assert(app.includes('const [intensity,setIntensity]=useState("");'));

console.log(JSON.stringify({ test: 'training-eligibility-d018-d019-d022', failures_total: 0 }, null, 2));
