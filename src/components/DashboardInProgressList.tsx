import { differenceInCalendarDays, isValid } from "date-fns";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface InProgressTask {
  ID: number | string;
  Title: string;
  WorkItemType: string;
  Assignee?: string | null;
  ActivatedDate?: string;
}

export interface DashboardInProgressListProps {
  tasks: InProgressTask[];
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (!isValid(date)) return "-";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function calcDaysInProgress(dateStr?: string): string | number {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (!isValid(date)) return "-";
  return differenceInCalendarDays(new Date(), date);
}

export default function DashboardInProgressList({
  tasks,
}: DashboardInProgressListProps) {
  if (!tasks || tasks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>In Progress Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Work Item Type</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Activated Date</TableHead>
              <TableHead>Days in Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.ID}>
                <TableCell>{task.ID}</TableCell>
                <TableCell>{task.Title}</TableCell>
                <TableCell>{task.WorkItemType}</TableCell>
                <TableCell>{task.Assignee ?? "-"}</TableCell>
                <TableCell>{formatDate(task.ActivatedDate)}</TableCell>
                <TableCell>{calcDaysInProgress(task.ActivatedDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
