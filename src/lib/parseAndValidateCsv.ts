import Papa from "papaparse";
import { WorkItemSchema, type WorkItem } from "@/lib/workItemSchema";

const EXPECTED_HEADERS = [
  "ID",
  "Work Item Type",
  "Title",
  "Assigned To",
  "State",
  "Tags",
  "Created Date",
  "Activated Date",
  "Closed Date",
  "Effort",
  "History",
  "T Shirt Size",
];

export async function parseAndValidateCsv(
  file: File,
): Promise<
  | { success: true; data: WorkItem[] }
  | { success: false; error: "empty_file" }
  | { success: false; error: "missing_columns"; details: string[] }
  | { success: false; error: "unexpected_columns"; details: string[] }
> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const actual = results.meta.fields ?? [];

        if (actual.length === 0 || results.data.length === 0) {
          resolve({ success: false, error: "empty_file" });
          return;
        }

        const missing = EXPECTED_HEADERS.filter((h) => !actual.includes(h));
        const unexpected = actual.filter((h) => !EXPECTED_HEADERS.includes(h));

        if (missing.length > 0) {
          resolve({
            success: false,
            error: "missing_columns",
            details: missing,
          });
          return;
        }

        if (unexpected.length > 0) {
          resolve({
            success: false,
            error: "unexpected_columns",
            details: unexpected,
          });
          return;
        }

        const parsed: WorkItem[] = [];
        for (const row of results.data as any[]) {
          const sanitizedRow = {
            ...row,
            TShirtSize:
              row["T Shirt Size"] === undefined || row["T Shirt Size"] === ""
                ? undefined
                : (row["T Shirt Size"] as string),
          };
          const parsedRow = WorkItemSchema.parse(sanitizedRow);
          parsed.push(parsedRow);
        }

        resolve({ success: true, data: parsed });
      },
      error() {
        resolve({ success: false, error: "empty_file" });
      },
    });
  });
}
