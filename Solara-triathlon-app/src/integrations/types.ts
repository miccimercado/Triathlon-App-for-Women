import { IntegrationStatus, Workout } from '@/types/domain';

export interface SyncedActivity {
  externalId: string;
  sport: string;
  startedAt: string;
  durationMinutes: number;
  distanceMeters?: number;
}

export interface WellnessSnapshot {
  date: string;
  sleepHours?: number;
  restingHeartRate?: number;
  hrvMs?: number;
}

export interface IntegrationAdapter {
  status(): Promise<IntegrationStatus>;
  connect(): Promise<IntegrationStatus>;
  disconnect(): Promise<IntegrationStatus>;
  activities(since: string): Promise<SyncedActivity[]>;
  wellness?(date: string): Promise<WellnessSnapshot | null>;
  publishWorkout?(workout: Workout): Promise<{ externalId: string; syncedAt: string }>;
}

