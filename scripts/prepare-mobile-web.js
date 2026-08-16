const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const checkOnly = process.argv.includes("--check");

const files = [
  "index.html",
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

  let content = fs.readFileSync(source);
  if (relativePath === "index.html") {
    content = injectMobileBridge(content.toString("utf8"));
  }

  fs.writeFileSync(target, content);
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

function verifyDist() {
  const htmlPath = path.join(dist, "index.html");
  const html = fs.readFileSync(htmlPath, "utf8");
  const required = [
    'id="dubi-html"',
    "API_BASE_URL",
    "WearableProvider",
    "authorizeWearableProviderInBackend",
    "/mobile-bridge.js"
  ];
  const missing = required.filter((needle) => !html.includes(needle));
  if (missing.length) {
    throw new Error(`Mobile web build is missing markers: ${missing.join(", ")}`);
  }
}

if (!checkOnly) {
  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(dist, { recursive: true });
  files.forEach(copyFile);
  directories.forEach(copyDirectory);
}

verifyDist();
console.log(`${checkOnly ? "Checked" : "Prepared"} DUBI mobile web assets in ${dist}`);
