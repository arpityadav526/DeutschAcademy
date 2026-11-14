import { SM2State } from "./types";

/**
 * SuperMemo 2 (SM-2) Spaced Repetition Calculation
 * @param quality 0 (complete blackout) to 5 (flawless recall)
 * @param currentRepetition current repetition count
 * @param previousInterval previous interval in days
 * @param currentEaseFactor current ease factor (min 1.3)
 */
export function calculateSM2(
  quality: number,
  currentRepetition: number,
  previousInterval: number,
  currentEaseFactor: number = 2.5
): SM2State {
  let repetition = currentRepetition;
  let interval: number;
  let easeFactor = currentEaseFactor;

  // Clamp quality between 0 and 5
  const q = Math.max(0, Math.min(5, Math.round(quality)));

  if (q >= 3) {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(previousInterval * easeFactor);
    }
    repetition += 1;

    // Calculate new Ease Factor
    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (easeFactor < 1.3) {
      easeFactor = 1.3;
    }
  } else {
    // Failure resets repetition count to zero and schedules for tomorrow
    repetition = 0;
    interval = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  // Normalize time to start of day or exact offset
  nextReviewDate.setHours(4, 0, 0, 0); // Scheduled for early morning

  return {
    repetition,
    interval,
    easeFactor: Number(easeFactor.toFixed(2)),
    nextReviewDate,
  };
}

/**
 * Maps exercise correctness to an SM-2 quality grade (0 to 5)
 */
export function gradeAttempt(correct: boolean, attempts: number, timeSpentSeconds: number): number {
  if (!correct) {
    return attempts > 1 ? 1 : 2;
  }
  if (attempts === 1 && timeSpentSeconds < 8) {
    return 5; // Instant flawless recall
  }
  if (attempts === 1) {
    return 4; // Correct on first try with normal contemplation
  }
  return 3; // Correct after hint or second attempt
}
