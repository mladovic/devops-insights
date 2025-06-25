"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import Dashboard from "@/components/Dashboard";
import type { TaskItem } from "@/components/DashboardTaskList";
import type { MetricsSummaryProps } from "@/components/MetricsSummary";
import {
  calculateTaskMetrics,
  type RawTask,
} from "@/lib/calculateTaskMetrics";
import { calculateOverallMetrics } from "@/lib/calculateOverallMetrics";
import { aggregateMetricsByType } from "@/lib/aggregateMetricsByType";
import { calculateThroughputMetrics } from "@/lib/calculateThroughputMetrics";
import { parseAndValidateCsv } from "@/lib/parseAndValidateCsv";

export default function DashboardPage() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<MetricsSummaryProps | null>(null);
  const [tasks, setTasks] = useState<TaskItem[] | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    const result = await parseAndValidateCsv(file);

    if (result.success) {
      const rawTasks = result.data as RawTask[];
      const taskMetrics = calculateTaskMetrics(rawTasks);
      const dashboardTasks: TaskItem[] = rawTasks.map((task, idx) => ({
        ID: Number(task.ID),
        Title: (task as any).Title,
        WorkItemType: (task as any)["Work Item Type"],
        Assignee: (task as any)["Assigned To"] ?? null,
        CycleTimeDays: taskMetrics[idx].CycleTimeDays,
        LeadTimeDays: taskMetrics[idx].LeadTimeDays,
      }));
      setTasks(dashboardTasks);

      const metricsSummary: MetricsSummaryProps = {
        overall: calculateOverallMetrics(taskMetrics),
        byType: aggregateMetricsByType(taskMetrics),
        throughput: calculateThroughputMetrics(rawTasks, new Date()),
      };
      setMetrics(metricsSummary);

      setShowDashboard(true);
      return;
    }

    switch (result.error) {
      case "empty_file":
        console.error("CSV upload failed: empty_file");
        break;
      case "missing_columns":
        console.error(
          "CSV upload failed: missing_columns",
          result.details,
        );
        break;
      case "unexpected_columns":
        console.error(
          "CSV upload failed: unexpected_columns",
          result.details,
        );
        break;
      default:
        console.error("CSV upload failed", result);
    }

    setError("Upload failed, please try again.");
  };

  if (showDashboard) {
    return <Dashboard metricsData={metrics} taskData={tasks ?? []} />;
  }

  return (
    <div className="p-4 space-y-4">
      <FileUpload onFileAccepted={handleFile} error={error} />
    </div>
  );
}
