import { AthleteProfile, IntegrationStatus, ReadinessInput } from '@/types/domain';
import { addDays, isoDate } from '@/engine/date';

export const demoProfile: AthleteProfile = {
  id: 'demo-athlete-01',
  firstName: 'Michelle',
  age: 36,
  raceName: 'Victoria 70.3',
  raceDate: isoDate(addDays(new Date(), 18 * 7)),
  goal: 'finish',
  weeklyHours: 8,
  experience: 'intermediate',
  longRideDay: 5,
  longRunDay: 6,
  poolDays: [0, 2, 4],
  gymDays: [1, 3],
  diet: 'Vegetarian + eggs and dairy',
  allergies: [],
  weightKg: 55,
  cycleAware: true,
  migraineFrequency: 'occasional',
};

export const demoReadiness: ReadinessInput = {
  sleep: 4,
  stress: 2,
  soreness: 2,
  mood: 4,
  fatigue: 2,
  hrvStatus: 'normal',
  restingHeartRateDelta: 1,
  migraine: 'none',
  cycleSymptomSeverity: 2,
  underFueled: false,
  illnessSymptoms: false,
};

export const demoIntegrations: IntegrationStatus[] = [
  { provider: 'garmin', connected: true, mode: 'mock', lastSync: new Date().toISOString(), permission: 'granted' },
  { provider: 'apple', connected: false, mode: 'mock', permission: 'none' },
  { provider: 'strava', connected: false, mode: 'mock', permission: 'none' },
  { provider: 'trainingpeaks', connected: false, mode: 'mock', permission: 'none' },
  { provider: 'calendar', connected: true, mode: 'mock', lastSync: new Date().toISOString(), permission: 'partial' },
];

