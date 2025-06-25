import ThresholdForm from "@/components/ThresholdForm";

export default function SettingsPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Manage Thresholds</h1>
      <ThresholdForm />
    </div>
  );
}
