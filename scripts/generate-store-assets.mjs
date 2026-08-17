import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const rootDir = process.cwd();
const outDir = path.join(rootDir, "store-assets", "android");

await fs.mkdir(outDir, { recursive: true });

await sharp(path.join(rootDir, "icons", "dubi-icon-512.png"))
  .resize(512, 512, { fit: "cover" })
  .png()
  .toFile(path.join(outDir, "play-store-icon-512.png"));

const featureSvg = `
<svg width="1024" height="500" viewBox="0 0 1024 500" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="500" fill="#FAF9F7"/>
  <circle cx="836" cy="190" r="170" fill="#DDE7D7"/>
  <circle cx="142" cy="388" r="120" fill="#E9D8C8"/>
  <rect x="88" y="88" width="848" height="324" rx="48" fill="#FFFFFF"/>
  <text x="150" y="222" font-family="Arial, sans-serif" font-size="88" font-weight="800" fill="#2B2B2B">DUBI</text>
  <text x="154" y="288" font-family="Arial, sans-serif" font-size="34" font-weight="500" fill="#625D59">Nutrition planning for real life</text>
  <text x="154" y="342" font-family="Arial, sans-serif" font-size="26" font-weight="500" fill="#6B8A64">Beta Android release</text>
  <circle cx="808" cy="250" r="86" fill="#6B8A64"/>
  <text x="746" y="280" font-family="Arial, sans-serif" font-size="56" font-weight="800" fill="#FFFFFF">DU</text>
</svg>`;

await sharp(Buffer.from(featureSvg))
  .png()
  .toFile(path.join(outDir, "feature-graphic-1024x500.png"));

console.log("Generated Android store assets.");
