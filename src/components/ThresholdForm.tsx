"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";

const schema = z.object({
  XS: z.number().positive(),
  S: z.number().positive(),
  M: z.number().positive(),
  L: z.number().positive(),
  XL: z.number().positive(),
  rcaDeviationPercentage: z
    .number()
    .min(5, "Minimum is 5%")
    .max(100, "Maximum is 100%"),
});

type Thresholds = z.infer<typeof schema>;

export default function ThresholdForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Thresholds>({
    resolver: zodResolver(schema),
    defaultValues: {
      XS: 1,
      S: 2,
      M: 3,
      L: 5,
      XL: 8,
      rcaDeviationPercentage: 20,
    },
  });

  const onSubmit = (data: Thresholds) => {
    // TODO: replace with API call
    console.log("Saving settings:", data);
  };

  return (
    <form
      className="flex flex-col gap-4 max-w-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      {["XS", "S", "M", "L", "XL"].map((size) => (
        <div key={size}>
          <label>{size} Threshold (days)</label>
          <Input
            type="number"
            {...register(size as keyof Thresholds, { valueAsNumber: true })}
          />
          {errors[size as keyof Thresholds] && (
            <span className="text-red-500 text-sm">
              Please enter a valid number.
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
