# DUBI Play Console Ready Pack

Last updated: 2026-08-18.

Use this when Google finishes developer identity verification and the Create app button becomes available.

Official references checked:

- Google Play Health Content and Services: https://support.google.com/googleplay/android-developer/answer/16679511
- Google Play testing requirements for new personal developer accounts: https://support.google.com/googleplay/android-developer/answer/14151465
- Android Health Connect publishing guidance: https://developer.android.com/health-and-fitness/health-connect/publish

## Create App

- App name: DUBI
- Default language: Italian
- App or game: App
- Free or paid: Free
- Category: Health & Fitness
- Tags to consider: Nutrition, Wellness, Health, Fitness, Meal planner
- Contains ads: No
- Target audience: Adults, 18+
- App access restricted by login: Yes
- Privacy policy URL: https://app.dubi.health/privacy.html

## Store Listing Copy

Short description, max 80 characters:

```text
Piano nutrizionale personalizzato, progressi e coaching beta.
```

Full description:

```text
DUBI aiuta a creare e adattare un piano nutrizionale personalizzato in base a obiettivi, dati corporei, preferenze alimentari, pasti, progressi e stile di vita.

La beta Android include login, onboarding, piano nutrizionale, logica dei pasti, progressi, impostazioni privacy e sincronizzazione account.

DUBI è pensata per benessere e pianificazione nutrizionale. Non è un dispositivo medico, non diagnostica o tratta condizioni cliniche e non sostituisce il parere di un professionista sanitario qualificato.
```

Release notes for internal/closed test:

```text
Prima beta Android di DUBI.

Include app Android nativa con login persistente, onboarding, piano nutrizionale, logica pasti, progressi, privacy/account controls e connessione al backend di produzione.
```

## App Access For Review

Answer: Some or all functionality is restricted.

Reviewer note:

```text
DUBI richiede login per accedere all'app. Forniremo un account test dedicato al reviewer prima della submission. La release è una beta controllata per pianificazione nutrizionale e benessere. La versione attuale non richiede dispositivi wearable esterni.
```

Before submission create one reviewer account in production:

```text
Email: reviewer+dubi@dubi.health
Password: create manually and store only in Play Console reviewer notes
```

Do not commit the reviewer password.

## Health Apps Declaration

DUBI should be declared as a health/wellness/nutrition app because it handles user-entered body, nutrition and progress data.

Suggested wording:

```text
DUBI is a wellness and nutrition planning app. It helps users organize nutrition goals, meals, progress and lifestyle signals. DUBI is not a medical device and does not provide diagnosis, treatment or clinical decision-making.
```

Current beta position:

- No Health Connect permissions requested yet.
- No medical diagnosis, treatment or emergency functionality.
- No claims of guaranteed weight loss or clinical outcomes.
- Include a clear disclaimer in store listing and review notes.

## Data Safety Draft

Data collected:

- Personal info: email address, name if entered, user ID.
- Health and fitness: body metrics, nutrition goals, meal choices, progress entries, wellness preferences.
- App activity: app interactions needed for app functionality and account sync, if logged by backend.
- Diagnostics: only if collected by platform/backend logs; do not claim crash analytics unless added.

Purpose:

- App functionality.
- Account management.
- Personalization.
- Security/fraud prevention where applicable.

Sharing:

- Not sold.
- Not shared with advertisers.
- Processed by DUBI backend/Supabase/hosting/email providers only as needed to operate the service.

Security:

- Data transmitted over HTTPS.
- Account deletion available in-app from Settings.
- Native app token storage uses Capacitor Preferences.
- Android automatic app backup disabled.

Tracking:

- No ads.
- No cross-app tracking in the current beta.

## Content Rating Expected Answers

- Violence: No
- Sexual content: No
- Gambling: No
- Controlled substances: No
- User-generated public content/social network: No
- Health/wellness/nutrition content: Yes
- App directed at children: No

## Android Artifacts

Use the latest signed release workflow artifact:

- Upload to Play Console: `app-release.aab`
- Direct testing only: `app-release.apk`

Generated assets:

- Play icon: `store-assets/android/play-store-icon-512.png`
- Feature graphic: `store-assets/android/feature-graphic-1024x500.png`

Still needed from the real app:

- 4-8 phone screenshots after the final beta UI is installed on Android.

