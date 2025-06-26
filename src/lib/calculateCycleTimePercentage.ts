import { ThresholdConfig } from "@/lib/defaultThresholdConfig";
import type { TShirtSize } from "@/lib/checkRCAIndicator";

/**
 * Calculate the percentage of the cycle time relative to the expected threshold
 * for a given T‑shirt size.
 *
 * @param taskCycleTimeDays - The actual cycle time for the task in days.
 * @param tshirtSize - The T‑shirt size to use for reference.
 * @returns The cycle time percentage rounded to one decimal place or
 *          "No reference" when the size is not provided.
 */
export function calculateCycleTimePercentage(
  taskCycleTimeDays: number,
  tshirtSize?: TShirtSize,
): number | "No reference" {
  if (!tshirtSize) {
    return "No reference";
  }

  const thresholdDays = ThresholdConfig.thresholds[tshirtSize];
  if (!thresholdDays) {
    return "No reference";
  }

  const percentage = (taskCycleTimeDays / thresholdDays) * 100;
  return Number(percentage.toFixed(1));
}
