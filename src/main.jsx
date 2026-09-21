import React from "react";
import { createRoot } from "react-dom/client";

window.__DUBI_BUILD__ = {
  frontend_commit: __DUBI_FRONTEND_COMMIT__,
  build_timestamp: __DUBI_BUILD_TIMESTAMP__,
};

const finishBoot = () => {
  window._dubiReady = true;
  clearTimeout(window._dubiBootTimer);
  const bootEl = document.getElementById("dubi-boot");
  if (bootEl) {
    bootEl.classList.add("hidden");
    setTimeout(() => {
      bootEl.style.display = "none";
    }, 350);
  }
};

const showBootError = () => {
  const errorEl = document.getElementById("dubi-boot-error");
  if (errorEl) errorEl.style.display = "block";
  const spinner = document.querySelector(".dubi-boot-spinner");
  if (spinner) spinner.style.display = "none";
};

import("./App.jsx")
  .then(({ DUBIRoot, LangProvider, WearableProvider }) => {
    const rootEl = document.getElementById("root");
    if (!rootEl) throw new Error("Missing DUBI root element");

    createRoot(rootEl).render(
      <LangProvider>
        <WearableProvider>
          <DUBIRoot />
        </WearableProvider>
      </LangProvider>
    );

    finishBoot();
  })
  .catch((error) => {
    console.error("DUBI startup failed", error);
    showBootError();
  });
