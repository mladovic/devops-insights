
/**
 * Determine a color to display for the given cycle time percentage.
 *
 * @param percentage - The cycle time as a percentage of the threshold.
 * @param deviationPercentage - Allowed deviation from the 100% reference.
 * @returns "green", "black", or "red" based on the deviation rules.
 */
export function getCycleTimePercentageColor(
  percentage: number | "No reference",
  deviationPercentage: number,
): "green" | "black" | "red" {
  if (percentage === "No reference") {
    return "black";
  }

  const lowerBound = 100 - deviationPercentage;
  const upperBound = 100 + deviationPercentage;

  if (percentage <= lowerBound) {
    return "green";
  }

  if (percentage >= upperBound) {
    return "red";
  }

  return "black";
}
