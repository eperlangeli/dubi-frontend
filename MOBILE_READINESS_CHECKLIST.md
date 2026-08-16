# DUBI Mobile Readiness Checklist

## Must be handled before wider beta

- Babel standalone to Vite bundled build.
- Native session storage through `@capacitor/preferences`.
- Staging/production environment configuration.
- Reset-password and email-verification deep link handling.
- iOS safe-area audit for every screen with bottom navigation or fixed controls.
- iOS keyboard testing for onboarding, login, password reset, and numeric inputs.
- Production icons and splash assets.
- Android release signing and Google Play internal testing.
- iOS signing, TestFlight, and App Store Connect setup.

## Done in the current shell

- Capacitor Android/iOS platform projects.
- Bundle id: `health.dubi.app`.
- URL scheme skeleton: `dubi://`.
- Android debug APK workflow.
- Android release artifact workflow.
- Baseline iOS `PrivacyInfo.xcprivacy`.

## Asset targets

Prepare a square source logo at `1024x1024` PNG with no transparency for iOS. From that source we can generate the required iOS and Android icon sets.

Prepare a splash source at least `2732x2732` PNG, centered, with enough padding for cropping on tall and wide screens.
