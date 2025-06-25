"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import MockDashboard from "@/components/MockDashboard";
import { parseAndValidateCsv } from "@/lib/parseAndValidateCsv";

export default function DashboardPage() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    const result = await parseAndValidateCsv(file);
    if (result.success) {
      setShowDashboard(true);
    } else {
      setError("Upload failed, please try again.");
    }
  };

  if (showDashboard) {
    return <MockDashboard />;
  }

  return (
    <div className="p-4 space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <FileUpload onFileAccepted={handleFile} />
    </div>
  );
}
