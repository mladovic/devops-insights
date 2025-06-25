import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RCAIndicator from "@/components/RCAIndicator";
import { checkRCAIndicator } from "@/lib/checkRCAIndicator";
import { useSettings } from "@/context/SettingsContext";

export interface TaskItem {
  ID: number;
  Title: string;
  WorkItemType: string;
  Assignee: string | null;
  CycleTimeDays?: number;
  LeadTimeDays?: number;
}

export interface DashboardTaskListProps {
  taskData: TaskItem[];
}

export default function DashboardTaskList({
  taskData,
}: DashboardTaskListProps) {
  if (!taskData || taskData.length === 0) {
    return null;
  }

  const { rcaDeviationPercentage } = useSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Work Item Type</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Cycle Time (days)</TableHead>
              <TableHead>Lead Time (days)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taskData.map((task) => {
              const isRCA =
                typeof task.CycleTimeDays === "number" &&
                checkRCAIndicator(
                  task.CycleTimeDays,
                  "M",
                  rcaDeviationPercentage,
                );

              return (
                <TableRow key={task.ID}>
                  <TableCell>{task.ID}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {task.Title}
                      <RCAIndicator isRCA={isRCA} />
                    </div>
                  </TableCell>
                  <TableCell>{task.WorkItemType}</TableCell>
                  <TableCell>{task.Assignee ?? "-"}</TableCell>
                  <TableCell>
                    {typeof task.CycleTimeDays === "number"
                      ? task.CycleTimeDays
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {typeof task.LeadTimeDays === "number"
                      ? task.LeadTimeDays
                      : "-"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
