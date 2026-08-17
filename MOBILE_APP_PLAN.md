# DUBI Mobile App Plan

This repo now has a Capacitor app shell so the current static DUBI web app can become a real iOS/Android app without pausing backend meal-engine work.

## Current architecture

- Web app: static `index.html` prototype with PWA files.
- Mobile shell: Capacitor packages the generated `dist` folder.
- Backend: `https://dubi-backend.onrender.com`, with wearable routes already present.
- Build config: `VITE_DUBI_APP_ENV` and `VITE_DUBI_API_BASE_URL` select staging/production without code edits.
- Native bridge: `mobile-bridge.js` is the reserved integration point for native-only features.
- Bundle id: `health.dubi.app`.
- URL scheme: `dubi://`.

## Phase 1 - App shell

- Done: build static assets into `dist`.
- Done: add Capacitor config and native Android/iOS platform folders.
- Done: configure app id `health.dubi.app`, app name, splash screen, status bar, and web asset sync.
- Done: add GitHub Actions workflow for Android debug APK builds.
- Done: add Android release workflow for signed APK/AAB artifacts through GitHub Secrets.
- Done: switch native bundle id to `health.dubi.app`.
- Done: add native `dubi://` URL scheme skeleton.
- Done: add baseline iOS privacy manifest.
- Pending local machine setup: Android debug build requires JDK 21, `JAVA_HOME`, and Android SDK.
- Pending macOS setup: iOS build requires Xcode and CocoaPods.

## Phase 2 - Product hardening

- Done: move the frontend from CDN React/Babel to a bundled React/Vite build.
- Done: keep the existing UX while reducing startup risk and improving offline behavior.
- Done: add mobile-safe session handling and deep-link handling.
- Done: move auth token storage behind a small async adapter and use Capacitor Preferences in native builds.
- Done: add staging/production API configuration with build-time validation.
- Done: split the native app bootstrap into a small Vite entry chunk.

## Phase 3 - Monetization

- Add Apple/Google subscriptions.
- Store entitlement status on the backend.
- Gate premium features server-side, not only in the frontend.
- Add trial/paywall states and subscription recovery.

## Phase 4 - Health and wearable data

- iOS: HealthKit through a native plugin.
- Android: Health Connect.
- Existing cloud wearables continue through the backend/OpenWearables flow.
- Store consent, sync status, and revocation behavior in the backend.

## Commands

```bash
pnpm install
pnpm run build:web
pnpm exec cap sync android
pnpm exec cap open android
```

For iOS, run the equivalent commands on macOS with Xcode:

```bash
pnpm exec cap sync ios
pnpm exec cap open ios
```

## Verification status

- `pnpm install`: passed.
- `node scripts/prepare-mobile-web.js`: passed.
- `pnpm exec cap add android`: passed.
- `pnpm exec cap add ios`: passed, with expected Windows warnings for missing CocoaPods/Xcode.
- `pnpm exec cap sync`: passed.
- `android/gradlew.bat assembleDebug`: blocked locally by missing `JAVA_HOME` / local Java installation.
- `pnpm run check:mobile-env`: use this before Android builds to verify JDK/SDK setup.
- `.github/workflows/android-debug.yml`: can build and upload a debug APK from GitHub Actions after these mobile files are pushed.
- `.github/workflows/android-release.yml`: can build signed Android release artifacts after release signing secrets are configured.
