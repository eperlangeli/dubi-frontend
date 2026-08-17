# DUBI Frontend

Static beta frontend for DUBI.

## Free Beta

DUBI is currently available as a free beta. The complete nutrition plan, adaptations, shopping list, progress tracking, and wearable features are included without a subscription.

The initial beta is limited to users aged 18 or older. Minor access will open only after a real parental-consent flow is available.

## PWA

The deployed static site includes a web app manifest, installable icon, service worker, and offline fallback page. The next frontend milestone is migrating the current single-file prototype to React + Vite without changing the user experience.

## Native mobile app

DUBI now includes a Capacitor shell for iOS and Android.

```bash
pnpm install
pnpm run build:web
pnpm exec cap sync
pnpm exec cap open android
```

## Environments

The app reads its backend URL from Vite env vars. Production is the default:

```bash
VITE_DUBI_APP_ENV=production
VITE_DUBI_API_BASE_URL=https://dubi-backend.onrender.com
```

Use `.env.example` as the template for local or staging builds. Do not hardcode backend URLs inside `src/App.jsx`.

Staging builds intentionally fail unless `VITE_DUBI_API_BASE_URL` is explicitly set, so test builds cannot accidentally use production data.

Android debug builds require a local JDK 21+ and Android SDK:

```bash
pnpm run check:mobile-env
pnpm run android:debug
```

iOS builds require macOS, Xcode, and CocoaPods:

```bash
pnpm exec cap open ios
```

The current mobile shell intentionally reuses the static app and production backend. Native HealthKit, Health Connect, push notifications, and subscriptions should be added through `mobile-bridge.js` plus Capacitor plugins, with entitlement checks enforced by the backend.

The `Android Debug Build` GitHub Action can also produce a debug APK artifact from GitHub without relying on the local Windows Android setup.

For release and Google Play preparation, see `ANDROID_RELEASE.md`.
