# DUBI Android Release

This document tracks the Android path from internal testing to Google Play.

## Current state

- Debug APK builds in GitHub Actions.
- Release workflow can produce unsigned APK/AAB artifacts.
- App id: `health.dubi.app`.
- Version defaults: `versionName=0.1.0`, `versionCode=1`.

## Internal testing flow

1. Run `Android Release Build` from GitHub Actions.
2. Use `version_name=0.1.0` and `version_code=1` for the first internal build.
3. Download `dubi-android-release-unsigned`.
4. Before Google Play upload, sign the AAB with Play App Signing or a release keystore.

## Google Play requirements

- Google Play Console account.
- App name, short description, full description.
- App icon and feature graphic.
- Phone screenshots.
- Privacy policy URL.
- Data safety form.
- Content rating questionnaire.
- Closed/internal testing track.
- Signed Android App Bundle (`.aab`).

## Signing policy

Do not commit keystores, passwords, service account JSON, or signing secrets.

For Play Store builds, use one of these:

- Google Play App Signing with upload key.
- GitHub Actions secrets for release signing.
- Local signing through Android Studio for controlled manual releases.

## Versioning

Every Play upload must increase `versionCode`.

Examples:

```bash
./gradlew -PDUBI_VERSION_NAME=0.1.0 -PDUBI_VERSION_CODE=1 bundleRelease
./gradlew -PDUBI_VERSION_NAME=0.1.1 -PDUBI_VERSION_CODE=2 bundleRelease
```
