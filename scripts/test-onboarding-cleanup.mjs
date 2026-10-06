import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fallbackTdee, normalizeLegacyGoal } from '../src/nutritionFallback.mjs';
import { toAppGoalStrict } from '../src/goalMacroRules.mjs';

const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
const legacyCompetitionPlanGoal = normalizeLegacyGoal('competition');
assert.equal(legacyCompetitionPlanGoal, 'maintain');
// D-017a (5 ott 2026): un obiettivo mancante o sconosciuto non diventa più "maintain" (errore esplicito).
// Resta l'invariante di questo test: il vecchio obiettivo "competition" diventa mantenimento valido.
assert.equal(toAppGoalStrict('competition'), 'maintain');
assert.equal(toAppGoalStrict(''), null);
assert.match(app, /const toAppGoal\s*=\s*\(value\)\s*=>\s*toAppGoalStrict\(value\)/);
assert.match(app, /const goal = requireGoal\(normalizeLegacyGoal\(data\.goal\)\)/);
assert.match(app, /"goal\.labels\.maintain"/);
assert.match(app, /competition:\s*\{\s*participates:\s*false,\s*competition_date:\s*null,\s*competition_name:\s*null\s*\}/s);

for (const obsolete of [
  'occupation', 'dailySteps', 'sedentaryDays', 'targetBodyFat', 'dietIntensity',
  'calcRacePhase', 'racePhase', 'goal.competition', 'race.phase',
]) assert(!app.includes(obsolete), `App.jsx must not contain ${obsolete}`);

const expectedProfiles = [
  { gender: 'F', age: 28, height: 168, weight: 63, workoutDays: '0', workoutIntensity: 'moderata', expected: 1655 },
  { gender: 'M', age: 36, height: 182, weight: 82, workoutDays: '3-4', workoutIntensity: 'moderata', expected: 2333 },
  { gender: 'F', age: 41, height: 160, weight: 58, workoutDays: '5-6', workoutIntensity: 'alta', expected: 1921 },
];
for (const profile of expectedProfiles) {
  assert.equal(fallbackTdee(profile), profile.expected);
}

assert.match(app, /const PAGES_PER_STEP = \[1, 2, 2, 2, 2, 1\]/);
assert.match(app, /const TOTAL_PAGES = 10/);
assert.match(app, /workout_duration: data\.workoutDuration/);
assert.match(app, /training_sessions: canonicalData\.sportOnboardingContract\.training\.sessions/);

console.log(JSON.stringify({
  test: 'onboarding-cleanup',
  failures_total: 0,
  legacy_competition_goal: { normalized: legacyCompetitionPlanGoal, label: 'goal.labels.maintain', valid_plan_goal: true },
  fallback_tdee_profiles: expectedProfiles.map(({ gender, age, height, weight, workoutDays, workoutIntensity, expected }) => ({ gender, age, height, weight, workout_days: workoutDays, intensity: workoutIntensity, tdee: fallbackTdee({ gender, age, height, weight, workoutDays, workoutIntensity }), backend_tdee: expected })),
  wizard_pages: 10,
}, null, 2));
