import { ReadinessInput, ReadinessResult } from '@/types/domain';

const MEDICAL_RED_FLAGS = [
  'chest pain',
  'fainting',
  'sudden severe headache',
  'neurological symptoms',
  'severe dehydration',
  'pregnancy concern',
  'injury pain',
];

export function calculateReadiness(input: ReadinessInput): ReadinessResult {
  const redFlags = (input.redFlags || []).filter((flag) => MEDICAL_RED_FLAGS.includes(flag.toLowerCase()));
  if (redFlags.length > 0) {
    return {
      score: 0,
      state: 'rest',
      headline: 'Training can wait today',
      reasons: redFlags,
      action: 'Do not start the workout. Seek prompt medical guidance; use emergency care for severe or rapidly changing symptoms.',
      safetyMessage: 'This app cannot assess or diagnose urgent symptoms.',
    };
  }

  if (input.migraine === 'active' || input.illnessSymptoms) {
    return {
      score: 22,
      state: 'rest',
      headline: input.migraine === 'active' ? 'Give your system a quieter day' : 'Recovery is the training today',
      reasons: [input.migraine === 'active' ? 'Active migraine reported' : 'Illness symptoms reported'],
      action: 'Rest, maintain regular fluids and meals as tolerated, and reassess later. Seek care for severe, unusual, or neurological symptoms.',
      safetyMessage: 'This is conservative training guidance, not medical advice.',
    };
  }

  let score = 100;
  const reasons: string[] = [];
  if (input.sleep <= 2) { score -= 20; reasons.push('Sleep was below your usual needs'); }
  else if (input.sleep === 3) { score -= 10; reasons.push('Sleep was only fair'); }
  if (input.stress >= 4) { score -= 13; reasons.push('High stress'); }
  if (input.soreness >= 4) { score -= 15; reasons.push('High soreness'); }
  if (input.fatigue >= 4) { score -= 18; reasons.push('High fatigue'); }
  if (input.mood <= 2) { score -= 7; reasons.push('Lower mood'); }
  if (input.hrvStatus === 'below') { score -= 10; reasons.push('HRV below your baseline'); }
  if ((input.restingHeartRateDelta || 0) >= 7) { score -= 10; reasons.push('Resting heart rate elevated'); }
  if (input.migraine === 'warning') { score -= 25; reasons.push('Migraine warning signs'); }
  if (input.migraine === 'recovery') { score -= 18; reasons.push('Post-migraine recovery'); }
  if (input.cycleSymptomSeverity >= 4) { score -= 14; reasons.push('Symptoms are materially affecting you'); }
  if (input.underFueled) { score -= 22; reasons.push('Under-fueling reported'); }
  score = Math.max(0, score);

  if (score < 40) return { score, state: 'rest', headline: 'The smartest move is recovery', reasons, action: 'Replace training with rest or gentle mobility. Eat regular meals and reassess tomorrow.' };
  if (score < 65) return { score, state: 'reduce', headline: 'Let’s lower the load', reasons, action: 'Use the low-energy version and keep the effort easy. Stop if symptoms worsen.' };
  if (score < 82) return { score, state: 'steady', headline: 'Steady is plenty today', reasons, action: 'Keep the planned duration, but avoid adding intensity or extra volume.' };
  return { score, state: 'ready', headline: 'You’re ready for the plan', reasons: reasons.length ? reasons : ['Recovery signals are in your usual range'], action: 'Complete the workout as prescribed, guided by feel.' };
}

