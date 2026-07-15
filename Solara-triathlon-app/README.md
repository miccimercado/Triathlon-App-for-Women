# Solara

Solara is a production-oriented Expo/React Native foundation for busy women age-group triathletes preparing for a Half Ironman / 70.3. It combines periodized swim-bike-run-strength planning, symptom-led daily adaptation, complete everyday nutrition, race-fueling practice, and permission-based integration boundaries.

The app works immediately in demo mode. External services default to mocks until credentials and program approvals are available.

## What is included

- Expo Router + strict TypeScript app with a calm, accessible, premium visual system
- Welcome, auth, consent, six-step onboarding, Today, plan calendar, workout details, strength, nutrition, recipes, groceries, meal prep, hydration, race fueling, readiness logging, adaptation, integrations, progress, settings, and science/admin screens
- Deterministic modules for 80/20-informed periodization, weekly progression, recovery insertion, tapering, readiness, missed workouts, nutrition targets, allergy filtering, grocery generation, and safety flags
- Mock Garmin, Apple Health, Strava, TrainingPeaks, and calendar states plus typed production adapter boundaries
- Supabase schema covering all requested domains, RLS for user-owned records, token-secret references, science rules, audit logs, export function, and seed references
- Unit tests for plan generation, recovery/taper, progression caps, distribution, strength placement, missed workouts, migraine and cycle-symptom adaptation, under-fueling flags, meal preferences, grocery generation, and mock sync

## Quick start

Requirements: Node 22+ and npm. For native builds, install Xcode or Android Studio as appropriate.

```bash
npm install
cp .env.example .env
npm run start
```

Press `i` for iOS, `a` for Android, or `w` for web. Choose **Explore with demo data** to use the full app without accounts or integrations.

Validation:

```bash
npm run typecheck
npm test
```

### Native development and release builds

HealthKit and other native-only integrations require a development build rather than Expo Go:

```bash
npx expo prebuild
npx expo run:ios
# or
npx expo run:android
```

For EAS after replacing the example bundle identifiers and configuring signing:

```bash
npm install --global eas-cli
eas login
eas build:configure
eas build --platform ios --profile production
eas build --platform android --profile production
```

## Configuration and renaming

Change the working name in `src/config/app.ts` or set `EXPO_PUBLIC_APP_NAME`. Update `name`, `slug`, app scheme, and bundle identifiers in `app.json` before release.

## Supabase setup

1. Create a Supabase project.
2. Apply SQL files from `supabase/migrations` in order, using the Supabase CLI or migration workflow.
3. Add the project URL and anon key to `.env`. The anon key is safe for the client when RLS is enabled; the service-role key is backend-only.
4. Configure email auth and redirect URLs for the app scheme.
5. Create the optional demo auth user through the Dashboard/Admin API, then use its UUID in `supabase/seed.sql`.
6. Implement server/Edge Functions for OAuth exchange, export packaging, account deletion after re-authentication, and any admin rule mutations.

Never place service-role keys, OAuth client secrets, or raw provider tokens in Expo environment variables. `EXPO_PUBLIC_*` values are bundled into the client. The `oauth_tokens` table stores only a secret-manager reference; the encrypted token itself belongs in backend-only secret storage.

## Integrations and limitations

### Garmin Connect

Mock mode supports connection state, activities, wellness snapshots, and structured-workout publishing. Live workout/calendar, completed activity, wellness, or women’s-health capabilities depend on acceptance to the Garmin Connect Developer Program and granted scopes. OAuth and token refresh must be proxied through a secure backend. `src/integrations/garmin.ts` defines the boundary.

### Apple HealthKit

HealthKit cannot be fully tested in a browser or Expo Go. It requires an iOS development build, HealthKit entitlements, usage descriptions, and granular permission prompts. Read only explicitly authorized types. The skeleton includes sleep, resting heart rate, HRV, workouts, steps, and optional cycle-data boundaries.

### Strava

Live sync requires a registered OAuth application and compliance with current Strava API requirements. User-authorized activity data is restricted here to user-facing sync, deterministic summaries, and coaching calculations. It must not be used for AI/ML model training.

### TrainingPeaks

Publishing planned workouts and reading completed workouts require approved developer access. The UI communicates this and keeps mock mode available.

### Calendar

Mock busy windows are available. A live Google/Apple adapter should request the minimum scope needed, distinguish read from write permission, and never overwrite or remove events without an explicit user action.

## Training and nutrition guardrails

- The default model targets roughly 80% low-intensity and 20% moderate/high-intensity work across appropriate blocks. It does not force an exact split each week.
- Cycle phase alone never changes training. Only material symptoms, individual history, recovery information, and user preference can contribute to an adjustment.
- Active migraine or illness triggers conservative rest/recovery guidance. Red flags such as chest pain, fainting, sudden severe headache, unusual neurological symptoms, severe dehydration, pregnancy concerns, and concerning injury pain require professional or emergency guidance.
- Nutrition prioritizes adequate energy and flexible targets. It avoids aggressive weight loss and moral labels for food. Pregnancy/postpartum nutrition, anemia, persistent GI issues, REDs risk, or eating-disorder history require a registered dietitian and/or doctor.
- Every user-facing recommendation should retain a plain-language rationale and reference IDs when persisted.

Solara provides educational training and nutrition guidance. It is not medical advice and does not replace a doctor, registered dietitian, physiotherapist, or human coach.

## Production hardening checklist

- Replace local Zustand demo state with authenticated repository functions and offline-safe persistence.
- Add native HealthKit modules in a development build and complete provider security reviews.
- Build backend OAuth/token rotation functions with a managed secrets service.
- Add re-authentication, signed export download, deletion jobs, retention policies, and admin RBAC.
- Add localization, full VoiceOver/TalkBack QA, dynamic type QA, device testing, E2E tests, observability with consent filtering, and app-store privacy declarations.
- Have qualified sports-medicine, sports-nutrition, legal/privacy, and security reviewers approve rules, copy, references, and clinical escalation logic before public release.
