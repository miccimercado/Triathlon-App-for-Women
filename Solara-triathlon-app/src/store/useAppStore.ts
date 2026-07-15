import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { adaptMissedWorkout, AdaptationChoice, AdaptationResult } from '@/engine/adaptation';
import { generatePlan } from '@/engine/training';
import { calculateReadiness } from '@/engine/readiness';
import { demoIntegrations, demoProfile, demoReadiness } from '@/data/demo';
import { AthleteProfile, IntegrationStatus, PlanWeek, ReadinessInput, Workout } from '@/types/domain';

interface AppState {
  hydrated: boolean;
  consented: boolean;
  onboardingComplete: boolean;
  demoMode: boolean;
  profile: AthleteProfile;
  plan: PlanWeek[];
  readinessInput: ReadinessInput;
  integrations: IntegrationStatus[];
  latestAdaptation?: AdaptationResult;
  setConsented: (value: boolean) => void;
  completeOnboarding: (updates?: Partial<AthleteProfile>) => void;
  useDemo: () => void;
  regeneratePlan: () => void;
  setReadiness: (updates: Partial<ReadinessInput>) => void;
  adaptMissed: (workoutId: string, choice: AdaptationChoice) => AdaptationResult | undefined;
  completeWorkout: (workoutId: string) => void;
  toggleIntegration: (provider: IntegrationStatus['provider']) => void;
  resetData: () => void;
}

const initialPlan = generatePlan(demoProfile);

export const useAppStore = create<AppState>()(persist((set, get) => ({
  hydrated: true,
  consented: false,
  onboardingComplete: false,
  demoMode: false,
  profile: demoProfile,
  plan: initialPlan,
  readinessInput: demoReadiness,
  integrations: demoIntegrations,
  setConsented: (consented) => set({ consented }),
  completeOnboarding: (updates = {}) => {
    const profile = { ...get().profile, ...updates };
    set({ profile, plan: generatePlan(profile), onboardingComplete: true });
  },
  useDemo: () => set({ demoMode: true, consented: true, onboardingComplete: true, profile: demoProfile, plan: generatePlan(demoProfile) }),
  regeneratePlan: () => set({ plan: generatePlan(get().profile) }),
  setReadiness: (updates) => set({ readinessInput: { ...get().readinessInput, ...updates } }),
  adaptMissed: (workoutId, choice) => {
    const weekIndex = get().plan.findIndex((week) => week.workouts.some((workout) => workout.id === workoutId));
    if (weekIndex < 0) return undefined;
    const plan = [...get().plan];
    const result = adaptMissedWorkout(plan[weekIndex], workoutId, choice);
    plan[weekIndex] = { ...plan[weekIndex], workouts: result.updatedWorkouts };
    set({ plan, latestAdaptation: result });
    return result;
  },
  completeWorkout: (workoutId) => set({ plan: get().plan.map((week) => ({ ...week, workouts: week.workouts.map((workout) => workout.id === workoutId ? { ...workout, status: 'complete' as const } : workout) })) }),
  toggleIntegration: (provider) => set({ integrations: get().integrations.map((integration) => integration.provider === provider ? { ...integration, connected: !integration.connected, permission: integration.connected ? 'none' : 'granted', lastSync: integration.connected ? undefined : new Date().toISOString() } : integration) }),
  resetData: () => set({ consented: false, onboardingComplete: false, demoMode: false, profile: demoProfile, plan: generatePlan(demoProfile), readinessInput: demoReadiness, integrations: demoIntegrations, latestAdaptation: undefined }),
}), {
  name: 'solara-app-v1',
  storage: createJSONStorage(() => AsyncStorage),
  version: 1,
}));

export function selectTodayWorkout(state: AppState): Workout | undefined {
  const today = new Date().toISOString().slice(0, 10);
  return state.plan.flatMap((week) => week.workouts).find((workout) => workout.date === today) || state.plan[0]?.workouts[0];
}

export function selectReadiness(state: AppState) { return calculateReadiness(state.readinessInput); }
