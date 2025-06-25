import Papa from "papaparse";

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
];

export async function parseAndValidateCsv(
  file: File,
): Promise<{ success: true; data: any[] } | { success: false; error: "invalid_format" }> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const actual = results.meta.fields || [];
        const hasAllHeaders =
          EXPECTED_HEADERS.length === actual.length &&
          EXPECTED_HEADERS.every((h) => actual.includes(h)) &&
          actual.every((h) => EXPECTED_HEADERS.includes(h));

        if (hasAllHeaders) {
          resolve({ success: true, data: results.data as any[] });
        } else {
          resolve({ success: false, error: "invalid_format" });
        }
      },
      error() {
        resolve({ success: false, error: "invalid_format" });
      },
    });
  });
}
