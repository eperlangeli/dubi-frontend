// D-057: scanner del codice a barre nell'app. Testi nelle 10 lingue costruiti dai dati strutturati del backend
// (italiano identico ai testi del backend), chiamate al backend, codice letto, ordine dei gruppi.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  GROUP_ORDER, PRODUCT_SCAN_LANGS, errorText, fetchProductScanStatus, normalizeBarcode, orderedGroups,
  productScanTexts, reasonText, scanProduct, suggestionText, verdictLabel,
} from "../src/productScan.mjs";

const fixtures = JSON.parse(readFileSync(new URL("./fixtures/product-scan-responses.json", import.meta.url), "utf8")).cases;

// Parità con il backend: ogni motivo e suggerimento in italiano coincide con text_it / suggestion_it.
for (const [name, result] of Object.entries(fixtures)) {
  for (const reason of result.reasons) assert.equal(reasonText(reason, "it"), reason.text_it, `${name}: ${reason.code}`);
  assert.equal(suggestionText(result.suggestion, "it"), result.suggestion_it ?? null, `${name}: suggerimento`);
  assert.equal(verdictLabel(result.verdict, "it"), result.verdict_label_it, `${name}: esito`);
  for (const group of result.groups) assert.equal(productScanTexts("it").groups[group.key], group.label_it, `${name}: gruppo ${group.key}`);
}

// Ogni lingua ha tutte le chiavi dell'italiano, tutti i motivi producono testo, mai "sicuro".
const it = productScanTexts("it");
const keysOf = (o) => Object.keys(o).sort();
assert.equal(PRODUCT_SCAN_LANGS.length, 10);
for (const lang of PRODUCT_SCAN_LANGS) {
  const tx = productScanTexts(lang);
  assert.deepEqual(keysOf(tx), keysOf(it), `${lang}: chiavi`);
  for (const k of ["errors", "verdicts", "groups", "routes", "dietPlan", "dietAdj"]) assert.deepEqual(keysOf(tx[k]), keysOf(it[k]), `${lang}: ${k}`);
  for (const result of Object.values(fixtures)) {
    for (const reason of result.reasons) {
      const s = reasonText(reason, lang);
      assert.ok(s && !/undefined|null/.test(s), `${lang}: ${reason.code} → ${s}`);
    }
    const s = suggestionText(result.suggestion, lang);
    if (result.suggestion) assert.ok(s && !/undefined|null/.test(s), `${lang}: suggerimento ${s}`);
  }
  if (lang !== "it") assert.notEqual(tx.open, it.open, `${lang}: tradotto`);
  const all = JSON.stringify(tx) + Object.values(fixtures).map((r) => r.reasons.map((x) => reasonText(x, lang)).join(" ")).join(" ");
  assert.ok(!/\bsicur|\bsafe\b|\bsûr|\bseguro\b|\bsicher\b|celiac|celiach/i.test(all), `${lang}: mai "sicuro" né "adatto ai celiaci"`);
}

// Esempio in inglese.
const gv = fixtures.gluten_vegan;
assert.equal(reasonText(gv.reasons.find((r) => r.restriction?.[0] === "gluten_free"), "en"), "Contains farina di frumento (gluten). You listed it as something to avoid.");
assert.equal(suggestionText(gv.suggestion, "en"), "Try a similar product (biscotti) without gluten, soy, vegan.");

// Gruppi: ordine fisso della specifica, ordine dell'etichetta dentro il gruppo, gruppi vuoti assenti.
const shuffled = { groups: [...fixtures.none.groups].reverse().map((g) => ({ ...g, items: [...g.items].reverse() })) };
const ordered = orderedGroups(shuffled);
assert.deepEqual(ordered.map((g) => g.key), GROUP_ORDER.filter((k) => fixtures.none.groups.some((g) => g.key === k)));
for (const g of ordered) assert.deepEqual(g.items.map((i) => i.order), [...g.items.map((i) => i.order)].sort((a, b) => a - b));
assert.deepEqual(orderedGroups(fixtures.oats_in_diet).map((g) => g.key), ["IN_YOUR_DIET"]);
assert.deepEqual(orderedGroups(null), []);
// Percentuale solo se dichiarata (il backend non manda mai la stima).
assert.ok(fixtures.none.groups.flatMap((g) => g.items).every((i) => !("percent_estimate" in i)));

// Codice a barre: stessa regola del backend.
assert.equal(normalizeBarcode(" 8076 8001-95057 "), "8076800195057");
assert.equal(normalizeBarcode("12345678"), "12345678");
for (const bad of ["1234567", "123456789012345", "abc12345678", "", null, undefined]) assert.equal(normalizeBarcode(bad), null);

// Chiamate al backend (fetch finta): mai Open Food Facts dall'app, token sempre presente, errori espliciti.
const calls = [];
const fake = (status, body) => async (url, options) => { calls.push({ url, options }); return { ok: status >= 200 && status < 300, status, json: async () => body }; };
const r = await scanProduct({ apiBaseUrl: "https://api.test", token: "tok", barcode: "8000 0000 00002", fetchImpl: fake(200, fixtures.none) });
assert.equal(r.verdict, "NO_ISSUE_FOUND");
assert.equal(calls[0].url, "https://api.test/api/product-scan/lookup");
assert.equal(calls[0].options.method, "POST");
assert.deepEqual(JSON.parse(calls[0].options.body), { barcode: "8000000000002" }, "solo il codice");
assert.equal(calls[0].options.headers.Authorization, "Bearer tok");
assert.ok(calls.every((c) => !/openfoodfacts/.test(c.url)), "l'app non chiama Open Food Facts");
const code = async (p) => { try { await p; return null; } catch (e) { return e.code; } };
assert.equal(await code(scanProduct({ apiBaseUrl: "x", token: "t", barcode: "123", fetchImpl: fake(200, {}) })), "PRODUCT_SCAN_BARCODE_INVALID");
assert.equal(await code(scanProduct({ apiBaseUrl: "x", token: "", barcode: "12345678", fetchImpl: fake(200, {}) })), "PRODUCT_SCAN_AUTH");
assert.equal(await code(scanProduct({ apiBaseUrl: "x", token: "t", barcode: "12345678", fetchImpl: fake(503, { error: "PRODUCT_SCAN_SOURCE_UNAVAILABLE" }) })), "PRODUCT_SCAN_SOURCE_UNAVAILABLE");
assert.equal(await code(scanProduct({ apiBaseUrl: "x", token: "t", barcode: "12345678", fetchImpl: fake(503, { error: "PRODUCT_SCAN_NOT_ACTIVE" }) })), "PRODUCT_SCAN_NOT_ACTIVE");
assert.equal(await code(scanProduct({ apiBaseUrl: "x", token: "t", barcode: "12345678", fetchImpl: fake(500, { error: "boom" }) })), "PRODUCT_SCAN_FAILED");
assert.equal(await code(scanProduct({ apiBaseUrl: "x", token: "t", barcode: "12345678", fetchImpl: fake(200, { verdict: "SICURO" }) })), "PRODUCT_SCAN_FAILED", "esito sconosciuto = errore, mai un ripiego");
assert.equal(await code(scanProduct({ apiBaseUrl: "x", token: "t", barcode: "12345678", fetchImpl: async () => { throw new TypeError("Failed to fetch"); } })), "PRODUCT_SCAN_NETWORK");
assert.equal(await code(scanProduct({ apiBaseUrl: "x", token: "t", barcode: "12345678", timeoutMs: 20, fetchImpl: (url, { signal }) => new Promise((_, reject) => signal.addEventListener("abort", () => reject(Object.assign(new Error("abort"), { name: "AbortError" })))) })), "PRODUCT_SCAN_TIMEOUT");
for (const lang of PRODUCT_SCAN_LANGS) assert.ok(errorText("PRODUCT_SCAN_TIMEOUT", lang) && errorText("XYZ", lang) === productScanTexts(lang).errors.PRODUCT_SCAN_FAILED);

// Stato: pulsante visibile solo se il backend risponde active: true.
assert.deepEqual(await fetchProductScanStatus({ apiBaseUrl: "x", token: "t", fetchImpl: fake(200, { active: true, version: "PRODUCT_SCAN_01" }) }), { active: true, version: "PRODUCT_SCAN_01" });
assert.equal((await fetchProductScanStatus({ apiBaseUrl: "x", token: "t", fetchImpl: fake(200, { active: false }) })).active, false);
assert.equal((await fetchProductScanStatus({ apiBaseUrl: "x", token: "t", fetchImpl: fake(404, null) })).active, false, "backend senza scanner");
assert.equal((await fetchProductScanStatus({ apiBaseUrl: "x", token: "t", fetchImpl: async () => { throw new Error("rete"); } })).active, false);
assert.equal((await fetchProductScanStatus({ apiBaseUrl: "x", token: "", fetchImpl: fake(200, { active: true }) })).active, false);

// Collegamento nell'app (controllo statico): pulsante nella Spesa solo se lo scanner è attivo; schermata in un portale;
// la schermata non chiama mai l'API di Open Food Facts e non salva nulla nel dispositivo.
const app = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const screen = readFileSync(new URL("../src/ProductScanScreen.jsx", import.meta.url), "utf8");
const shopping = app.slice(app.indexOf("const ShoppingScreen = ("), app.indexOf("const ShoppingScreen = (") + 12000);
assert.match(shopping, /fetchProductScanStatus\(\{ apiBaseUrl: API_BASE_URL, token: getAuthToken\(\) \}\)/);
assert.match(shopping, /\{scanActive && \(/);
assert.match(shopping, /showScanner && createPortal\(<ProductScanScreen /);
assert.ok(!/api\/v[0-9]|openfoodfacts\.org\/api/.test(screen), "nessuna chiamata diretta a Open Food Facts");
assert.ok(!/localStorage|sessionStorage|Preferences/.test(screen), "nessun dato salvato nel dispositivo");
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
assert.equal(pkg.dependencies["@capacitor-mlkit/barcode-scanning"], "7.5.0", "versione fissata, compatibile con Capacitor 7");
const plist = readFileSync(new URL("../ios/App/App/Info.plist", import.meta.url), "utf8");
assert.match(plist, /<key>NSCameraUsageDescription<\/key>\s*<string>[^<]{20,}<\/string>/);
const manifest = readFileSync(new URL("../android/app/src/main/AndroidManifest.xml", import.meta.url), "utf8");
assert.match(manifest, /com\.google\.mlkit\.vision\.DEPENDENCIES[^>]*barcode_ui/);
assert.ok(!/android\.permission\.CAMERA/.test(manifest), "Android: scanner di Google Play Services, nessun permesso fotocamera all'app");

console.log(JSON.stringify({ test: "test-product-scan", result: "PASS" }));
