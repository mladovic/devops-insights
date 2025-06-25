export const CycleTimeThresholds = {
  XS: [1, 2],
  S: [2, 4],
  M: [3, 6],
  L: [5, 10],
  XL: [8, 15],
} as const;

export type TShirtSize = keyof typeof CycleTimeThresholds;

/**
 * Determines if an RCA indicator should be shown based on the cycle time and
 * T‑shirt size thresholds.
 *
 * @param cycleTimeDays - The actual cycle time in days.
 * @param tShirtSize - The T‑shirt size to compare against.
 * @param deviationPercentage - Allowed deviation percentage from the range.
 * @returns True if the cycle time deviates outside the allowed range.
 */
export function checkRCAIndicator(
  cycleTimeDays: number,
  tShirtSize: TShirtSize,
  deviationPercentage = 20,
): boolean {
  const [min, max] = CycleTimeThresholds[tShirtSize];
  const factor = deviationPercentage / 100;
  const lowerBound = min * (1 - factor);
  const upperBound = max * (1 + factor);
  return cycleTimeDays < lowerBound || cycleTimeDays > upperBound;
}
