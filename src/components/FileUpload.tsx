"use client";

import { useState, DragEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileAccepted: (file: File) => void;
}

export default function FileUpload({ onFileAccepted }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

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
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith(".csv")) {
      onFileAccepted(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
        isDragOver ? "border-primary" : "border-input"
      }`}
    >
      <p className="mb-2">Drag and drop your CSV file here</p>
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
  );
}
