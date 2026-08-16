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
