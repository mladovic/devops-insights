"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useSettings } from "@/context/SettingsContext";

const rangeSchema = z
  .object({
    lower: z.number().positive(),
    upper: z.number().positive(),
  })
  .refine((v) => v.lower < v.upper, {
    message: "Lower must be < upper",
    path: ["upper"],
  });

const schema = z.object({
  thresholds: z.object({
    XS: rangeSchema,
    S: rangeSchema,
    M: rangeSchema,
    L: rangeSchema,
    XL: rangeSchema,
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
    formState: { errors },
  } = useForm<Thresholds>({
    resolver: zodResolver(schema),
    defaultValues: defaultConfig,
  });

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
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Lower"
              {...register(`thresholds.${size}.lower` as const, {
                valueAsNumber: true,
              })}
            />
            <Input
              type="number"
              placeholder="Upper"
              {...register(`thresholds.${size}.upper` as const, {
                valueAsNumber: true,
              })}
            />
          </div>
          {errors.thresholds?.[size]?.lower && (
            <span className="text-red-500 text-sm">
              {errors.thresholds[size]?.lower?.message as string}
            </span>
          )}
          {errors.thresholds?.[size]?.upper && (
            <span className="text-red-500 text-sm">
              {errors.thresholds[size]?.upper?.message as string}
            </span>
          )}
        </div>
      ))}
      <div>
        <label>RCA Deviation Percentage (%)</label>
        <Input
          type="number"
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
