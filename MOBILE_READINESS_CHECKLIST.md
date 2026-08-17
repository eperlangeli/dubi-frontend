# DUBI Mobile Readiness Checklist

## Must be handled before wider beta

- Android release signing and Google Play internal testing.
- iOS signing, TestFlight, and App Store Connect setup.
- Store listing, privacy/data safety, health-app declarations, and reviewer notes.

## Done in the current shell

- Capacitor Android/iOS platform projects.
- Bundle id: `health.dubi.app`.
- URL scheme skeleton: `dubi://`.
- Android debug APK workflow.
- Android release artifact workflow.
- Android release signing workflow through GitHub Secrets.
- Vite bundled build.
- Small native startup bootstrap chunk.
- Native session storage through `@capacitor/preferences`.
- Reset-password deep link handling.
- iOS safe-area audit for bottom navigation and fixed controls.
- Native keyboard handling for onboarding and numeric inputs.
- Production icons and splash assets.
- Staging/production environment configuration.
- iOS `PrivacyInfo.xcprivacy` with current data-use declarations.

## Asset targets

Prepare a square source logo at `1024x1024` PNG with no transparency for iOS. From that source we can generate the required iOS and Android icon sets.

Prepare a splash source at least `2732x2732` PNG, centered, with enough padding for cropping on tall and wide screens.

## Store-readiness materials

Use `STORE_RELEASE_CHECKLIST.md` as the source of truth for the remaining Android/iOS beta and store tasks.
