import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildTodayWorkoutCardState } from '../src/workoutScheduleModel.mjs';
import { confirmScheduledTraining } from '../src/trainingConfirmationApi.mjs';

const date = '2026-09-28';
const sessions = [{ day_of_week: 1, sport_id: 'powerlifting', start_time: '19:00', duration_min: 90 }];
const unconfirmed = buildTodayWorkoutCardState({ sessions, isoDate: date, confirmationStatus: 'unconfirmed' });
assert.equal(unconfirmed.showExpectedRoutine, true);
assert.equal(unconfirmed.routineSessions[0].sport_id, 'powerlifting');
assert.equal(unconfirmed.showRoutineConfirmationActions, true);
assert.equal(unconfirmed.confirmationStatus, 'unconfirmed');

const confirmed = buildTodayWorkoutCardState({ sessions, isoDate: date, confirmationStatus: 'confirmed_training' });
assert.equal(confirmed.showExpectedRoutine, true);
assert.equal(confirmed.showRoutineConfirmationActions, false);

const rest = buildTodayWorkoutCardState({ sessions, isoDate: date, confirmationStatus: 'confirmed_rest' });
assert.equal(rest.showConfirmedRest, true);
assert.equal(rest.showExpectedRoutine, false);

const noRoutine = buildTodayWorkoutCardState({ sessions: [], isoDate: date });
assert.equal(noRoutine.showQuestion, true);
assert.equal(noRoutine.showRoutineConfirmationActions, false);

const requests = [];
const result = await confirmScheduledTraining({
  date,
  apiBaseUrl: 'https://api.example.test',
  token: 'test-token',
  fetcher: async (url, options) => {
    requests.push({ url, options });
    return { ok: true, json: async () => ({ confirmation: { status: 'confirmed_yes' }, plan_invalidated: false }) };
  },
});
assert.equal(requests.length, 1);
assert.equal(requests[0].url, 'https://api.example.test/api/training/day/confirm');
assert.equal(requests[0].options.method, 'POST');
assert.equal(requests[0].options.headers.Authorization, 'Bearer test-token');
assert.deepEqual(JSON.parse(requests[0].options.body), { day: date, answer: 'yes' });
assert.equal(result.plan_invalidated, false);

const appSource = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
assert(!appSource.includes('const MorningTrainingCard'), 'obsolete morning workout card must be removed');
assert(appSource.includes('data-testid="today-training-unconfirmed"'));
assert(appSource.includes('"Sì, mi alleno"'));
assert(appSource.includes('"Oggi no"'));
assert(appSource.includes('confirmScheduledTraining as postScheduledTrainingConfirmation'));
assert(appSource.includes('await postScheduledTrainingConfirmation({date:todayIso'));

console.log(JSON.stringify({
  test: 'today-workout-card-confirmation-state',
  unconfirmed_routine: 'PASS',
  confirmed_training_no_regeneration: 'PASS',
  confirmed_rest: 'PASS',
  no_routine_ask_flow: 'PASS',
  obsolete_card_removed: 'PASS',
  failures_total: 0,
}, null, 2));
