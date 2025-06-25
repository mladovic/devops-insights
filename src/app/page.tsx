"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import MockDashboard from "@/components/MockDashboard";
import { parseAndValidateCsv } from "@/lib/parseAndValidateCsv";

export default function DashboardPage() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    const result = await parseAndValidateCsv(file);

    if (result.success) {
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
    return <MockDashboard />;
  }

  return (
    <div className="p-4 space-y-4">
      <FileUpload onFileAccepted={handleFile} error={error} />
    </div>
  );
}
