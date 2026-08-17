#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const keystorePath = process.argv[2];

if (!keystorePath) {
  console.error("Usage: node scripts/encode-android-keystore.mjs <path-to-upload-key.jks>");
  process.exit(1);
}

const resolved = path.resolve(keystorePath);
if (!fs.existsSync(resolved)) {
  console.error(`Keystore not found: ${resolved}`);
  process.exit(1);
}

const base64 = fs.readFileSync(resolved).toString("base64");
console.log(base64);
