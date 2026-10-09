// D-057: schermata dello scanner del codice a barre. Tutto dentro DUBI: la fotocamera si apre nell'app
// (telefono: ML Kit, @capacitor-mlkit/barcode-scanning; web: BarcodeDetector del browser, se c'è), oppure il
// codice si scrive a mano. Al backend arriva solo il numero del codice; nessuna foto viene salvata o inviata.
// Ordine della risposta deciso da Enrico: esito → motivo → "prova un prodotto simile" → ingredienti in gruppi →
// fonte, data, "controlla sempre l'etichetta", attribuzione Open Food Facts.
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  errorText, normalizeBarcode, orderedGroups, productScanTexts, reasonText, scanProduct, suggestionText,
  VERDICT_COLORS, verdictLabel,
} from "./productScan.mjs";

const PALETTE = {
  red: { fg: "#8E1B1B", bg: "rgba(190,40,40,0.13)", border: "rgba(142,27,27,0.45)" },
  orange: { fg: "#8A4B00", bg: "rgba(214,128,0,0.15)", border: "rgba(138,75,0,0.45)" },
  green: { fg: "#1F5E2A", bg: "rgba(46,125,50,0.13)", border: "rgba(31,94,42,0.45)" },
  grey: { fg: "#4A4744", bg: "rgba(74,71,68,0.10)", border: "rgba(74,71,68,0.35)" },
};
const GROUP_COLOR = { AVOID: "red", TO_VERIFY: "orange", IN_YOUR_DIET: "green" };
const LOCALES = { it: "it-IT", en: "en-GB", fr: "fr-FR", es: "es-ES", de: "de-DE", pt: "pt-PT", ar: "ar", zh: "zh-CN", ja: "ja-JP", ru: "ru-RU" };
const WEB_FORMATS = ["ean_13", "ean_8", "upc_a", "upc_e"];

function cameraError(code) {
  const error = new Error(code);
  error.code = code;
  return error;
}

// Telefono (Android/iOS): interfaccia pronta di ML Kit. Su Android usa il modulo di Google Play Services
// (nessun permesso fotocamera all'app); su iOS chiede il permesso con il testo di Info.plist.
export async function readBarcodeNative(platform) {
  let plugin;
  try { plugin = await import("@capacitor-mlkit/barcode-scanning"); } catch (_error) { throw cameraError("CAMERA_UNSUPPORTED"); }
  const { BarcodeScanner, BarcodeFormat } = plugin;
  const { supported } = await BarcodeScanner.isSupported();
  if (!supported) throw cameraError("CAMERA_UNSUPPORTED");
  if (platform === "android") {
    const { available } = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
    if (!available) {
      await new Promise((resolve, reject) => {
        let handle = null;
        const timer = setTimeout(() => { if (handle) handle.remove(); reject(cameraError("CAMERA_FAILED")); }, 90000);
        BarcodeScanner.addListener("googleBarcodeScannerModuleInstallProgress", (event) => {
          if (event.state === 4) { clearTimeout(timer); if (handle) handle.remove(); resolve(); }
          if (event.state === 3 || event.state === 5) { clearTimeout(timer); if (handle) handle.remove(); reject(cameraError("CAMERA_FAILED")); }
        }).then((h) => { handle = h; return BarcodeScanner.installGoogleBarcodeScannerModule(); })
          .catch(() => { clearTimeout(timer); reject(cameraError("CAMERA_FAILED")); });
      });
    }
  } else {
    let permission = await BarcodeScanner.checkPermissions();
    if (permission.camera !== "granted" && permission.camera !== "limited") permission = await BarcodeScanner.requestPermissions();
    if (permission.camera !== "granted" && permission.camera !== "limited") throw cameraError("CAMERA_DENIED");
  }
  try {
    const { barcodes } = await BarcodeScanner.scan({ formats: [BarcodeFormat.Ean13, BarcodeFormat.Ean8, BarcodeFormat.UpcA, BarcodeFormat.UpcE] });
    const value = barcodes && barcodes[0] ? barcodes[0].rawValue || barcodes[0].displayValue : null;
    if (!value) throw cameraError("CAMERA_CANCELLED");
    return value;
  } catch (error) {
    if (error && error.code && String(error.code).startsWith("CAMERA_")) throw error;
    if (/cancel/i.test(String(error && error.message))) throw cameraError("CAMERA_CANCELLED");
    throw cameraError("CAMERA_FAILED");
  }
}

export async function webBarcodeSupport() {
  try {
    if (typeof window === "undefined" || !("BarcodeDetector" in window) || !navigator.mediaDevices?.getUserMedia) return false;
    const formats = await window.BarcodeDetector.getSupportedFormats();
    return WEB_FORMATS.some((f) => formats.includes(f));
  } catch (_error) {
    return false;
  }
}

const ProductScanScreen = ({ lang = "it", theme, apiBaseUrl, getToken, onClose, platform = "web", fetchImpl }) => {
  const tx = productScanTexts(lang);
  const T = theme || {};
  const [phase, setPhase] = useState("idle"); // idle | camera | loading | result
  const [manual, setManual] = useState("");
  const [inputError, setInputError] = useState(null);
  const [message, setMessage] = useState(null); // { kind: "error"|"info", text }
  const [result, setResult] = useState(null);
  const [webCamera, setWebCamera] = useState(null); // null = da verificare, true/false
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const loopRef = useRef(null);
  const busyRef = useRef(false);
  const native = platform === "android" || platform === "ios";

  useEffect(() => {
    let alive = true;
    if (!native) webBarcodeSupport().then((ok) => { if (alive) setWebCamera(ok); });
    return () => { alive = false; };
  }, [native]);

  const stopWebCamera = useCallback(() => {
    if (loopRef.current) { clearInterval(loopRef.current); loopRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach((track) => track.stop()); streamRef.current = null; }
  }, []);
  useEffect(() => stopWebCamera, [stopWebCamera]);

  const check = useCallback(async (raw) => {
    const code = normalizeBarcode(raw);
    if (!code) { setInputError(tx.invalidCode); return; }
    if (busyRef.current) return;
    busyRef.current = true;
    stopWebCamera();
    setInputError(null); setMessage(null); setPhase("loading");
    try {
      const body = await scanProduct({ apiBaseUrl, token: getToken ? getToken() : "", barcode: code, ...(fetchImpl ? { fetchImpl } : {}) });
      setResult(body); setPhase("result");
    } catch (error) {
      setMessage({ kind: "error", text: errorText(error && error.code, lang) });
      setPhase("idle");
    } finally {
      busyRef.current = false;
    }
  }, [apiBaseUrl, getToken, fetchImpl, lang, stopWebCamera, tx.invalidCode]);

  const openCamera = useCallback(async () => {
    setMessage(null); setInputError(null);
    if (native) {
      try {
        const value = await readBarcodeNative(platform);
        await check(value);
      } catch (error) {
        const code = error && error.code;
        if (code === "CAMERA_CANCELLED") return;
        setMessage({ kind: "info", text: code === "CAMERA_DENIED" ? tx.cameraDenied : code === "CAMERA_UNSUPPORTED" ? tx.cameraUnsupported : tx.cameraFailed });
      }
      return;
    }
    if (!webCamera) { setMessage({ kind: "info", text: tx.cameraUnsupported }); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      setPhase("camera");
      const detector = new window.BarcodeDetector({ formats: WEB_FORMATS });
      requestAnimationFrame(() => {
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        video.play().catch(() => {});
        loopRef.current = setInterval(async () => {
          if (!videoRef.current || videoRef.current.readyState < 2 || busyRef.current) return;
          try {
            const found = await detector.detect(videoRef.current);
            const value = found.map((b) => normalizeBarcode(b.rawValue)).find(Boolean);
            if (value) check(value);
          } catch (_error) { /* fotogramma non leggibile: si riprova al successivo */ }
        }, 250);
      });
    } catch (error) {
      stopWebCamera(); setPhase("idle");
      setMessage({ kind: "info", text: error && (error.name === "NotAllowedError" || error.name === "SecurityError") ? tx.cameraDenied : tx.cameraFailed });
    }
  }, [native, platform, webCamera, check, stopWebCamera, tx]);

  const closeCamera = () => { stopWebCamera(); setPhase("idle"); };
  const reset = () => { setResult(null); setManual(""); setMessage(null); setInputError(null); setPhase("idle"); };
  const close = () => { stopWebCamera(); if (onClose) onClose(); };

  const font = T.fontBody || "inherit";
  const display = T.fontDisplay || "inherit";
  const text = T.text || "#0F0F0F";
  const muted = T.muted || "#6B6660";
  const card = T.card || "#DEDAD1";
  const border = T.border || "rgba(15,15,15,0.13)";
  const button = { fontFamily: font, fontSize: 16, fontWeight: 600, padding: "14px 18px", borderRadius: 12, border: "none", background: T.accentD || "#0F0F0F", color: T.bg || "#E8E4DC", width: "100%", cursor: "pointer" };
  const ghost = { ...button, background: "transparent", color: text, border: `1px solid ${border}` };
  const cameraAvailable = native || webCamera === true;

  return (
    <div role="dialog" aria-modal="true" aria-label={tx.title} data-testid="product-scan-screen"
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: T.bg || "#E8E4DC", color: text, fontFamily: font, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "max(16px, env(safe-area-inset-top)) 16px max(24px, env(safe-area-inset-bottom))" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
          <h2 style={{ fontFamily: display, fontSize: 28, margin: 0, letterSpacing: 0.3 }}>{tx.title}</h2>
          <button type="button" onClick={close} aria-label={tx.close} style={{ ...ghost, width: "auto", padding: "8px 14px", fontSize: 15 }}>{tx.close}</button>
        </div>

        {phase !== "result" && (
          <>
            <p style={{ color: muted, fontSize: 15, lineHeight: 1.45, margin: "0 0 16px" }}>{tx.openHint}</p>
            {phase === "camera" && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", background: "#000", aspectRatio: "4 / 3" }}>
                  <video ref={videoRef} muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div aria-hidden="true" style={{ position: "absolute", left: "12%", right: "12%", top: "38%", height: "24%", border: "2px solid rgba(255,255,255,0.85)", borderRadius: 10 }} />
                </div>
                <p style={{ textAlign: "center", color: muted, fontSize: 14, margin: "8px 0" }}>{tx.cameraAim}</p>
                <button type="button" onClick={closeCamera} style={ghost}>{tx.cameraStop}</button>
              </div>
            )}
            {phase === "idle" && cameraAvailable && (
              <button type="button" onClick={openCamera} style={{ ...button, marginBottom: 16 }} data-testid="product-scan-camera">{tx.cameraStart}</button>
            )}
            {phase === "loading" && (
              <p role="status" aria-live="polite" style={{ fontSize: 16, padding: "18px 0", textAlign: "center" }}>{tx.loading}</p>
            )}
            {message && (
              <p role={message.kind === "error" ? "alert" : "status"} style={{ background: message.kind === "error" ? PALETTE.red.bg : card, color: message.kind === "error" ? PALETTE.red.fg : text, borderRadius: 12, padding: "12px 14px", fontSize: 15, margin: "0 0 16px" }}>{message.text}</p>
            )}
            {phase !== "loading" && (
              <form onSubmit={(e) => { e.preventDefault(); check(manual); }} style={{ display: "grid", gap: 8 }}>
                <label htmlFor="dubi-barcode-input" style={{ fontSize: 14, color: muted }}>{tx.manualLabel}</label>
                <input id="dubi-barcode-input" data-testid="product-scan-input" inputMode="numeric" autoComplete="off" value={manual}
                  onChange={(e) => { setManual(e.target.value); setInputError(null); }}
                  aria-invalid={inputError ? "true" : "false"} aria-describedby={inputError ? "dubi-barcode-error" : undefined}
                  style={{ fontFamily: font, fontSize: 18, padding: "12px 14px", borderRadius: 12, border: `1px solid ${inputError ? PALETTE.red.fg : border}`, background: card, color: text, letterSpacing: 1 }} />
                {inputError && <span id="dubi-barcode-error" role="alert" style={{ color: PALETTE.red.fg, fontSize: 14 }}>{inputError}</span>}
                <button type="submit" style={phase === "idle" && cameraAvailable ? ghost : button} data-testid="product-scan-submit">{tx.manualSubmit}</button>
              </form>
            )}
          </>
        )}

        {phase === "result" && result && <ScanResult result={result} lang={lang} tx={tx} T={T} border={border} muted={muted} card={card} />}

        {phase === "result" && (
          <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
            <button type="button" onClick={reset} style={button} data-testid="product-scan-again">{tx.again}</button>
            <button type="button" onClick={close} style={ghost}>{tx.close}</button>
          </div>
        )}
      </div>
    </div>
  );
};

const ScanResult = ({ result, lang, tx, T, border, muted, card }) => {
  const color = PALETTE[VERDICT_COLORS[result.verdict]] || PALETTE.grey;
  const showReasons = result.verdict === "NOT_SUITABLE" || result.verdict === "TO_VERIFY" || result.verdict === "INSUFFICIENT_DATA";
  const reasons = showReasons ? (result.reasons || []).map((r) => reasonText(r, lang)) : [];
  const uniqueReasons = [...new Set(reasons)].map((r) => (r ? r[0].toLocaleUpperCase(LOCALES[lang] || "it-IT") + r.slice(1) : r));
  const suggestion = suggestionText(result.suggestion, lang);
  const groups = orderedGroups(result);
  const product = result.product || null;
  let fetched = null;
  if (result.source && result.source.fetched_at) {
    const d = new Date(result.source.fetched_at);
    if (!Number.isNaN(d.getTime())) fetched = d.toLocaleDateString(LOCALES[lang] || "it-IT", { day: "numeric", month: "long", year: "numeric" });
  }
  return (
    <div data-testid="product-scan-result" data-verdict={result.verdict}>
      <div role="status" aria-live="polite" style={{ background: color.bg, border: `1px solid ${color.border}`, color: color.fg, borderRadius: 14, padding: "14px 16px", fontSize: 20, fontWeight: 700, fontFamily: T.fontDisplay || "inherit", letterSpacing: 0.2 }}>
        {verdictLabel(result.verdict, lang)}
      </div>
      {product && (
        <p style={{ margin: "10px 2px 0", fontSize: 15, color: muted }}>
          <strong style={{ color: T.text || "#0F0F0F" }}>{product.name || tx.noName}</strong>{product.brands ? ` · ${product.brands}` : ""} · {product.code}
        </p>
      )}
      {uniqueReasons.length > 0 && (
        <ul style={{ margin: "14px 0 0", paddingInlineStart: 20, display: "grid", gap: 6, fontSize: 15, lineHeight: 1.45 }}>
          {uniqueReasons.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      )}
      {suggestion && (
        <p style={{ margin: "12px 0 0", padding: "10px 12px", borderRadius: 12, background: card, fontSize: 15, lineHeight: 1.45 }}>{suggestion}</p>
      )}
      {groups.map((group) => {
        const gc = GROUP_COLOR[group.key] ? PALETTE[GROUP_COLOR[group.key]] : null;
        const small = group.key === "ADDITIVES_FLAVOURINGS";
        return (
          <section key={group.key} data-group={group.key} style={{ marginTop: 18 }}>
            <h3 style={{ margin: "0 0 6px", fontSize: small ? 13 : 15, textTransform: "uppercase", letterSpacing: 0.6, color: gc ? gc.fg : muted }}>{tx.groups[group.key]}</h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, borderTop: `1px solid ${border}` }}>
              {group.items.map((item) => (
                <li key={`${group.key}-${item.order}`} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: small ? "5px 0" : "8px 0", borderBottom: `1px solid ${border}`, fontSize: small ? 13 : 15, paddingInlineStart: item.depth ? item.depth * 14 : 0, color: small ? muted : "inherit" }}>
                  <span>{item.text}</span>
                  {Number.isFinite(item.percent_declared) && <span style={{ color: muted, whiteSpace: "nowrap" }}>{tx.percent(item.percent_declared)}</span>}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      {Array.isArray(result.traces) && result.traces.length > 0 && (
        <p style={{ marginTop: 14, fontSize: 14, color: muted }}>
          {tx.traces}: {result.traces.map((t) => (t.route && tx.routes[t.route]) || (lang === "it" ? t.label_it : String(t.tag || "").replace(/^\w+:/, ""))).join(", ")}
        </p>
      )}
      <div style={{ marginTop: 20, fontSize: 13, color: muted, lineHeight: 1.5 }}>
        <p style={{ margin: "0 0 4px", fontWeight: 700, color: T.text || "#0F0F0F", fontSize: 14 }}>{tx.notice}</p>
        {fetched && <p style={{ margin: "0 0 4px" }}>{tx.fetchedAt(fetched)}</p>}
        <p style={{ margin: 0 }}>
          <a href={product && product.code ? `https://world.openfoodfacts.org/product/${product.code}` : "https://world.openfoodfacts.org"} target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>{tx.attribution}</a>
        </p>
      </div>
    </div>
  );
};

export default ProductScanScreen;
