import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { OverallMetrics } from "@/lib/calculateOverallMetrics";
import type { AggregatedMetrics } from "@/lib/aggregateMetricsByType";
import type { ThroughputMetrics } from "@/lib/calculateThroughputMetrics";

import type { DateRangeOption } from "@/components/filters/DateRangeFilter";

export interface MetricsSummaryProps {
  overall: OverallMetrics;
  byType: AggregatedMetrics;
  throughput: ThroughputMetrics;
  selectedDateRange: DateRangeOption;
}

export default function MetricsSummary({
  overall,
  byType,
  throughput,
  selectedDateRange,
}: MetricsSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Overall Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Avg Cycle Time (days)</p>
              <p className="text-xl font-semibold">{overall.overallAverageCycleTimeDays.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Lead Time (days)</p>
              <p className="text-xl font-semibold">{overall.overallAverageLeadTimeDays.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics by Work Item Type */}
      <Card>
        <CardHeader>
          <CardTitle>Metrics by Work Item Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Avg Cycle Time</TableHead>
                <TableHead className="text-right">Avg Lead Time</TableHead>
                <TableHead className="text-right">Completed</TableHead>
                <TableHead className="text-right">Incomplete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(byType).map(([type, data]) => (
                <TableRow key={type}>
                  <TableCell>{type}</TableCell>
                  <TableCell className="text-right">{data.averageCycleTimeDays.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{data.averageLeadTimeDays.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{data.completedTasks}</TableCell>
                  <TableCell className="text-right">{data.incompleteTasks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Throughput Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Throughput</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Last 7 days</TableCell>
                <TableCell className="text-right">{throughput.weeklyThroughput}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Last 30 days</TableCell>
                <TableCell className="text-right">{throughput.monthlyThroughput}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Last 14 days</TableCell>
                <TableCell className="text-right">{throughput.throughputLast14Days}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Last 30 days (custom)</TableCell>
                <TableCell className="text-right">{throughput.throughputLast30Days}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Last 60 days</TableCell>
                <TableCell className="text-right">{throughput.throughputLast60Days}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

