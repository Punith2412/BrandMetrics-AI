"use client";

import { useState, useMemo } from "react";
import { PlatformAd } from "@/types";
import { Copy, Check, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { predictCTR } from "@/lib/analytics";

const PLATFORM_STYLES = {
  linkedin: {
    name: "LinkedIn",
    border: "border-l-[#0A66C2]",
    badge: "bg-[#0A66C2]/10 text-[#0A66C2]",
    icon: "in",
  },
  instagram: {
    name: "Instagram",
    border: "border-l-[#E1306C]",
    badge: "bg-[#E1306C]/10 text-[#E1306C]",
    icon: "IG",
  },
  facebook: {
    name: "Facebook",
    border: "border-l-[#1877F2]",
    badge: "bg-[#1877F2]/10 text-[#1877F2]",
    icon: "f",
  },
  x: {
    name: "X (Twitter)",
    border: "border-l-neutral-800 dark:border-l-neutral-200",
    badge: "bg-neutral-800/10 text-neutral-800 dark:bg-neutral-200/10 dark:text-neutral-200",
    icon: "𝕏",
  },
};

interface Props {
  ad: PlatformAd;
}

export function PlatformAdCard({ ad }: Props) {
  const [isCopied, setIsCopied] = useState(false);
  const style = PLATFORM_STYLES[ad.platform];

  const ctr = useMemo(
    () => predictCTR(ad.hook, ad.body, ad.cta),
    [ad.hook, ad.body, ad.cta]
  );

  const fullText = [ad.hook, ad.body, ad.cta, ...(ad.hashtags || [])]
    .filter(Boolean)
    .join("\n\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden border-l-4",
        style.border
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] bg-secondary/30">
        <div className="flex items-center gap-2.5">
          <span className={cn("text-xs font-bold px-2 py-0.5 rounded", style.badge)}>
            {style.icon}
          </span>
          <span className="font-semibold text-sm">{style.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Predicted CTR Badge */}
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
            <TrendingUp className="w-3 h-3" />
            CTR {ctr.expectedCTR}
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-[var(--border)] hover:bg-secondary transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Ad
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 font-medium">
            Hook
          </p>
          <p className="font-semibold text-[15px] leading-snug">{ad.hook}</p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 font-medium">
            Body
          </p>
          <p className="text-sm leading-relaxed text-[var(--foreground)]/90 whitespace-pre-line">
            {ad.body}
          </p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 font-medium">
            Call to Action
          </p>
          <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-brand-600 text-white text-sm font-medium">
            {ad.cta}
          </div>
        </div>

        {ad.hashtags && ad.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {ad.hashtags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTR Factors */}
        {ctr.factors.length > 0 && (
          <div className="pt-2 border-t border-[var(--border)]">
            <p className="text-[10px] text-muted-foreground mb-1">CTR drivers detected:</p>
            <div className="flex flex-wrap gap-1">
              {ctr.factors.map((f) => (
                <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
