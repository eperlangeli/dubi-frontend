import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const colors = {
  bg: "#FAF9F7",
  ink: "#FAF9F7",
  green: "#6B8A64",
  gold: "#C9A87C",
};

const ensureDir = (dir) => fs.mkdir(dir, { recursive: true });

const iconSvg = ({ background = true, rounded = true, transparent = false } = {}) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  ${background ? `<rect width="512" height="512" rx="${rounded ? 112 : 0}" fill="${transparent ? "transparent" : colors.bg}"/>` : ""}
  <circle cx="256" cy="256" r="170" fill="${colors.green}"/>
  <path d="M157 166h88c75 0 122 37 122 90s-47 90-122 90h-88zm84 132c40 0 63-15 63-42s-23-42-63-42h-23v84z" fill="${colors.ink}"/>
  <circle cx="363" cy="166" r="26" fill="${colors.gold}"/>
</svg>`;

const splashSvg = (width, height) => {
  const size = Math.round(Math.min(width, height) * 0.22);
  const x = Math.round((width - size) / 2);
  const y = Math.round((height - size) / 2);
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${colors.bg}"/>
  <g transform="translate(${x} ${y}) scale(${size / 512})">
    ${iconSvg({ background: true, rounded: true }).replace(/<svg[^>]*>|<\/svg>/g, "")}
  </g>
</svg>`;
};

const writePngFromSvg = async (file, svg, width, height = width) => {
  await ensureDir(path.dirname(file));
  await sharp(Buffer.from(svg)).resize(width, height).png().toFile(file);
};

const writeJson = async (file, data) => {
  await ensureDir(path.dirname(file));
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
};

const androidDensities = [
  ["mdpi", 48, 108],
  ["hdpi", 72, 162],
  ["xhdpi", 96, 216],
  ["xxhdpi", 144, 324],
  ["xxxhdpi", 192, 432],
];

for (const [density, legacySize, foregroundSize] of androidDensities) {
  const dir = path.join(root, "android/app/src/main/res", `mipmap-${density}`);
  await writePngFromSvg(path.join(dir, "ic_launcher.png"), iconSvg(), legacySize);
  await writePngFromSvg(path.join(dir, "ic_launcher_round.png"), iconSvg({ rounded: false }), legacySize);
  await writePngFromSvg(path.join(dir, "ic_launcher_foreground.png"), iconSvg({ background: false }), foregroundSize);
}

await writePngFromSvg(path.join(root, "icons/dubi-icon-192.png"), iconSvg(), 192);
await writePngFromSvg(path.join(root, "icons/dubi-icon-512.png"), iconSvg(), 512);

const splashTargets = [
  ["android/app/src/main/res/drawable/splash.png", 480, 320],
  ["android/app/src/main/res/drawable-land-mdpi/splash.png", 480, 320],
  ["android/app/src/main/res/drawable-land-hdpi/splash.png", 800, 480],
  ["android/app/src/main/res/drawable-land-xhdpi/splash.png", 1280, 720],
  ["android/app/src/main/res/drawable-land-xxhdpi/splash.png", 1600, 960],
  ["android/app/src/main/res/drawable-land-xxxhdpi/splash.png", 1920, 1280],
  ["android/app/src/main/res/drawable-port-mdpi/splash.png", 320, 480],
  ["android/app/src/main/res/drawable-port-hdpi/splash.png", 480, 800],
  ["android/app/src/main/res/drawable-port-xhdpi/splash.png", 720, 1280],
  ["android/app/src/main/res/drawable-port-xxhdpi/splash.png", 960, 1600],
  ["android/app/src/main/res/drawable-port-xxxhdpi/splash.png", 1280, 1920],
];

for (const [file, width, height] of splashTargets) {
  await writePngFromSvg(path.join(root, file), splashSvg(width, height), width, height);
}

const iosIconDir = path.join(root, "ios/App/App/Assets.xcassets/AppIcon.appiconset");
const iosIcons = [
  ["Icon-App-20x20@1x.png", "20x20", "1x", "ipad", 20],
  ["Icon-App-20x20@2x.png", "20x20", "2x", "iphone", 40],
  ["Icon-App-20x20@2x~ipad.png", "20x20", "2x", "ipad", 40],
  ["Icon-App-20x20@3x.png", "20x20", "3x", "iphone", 60],
  ["Icon-App-29x29@1x.png", "29x29", "1x", "ipad", 29],
  ["Icon-App-29x29@2x.png", "29x29", "2x", "iphone", 58],
  ["Icon-App-29x29@2x~ipad.png", "29x29", "2x", "ipad", 58],
  ["Icon-App-29x29@3x.png", "29x29", "3x", "iphone", 87],
  ["Icon-App-40x40@1x.png", "40x40", "1x", "ipad", 40],
  ["Icon-App-40x40@2x.png", "40x40", "2x", "iphone", 80],
  ["Icon-App-40x40@2x~ipad.png", "40x40", "2x", "ipad", 80],
  ["Icon-App-40x40@3x.png", "40x40", "3x", "iphone", 120],
  ["Icon-App-60x60@2x.png", "60x60", "2x", "iphone", 120],
  ["Icon-App-60x60@3x.png", "60x60", "3x", "iphone", 180],
  ["Icon-App-76x76@1x.png", "76x76", "1x", "ipad", 76],
  ["Icon-App-76x76@2x.png", "76x76", "2x", "ipad", 152],
  ["Icon-App-83.5x83.5@2x.png", "83.5x83.5", "2x", "ipad", 167],
  ["Icon-App-1024x1024@1x.png", "1024x1024", "1x", "ios-marketing", 1024],
];

for (const [filename, , , , px] of iosIcons) {
  await writePngFromSvg(path.join(iosIconDir, filename), iconSvg({ rounded: false }), px);
}

await writeJson(path.join(iosIconDir, "Contents.json"), {
  images: iosIcons.map(([filename, size, scale, idiom]) => ({ size, idiom, filename, scale })),
  info: { version: 1, author: "xcode" },
});

const iosSplashDir = path.join(root, "ios/App/App/Assets.xcassets/Splash.imageset");
for (const filename of ["splash-2732x2732.png", "splash-2732x2732-1.png", "splash-2732x2732-2.png"]) {
  await writePngFromSvg(path.join(iosSplashDir, filename), splashSvg(2732, 2732), 2732, 2732);
}

console.log("Generated DUBI mobile icons and splash assets.");
