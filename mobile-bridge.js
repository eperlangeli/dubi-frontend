(function () {
  var runtime = {
    isNative: false,
    platform: "web",
    ready: false
  };

  function detectRuntime() {
    var capacitor = window.Capacitor;
    runtime.isNative = Boolean(capacitor && typeof capacitor.isNativePlatform === "function" && capacitor.isNativePlatform());
    runtime.platform = capacitor && typeof capacitor.getPlatform === "function" ? capacitor.getPlatform() : "web";
    runtime.ready = true;

    document.documentElement.setAttribute("data-dubi-runtime", runtime.isNative ? "native" : "web");
    document.documentElement.setAttribute("data-dubi-platform", runtime.platform);
    window.dispatchEvent(new CustomEvent("dubi:mobile-ready", { detail: runtime }));
  }

  window.DUBI_MOBILE = {
    getRuntime: function () {
      return Object.assign({}, runtime);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", detectRuntime, { once: true });
  } else {
    detectRuntime();
  }
})();
