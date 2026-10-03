import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');

assert.match(app, /const WORKOUT_DAYS_BANDS = new Set\(\["0","1-2","3-4","5-6","7"\]\)/);
assert.match(app, /sessions_per_week: null,/);
assert.match(app, /workout_days_band: workoutDaysBand,/);
assert.match(app, /workout_days_band: canonicalData\.sportOnboardingContract\.training\.workout_days_band,/);
assert.match(app, /workout_days: parseInt\(String\(data\.workoutDays\)\.split\("-"\)\[0\], 10\),/,
  'legacy integer remains the existing lower-bound value');
assert.match(app, /workoutDays: source\.workout_days_band \|\| source\.workoutDaysBand \|\| source\.workout_days/,
  'saved band is restored before legacy integer');
assert.doesNotMatch(app, /sessions_per_week:\s*Number\(data\.workoutDays/,
  'band is never numerically coerced into sessions_per_week in frontend');

console.log('PASS frontend band contract: exact band sent/restored, legacy INT preserved, no numeric band coercion');
