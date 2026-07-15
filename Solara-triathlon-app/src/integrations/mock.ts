import { IntegrationStatus, Workout } from '@/types/domain';
import { IntegrationAdapter, SyncedActivity, WellnessSnapshot } from './types';

export class MockIntegrationAdapter implements IntegrationAdapter {
  private current: IntegrationStatus;
  constructor(provider: IntegrationStatus['provider'], connected = false) {
    this.current = { provider, connected, mode: 'mock', permission: connected ? 'granted' : 'none', lastSync: connected ? new Date().toISOString() : undefined };
  }
  async status() { return { ...this.current }; }
  async connect() { this.current = { ...this.current, connected: true, permission: 'granted', lastSync: new Date().toISOString() }; return this.status(); }
  async disconnect() { this.current = { ...this.current, connected: false, permission: 'none', lastSync: undefined }; return this.status(); }
  async activities(_since: string): Promise<SyncedActivity[]> {
    if (!this.current.connected) return [];
    return [
      { externalId: 'mock-a1', sport: 'cycling', startedAt: new Date(Date.now() - 86400000).toISOString(), durationMinutes: 58, distanceMeters: 24700 },
      { externalId: 'mock-a2', sport: 'running', startedAt: new Date(Date.now() - 3 * 86400000).toISOString(), durationMinutes: 42, distanceMeters: 6600 },
    ];
  }
  async wellness(date: string): Promise<WellnessSnapshot> { return { date, sleepHours: 7.5, restingHeartRate: 53, hrvMs: 48 }; }
  async publishWorkout(workout: Workout) { if (!this.current.connected) throw new Error('Connect first'); return { externalId: `mock-${workout.id}`, syncedAt: new Date().toISOString() }; }
}

