# DUBI Android Release

This document tracks the Android path from internal testing to Google Play.

## Current state

- Debug APK builds in GitHub Actions.
- Release workflow can produce signed APK/AAB artifacts when GitHub Secrets are configured.
- App id: `health.dubi.app`.
- Version defaults: `versionName=0.1.0`, `versionCode=1`.

## Internal testing flow

1. Create an Android upload keystore and keep it private.
2. Add the signing values below as GitHub Actions secrets.
3. Run `Android Release Build` from GitHub Actions.
4. Use `version_name=0.1.0` and `version_code=1` for the first internal build.
5. Download `dubi-android-release-signed`.
6. Upload `app-release.aab` to Google Play Console internal testing.

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

The release workflow expects these GitHub Actions secrets:

- `DUBI_ANDROID_KEYSTORE_BASE64`: base64-encoded upload keystore file.
- `DUBI_ANDROID_KEYSTORE_PASSWORD`: keystore password.
- `DUBI_ANDROID_KEY_ALIAS`: upload key alias.
- `DUBI_ANDROID_KEY_PASSWORD`: key password.

Google Play App Signing should be enabled in Play Console. The GitHub keystore is the upload key, not the final app signing key managed by Google.

Local signed release builds can use the same Gradle properties:

```bash
./gradlew -PDUBI_VERSION_NAME=0.1.0 -PDUBI_VERSION_CODE=1 \
  -PDUBI_ANDROID_KEYSTORE_PATH=/absolute/path/to/dubi-upload-key.jks \
  -PDUBI_ANDROID_KEYSTORE_PASSWORD=*** \
  -PDUBI_ANDROID_KEY_ALIAS=dubi \
  -PDUBI_ANDROID_KEY_PASSWORD=*** \
  bundleRelease
```

## Versioning

Every Play upload must increase `versionCode`.

Examples:

```bash
./gradlew -PDUBI_VERSION_NAME=0.1.0 -PDUBI_VERSION_CODE=1 bundleRelease
./gradlew -PDUBI_VERSION_NAME=0.1.1 -PDUBI_VERSION_CODE=2 bundleRelease
```
