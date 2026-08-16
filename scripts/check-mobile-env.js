const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

function command(name, args = ["--version"]) {
  const result = spawnSync(name, args, { encoding: "utf8", shell: process.platform === "win32" });
  return {
    ok: result.status === 0,
    output: `${result.stdout || ""}${result.stderr || ""}`.trim()
  };
}

function exists(value) {
  return Boolean(value && fs.existsSync(value));
}

function androidSdkCandidates() {
  const candidates = [
    process.env.ANDROID_HOME,
    process.env.ANDROID_SDK_ROOT,
    path.join(os.homedir(), "AppData", "Local", "Android", "Sdk"),
    path.join(os.homedir(), "Library", "Android", "sdk"),
    path.join(os.homedir(), "Android", "Sdk")
  ].filter(Boolean);
  return [...new Set(candidates)];
}

const java = command("java");
const javac = command("javac");
const sdkPath = androidSdkCandidates().find(exists);
const sdkmanager = sdkPath
  ? [
      path.join(sdkPath, "cmdline-tools", "latest", "bin", process.platform === "win32" ? "sdkmanager.bat" : "sdkmanager"),
      path.join(sdkPath, "tools", "bin", process.platform === "win32" ? "sdkmanager.bat" : "sdkmanager")
    ].find(exists)
  : null;

const checks = [
  ["Java runtime", java.ok, java.output.split(/\r?\n/)[0] || "not found"],
  ["Java compiler", javac.ok, javac.output.split(/\r?\n/)[0] || "not found"],
  ["JAVA_HOME", exists(process.env.JAVA_HOME), process.env.JAVA_HOME || "not set"],
  ["Android SDK", Boolean(sdkPath), sdkPath || "not found"],
  ["sdkmanager", Boolean(sdkmanager), sdkmanager || "not found"]
];

let failed = false;
for (const [label, ok, details] of checks) {
  const marker = ok ? "OK" : "MISSING";
  console.log(`${marker.padEnd(8)} ${label}: ${details}`);
  if (!ok) failed = true;
}

if (failed) {
  console.log("\nRequired for Android debug builds: JDK 17+ and Android SDK platform 35.");
  process.exit(1);
}

console.log("\nMobile build environment looks ready.");
