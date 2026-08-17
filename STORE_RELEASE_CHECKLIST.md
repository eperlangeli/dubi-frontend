# DUBI Store Release Checklist

This file tracks what remains to move DUBI from debug APK to controlled beta distribution and then public store release.

## Android beta through Google Play Internal Testing

Status: in progress. Engineering release is ready; Play Console account verification is the current gate.

Engineering:

- Done: Capacitor Android project.
- Done: production app id `health.dubi.app`.
- Done: Vite production web bundle for native packaging.
- Done: debug APK workflow.
- Done: Android upload keystore created locally.
- Done: release signing secrets added to GitHub Actions.
- Done: signed release workflow.
- Done: `Android Release Build` generated `dubi-android-release-signed`.
- Done: signed release artifact contains `app-release.aab` for Play Console and `app-release.apk` for direct testing.
- Pending: upload `app-release.aab` to Play Console internal testing after developer identity verification.

Google Play Console:

- Done: Google Play developer account created as personal account.
- Pending: developer identity verification approval.
- Pending: create app `DUBI`.
- Pending: enable Google Play App Signing.
- Pending: create internal tester list.
- Pending: upload signed `.aab`.
- Pending: complete App access with a reviewer test account.
- Pending: complete Data safety form.
- Pending: complete Health Apps declaration form.
- Pending: complete content rating questionnaire.
- Pending: add privacy policy URL.
- Pending: add store listing text and graphics.

Android store assets:

- Done: app icon source exists in `icons/` and Android launcher icons are generated.
- Pending: Play Store app icon upload, 512 x 512 PNG.
- Pending: feature graphic, 1024 x 500 PNG or JPEG.
- Pending: phone screenshots, 4-8 recommended, PNG/JPEG, max 8 MB each.
- Recommended screenshot themes: onboarding, dashboard, meal planning, progress/trends, settings/privacy.

## iOS beta through TestFlight

Status: not complete.

Engineering:

- Done: Capacitor iOS project.
- Done: bundle id `health.dubi.app`.
- Done: URL scheme `dubi://`.
- Done: baseline `PrivacyInfo.xcprivacy`.
- Pending: macOS machine with Xcode and CocoaPods.
- Pending: Apple Developer Program enrollment.
- Pending: App Store Connect app record.
- Pending: signing certificate and provisioning profile.
- Pending: archive build from Xcode.
- Pending: upload build to App Store Connect.
- Pending: invite internal TestFlight testers.

App Store Connect:

- Pending: app name, subtitle, keywords, support URL, privacy policy URL.
- Pending: app privacy answers.
- Pending: beta app review notes.
- Pending: health disclaimer/reviewer notes.
- Pending: screenshots.

iOS store assets:

- App icon: 1024 x 1024 PNG with no transparency.
- Screenshots: 1-10 per required device class, PNG/JPEG with no alpha channel.
- Recommended first iPhone screenshots: plan dashboard, meal flow, progress/trends.

## Health and wearable integrations

Status: later phase, not blocking Android UI beta.

- Pending: Android Health Connect native plugin and permission flow.
- Pending: Google Play Health Apps declaration before requesting Health Connect or health-data permissions.
- Pending: iOS HealthKit entitlement and native plugin.
- Pending: Apple review notes explaining HealthKit usage.
- Pending: backend consent, revocation, and sync logs for native health data.
- Pending: production OAuth verification for cloud wearable providers.

## Public release gates

Do not submit public release until these are true:

- Android internal testing passed on real devices.
- iOS TestFlight passed on real iPhones.
- Account deletion, privacy policy, terms, and health disclaimer are reachable in-app.
- Data safety/App privacy answers match real backend behavior.
- Version code/build number strategy is documented.
- Crash/error monitoring decision is made.
- HealthKit/Health Connect permission screens are tested if included in the release.

## Working submission pack

Use `GOOGLE_PLAY_SUBMISSION_PACK.md` for copy-ready Play Console text, Data safety notes, reviewer access notes, and asset tasks.
