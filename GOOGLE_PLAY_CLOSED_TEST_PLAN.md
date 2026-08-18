# DUBI Google Play Closed Test Plan

Last updated: 2026-08-18.

Google Play currently requires new personal developer accounts to run a closed test with at least 12 opted-in testers continuously for 14 days before applying for production access.

Official reference: https://support.google.com/googleplay/android-developer/answer/14151465

## Goal

Prepare the tester group before Play Console identity verification is approved, so the test can start immediately after the app is created and the signed AAB is uploaded.

## Tester Requirements

- Minimum: 12 opted-in testers.
- Recommended: 15-18 invited testers to avoid dropping below 12 if someone does not opt in.
- Testers must use Google accounts.
- Testers must opt in from the Play Console test link.
- Keep the test active for 14 consecutive days.
- Ask testers to open the app at least once and report login/onboarding issues.

## Tester List Template

Create a Google Group or Play Console email list named:

```text
DUBI Android Closed Beta
```

Collect these fields:

```text
Name
Google account email
Android phone model
Android version
Country
Opt-in completed: yes/no
Installed app: yes/no
Login tested: yes/no
Main issue found
```

## Invitation Message

```text
Ciao, sto preparando la beta Android di DUBI.

Ti invierò un link ufficiale Google Play per partecipare al test chiuso. Dovrai:

1. Aprire il link con il tuo account Google.
2. Accettare l'invito al test.
3. Installare DUBI da Google Play.
4. Aprire l'app, fare login/onboarding e segnalarmi eventuali problemi.

Il test serve anche a completare i requisiti Google Play per pubblicare l'app. Grazie davvero.
```

## Test Script For Testers

Ask testers to verify:

- App installs from Google Play.
- App opens without white screen.
- Login/register works.
- Session remains logged in after closing and reopening.
- Onboarding screens fit the phone.
- Keyboard does not cover numeric fields.
- Dashboard loads.
- Meal plan/Today screen loads.
- Progress/settings screens open.
- Delete-account/privacy controls are visible.

## Known Beta Scope

Included:

- Native Android shell.
- Account login.
- Onboarding.
- Nutrition plan and meal logic.
- Progress and settings.
- Privacy/account controls.

Not included yet:

- Health Connect.
- HealthKit.
- Direct wearable integrations.
- Public monetization.

## Production Access Notes

After 14 days with enough opted-in testers:

1. Open Play Console.
2. Go to Production access.
3. Answer Google questions about testing.
4. Summarize tester feedback and fixes.
5. Request production access.

