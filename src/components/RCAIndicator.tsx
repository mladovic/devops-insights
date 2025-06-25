import { AlertCircle } from "lucide-react";

export default function RCAIndicator({ isRCA }: { isRCA: boolean }) {
  if (!isRCA) {
    return null;
  }

  return <AlertCircle className="text-red-500" />;
}
