import assert from "node:assert/strict";
import {
  buildTodayWorkoutModel,
  getTrainingSessionForDate,
  isTrainingSessionComplete,
  normalizeTrainingSessions,
  removeTrainingSession,
  upsertTrainingSession,
  workoutScheduleSignature,
} from "../src/workoutScheduleModel.mjs";

let sessions = [];
sessions = upsertTrainingSession(sessions, {
  day_of_week: 1,
  sport_id: "powerlifting",
  start_time: "19:00",
  duration_minutes: 90,
  session_index: 1,
});
assert.deepEqual(sessions, [{day_of_week:1,sport_id:"powerlifting",start_time:"19:00",duration_min:90,session_index:1}]);
assert.equal(isTrainingSessionComplete(sessions[0]), true);
assert.equal(getTrainingSessionForDate(sessions, "2026-09-21")?.start_time, "19:00");
assert.equal(buildTodayWorkoutModel({sessions,isoDate:"2026-09-21"}).status, "complete");
assert.equal(buildTodayWorkoutModel({sessions,isoDate:"2026-09-21"}).detail, "19:00 · 90 min");

sessions = upsertTrainingSession(sessions, {...sessions[0],start_time:"20:15",duration_min:75});
assert.equal(sessions.length, 1, "editing a day must replace its single session without reload duplicates");
assert.equal(sessions[0].start_time, "20:15");
assert.equal(sessions[0].duration_min, 75);

const incomplete = normalizeTrainingSessions([{day_of_week:2,sport_id:"powerlifting",start_time:"",duration_min:null,session_index:1}]);
assert.equal(buildTodayWorkoutModel({sessions:incomplete,isoDate:"2026-09-22"}).status, "incomplete");
assert.equal(buildTodayWorkoutModel({sessions:incomplete,isoDate:"2026-09-22"}).title, "Mancano orario o durata");

const before = workoutScheduleSignature(sessions);
sessions = removeTrainingSession(sessions, 1);
assert.notEqual(workoutScheduleSignature(sessions), before);
assert.equal(buildTodayWorkoutModel({sessions,isoDate:"2026-09-21"}).status, "rest");

console.log("Workout schedule model tests passed");
