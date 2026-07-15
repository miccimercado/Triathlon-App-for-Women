import { IntegrationAdapter } from './types';

/**
 * Production Garmin adapter boundary.
 * OAuth/token exchange and Garmin Connect Developer API calls must run through
 * a secure backend function. Never embed a Garmin client secret in Expo code.
 * Access, endpoints, and supported health/workout scopes depend on Garmin approval.
 */
export interface GarminBackendAdapter extends IntegrationAdapter {
  beginAuthorization(redirectUri: string): Promise<{ authorizationUrl: string }>;
  syncTrainingPlan(planId: string): Promise<{ queued: number }>;
}

