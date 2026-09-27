import assert from "node:assert/strict";
import { canonicalSportId, classifySportSearch, searchSports } from "../src/sportSearchModel.mjs";
import { normalizeTrainingSessions } from "../src/workoutScheduleModel.mjs";

const sports = [
  {sport_id:"muay_thai",name_it:"Muay thai",name_en:"Muay thai"},
  {sport_id:"table_tennis",name_it:"Ping pong",name_en:"Table tennis"},
  {sport_id:"indoor_cycling",name_it:"Spinning / cyclette",name_en:"Indoor cycling"},
  {sport_id:"soccer",name_it:"Calcio",name_en:"Football or soccer"},
  {sport_id:"archery",name_it:"Tiro con l'arco",name_en:"Archery"},
];
assert.equal(searchSports(sports,"muay thai","it")[0].sport_id,"muay_thai");
assert.equal(searchSports(sports,"ping pong","it")[0].sport_id,"table_tennis");
assert.equal(searchSports(sports,"Ping-Pong","en")[0].sport_id,"table_tennis");
assert.equal(searchSports(sports,"table tennis","en")[0].sport_id,"table_tennis");
assert.equal(searchSports(sports,"spinning","it")[0].sport_id,"indoor_cycling");
assert.equal(searchSports(sports,"tiro con l'arco","it")[0].sport_id,"archery");
assert.equal(searchSports(sports,"arco","it")[0].sport_id,"archery");
assert.equal(searchSports(sports,"archery","en")[0].sport_id,"archery");
assert.equal(classifySportSearch(sports,"ultra pickleball").kind,"unmatched");
for (const [oldId,newId] of Object.entries({football:"soccer",kayak:"canoe_kayak",nordic_ski:"cross_country_ski",sprint:"sprint_track",surf:"surfing",equestrian:"horse_riding",baseball:"baseball_softball",cycling:"cycling_road",gym:"resistance_training"})) assert.equal(canonicalSportId(oldId),newId);
assert.equal(normalizeTrainingSessions([{day_of_week:1,sport_id:"gym",start_time:"18:00",duration_min:60}])[0].sport_id,"resistance_training");
assert.equal(normalizeTrainingSessions([{day_of_week:1,sport_id:"custom:climbing_wall",start_time:"18:00",duration_min:60}])[0].sport_id,"custom:climbing_wall");
console.log("PASS sport search normalization, bilingual examples, and legacy aliases");
