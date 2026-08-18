# DUBI App Store Connect Ready Pack

Last updated: 2026-08-18.

Use this when Apple Developer Program enrollment is active and a macOS/Xcode build path is available.

Official reference checked:

- Apple App Privacy Details: https://developer.apple.com/app-store/app-privacy-details/

## App Record

- App name: DUBI
- Bundle ID: `health.dubi.app`
- SKU: `dubi-ios`
- Primary language: Italian
- Category: Health & Fitness
- Price: Free for beta/public initial release
- Privacy policy URL: https://app.dubi.health/privacy.html
- Support URL: https://app.dubi.health/privacy.html

## TestFlight Beta Information

Beta app description:

```text
DUBI è una beta per pianificazione nutrizionale personalizzata, onboarding, pasti, progressi e impostazioni account/privacy.
```

What to test:

```text
Verificare login, registrazione, persistenza sessione, onboarding, piano nutrizionale, schermata Today, progressi, impostazioni, reset password e cancellazione account.
```

Reviewer notes:

```text
DUBI richiede login. Forniremo un account test dedicato. La versione attuale è una beta wellness/nutrizione e non offre diagnosi, trattamento medico o integrazioni HealthKit attive.
```

## App Store Listing Draft

Subtitle:

```text
Nutrizione personalizzata
```

Promotional text:

```text
Beta DUBI: piano nutrizionale, logica pasti e progressi in una app nativa.
```

Description:

```text
DUBI aiuta a creare e adattare un piano nutrizionale personalizzato in base a obiettivi, dati corporei, preferenze alimentari, pasti, progressi e stile di vita.

La beta include onboarding, piano nutrizionale, logica dei pasti, monitoraggio progressi, impostazioni privacy e sincronizzazione account.

DUBI è pensata per benessere e pianificazione nutrizionale. Non è un dispositivo medico, non diagnostica o tratta condizioni cliniche e non sostituisce il parere di un professionista sanitario qualificato.
```

Keywords draft:

```text
nutrizione,benessere,pasti,dieta,fitness,progressi
```

## App Privacy Answers Draft

Data collected and linked to the user:

- Contact Info: email address.
- Identifiers: user ID.
- Health & Fitness: nutrition goals, body metrics, meal choices, progress entries, user-entered wellness data.
- User Content or Other Data: profile/preferences/settings if Apple asks for exact categorization.

Purpose:

- App Functionality.
- Personalization where available.
- Account management.

Tracking:

- No tracking in the current beta.
- No third-party advertising SDKs in the current beta.

Data not currently collected:

- Precise location.
- Contacts.
- Browsing history.
- Purchases.
- Advertising data.

## iOS Assets Needed

Already generated:

- App icon set in `ios/App/App/Assets.xcassets/AppIcon.appiconset`.
- Splash set in `ios/App/App/Assets.xcassets/Splash.imageset`.
- Baseline privacy manifest: `ios/App/App/PrivacyInfo.xcprivacy`.

Still needed:

- App Store screenshots from a real iPhone or simulator.
- Final Xcode archive.
- TestFlight build upload.

## HealthKit Later Phase

Do not request HealthKit permissions in the first beta unless the integration is actually implemented and tested.

Before enabling HealthKit:

- Add HealthKit capability in Apple Developer/Xcode.
- Add exact permission purpose strings.
- Update App Privacy answers.
- Update privacy policy.
- Add reviewer notes explaining what data is read and why.

