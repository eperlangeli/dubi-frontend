const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const checkOnly = process.argv.includes("--check");

const files = [
  "offline.html",
  "privacy.html",
  "manifest.webmanifest",
  "sw.js",
  "dubi_legal.js",
  "mobile-bridge.js"
];

const directories = ["icons"];

function copyFile(relativePath) {
  const source = path.join(root, relativePath);
  const target = path.join(dist, relativePath);

  if (!fs.existsSync(source)) {
    throw new Error(`Missing required file: ${relativePath}`);
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });

  fs.copyFileSync(source, target);
}

function copyDirectory(relativePath) {
  const source = path.join(root, relativePath);
  const target = path.join(dist, relativePath);

  if (!fs.existsSync(source)) {
    throw new Error(`Missing required directory: ${relativePath}`);
  }

  fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(source, target, { recursive: true });
}

function injectMobileBridge(html) {
  const bridgeTag = '<script src="/mobile-bridge.js"></script>';
  if (html.includes(bridgeTag)) return html;
  return html.replace("</head>", `  ${bridgeTag}\n</head>`);
}

function buildWithVite() {
  const viteScript = path.join(root, "node_modules", "vite", "bin", "vite.js");
  const result = spawnSync(process.execPath, [viteScript, "build"], {
    cwd: root,
    stdio: "inherit"
  });

  if (result.status !== 0) {
    throw new Error(`Vite build failed with exit code ${result.status}`);
  }
}

function injectBridgeIntoDist() {
  const htmlPath = path.join(dist, "index.html");
  const html = fs.readFileSync(htmlPath, "utf8");
  fs.writeFileSync(htmlPath, injectMobileBridge(html), "utf8");
}

function verifyDist() {
  const htmlPath = path.join(dist, "index.html");
  const html = fs.readFileSync(htmlPath, "utf8");
  const required = [
    'id="dubi-html"',
    'type="module"',
    "/mobile-bridge.js"
  ];
  const missing = required.filter((needle) => !html.includes(needle));
  if (missing.length) {
    throw new Error(`Mobile web build is missing markers: ${missing.join(", ")}`);
  }

  const assetsPath = path.join(dist, "assets");
  if (!fs.existsSync(assetsPath)) {
    throw new Error("Mobile web build is missing Vite assets.");
  }
}

if (!checkOnly) {
  buildWithVite();
  files.forEach(copyFile);
  directories.forEach(copyDirectory);
  injectBridgeIntoDist();
}

verifyDist();
console.log(`${checkOnly ? "Checked" : "Prepared"} DUBI mobile web assets in ${dist}`);
