import { IntegrationAdapter } from './types';

/** Strava activity data is used only for user-facing sync and deterministic calculations. */
export interface StravaAdapter extends IntegrationAdapter {
  beginOAuth(redirectUri: string): Promise<{ authorizationUrl: string }>;
}

/** TrainingPeaks integration requires approved developer access. */
export interface TrainingPeaksAdapter extends IntegrationAdapter {
  syncPlan(planId: string): Promise<{ queued: number }>;
}

/** Calendar adapters must never overwrite or remove events without explicit user approval. */
export interface CalendarAdapter extends IntegrationAdapter {
  readBusyWindows(start: string, end: string): Promise<Array<{ start: string; end: string }>>;
}

