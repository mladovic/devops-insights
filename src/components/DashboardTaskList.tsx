import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface DashboardTaskListProps {
  tasks: Array<{
    ID: number | string;
    Title: string;
    State: string;
    [key: string]: any;
  }>;
}

export default function DashboardTaskList({ tasks }: DashboardTaskListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>State</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.ID}>
                <TableCell>{task.ID}</TableCell>
                <TableCell>{task.Title}</TableCell>
                <TableCell>{task["Work Item Type"]}</TableCell>
                <TableCell>{task.State}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
