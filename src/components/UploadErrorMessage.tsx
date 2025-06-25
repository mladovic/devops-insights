"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface UploadErrorMessageProps {
  message: string;
}

export default function UploadErrorMessage({ message }: UploadErrorMessageProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className={cn("text-red-500 bg-red-50 border rounded-md p-2 flex items-start gap-2")}> 
      <span className="flex-1">{message}</span>
      <button
        type="button"
        aria-label="Dismiss error"
        className="text-red-500 hover:text-red-700"
        onClick={() => setVisible(false)}
      >
        &times;
      </button>
    </div>
  );
}
