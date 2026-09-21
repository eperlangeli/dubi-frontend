import assert from "node:assert/strict";
import {
  buildTodayWorkoutModel,
  getTrainingSessionForDate,
  getTrainingSessionsForDate,
  isTrainingSessionComplete,
  normalizeTrainingSessions,
  removeTrainingSession,
  trainingSessionsOverlap,
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

sessions = upsertTrainingSession(sessions, {
  day_of_week:1,
  sport_id:"running",
  start_time:"18:00",
  duration_min:45,
  session_index:2,
});
assert.deepEqual(
  getTrainingSessionsForDate(sessions,"2026-09-21").map(session=>[session.session_index,session.sport_id,session.start_time]),
  [[1,"running","18:00"],[2,"powerlifting","20:15"]],
  "multiple sports must remain separate and sort chronologically"
);
assert.equal(trainingSessionsOverlap(sessions),false);
assert.equal(buildTodayWorkoutModel({sessions,isoDate:"2026-09-21"}).status,"multiple");
assert.equal(buildTodayWorkoutModel({sessions,isoDate:"2026-09-21"}).sessions.length,2);

const overlap = normalizeTrainingSessions([
  {day_of_week:1,sport_id:"powerlifting",start_time:"18:00",duration_min:90,session_index:1},
  {day_of_week:1,sport_id:"running",start_time:"19:00",duration_min:45,session_index:2},
]);
assert.equal(trainingSessionsOverlap(overlap),true);

assert.equal(buildTodayWorkoutModel({
  sessions,
  isoDate:"2026-09-21",
  dailyOverride:{state:"rest",sessions:[]},
}).title,"Oggi non ti alleni");
assert.equal(buildTodayWorkoutModel({
  sessions,
  isoDate:"2026-09-21",
  dailyOverride:{state:"training",sessions:[{day_of_week:1,sport_id:"running",start_time:"07:00",duration_min:30,session_index:1}]},
}).session.sport_id,"running","today override must supersede the recurring primary-sport session");

const incomplete = normalizeTrainingSessions([{day_of_week:2,sport_id:"powerlifting",start_time:"",duration_min:null,session_index:1}]);
assert.equal(buildTodayWorkoutModel({sessions:incomplete,isoDate:"2026-09-22"}).status, "incomplete");
assert.equal(buildTodayWorkoutModel({sessions:incomplete,isoDate:"2026-09-22"}).title, "Mancano sport, orario o durata");

const before = workoutScheduleSignature(sessions);
sessions = removeTrainingSession(sessions, 1);
assert.notEqual(workoutScheduleSignature(sessions), before);
assert.equal(buildTodayWorkoutModel({sessions,isoDate:"2026-09-21"}).status, "rest");

console.log("Workout schedule model tests passed");
