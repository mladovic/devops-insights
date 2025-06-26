"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useSettings } from "@/context/SettingsContext";

const schema = z.object({
  thresholds: z.object({
    XS: z.number().int().positive(),
    S: z.number().int().positive(),
    M: z.number().int().positive(),
    L: z.number().int().positive(),
    XL: z.number().int().positive(),
  }),
  rcaDeviationPercentage: z
    .number()
    .int("Must be an integer")
    .min(5, "Minimum is 5%")
    .max(100, "Maximum is 100%"),
});

type Thresholds = z.infer<typeof schema>;

export default function ThresholdForm() {
  const { config: defaultConfig, updateConfig } = useSettings();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Thresholds>({
    resolver: zodResolver(schema),
    defaultValues: defaultConfig,
  });

  // sync form when persisted configuration changes
  useEffect(() => {
    reset(defaultConfig);
  }, [defaultConfig, reset]);

  const onSubmit = (data: Thresholds) => {
    updateConfig(data);
  };

  return (
    <form
      className="flex flex-col gap-4 max-w-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      {["XS", "S", "M", "L", "XL"].map((size) => (
        <div key={size}>
          <label className="font-medium block">{size} Threshold (days)</label>
          <Input
            type="number"
            min={1}
            step={1}
            {...register(`thresholds.${size}` as const, {
              valueAsNumber: true,
            })}
          />
          {errors.thresholds?.[size] && (
            <span className="text-red-500 text-sm">
              {errors.thresholds[size]?.message as string}
            </span>
          )}
        </div>
      ))}
      <div>
        <label>RCA Deviation Percentage (%)</label>
        <Input
          type="number"
          min={5}
          step={1}
          {...register("rcaDeviationPercentage", { valueAsNumber: true })}
        />
        {errors.rcaDeviationPercentage && (
          <span className="text-red-500 text-sm">
            {errors.rcaDeviationPercentage.message as string}
          </span>
        )}
      </div>
      <Button type="submit">Save Thresholds</Button>
    </form>
  );
}
