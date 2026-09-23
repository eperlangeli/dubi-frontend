#!/usr/bin/env node
/*
 * DUBI frontend guard — spec DUBI_ROUTING_V16_2
 *
 * Location in repo: scripts/test-no-name-substitution.mjs  (dubi-frontend)
 * Run:              node scripts/test-no-name-substitution.mjs
 * Exit code:        0 = pass, 1 = fail (CI must fail)
 *
 * Spec rules enforced:
 *  - "Runtime ingredient-name substitutions are prohibited for allergy and intolerance routing."
 *  - "No output may be built from display-name replacements."
 *  - "When the candidate set is empty ... return NO_SAFE_MATCH rather than a fabricated meal."
 *
 * DO NOT weaken or delete checks to make this pass. Remove the forbidden code instead.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src');

function files(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return files(p);
    return ['.js', '.jsx', '.mjs', '.ts', '.tsx'].includes(extname(p)) ? [p] : [];
  });
}

const sources = files(SRC).map((p) => ({ p, s: readFileSync(p, 'utf8') }));
const all = sources.map((x) => x.s).join('\n');
const failures = [];

// 1. Forbidden symbols: client-side text substitution and hard-coded fallback meals.
const FORBIDDEN = [
  'applyAllergyFilter',
  'applyDietSub',
  'applySeasonalSub',
  'WEEKLY_MEALS',
  'getDietMeals',
];
for (const { p, s } of sources) {
  for (const sym of FORBIDDEN) {
    const n = (s.match(new RegExp(`\\b${sym}\\b`, 'g')) || []).length;
    if (n) failures.push({ check: 'forbidden_symbol', file: p.replace(ROOT, ''), symbol: sym, occurrences: n });
  }
}

// 2. No .replace() that rewrites a food/allergen word into another food.
const FOOD_REPLACE = /\.replace\(\s*\/[^/]*\b(latte|ricotta|formagg|yogurt|uov|sesamo|tahin|arachid|soia|tofu|pollo|manzo|pesce|salmone|tonno|glutin|pane|pasta|miele|semi)[^/]*\/[gimsuy]*\s*,\s*["'`]/i;
const FOOD_REPLACE_TARGET = /\.replace\(\s*\/[^/]*\/[gimsuy]*\s*,\s*["'`]([^"'`]*)["'`]/;
const ENGLISH_FOOD = /\b(milk|beef|chicken|egg|eggs|banana|whole|medium|skimmed|fish|bread|seeds?|cheese|pork|turkey|oil)\b/i;
const ITALIAN_FOOD = /\b(latte|ricotta|formaggio|yogurt|uov[ao]|sesamo|hummus|arachidi|soia|tofu|pollo|manzo|pesce|miele|semi di|fiocchi|sciroppo|avena|zucca|girasole)\b/i;
for (const { p, s } of sources) {
  s.split('\n').forEach((line, i) => {
    // Display translations IT -> EN (e.g. localizeFood) are allowed: they change the language, not the food.
    const target = (line.match(FOOD_REPLACE_TARGET) || [])[1] || '';
    const isEnglishTranslation = ENGLISH_FOOD.test(target) && !ITALIAN_FOOD.test(target);
    if (FOOD_REPLACE.test(line) && !isEnglishTranslation) failures.push({ check: 'food_name_replace', file: p.replace(ROOT, ''), line: i + 1, code: line.trim().slice(0, 160) });
  });
}

// 3. Mustard must be selectable in onboarding (spec §6 mustard-free route).
const keys = all.match(/ALLERGY_KEYS\s*=\s*\[([^\]]*)\]/);
if (!keys || !/["']mustard["']/.test(keys[1])) failures.push({ check: 'mustard_allergy_option', detail: 'ALLERGY_KEYS must include "mustard"' });

// 4. NO_SAFE_MATCH / controlled failures must be handled explicitly (no silent fallback meal).
if (!/NO_SAFE_MATCH|RECIPE_ENGINE_V1_CONTROLLED_FAILURE/.test(all)) {
  failures.push({ check: 'no_safe_match_handled', detail: 'frontend must show a "no safe recipe" state for NO_SAFE_MATCH / RECIPE_ENGINE_V1_* errors' });
}

console.log(JSON.stringify({ test: 'no-name-substitution', failures_total: failures.length, failures: failures.slice(0, 60) }, null, 2));
process.exit(failures.length ? 1 : 0);

