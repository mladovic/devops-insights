import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MockDashboard() {
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your metrics and insights will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
