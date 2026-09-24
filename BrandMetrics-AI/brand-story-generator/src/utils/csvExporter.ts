import { PlatformAd } from "@/types";

/**
 * Builds a Content Calendar CSV from ads + optional headline
 * and triggers a browser download.
 */
export function exportContentCalendarCSV(
  ads: PlatformAd[],
  headline?: string,
  fileName: string = "content-calendar.csv"
) {
  const rows: string[][] = [
    ["Channel Target", "Character Count", "Hook", "Body", "Call to Action", "Hashtags", "Full Text"],
  ];

  if (headline) {
    rows.push([
      "LinkedIn Headline",
      String(headline.length),
      headline,
      "",
      "",
      "",
      headline,
    ]);
  }

  ads.forEach((ad) => {
    const full = [ad.hook, ad.body, ad.cta, ...(ad.hashtags || [])].filter(Boolean).join("\n\n");
    rows.push([
      ad.platform.charAt(0).toUpperCase() + ad.platform.slice(1),
      String(full.length),
      ad.hook,
      ad.body,
      ad.cta,
      (ad.hashtags || []).join(" "),
      full,
    ]);
  });

  // Escape CSV fields
  const escape = (val: string) => {
    if (val.includes('"') || val.includes(",") || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const csvContent = rows.map((row) => row.map(escape).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
