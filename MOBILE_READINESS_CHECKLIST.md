# DUBI Mobile Readiness Checklist

## Must be handled before wider beta

- Android release signing and Google Play internal testing.
- iOS signing, TestFlight, and App Store Connect setup.
- Performance bundle/code-splitting pass for faster native startup.

## Done in the current shell

- Capacitor Android/iOS platform projects.
- Bundle id: `health.dubi.app`.
- URL scheme skeleton: `dubi://`.
- Android debug APK workflow.
- Android release artifact workflow.
- Vite bundled build.
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
