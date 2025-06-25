import MetricsSummary from "@/components/MetricsSummary";
import DashboardTaskList from "@/components/DashboardTaskList";
import type { MetricsSummaryProps } from "@/components/MetricsSummary";

export interface DashboardProps {
  metricsData?: MetricsSummaryProps | null;
  taskData?: any[] | null;
}

export default function Dashboard({ metricsData, taskData }: DashboardProps) {
  const hasMetricsData =
    metricsData && Object.keys(metricsData.byType ?? {}).length > 0;

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-semibold">Project Dashboard</h1>

      {hasMetricsData && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Metrics Overview</h2>
          <MetricsSummary {...metricsData} />
        </section>
      )}

      {taskData && taskData.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Task List</h2>
          <DashboardTaskList tasks={taskData} />
        </section>
      )}
    </div>
  );
}
