# DUBI Wearable Integration Roadmap

Last updated: 2026-08-17.

## Recommendation

Build DUBI around one normalized wearable layer, then connect providers one by one.

Do not make the nutrition logic depend on WHOOP, Strava, Apple Watch, Oppo, or any single brand directly. DUBI should depend on normalized signals:

- steps
- active calories
- workouts/training load
- sleep duration
- sleep quality
- resting heart rate
- HRV
- recovery/readiness score when available
- provider and sync timestamp

The DUBI backend already has the right direction with `wearable_data` and OpenWearables-oriented endpoints. The next work should harden that layer before adding more provider-specific logic.

## Best Integration Order

### Phase 1: Native phone health hubs

Priority: high.

Android:

- Use Health Connect for Android health and fitness data.
- Declare every requested Health Connect data type in Play Console.
- Start with low-risk data types only: steps, active calories, exercise sessions, sleep, heart rate, HRV if available.

iOS:

- Use Apple HealthKit for iPhone and Apple Watch.
- HealthKit is local to the user's iPhone and requires native iOS permissions.
- Add Apple Developer entitlement and App Store review notes before TestFlight/App Store release.

Why first:

- Apple Watch is covered through HealthKit.
- Many Android devices and apps can write into Health Connect.
- It avoids building direct integrations for every hardware brand immediately.

OPPO note:

- Treat OPPO as an Android device source.
- If OPPO/HeyTap/Google Fit data reaches Health Connect, DUBI can read it through Health Connect.
- If OPPO does not expose the needed data through Health Connect or a supported cloud API, direct OPPO integration is not a good first target.

### Phase 2: Cloud providers through OpenWearables

Priority: medium/high after beta is stable.

Use OpenWearables for providers that have cloud OAuth APIs:

- WHOOP: good for recovery, strain, sleep, HRV.
- Strava: good for workouts and activities, not a full recovery/sleep source.
- Polar: good training/recovery provider and often simpler than Garmin.
- Garmin/Oura/Fitbit/Suunto/Ultrahuman: add after the first integration path is stable.

Why second:

- Provider APIs require app registration, OAuth credentials, callback URLs, privacy policy, and sometimes provider approval.
- Each provider has different data shape, rate limits, and review friction.
- OpenWearables keeps that complexity outside the DUBI core.

### Phase 3: Direct provider integrations only where needed

Priority: later.

Use direct integration only when:

- HealthKit/Health Connect does not provide enough data.
- OpenWearables does not support the provider well enough.
- There is a strong product reason to own the integration directly.

## Timing

Do not block the Android beta on full wearable integrations.

Recommended timeline:

1. Finish Android internal testing release.
2. Add native permission UX and backend consent model for health data.
3. Implement Health Connect on Android.
4. Implement HealthKit when iOS/TestFlight starts.
5. Deploy OpenWearables staging.
6. Connect one cloud provider first, preferably WHOOP if we have a WHOOP account/device, otherwise Strava for easier activity testing.
7. Use real wearable data in DUBI adaptation logic after the sync pipeline is stable.

## Approval and Policy Notes

Google Play:

- Complete the Health Apps declaration in Play Console.
- Declare every Health Connect data type used by the app.
- Keep the Data safety form aligned with real data behavior.

Apple:

- Add HealthKit entitlement.
- Explain why each health data type is needed.
- Avoid medical diagnosis or treatment claims unless the product is regulated and reviewed accordingly.

Cloud providers:

- Create developer apps in provider dashboards.
- Configure OAuth redirect URLs.
- Store client secrets only in backend/hosting secrets.
- Never ship provider client secrets in the mobile app.

## Cost Expectations

Platform accounts:

- Apple Developer Program is typically required for TestFlight/App Store.
- Google Play Console account is already being set up.

Provider APIs:

- HealthKit and Health Connect do not usually have per-request API fees.
- Strava and WHOOP developer APIs are usually free to start, but may have limits, approval steps, and policy requirements.
- Some providers may require partner approval before production access.

Infrastructure:

- OpenWearables staging can start small.
- Expect roughly low monthly hosting cost at beta scale, then scale workers/database if sync volume grows.

Main cost:

- Development time, provider approval friction, real devices/subscriptions for testing, and compliance work.

## First Technical Slice

Start with a provider-neutral mobile health module:

- Native permission screen.
- Local permission state.
- Backend consent flag and revocation path.
- Manual "sync now" action.
- Normalized payload to DUBI backend.
- Store only daily signals DUBI needs.

Do not expose full wearable-driven nutrition adaptation until real data has been tested across several days.

