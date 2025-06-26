export interface OverallMetrics {
  overallAverageCycleTimeDays: number;
  overallAverageLeadTimeDays: number;
  totalCompletedTasks: number;
  totalIncompleteTasks: number;
}

import type { TaskMetrics } from "./calculateTaskMetrics";

export type CompletedTaskMetrics = TaskMetrics & { Status: "Complete" };

export interface CompletedMetricsInput {
  /** Metrics for tasks that have been completed */
  completedTasks: CompletedTaskMetrics[];
  /** Count of tasks that are not yet complete */
  incompleteCount: number;
}

export function calculateOverallMetrics({
  completedTasks,
  incompleteCount,
}: CompletedMetricsInput): OverallMetrics {
  let totalCycleTime = 0;
  let totalLeadTime = 0;

  const completed = completedTasks.length;
  const incomplete = incompleteCount;

  for (const metric of completedTasks) {
    if (typeof metric.CycleTimeDays === "number") {
      totalCycleTime += metric.CycleTimeDays;
    }
    if (typeof metric.LeadTimeDays === "number") {
      totalLeadTime += metric.LeadTimeDays;
    }
  }

  const overallAverageCycleTimeDays =
    completed > 0 ? totalCycleTime / completed : 0;
  const overallAverageLeadTimeDays =
    completed > 0 ? totalLeadTime / completed : 0;

  return {
    overallAverageCycleTimeDays,
    overallAverageLeadTimeDays,
    totalCompletedTasks: completed,
    totalIncompleteTasks: incomplete,
  };
}
