export interface AggregatedMetrics {
  [WorkItemType: string]: {
    averageCycleTimeDays: number;
    averageLeadTimeDays: number;
    completedTasks: number;
    incompleteTasks: number;
  };
}

import type { TaskMetrics } from "./calculateTaskMetrics";

export type CompletedTaskMetrics = TaskMetrics & { Status: "Complete" };

export interface MetricsByTypeInput {
  /** Metrics for completed tasks only */
  completedTasks: CompletedTaskMetrics[];
  /** Optional metrics for incomplete tasks used solely for counts */
  incompleteTasks?: TaskMetrics[];
}

export function aggregateMetricsByType({
  completedTasks,
  incompleteTasks = [],
}: MetricsByTypeInput): AggregatedMetrics {
  const result: AggregatedMetrics = {};

  for (const metric of completedTasks) {
    const type = metric.WorkItemType;
    if (!result[type]) {
      result[type] = {
        averageCycleTimeDays: 0,
        averageLeadTimeDays: 0,
        completedTasks: 0,
        incompleteTasks: 0,
      };
    }
    result[type].completedTasks += 1;
    if (typeof metric.CycleTimeDays === "number") {
      result[type].averageCycleTimeDays += metric.CycleTimeDays;
    }
    if (typeof metric.LeadTimeDays === "number") {
      result[type].averageLeadTimeDays += metric.LeadTimeDays;
    }
  }

  for (const metric of incompleteTasks) {
    const type = metric.WorkItemType;
    if (!result[type]) {
      result[type] = {
        averageCycleTimeDays: 0,
        averageLeadTimeDays: 0,
        completedTasks: 0,
        incompleteTasks: 0,
      };
    }
    result[type].incompleteTasks += 1;
  }

  for (const type of Object.keys(result)) {
    const data = result[type];
    if (data.completedTasks > 0) {
      data.averageCycleTimeDays = data.averageCycleTimeDays / data.completedTasks;
      data.averageLeadTimeDays = data.averageLeadTimeDays / data.completedTasks;
    } else {
      data.averageCycleTimeDays = 0;
      data.averageLeadTimeDays = 0;
    }
  }

  return result;
}
