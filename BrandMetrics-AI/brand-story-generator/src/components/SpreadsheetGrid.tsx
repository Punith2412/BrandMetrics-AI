"use client";

import { useState } from "react";
import { PlatformAd } from "@/types";
import { Copy, Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  ads: PlatformAd[];
  headline?: string;
}

const LIMITS: Record<string, number> = {
  linkedin: 3000,
  instagram: 2200,
  facebook: 63206,
  x: 280,
  "linkedin-headline": 220,
};

export function SpreadsheetGrid({ ads, headline }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const rows = [
    ...(headline
      ? [
          {
            id: "headline",
            platform: "LinkedIn Headline",
            hook: headline,
            body: "",
            cta: "",
            full: headline,
            chars: headline.length,
            limit: 220,
          },
        ]
      : []),
    ...ads.map((ad) => {
      const full = [ad.hook, ad.body, ad.cta, ...(ad.hashtags || [])].filter(Boolean).join("\n\n");
      return {
        id: ad.platform,
        platform: ad.platform.charAt(0).toUpperCase() + ad.platform.slice(1),
        hook: ad.hook,
        body: ad.body,
        cta: ad.cta,
        full,
        chars: full.length,
        limit: LIMITS[ad.platform] || 1000,
      };
    }),
  ];

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-secondary/60 text-left">
            <th className="px-4 py-3 font-semibold border-b border-[var(--border)] whitespace-nowrap">
              Channel Target
            </th>
            <th className="px-4 py-3 font-semibold border-b border-[var(--border)] whitespace-nowrap">
              Char Count
            </th>
            <th className="px-4 py-3 font-semibold border-b border-[var(--border)] min-w-[180px]">
              Algorithmic Hook
            </th>
            <th className="px-4 py-3 font-semibold border-b border-[var(--border)] min-w-[280px]">
              Full Content Payload
            </th>
            <th className="px-4 py-3 font-semibold border-b border-[var(--border)] text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const remaining = row.limit - row.chars;
            const isOver = remaining < 0;
            const isWarning = !isOver && remaining < row.limit * 0.15;

            return (
              <tr
                key={row.id}
                className={cn(
                  "border-b border-[var(--border)] last:border-0",
                  i % 2 === 1 && "bg-secondary/20",
                  isOver && "bg-red-50/50 dark:bg-red-950/20"
                )}
              >
                <td className="px-4 py-3 font-medium whitespace-nowrap">
                  {row.platform}
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1",
                      isOver && "text-red-600 font-semibold",
                      isWarning && "text-amber-600"
                    )}
                  >
                    {isOver && <AlertTriangle className="w-3.5 h-3.5" />}
                    {row.chars} / {row.limit}
                    {isOver && (
                      <span className="text-[10px]">(over by {Math.abs(remaining)})</span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-3 text-[13px] leading-snug max-w-[220px]">
                  <span className="line-clamp-2">{row.hook}</span>
                </td>
                <td className="px-4 py-3 text-[13px] leading-snug max-w-[320px]">
                  <span className="line-clamp-3 whitespace-pre-line text-muted-foreground">
                    {row.full}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleCopy(row.full, row.id)}
                    disabled={isOver}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                      isOver
                        ? "opacity-40 cursor-not-allowed border-[var(--border)]"
                        : "border-[var(--border)] hover:bg-secondary"
                    )}
                  >
                    {copiedId === row.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
