import MetricsSummary from "@/components/MetricsSummary";
import DashboardTaskList from "@/components/DashboardTaskList";
import type { MetricsSummaryProps } from "@/components/MetricsSummary";

export interface DashboardProps {
  metricsData?: MetricsSummaryProps | null;
  taskData?: any[] | null;
}

export default function Dashboard({ metricsData, taskData }: DashboardProps) {
  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-semibold">Project Dashboard</h1>

      {metricsData && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Metrics Overview</h2>
          <MetricsSummary
            overall={metricsData.overall}
            byType={metricsData.byType}
            throughput={metricsData.throughput}
          />
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
