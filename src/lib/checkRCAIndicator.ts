import { ThresholdConfig } from "@/lib/defaultThresholdConfig";
import type {
  ThresholdConfig as ThresholdConfigType,
} from "@/lib/defaultThresholdConfig";

export type TShirtSize = keyof ThresholdConfigType["thresholds"];

/**
 * Determines if an RCA indicator should be shown based on the cycle time and
 * T‑shirt size thresholds.
 *
 * @param cycleTimeDays - The actual cycle time in days.
 * @param tShirtSize - The T‑shirt size to compare against.
 * @param config - Threshold configuration containing ranges and deviation.
 * @returns True if the cycle time deviates outside the allowed range.
 */
export function checkRCAIndicator(
  cycleTimeDays: number,
  tShirtSize: TShirtSize,
  config: ThresholdConfigType = ThresholdConfig,
): boolean {
  const { thresholds, rcaDeviationPercentage } = config;
  const expected = thresholds[tShirtSize];
  const factor = rcaDeviationPercentage / 100;
  const lowerBound = expected * (1 - factor);
  const upperBound = expected * (1 + factor);
  return cycleTimeDays < lowerBound || cycleTimeDays > upperBound;
}
