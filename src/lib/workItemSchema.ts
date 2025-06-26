import { z } from "zod";
import type { TShirtSize } from "@/lib/checkRCAIndicator";

export const WorkItemSchema = z.object({
  ID: z.union([z.number(), z.string()]),
  "Work Item Type": z.string(),
  Title: z.string(),
  "Assigned To": z.string().optional().or(z.literal("")),
  State: z.string().optional(),
  Tags: z.string().optional(),
  "Created Date": z.string(),
  "Activated Date": z.string().optional(),
  "Closed Date": z.string().optional(),
  Effort: z.string().optional(),
  History: z.string().optional(),
  TShirtSize: z
    .union([z.enum(["XS", "S", "M", "L", "XL"]), z.literal("")])
    .optional()
    .transform((v) => (v === "" ? undefined : (v as TShirtSize))),
});

export type WorkItem = z.infer<typeof WorkItemSchema>;
