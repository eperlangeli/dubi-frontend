// D-057 (Enrico, 8 ottobre 2026): scanner del codice a barre. Logica pura dell'app, senza React.
// Il backend legge il prodotto (cache o Open Food Facts) e lo confronta con il profilo; l'app non chiama mai
// Open Food Facts. Qui: codice letto, chiamate al backend, testi nelle 10 lingue costruiti dai dati strutturati
// della risposta (l'italiano coincide con i testi del backend: test di parità).
// Testi IT della Regia secondo la specifica approvata (SPEC_SCANNER_D057.md), da rivedere dalla sezione 5;
// le altre 9 lingue sono traduzioni della Regia, da QA linguistico prima del lancio. Mai "sicuro".

export const PRODUCT_SCAN_VERSION = "PRODUCT_SCAN_01";
export const PRODUCT_SCAN_TIMEOUT_MS = 12000;
export const GROUP_ORDER = Object.freeze(["AVOID", "TO_VERIFY", "IN_YOUR_DIET", "OUTSIDE_YOUR_DIET", "OTHER", "ADDITIVES_FLAVOURINGS"]);
export const VERDICT_COLORS = Object.freeze({ NOT_SUITABLE: "red", TO_VERIFY: "orange", NO_ISSUE_FOUND: "green", INSUFFICIENT_DATA: "grey" });

// Stessa regola del backend (services/product-scan/off-client.js): solo cifre, da 8 a 14.
export function normalizeBarcode(raw) {
  const digits = String(raw === undefined || raw === null ? "" : raw).replace(/[\s-]/g, "");
  return /^\d{8,14}$/.test(digits) ? digits : null;
}

function scanError(code, status = null) {
  const error = new Error(code);
  error.code = code;
  error.status = status;
  return error;
}

async function withTimeout(fetchImpl, url, options, timeoutMs) {
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    return await fetchImpl(url, controller ? { ...options, signal: controller.signal } : options);
  } catch (error) {
    if (error && error.name === "AbortError") throw scanError("PRODUCT_SCAN_TIMEOUT");
    throw scanError("PRODUCT_SCAN_NETWORK");
  } finally {
    if (timer) clearTimeout(timer);
  }
}

// Lo scanner si mostra solo se il backend dice che è attivo (firme di Francesco). Backend vecchio (404) = spento.
export async function fetchProductScanStatus({ apiBaseUrl, token, fetchImpl = globalThis.fetch, timeoutMs = 8000 }) {
  if (!token) return { active: false };
  try {
    const response = await withTimeout(fetchImpl, `${apiBaseUrl}/api/product-scan/status`, { headers: { Authorization: `Bearer ${token}` } }, timeoutMs);
    if (!response.ok) return { active: false };
    const body = await response.json();
    return { active: body && body.active === true, version: body && body.version };
  } catch (_error) {
    return { active: false };
  }
}

const KNOWN_ERRORS = new Set(["PRODUCT_SCAN_NOT_ACTIVE", "PRODUCT_SCAN_BARCODE_INVALID", "PRODUCT_SCAN_SOURCE_UNAVAILABLE", "PROFILE_NOT_FOUND"]);

export async function scanProduct({ apiBaseUrl, token, barcode, fetchImpl = globalThis.fetch, timeoutMs = PRODUCT_SCAN_TIMEOUT_MS }) {
  const code = normalizeBarcode(barcode);
  if (!code) throw scanError("PRODUCT_SCAN_BARCODE_INVALID", 400);
  if (!token) throw scanError("PRODUCT_SCAN_AUTH", 401);
  // POST: il backend può scrivere la cache dei prodotti (nessun GET scrive, D-038). Solo il codice, nessun dato personale.
  const response = await withTimeout(fetchImpl, `${apiBaseUrl}/api/product-scan/lookup`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ barcode: code }),
  }, timeoutMs);
  let body = null;
  try { body = await response.json(); } catch (_error) { body = null; }
  if (!response.ok) {
    const backendCode = body && typeof body.error === "string" ? body.error : null;
    if (response.status === 401) throw scanError("PRODUCT_SCAN_AUTH", 401);
    throw scanError(KNOWN_ERRORS.has(backendCode) ? backendCode : "PRODUCT_SCAN_FAILED", response.status);
  }
  if (!body || !VERDICT_COLORS[body.verdict]) throw scanError("PRODUCT_SCAN_FAILED", response.status);
  return body;
}

// ─── Testi ───────────────────────────────────────────────────────────────────────────────────────────────

const IT = {
  open: "Scansiona un prodotto",
  openHint: "Inquadra il codice a barre: DUBI lo confronta con le tue allergie, intolleranze e la tua dieta.",
  title: "Scanner prodotti",
  cameraStart: "Apri la fotocamera",
  cameraStop: "Chiudi la fotocamera",
  cameraAim: "Inquadra il codice a barre",
  cameraDenied: "Senza il permesso della fotocamera puoi scrivere il codice a mano.",
  cameraUnsupported: "Qui la fotocamera non legge i codici a barre: scrivi il codice a mano.",
  cameraFailed: "Non riesco ad aprire la fotocamera: scrivi il codice a mano.",
  manualLabel: "Oppure scrivi il codice a barre (da 8 a 14 cifre)",
  manualSubmit: "Controlla",
  invalidCode: "Il codice deve avere da 8 a 14 cifre.",
  loading: "Controllo il prodotto…",
  again: "Scansiona un altro prodotto",
  close: "Chiudi",
  errors: {
    PRODUCT_SCAN_SOURCE_UNAVAILABLE: "Non riesco a raggiungere l'archivio dei prodotti. Riprova tra poco.",
    PRODUCT_SCAN_TIMEOUT: "La risposta sta impiegando troppo. Riprova.",
    PRODUCT_SCAN_NETWORK: "Sei offline o la connessione non funziona. Riprova.",
    PRODUCT_SCAN_NOT_ACTIVE: "Lo scanner non è ancora disponibile.",
    PROFILE_NOT_FOUND: "Completa il profilo per usare lo scanner.",
    PRODUCT_SCAN_AUTH: "Accedi di nuovo per usare lo scanner.",
    PRODUCT_SCAN_BARCODE_INVALID: "Il codice deve avere da 8 a 14 cifre.",
    PRODUCT_SCAN_FAILED: "Qualcosa non ha funzionato. Riprova.",
  },
  verdicts: { NOT_SUITABLE: "Non adatto a te", TO_VERIFY: "Da verificare", NO_ISSUE_FOUND: "Nessun ingrediente da evitare trovato", INSUFFICIENT_DATA: "Dati insufficienti" },
  groups: { AVOID: "Da evitare per te", TO_VERIFY: "Da verificare", IN_YOUR_DIET: "Nella tua dieta", OUTSIDE_YOUR_DIET: "Fuori dalla tua dieta", OTHER: "Altri ingredienti", ADDITIVES_FLAVOURINGS: "Additivi e aromi" },
  routes: { gluten_free: "glutine", dairy_free: "latte e derivati", egg_free: "uova", fish_shellfish_free: "pesce, crostacei e molluschi", nut_free: "frutta a guscio e arachidi", soy_free: "soia", sesame_free: "sesamo", mustard_free: "senape", seed_oil_free: "oli di semi" },
  dietPlan: { diet_vegan: "il tuo piano è vegano", diet_vegetarian: "il tuo piano è vegetariano", diet_pescetarian: "il tuo piano è pescetariano" },
  dietAdj: { vegan: "vegano", vegetarian: "vegetariano", pescetarian: "adatto alla tua dieta" },
  insufficient: "Non ho dati sufficienti per valutare questo prodotto. Leggi l'etichetta.",
  contains: (x, what) => `Contiene ${x} (${what}). L'hai indicato tra le cose da evitare.`,
  containsDiet: (x, plan) => `Contiene ${x}. ${cap(plan)}.`,
  declared: (what) => `Il produttore dichiara ${what}. L'hai indicato tra le cose da evitare.`,
  mayContain: (what) => `Può contenere tracce di ${what}. L'hai indicato tra le cose da evitare.`,
  verifyAmbiguous: (x) => `${x}: l'origine non è indicata. Controlla l'etichetta.`,
  verifyUnknown: (x) => `${x}: ingrediente che non riesco a riconoscere.`,
  verifyVeganMaybe: (x) => `${x}: potrebbe essere di origine animale.`,
  verifyOther: (x) => `${x}: da verificare.`,
  notRecognized: (values) => `Non riesco a controllare: ${values}. Leggi l'etichetta.`,
  suggestion: (category, without, diet) => {
    const what = category ? `un prodotto simile (${category})` : "un prodotto simile";
    const w = without ? ` senza ${without}` : "";
    return `Prova ${what}${w}${diet ? (w ? ", " : " ") + diet : ""}.`;
  },
  traces: "Può contenere",
  percent: (p) => `${p}%`,
  notice: "Controlla sempre l'etichetta sulla confezione.",
  attribution: "Dati prodotto: Open Food Facts (openfoodfacts.org), licenza ODbL.",
  fetchedAt: (date) => `Dati letti il ${date}.`,
  noName: "Prodotto senza nome",
};

const EN = {
  open: "Scan a product",
  openHint: "Point at the barcode: DUBI checks it against your allergies, intolerances and diet.",
  title: "Product scanner",
  cameraStart: "Open camera",
  cameraStop: "Close camera",
  cameraAim: "Point the camera at the barcode",
  cameraDenied: "Without camera permission you can type the code instead.",
  cameraUnsupported: "The camera can't read barcodes here: type the code instead.",
  cameraFailed: "I can't open the camera: type the code instead.",
  manualLabel: "Or type the barcode (8 to 14 digits)",
  manualSubmit: "Check",
  invalidCode: "The code must have 8 to 14 digits.",
  loading: "Checking the product…",
  again: "Scan another product",
  close: "Close",
  errors: {
    PRODUCT_SCAN_SOURCE_UNAVAILABLE: "I can't reach the product database. Try again shortly.",
    PRODUCT_SCAN_TIMEOUT: "The answer is taking too long. Try again.",
    PRODUCT_SCAN_NETWORK: "You're offline or the connection isn't working. Try again.",
    PRODUCT_SCAN_NOT_ACTIVE: "The scanner isn't available yet.",
    PROFILE_NOT_FOUND: "Complete your profile to use the scanner.",
    PRODUCT_SCAN_AUTH: "Sign in again to use the scanner.",
    PRODUCT_SCAN_BARCODE_INVALID: "The code must have 8 to 14 digits.",
    PRODUCT_SCAN_FAILED: "Something went wrong. Try again.",
  },
  verdicts: { NOT_SUITABLE: "Not suitable for you", TO_VERIFY: "To check", NO_ISSUE_FOUND: "No ingredients to avoid found", INSUFFICIENT_DATA: "Not enough data" },
  groups: { AVOID: "Avoid", TO_VERIFY: "To check", IN_YOUR_DIET: "In your diet", OUTSIDE_YOUR_DIET: "Outside your diet", OTHER: "Other ingredients", ADDITIVES_FLAVOURINGS: "Additives and flavourings" },
  routes: { gluten_free: "gluten", dairy_free: "milk and dairy", egg_free: "eggs", fish_shellfish_free: "fish, crustaceans and molluscs", nut_free: "nuts and peanuts", soy_free: "soy", sesame_free: "sesame", mustard_free: "mustard", seed_oil_free: "seed oils" },
  dietPlan: { diet_vegan: "your plan is vegan", diet_vegetarian: "your plan is vegetarian", diet_pescetarian: "your plan is pescatarian" },
  dietAdj: { vegan: "vegan", vegetarian: "vegetarian", pescetarian: "suitable for your diet" },
  insufficient: "I don't have enough data to assess this product. Read the label.",
  contains: (x, what) => `Contains ${x} (${what}). You listed it as something to avoid.`,
  containsDiet: (x, plan) => `Contains ${x}. ${cap(plan)}.`,
  declared: (what) => `The manufacturer declares ${what}. You listed it as something to avoid.`,
  mayContain: (what) => `May contain traces of ${what}. You listed it as something to avoid.`,
  verifyAmbiguous: (x) => `${x}: the origin isn't stated. Check the label.`,
  verifyUnknown: (x) => `${x}: an ingredient I can't recognise.`,
  verifyVeganMaybe: (x) => `${x}: may be of animal origin.`,
  verifyOther: (x) => `${x}: to check.`,
  notRecognized: (values) => `I can't check: ${values}. Read the label.`,
  suggestion: (category, without, diet) => {
    const what = category ? `a similar product (${category})` : "a similar product";
    const w = without ? ` without ${without}` : "";
    return `Try ${what}${w}${diet ? (w ? ", " : " ") + diet : ""}.`;
  },
  traces: "May contain",
  percent: (p) => `${p}%`,
  notice: "Always check the label on the pack.",
  attribution: "Product data: Open Food Facts (openfoodfacts.org), ODbL licence.",
  fetchedAt: (date) => `Data read on ${date}.`,
  noName: "Unnamed product",
};

const FR = {
  ...EN,
  open: "Scanner un produit",
  openHint: "Visez le code-barres : DUBI le compare à vos allergies, intolérances et à votre régime.",
  title: "Scanner de produits",
  cameraStart: "Ouvrir la caméra", cameraStop: "Fermer la caméra", cameraAim: "Visez le code-barres",
  cameraDenied: "Sans l'autorisation de la caméra, vous pouvez saisir le code.",
  cameraUnsupported: "Ici, la caméra ne lit pas les codes-barres : saisissez le code.",
  cameraFailed: "Impossible d'ouvrir la caméra : saisissez le code.",
  manualLabel: "Ou saisissez le code-barres (8 à 14 chiffres)", manualSubmit: "Vérifier",
  invalidCode: "Le code doit comporter de 8 à 14 chiffres.", loading: "Vérification du produit…",
  again: "Scanner un autre produit", close: "Fermer",
  errors: {
    PRODUCT_SCAN_SOURCE_UNAVAILABLE: "Impossible de joindre la base de produits. Réessayez dans un instant.",
    PRODUCT_SCAN_TIMEOUT: "La réponse prend trop de temps. Réessayez.",
    PRODUCT_SCAN_NETWORK: "Vous êtes hors ligne ou la connexion ne fonctionne pas. Réessayez.",
    PRODUCT_SCAN_NOT_ACTIVE: "Le scanner n'est pas encore disponible.",
    PROFILE_NOT_FOUND: "Complétez votre profil pour utiliser le scanner.",
    PRODUCT_SCAN_AUTH: "Reconnectez-vous pour utiliser le scanner.",
    PRODUCT_SCAN_BARCODE_INVALID: "Le code doit comporter de 8 à 14 chiffres.",
    PRODUCT_SCAN_FAILED: "Un problème est survenu. Réessayez.",
  },
  verdicts: { NOT_SUITABLE: "Ne vous convient pas", TO_VERIFY: "À vérifier", NO_ISSUE_FOUND: "Aucun ingrédient à éviter trouvé", INSUFFICIENT_DATA: "Données insuffisantes" },
  groups: { AVOID: "À éviter pour vous", TO_VERIFY: "À vérifier", IN_YOUR_DIET: "Dans votre régime", OUTSIDE_YOUR_DIET: "Hors de votre régime", OTHER: "Autres ingrédients", ADDITIVES_FLAVOURINGS: "Additifs et arômes" },
  routes: { gluten_free: "gluten", dairy_free: "lait et produits laitiers", egg_free: "œufs", fish_shellfish_free: "poisson, crustacés et mollusques", nut_free: "fruits à coque et arachides", soy_free: "soja", sesame_free: "sésame", mustard_free: "moutarde", seed_oil_free: "huiles de graines" },
  dietPlan: { diet_vegan: "votre plan est végétalien", diet_vegetarian: "votre plan est végétarien", diet_pescetarian: "votre plan est pescétarien" },
  dietAdj: { vegan: "végétalien", vegetarian: "végétarien", pescetarian: "adapté à votre régime" },
  insufficient: "Je n'ai pas assez de données pour évaluer ce produit. Lisez l'étiquette.",
  contains: (x, what) => `Contient ${x} (${what}). Vous l'avez indiqué parmi les choses à éviter.`,
  declared: (what) => `Le fabricant déclare ${what}. Vous l'avez indiqué parmi les choses à éviter.`,
  mayContain: (what) => `Peut contenir des traces de ${what}. Vous l'avez indiqué parmi les choses à éviter.`,
  verifyAmbiguous: (x) => `${x} : l'origine n'est pas indiquée. Vérifiez l'étiquette.`,
  verifyUnknown: (x) => `${x} : ingrédient que je ne reconnais pas.`,
  verifyVeganMaybe: (x) => `${x} : peut être d'origine animale.`,
  verifyOther: (x) => `${x} : à vérifier.`,
  notRecognized: (values) => `Je ne peux pas vérifier : ${values}. Lisez l'étiquette.`,
  suggestion: (category, without, diet) => {
    const what = category ? `un produit similaire (${category})` : "un produit similaire";
    const w = without ? ` sans ${without}` : "";
    return `Essayez ${what}${w}${diet ? (w ? ", " : " ") + diet : ""}.`;
  },
  containsDiet: (x, plan) => `Contient ${x}. ${cap(plan)}.`,
  traces: "Peut contenir",
  notice: "Vérifiez toujours l'étiquette sur l'emballage.",
  attribution: "Données produit : Open Food Facts (openfoodfacts.org), licence ODbL.",
  fetchedAt: (date) => `Données lues le ${date}.`,
  noName: "Produit sans nom",
};

const ES = {
  ...EN,
  open: "Escanear un producto",
  openHint: "Enfoca el código de barras: DUBI lo compara con tus alergias, intolerancias y tu dieta.",
  title: "Escáner de productos",
  cameraStart: "Abrir la cámara", cameraStop: "Cerrar la cámara", cameraAim: "Enfoca el código de barras",
  cameraDenied: "Sin permiso de cámara puedes escribir el código.",
  cameraUnsupported: "Aquí la cámara no lee códigos de barras: escribe el código.",
  cameraFailed: "No puedo abrir la cámara: escribe el código.",
  manualLabel: "O escribe el código de barras (de 8 a 14 cifras)", manualSubmit: "Comprobar",
  invalidCode: "El código debe tener de 8 a 14 cifras.", loading: "Comprobando el producto…",
  again: "Escanear otro producto", close: "Cerrar",
  errors: {
    PRODUCT_SCAN_SOURCE_UNAVAILABLE: "No puedo acceder a la base de productos. Inténtalo de nuevo en un momento.",
    PRODUCT_SCAN_TIMEOUT: "La respuesta tarda demasiado. Inténtalo de nuevo.",
    PRODUCT_SCAN_NETWORK: "Estás sin conexión o la conexión no funciona. Inténtalo de nuevo.",
    PRODUCT_SCAN_NOT_ACTIVE: "El escáner aún no está disponible.",
    PROFILE_NOT_FOUND: "Completa tu perfil para usar el escáner.",
    PRODUCT_SCAN_AUTH: "Vuelve a iniciar sesión para usar el escáner.",
    PRODUCT_SCAN_BARCODE_INVALID: "El código debe tener de 8 a 14 cifras.",
    PRODUCT_SCAN_FAILED: "Algo no ha funcionado. Inténtalo de nuevo.",
  },
  verdicts: { NOT_SUITABLE: "No apto para ti", TO_VERIFY: "Por verificar", NO_ISSUE_FOUND: "No se han encontrado ingredientes a evitar", INSUFFICIENT_DATA: "Datos insuficientes" },
  groups: { AVOID: "A evitar para ti", TO_VERIFY: "Por verificar", IN_YOUR_DIET: "En tu dieta", OUTSIDE_YOUR_DIET: "Fuera de tu dieta", OTHER: "Otros ingredientes", ADDITIVES_FLAVOURINGS: "Aditivos y aromas" },
  routes: { gluten_free: "gluten", dairy_free: "leche y derivados", egg_free: "huevos", fish_shellfish_free: "pescado, crustáceos y moluscos", nut_free: "frutos secos y cacahuetes", soy_free: "soja", sesame_free: "sésamo", mustard_free: "mostaza", seed_oil_free: "aceites de semillas" },
  dietPlan: { diet_vegan: "tu plan es vegano", diet_vegetarian: "tu plan es vegetariano", diet_pescetarian: "tu plan es pescetariano" },
  dietAdj: { vegan: "vegano", vegetarian: "vegetariano", pescetarian: "adecuado para tu dieta" },
  insufficient: "No tengo datos suficientes para evaluar este producto. Lee la etiqueta.",
  contains: (x, what) => `Contiene ${x} (${what}). Lo indicaste entre lo que debes evitar.`,
  declared: (what) => `El fabricante declara ${what}. Lo indicaste entre lo que debes evitar.`,
  mayContain: (what) => `Puede contener trazas de ${what}. Lo indicaste entre lo que debes evitar.`,
  verifyAmbiguous: (x) => `${x}: no se indica el origen. Revisa la etiqueta.`,
  verifyUnknown: (x) => `${x}: ingrediente que no reconozco.`,
  verifyVeganMaybe: (x) => `${x}: podría ser de origen animal.`,
  verifyOther: (x) => `${x}: por verificar.`,
  notRecognized: (values) => `No puedo comprobar: ${values}. Lee la etiqueta.`,
  suggestion: (category, without, diet) => {
    const what = category ? `un producto similar (${category})` : "un producto similar";
    const w = without ? ` sin ${without}` : "";
    return `Prueba ${what}${w}${diet ? (w ? ", " : " ") + diet : ""}.`;
  },
  containsDiet: (x, plan) => `Contiene ${x}. ${cap(plan)}.`,
  traces: "Puede contener",
  notice: "Revisa siempre la etiqueta del envase.",
  attribution: "Datos del producto: Open Food Facts (openfoodfacts.org), licencia ODbL.",
  fetchedAt: (date) => `Datos leídos el ${date}.`,
  noName: "Producto sin nombre",
};

const DE = {
  ...EN,
  open: "Produkt scannen",
  openHint: "Richte die Kamera auf den Barcode: DUBI vergleicht ihn mit deinen Allergien, Unverträglichkeiten und deiner Ernährung.",
  title: "Produktscanner",
  cameraStart: "Kamera öffnen", cameraStop: "Kamera schließen", cameraAim: "Richte die Kamera auf den Barcode",
  cameraDenied: "Ohne Kameraerlaubnis kannst du den Code eintippen.",
  cameraUnsupported: "Hier kann die Kamera keine Barcodes lesen: tippe den Code ein.",
  cameraFailed: "Ich kann die Kamera nicht öffnen: tippe den Code ein.",
  manualLabel: "Oder tippe den Barcode ein (8 bis 14 Ziffern)", manualSubmit: "Prüfen",
  invalidCode: "Der Code muss 8 bis 14 Ziffern haben.", loading: "Produkt wird geprüft…",
  again: "Weiteres Produkt scannen", close: "Schließen",
  errors: {
    PRODUCT_SCAN_SOURCE_UNAVAILABLE: "Die Produktdatenbank ist nicht erreichbar. Versuche es gleich noch einmal.",
    PRODUCT_SCAN_TIMEOUT: "Die Antwort dauert zu lange. Versuche es noch einmal.",
    PRODUCT_SCAN_NETWORK: "Du bist offline oder die Verbindung funktioniert nicht. Versuche es noch einmal.",
    PRODUCT_SCAN_NOT_ACTIVE: "Der Scanner ist noch nicht verfügbar.",
    PROFILE_NOT_FOUND: "Vervollständige dein Profil, um den Scanner zu nutzen.",
    PRODUCT_SCAN_AUTH: "Melde dich erneut an, um den Scanner zu nutzen.",
    PRODUCT_SCAN_BARCODE_INVALID: "Der Code muss 8 bis 14 Ziffern haben.",
    PRODUCT_SCAN_FAILED: "Etwas hat nicht funktioniert. Versuche es noch einmal.",
  },
  verdicts: { NOT_SUITABLE: "Nicht geeignet für dich", TO_VERIFY: "Zu prüfen", NO_ISSUE_FOUND: "Keine zu meidenden Zutaten gefunden", INSUFFICIENT_DATA: "Zu wenige Daten" },
  groups: { AVOID: "Für dich zu meiden", TO_VERIFY: "Zu prüfen", IN_YOUR_DIET: "In deiner Ernährung", OUTSIDE_YOUR_DIET: "Außerhalb deiner Ernährung", OTHER: "Weitere Zutaten", ADDITIVES_FLAVOURINGS: "Zusatzstoffe und Aromen" },
  routes: { gluten_free: "Gluten", dairy_free: "Milch und Milchprodukte", egg_free: "Eier", fish_shellfish_free: "Fisch, Krebstiere und Weichtiere", nut_free: "Schalenfrüchte und Erdnüsse", soy_free: "Soja", sesame_free: "Sesam", mustard_free: "Senf", seed_oil_free: "Samenöle" },
  dietPlan: { diet_vegan: "dein Plan ist vegan", diet_vegetarian: "dein Plan ist vegetarisch", diet_pescetarian: "dein Plan ist pescetarisch" },
  dietAdj: { vegan: "vegan", vegetarian: "vegetarisch", pescetarian: "passend zu deiner Ernährung" },
  insufficient: "Ich habe nicht genug Daten, um dieses Produkt zu bewerten. Lies das Etikett.",
  contains: (x, what) => `Enthält ${x} (${what}). Du hast es als zu meiden angegeben.`,
  declared: (what) => `Der Hersteller gibt ${what} an. Du hast es als zu meiden angegeben.`,
  mayContain: (what) => `Kann Spuren von ${what} enthalten. Du hast es als zu meiden angegeben.`,
  verifyAmbiguous: (x) => `${x}: Herkunft nicht angegeben. Prüfe das Etikett.`,
  verifyUnknown: (x) => `${x}: Zutat, die ich nicht erkenne.`,
  verifyVeganMaybe: (x) => `${x}: könnte tierischen Ursprungs sein.`,
  verifyOther: (x) => `${x}: zu prüfen.`,
  notRecognized: (values) => `Ich kann nicht prüfen: ${values}. Lies das Etikett.`,
  suggestion: (category, without, diet) => {
    const what = category ? `ein ähnliches Produkt (${category})` : "ein ähnliches Produkt";
    const w = without ? ` ohne ${without}` : "";
    return `Probiere ${what}${w}${diet ? (w ? ", " : " ") + diet : ""}.`;
  },
  containsDiet: (x, plan) => `Enthält ${x}. ${cap(plan)}.`,
  traces: "Kann enthalten",
  notice: "Prüfe immer das Etikett auf der Verpackung.",
  attribution: "Produktdaten: Open Food Facts (openfoodfacts.org), ODbL-Lizenz.",
  fetchedAt: (date) => `Daten gelesen am ${date}.`,
  noName: "Produkt ohne Namen",
};

const PT = {
  ...EN,
  open: "Digitalizar um produto",
  openHint: "Aponte para o código de barras: o DUBI compara-o com as suas alergias, intolerâncias e a sua dieta.",
  title: "Leitor de produtos",
  cameraStart: "Abrir a câmara", cameraStop: "Fechar a câmara", cameraAim: "Aponte para o código de barras",
  cameraDenied: "Sem autorização da câmara pode escrever o código.",
  cameraUnsupported: "Aqui a câmara não lê códigos de barras: escreva o código.",
  cameraFailed: "Não consigo abrir a câmara: escreva o código.",
  manualLabel: "Ou escreva o código de barras (de 8 a 14 algarismos)", manualSubmit: "Verificar",
  invalidCode: "O código deve ter de 8 a 14 algarismos.", loading: "A verificar o produto…",
  again: "Digitalizar outro produto", close: "Fechar",
  errors: {
    PRODUCT_SCAN_SOURCE_UNAVAILABLE: "Não consigo aceder à base de produtos. Tente novamente daqui a pouco.",
    PRODUCT_SCAN_TIMEOUT: "A resposta está a demorar demasiado. Tente novamente.",
    PRODUCT_SCAN_NETWORK: "Está offline ou a ligação não funciona. Tente novamente.",
    PRODUCT_SCAN_NOT_ACTIVE: "O leitor ainda não está disponível.",
    PROFILE_NOT_FOUND: "Complete o seu perfil para usar o leitor.",
    PRODUCT_SCAN_AUTH: "Inicie sessão novamente para usar o leitor.",
    PRODUCT_SCAN_BARCODE_INVALID: "O código deve ter de 8 a 14 algarismos.",
    PRODUCT_SCAN_FAILED: "Algo correu mal. Tente novamente.",
  },
  verdicts: { NOT_SUITABLE: "Não adequado para si", TO_VERIFY: "A verificar", NO_ISSUE_FOUND: "Nenhum ingrediente a evitar encontrado", INSUFFICIENT_DATA: "Dados insuficientes" },
  groups: { AVOID: "A evitar para si", TO_VERIFY: "A verificar", IN_YOUR_DIET: "Na sua dieta", OUTSIDE_YOUR_DIET: "Fora da sua dieta", OTHER: "Outros ingredientes", ADDITIVES_FLAVOURINGS: "Aditivos e aromas" },
  routes: { gluten_free: "glúten", dairy_free: "leite e derivados", egg_free: "ovos", fish_shellfish_free: "peixe, crustáceos e moluscos", nut_free: "frutos de casca rija e amendoins", soy_free: "soja", sesame_free: "sésamo", mustard_free: "mostarda", seed_oil_free: "óleos de sementes" },
  dietPlan: { diet_vegan: "o seu plano é vegano", diet_vegetarian: "o seu plano é vegetariano", diet_pescetarian: "o seu plano é pescetariano" },
  dietAdj: { vegan: "vegano", vegetarian: "vegetariano", pescetarian: "adequado à sua dieta" },
  insufficient: "Não tenho dados suficientes para avaliar este produto. Leia o rótulo.",
  contains: (x, what) => `Contém ${x} (${what}). Indicou-o entre o que deve evitar.`,
  declared: (what) => `O fabricante declara ${what}. Indicou-o entre o que deve evitar.`,
  mayContain: (what) => `Pode conter vestígios de ${what}. Indicou-o entre o que deve evitar.`,
  verifyAmbiguous: (x) => `${x}: a origem não é indicada. Verifique o rótulo.`,
  verifyUnknown: (x) => `${x}: ingrediente que não consigo reconhecer.`,
  verifyVeganMaybe: (x) => `${x}: pode ser de origem animal.`,
  verifyOther: (x) => `${x}: a verificar.`,
  notRecognized: (values) => `Não consigo verificar: ${values}. Leia o rótulo.`,
  suggestion: (category, without, diet) => {
    const what = category ? `um produto semelhante (${category})` : "um produto semelhante";
    const w = without ? ` sem ${without}` : "";
    return `Experimente ${what}${w}${diet ? (w ? ", " : " ") + diet : ""}.`;
  },
  containsDiet: (x, plan) => `Contém ${x}. ${cap(plan)}.`,
  traces: "Pode conter",
  notice: "Verifique sempre o rótulo da embalagem.",
  attribution: "Dados do produto: Open Food Facts (openfoodfacts.org), licença ODbL.",
  fetchedAt: (date) => `Dados lidos em ${date}.`,
  noName: "Produto sem nome",
};

const AR = {
  ...EN,
  open: "امسح منتجًا",
  openHint: "وجّه الكاميرا إلى الرمز الشريطي: يقارنه DUBI بحساسيتك وعدم تحمّلك ونظامك الغذائي.",
  title: "ماسح المنتجات",
  cameraStart: "افتح الكاميرا", cameraStop: "أغلق الكاميرا", cameraAim: "وجّه الكاميرا إلى الرمز الشريطي",
  cameraDenied: "من دون إذن الكاميرا يمكنك كتابة الرمز.",
  cameraUnsupported: "لا تستطيع الكاميرا هنا قراءة الرموز الشريطية: اكتب الرمز.",
  cameraFailed: "لا أستطيع فتح الكاميرا: اكتب الرمز.",
  manualLabel: "أو اكتب الرمز الشريطي (من 8 إلى 14 رقمًا)", manualSubmit: "تحقّق",
  invalidCode: "يجب أن يتكوّن الرمز من 8 إلى 14 رقمًا.", loading: "جارٍ التحقق من المنتج…",
  again: "امسح منتجًا آخر", close: "إغلاق",
  errors: {
    PRODUCT_SCAN_SOURCE_UNAVAILABLE: "لا أستطيع الوصول إلى قاعدة بيانات المنتجات. حاول مجددًا بعد قليل.",
    PRODUCT_SCAN_TIMEOUT: "الرد يستغرق وقتًا طويلًا. حاول مجددًا.",
    PRODUCT_SCAN_NETWORK: "أنت غير متصل أو الاتصال لا يعمل. حاول مجددًا.",
    PRODUCT_SCAN_NOT_ACTIVE: "الماسح غير متاح بعد.",
    PROFILE_NOT_FOUND: "أكمل ملفك الشخصي لاستخدام الماسح.",
    PRODUCT_SCAN_AUTH: "سجّل الدخول مجددًا لاستخدام الماسح.",
    PRODUCT_SCAN_BARCODE_INVALID: "يجب أن يتكوّن الرمز من 8 إلى 14 رقمًا.",
    PRODUCT_SCAN_FAILED: "حدث خطأ ما. حاول مجددًا.",
  },
  verdicts: { NOT_SUITABLE: "غير مناسب لك", TO_VERIFY: "يحتاج إلى تحقق", NO_ISSUE_FOUND: "لم يُعثر على مكوّنات يجب تجنّبها", INSUFFICIENT_DATA: "بيانات غير كافية" },
  groups: { AVOID: "يجب أن تتجنّبه", TO_VERIFY: "يحتاج إلى تحقق", IN_YOUR_DIET: "ضمن نظامك الغذائي", OUTSIDE_YOUR_DIET: "خارج نظامك الغذائي", OTHER: "مكوّنات أخرى", ADDITIVES_FLAVOURINGS: "مضافات ونكهات" },
  routes: { gluten_free: "الغلوتين", dairy_free: "الحليب ومشتقاته", egg_free: "البيض", fish_shellfish_free: "الأسماك والقشريات والرخويات", nut_free: "المكسرات والفول السوداني", soy_free: "الصويا", sesame_free: "السمسم", mustard_free: "الخردل", seed_oil_free: "زيوت البذور" },
  dietPlan: { diet_vegan: "خطتك نباتية صرفة", diet_vegetarian: "خطتك نباتية", diet_pescetarian: "خطتك نباتية مع الأسماك" },
  dietAdj: { vegan: "نباتي صرف", vegetarian: "نباتي", pescetarian: "مناسب لنظامك الغذائي" },
  insufficient: "ليست لدي بيانات كافية لتقييم هذا المنتج. اقرأ الملصق.",
  contains: (x, what) => `يحتوي على ${x} (${what}). ذكرته ضمن ما يجب تجنّبه.`,
  declared: (what) => `يصرّح المُصنّع بوجود ${what}. ذكرته ضمن ما يجب تجنّبه.`,
  mayContain: (what) => `قد يحتوي على آثار من ${what}. ذكرته ضمن ما يجب تجنّبه.`,
  verifyAmbiguous: (x) => `${x}: المصدر غير مذكور. تحقّق من الملصق.`,
  verifyUnknown: (x) => `${x}: مكوّن لا أستطيع التعرّف عليه.`,
  verifyVeganMaybe: (x) => `${x}: قد يكون من أصل حيواني.`,
  verifyOther: (x) => `${x}: يحتاج إلى تحقق.`,
  notRecognized: (values) => `لا أستطيع التحقق من: ${values}. اقرأ الملصق.`,
  suggestion: (category, without, diet) => {
    const what = category ? `منتجًا مشابهًا (${category})` : "منتجًا مشابهًا";
    const w = without ? ` من دون ${without}` : "";
    return `جرّب ${what}${w}${diet ? (w ? "، " : " ") + diet : ""}.`;
  },
  containsDiet: (x, plan) => `يحتوي على ${x}. ${plan}.`,
  traces: "قد يحتوي على",
  notice: "تحقّق دائمًا من الملصق على العبوة.",
  attribution: "بيانات المنتج: Open Food Facts (openfoodfacts.org)، ترخيص ODbL.",
  fetchedAt: (date) => `قُرئت البيانات في ${date}.`,
  noName: "منتج بلا اسم",
};

const ZH = {
  ...EN,
  open: "扫描商品",
  openHint: "对准条形码：DUBI 会将其与您的过敏、不耐受和饮食方式进行比对。",
  title: "商品扫描",
  cameraStart: "打开相机", cameraStop: "关闭相机", cameraAim: "将相机对准条形码",
  cameraDenied: "未授予相机权限时，您可以手动输入条码。",
  cameraUnsupported: "此处相机无法读取条形码：请手动输入条码。",
  cameraFailed: "无法打开相机：请手动输入条码。",
  manualLabel: "或输入条形码（8 至 14 位数字）", manualSubmit: "检查",
  invalidCode: "条码必须为 8 至 14 位数字。", loading: "正在检查商品…",
  again: "扫描其他商品", close: "关闭",
  errors: {
    PRODUCT_SCAN_SOURCE_UNAVAILABLE: "无法连接商品数据库，请稍后再试。",
    PRODUCT_SCAN_TIMEOUT: "响应时间过长，请重试。",
    PRODUCT_SCAN_NETWORK: "您处于离线状态或网络连接异常，请重试。",
    PRODUCT_SCAN_NOT_ACTIVE: "扫描功能尚未开放。",
    PROFILE_NOT_FOUND: "请先完善个人资料再使用扫描功能。",
    PRODUCT_SCAN_AUTH: "请重新登录后使用扫描功能。",
    PRODUCT_SCAN_BARCODE_INVALID: "条码必须为 8 至 14 位数字。",
    PRODUCT_SCAN_FAILED: "出现问题，请重试。",
  },
  verdicts: { NOT_SUITABLE: "不适合您", TO_VERIFY: "需要核实", NO_ISSUE_FOUND: "未发现需避免的成分", INSUFFICIENT_DATA: "数据不足" },
  groups: { AVOID: "您需避免", TO_VERIFY: "需要核实", IN_YOUR_DIET: "在您的饮食中", OUTSIDE_YOUR_DIET: "不在您的饮食中", OTHER: "其他成分", ADDITIVES_FLAVOURINGS: "添加剂和香料" },
  routes: { gluten_free: "麸质", dairy_free: "牛奶及乳制品", egg_free: "蛋类", fish_shellfish_free: "鱼类、甲壳类和软体动物", nut_free: "坚果和花生", soy_free: "大豆", sesame_free: "芝麻", mustard_free: "芥末", seed_oil_free: "种子油" },
  dietPlan: { diet_vegan: "您的计划为纯素", diet_vegetarian: "您的计划为素食", diet_pescetarian: "您的计划为鱼素" },
  dietAdj: { vegan: "纯素", vegetarian: "素食", pescetarian: "适合您的饮食" },
  insufficient: "我没有足够的数据来评估此商品。请阅读标签。",
  contains: (x, what) => `含有 ${x}（${what}）。您已将其列为需避免的内容。`,
  declared: (what) => `生产商声明含有${what}。您已将其列为需避免的内容。`,
  mayContain: (what) => `可能含有微量${what}。您已将其列为需避免的内容。`,
  verifyAmbiguous: (x) => `${x}：未注明来源，请查看标签。`,
  verifyUnknown: (x) => `${x}：我无法识别的成分。`,
  verifyVeganMaybe: (x) => `${x}：可能来自动物。`,
  verifyOther: (x) => `${x}：需要核实。`,
  notRecognized: (values) => `我无法检查：${values}。请阅读标签。`,
  suggestion: (category, without, diet) => {
    const what = category ? `类似商品（${category}）` : "类似商品";
    const w = without ? `，不含${without}` : "";
    return `试试${what}${w}${diet ? "，" + diet : ""}。`;
  },
  containsDiet: (x, plan) => `含有 ${x}。${plan}。`,
  traces: "可能含有",
  notice: "请务必查看包装上的标签。",
  attribution: "商品数据：Open Food Facts (openfoodfacts.org)，ODbL 许可。",
  fetchedAt: (date) => `数据读取于 ${date}。`,
  noName: "未命名商品",
};

const JA = {
  ...EN,
  open: "商品をスキャン",
  openHint: "バーコードを写してください。DUBI があなたのアレルギー、不耐症、食事スタイルと照合します。",
  title: "商品スキャナー",
  cameraStart: "カメラを開く", cameraStop: "カメラを閉じる", cameraAim: "バーコードを写してください",
  cameraDenied: "カメラの許可がない場合は、コードを入力できます。",
  cameraUnsupported: "ここではカメラでバーコードを読み取れません。コードを入力してください。",
  cameraFailed: "カメラを開けません。コードを入力してください。",
  manualLabel: "またはバーコードを入力（8〜14桁）", manualSubmit: "確認",
  invalidCode: "コードは8〜14桁の数字です。", loading: "商品を確認しています…",
  again: "別の商品をスキャン", close: "閉じる",
  errors: {
    PRODUCT_SCAN_SOURCE_UNAVAILABLE: "商品データベースに接続できません。少し後でもう一度お試しください。",
    PRODUCT_SCAN_TIMEOUT: "応答に時間がかかりすぎています。もう一度お試しください。",
    PRODUCT_SCAN_NETWORK: "オフラインか、接続に問題があります。もう一度お試しください。",
    PRODUCT_SCAN_NOT_ACTIVE: "スキャナーはまだ利用できません。",
    PROFILE_NOT_FOUND: "スキャナーを使うにはプロフィールを完成させてください。",
    PRODUCT_SCAN_AUTH: "スキャナーを使うにはもう一度ログインしてください。",
    PRODUCT_SCAN_BARCODE_INVALID: "コードは8〜14桁の数字です。",
    PRODUCT_SCAN_FAILED: "問題が発生しました。もう一度お試しください。",
  },
  verdicts: { NOT_SUITABLE: "あなたには不向き", TO_VERIFY: "要確認", NO_ISSUE_FOUND: "避けるべき原材料は見つかりませんでした", INSUFFICIENT_DATA: "データ不足" },
  groups: { AVOID: "避けるべきもの", TO_VERIFY: "要確認", IN_YOUR_DIET: "あなたの食事に含まれるもの", OUTSIDE_YOUR_DIET: "あなたの食事に含まれないもの", OTHER: "その他の原材料", ADDITIVES_FLAVOURINGS: "添加物と香料" },
  routes: { gluten_free: "グルテン", dairy_free: "乳・乳製品", egg_free: "卵", fish_shellfish_free: "魚・甲殻類・軟体動物", nut_free: "ナッツ類・落花生", soy_free: "大豆", sesame_free: "ごま", mustard_free: "マスタード", seed_oil_free: "種子油" },
  dietPlan: { diet_vegan: "あなたのプランはヴィーガンです", diet_vegetarian: "あなたのプランはベジタリアンです", diet_pescetarian: "あなたのプランはペスカタリアンです" },
  dietAdj: { vegan: "ヴィーガン", vegetarian: "ベジタリアン", pescetarian: "あなたの食事に合うもの" },
  insufficient: "この商品を評価するのに十分なデータがありません。ラベルをお読みください。",
  contains: (x, what) => `${x}（${what}）を含みます。避けるものとして登録されています。`,
  declared: (what) => `メーカーは${what}を表示しています。避けるものとして登録されています。`,
  mayContain: (what) => `${what}を微量に含む可能性があります。避けるものとして登録されています。`,
  verifyAmbiguous: (x) => `${x}：原料の由来が表示されていません。ラベルを確認してください。`,
  verifyUnknown: (x) => `${x}：認識できない原材料です。`,
  verifyVeganMaybe: (x) => `${x}：動物由来の可能性があります。`,
  verifyOther: (x) => `${x}：要確認。`,
  notRecognized: (values) => `確認できません：${values}。ラベルをお読みください。`,
  suggestion: (category, without, diet) => {
    const what = category ? `似た商品（${category}）` : "似た商品";
    const w = without ? `で${without}を含まないもの` : "";
    return `${what}${w}${diet ? "（" + diet + "）" : ""}を試してください。`;
  },
  containsDiet: (x, plan) => `${x}を含みます。${plan}。`,
  traces: "含む可能性",
  notice: "必ずパッケージのラベルを確認してください。",
  attribution: "商品データ：Open Food Facts (openfoodfacts.org)、ODbLライセンス。",
  fetchedAt: (date) => `${date} に読み込んだデータです。`,
  noName: "名前のない商品",
};

const RU = {
  ...EN,
  open: "Сканировать продукт",
  openHint: "Наведите камеру на штрихкод: DUBI сверит его с вашими аллергиями, непереносимостями и рационом.",
  title: "Сканер продуктов",
  cameraStart: "Открыть камеру", cameraStop: "Закрыть камеру", cameraAim: "Наведите камеру на штрихкод",
  cameraDenied: "Без доступа к камере можно ввести код вручную.",
  cameraUnsupported: "Здесь камера не читает штрихкоды: введите код вручную.",
  cameraFailed: "Не удаётся открыть камеру: введите код вручную.",
  manualLabel: "Или введите штрихкод (от 8 до 14 цифр)", manualSubmit: "Проверить",
  invalidCode: "Код должен содержать от 8 до 14 цифр.", loading: "Проверяю продукт…",
  again: "Сканировать другой продукт", close: "Закрыть",
  errors: {
    PRODUCT_SCAN_SOURCE_UNAVAILABLE: "Не удаётся связаться с базой продуктов. Попробуйте чуть позже.",
    PRODUCT_SCAN_TIMEOUT: "Ответ занимает слишком много времени. Попробуйте ещё раз.",
    PRODUCT_SCAN_NETWORK: "Нет подключения или соединение не работает. Попробуйте ещё раз.",
    PRODUCT_SCAN_NOT_ACTIVE: "Сканер пока недоступен.",
    PROFILE_NOT_FOUND: "Заполните профиль, чтобы пользоваться сканером.",
    PRODUCT_SCAN_AUTH: "Войдите снова, чтобы пользоваться сканером.",
    PRODUCT_SCAN_BARCODE_INVALID: "Код должен содержать от 8 до 14 цифр.",
    PRODUCT_SCAN_FAILED: "Что-то пошло не так. Попробуйте ещё раз.",
  },
  verdicts: { NOT_SUITABLE: "Вам не подходит", TO_VERIFY: "Нужно проверить", NO_ISSUE_FOUND: "Ингредиентов, которых нужно избегать, не найдено", INSUFFICIENT_DATA: "Недостаточно данных" },
  groups: { AVOID: "Вам нужно избегать", TO_VERIFY: "Нужно проверить", IN_YOUR_DIET: "В вашем рационе", OUTSIDE_YOUR_DIET: "Вне вашего рациона", OTHER: "Другие ингредиенты", ADDITIVES_FLAVOURINGS: "Добавки и ароматизаторы" },
  routes: { gluten_free: "глютен", dairy_free: "молоко и молочные продукты", egg_free: "яйца", fish_shellfish_free: "рыба, ракообразные и моллюски", nut_free: "орехи и арахис", soy_free: "соя", sesame_free: "кунжут", mustard_free: "горчица", seed_oil_free: "масла из семян" },
  dietPlan: { diet_vegan: "ваш план веганский", diet_vegetarian: "ваш план вегетарианский", diet_pescetarian: "ваш план пескетарианский" },
  dietAdj: { vegan: "веганский", vegetarian: "вегетарианский", pescetarian: "подходящий вашему рациону" },
  insufficient: "У меня недостаточно данных, чтобы оценить этот продукт. Прочитайте этикетку.",
  contains: (x, what) => `Содержит ${x} (${what}). Вы указали это среди того, чего нужно избегать.`,
  declared: (what) => `Производитель указывает: ${what}. Вы указали это среди того, чего нужно избегать.`,
  mayContain: (what) => `Может содержать следы: ${what}. Вы указали это среди того, чего нужно избегать.`,
  verifyAmbiguous: (x) => `${x}: происхождение не указано. Проверьте этикетку.`,
  verifyUnknown: (x) => `${x}: ингредиент, который я не могу распознать.`,
  verifyVeganMaybe: (x) => `${x}: может быть животного происхождения.`,
  verifyOther: (x) => `${x}: нужно проверить.`,
  notRecognized: (values) => `Не могу проверить: ${values}. Прочитайте этикетку.`,
  suggestion: (category, without, diet) => {
    const what = category ? `похожий продукт (${category})` : "похожий продукт";
    const w = without ? ` без: ${without}` : "";
    return `Попробуйте ${what}${w}${diet ? (w ? ", " : " ") + diet : ""}.`;
  },
  containsDiet: (x, plan) => `Содержит ${x}. ${cap(plan)}.`,
  traces: "Может содержать",
  notice: "Всегда проверяйте этикетку на упаковке.",
  attribution: "Данные о продукте: Open Food Facts (openfoodfacts.org), лицензия ODbL.",
  fetchedAt: (date) => `Данные получены ${date}.`,
  noName: "Продукт без названия",
};

const TEXTS = { it: IT, en: EN, fr: FR, es: ES, de: DE, pt: PT, ar: AR, zh: ZH, ja: JA, ru: RU };
export const PRODUCT_SCAN_LANGS = Object.freeze(Object.keys(TEXTS));

function cap(value) {
  const s = String(value || "");
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

export function productScanTexts(lang) {
  return TEXTS[lang] || TEXTS.it;
}

function routeLabel(tx, route) {
  return tx.routes[route] || route;
}

// Testo di un motivo nella lingua dell'utente, dai campi strutturati della risposta del backend.
export function reasonText(reason, lang) {
  const tx = productScanTexts(lang);
  const restriction = Array.isArray(reason.restriction) ? reason.restriction : [];
  switch (reason.code) {
    case "PRODUCT_NOT_FOUND":
    case "INGREDIENTS_MISSING":
      return tx.insufficient;
    case "CONTAINS_RESTRICTED": {
      const x = (reason.ingredients || []).join(", ");
      const first = restriction[0] || "";
      if (first.startsWith("diet_")) return tx.containsDiet(x, tx.dietPlan[first] || first);
      return tx.contains(x, restriction.map((r) => routeLabel(tx, r)).join(", "));
    }
    case "DECLARED_ALLERGEN":
      return tx.declared(routeLabel(tx, restriction[0]));
    case "MAY_CONTAIN":
      return tx.mayContain(routeLabel(tx, restriction[0]));
    case "TO_VERIFY": {
      const why = Array.isArray(reason.why) ? reason.why[0] : null;
      if (why === "ambiguous_origin") return tx.verifyAmbiguous(reason.ingredient);
      if (why === "not_recognized") return tx.verifyUnknown(reason.ingredient);
      if (why === "diet_vegan_maybe") return tx.verifyVeganMaybe(reason.ingredient);
      return tx.verifyOther(reason.ingredient);
    }
    case "PROFILE_RESTRICTION_NOT_RECOGNIZED":
      return tx.notRecognized((reason.values || []).join(", "));
    default:
      return lang === "it" && reason.text_it ? reason.text_it : tx.errors.PRODUCT_SCAN_FAILED;
  }
}

// "Prova un prodotto simile": solo tipo di prodotto e cosa evitare, mai marche (prima versione, D-057).
export function suggestionText(suggestion, lang) {
  if (!suggestion) return null;
  const tx = productScanTexts(lang);
  const without = (suggestion.without_routes || []).map((r) => routeLabel(tx, r)).filter(Boolean).join(", ");
  const diet = suggestion.diet ? tx.dietAdj[suggestion.diet] || null : null;
  return tx.suggestion(suggestion.category || null, without || null, diet);
}

// Gruppi nell'ordine fisso della specifica, solo quelli con ingredienti; dentro ogni gruppo l'ordine dell'etichetta.
export function orderedGroups(result) {
  const groups = Array.isArray(result && result.groups) ? result.groups : [];
  return GROUP_ORDER.map((key) => groups.find((g) => g.key === key)).filter((g) => g && Array.isArray(g.items) && g.items.length)
    .map((g) => ({ ...g, items: [...g.items].sort((a, b) => (a.order || 0) - (b.order || 0)) }));
}

export function verdictLabel(verdict, lang) {
  return productScanTexts(lang).verdicts[verdict] || productScanTexts(lang).verdicts.INSUFFICIENT_DATA;
}

export function errorText(code, lang) {
  const tx = productScanTexts(lang);
  return tx.errors[code] || tx.errors.PRODUCT_SCAN_FAILED;
}
