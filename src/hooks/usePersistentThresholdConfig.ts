import { useEffect, useState } from "react";
import { ThresholdConfig } from "@/lib/defaultThresholdConfig";
import type {
  ThresholdConfig as ThresholdConfigType,
} from "@/lib/defaultThresholdConfig";

const STORAGE_KEY = "thresholdConfig";

export function usePersistentThresholdConfig() {
  const [config, setConfig] = useState<ThresholdConfigType>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored) as ThresholdConfigType;
        }
      } catch {
        // ignore JSON parse errors
      }
    }
    return ThresholdConfig;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore write errors
    }
  }, [config]);

  const getConfig = () => config;

  const updateConfig = (newConfig: ThresholdConfigType) => {
    setConfig(newConfig);
  };

  return {
    getConfig,
    updateConfig,
  };
}
