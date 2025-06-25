"use client";

import { useState, DragEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import UploadErrorMessage from "./UploadErrorMessage";

interface FileUploadProps {
  onFileAccepted: (file: File) => void;
  error?: string | null;
}

export default function FileUpload({
  onFileAccepted,
  error,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [hovered, setHovered] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.toLowerCase().endsWith(".csv")) {
      onFileAccepted(file);
      setStatus("success");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith(".csv")) {
      onFileAccepted(file);
      setStatus("success");
    }
  };

  const base =
    "border-2 border-dashed rounded-md p-6 text-center transition-colors";

  let stateClasses = "border-input";
  if (error) {
    stateClasses = "border-red-400 bg-red-50";
  } else if (status === "success") {
    stateClasses = "border-green-500 bg-green-50";
  } else if (isDragOver) {
    stateClasses = "border-primary bg-primary/10";
  } else if (hovered) {
    stateClasses = "border-ring bg-muted/50";
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`${base} ${stateClasses}`}
      >
        <p className="mb-2">Drag your CSV file here or click Browse</p>
        <input
          id="file-upload-input"
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="hidden"
        />
        <label htmlFor="file-upload-input">
          <Button type="button">Browse</Button>
        </label>
      </div>
      {error && <UploadErrorMessage message={error} />}
    </div>
  );
}
