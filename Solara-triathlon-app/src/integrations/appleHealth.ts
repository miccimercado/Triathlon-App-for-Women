import { IntegrationAdapter } from './types';

/** HealthKit needs an iOS development build, entitlements, and per-type permission prompts. */
export interface AppleHealthAdapter extends IntegrationAdapter {
  requestHealthPermissions(types: string[]): Promise<string[]>;
}

