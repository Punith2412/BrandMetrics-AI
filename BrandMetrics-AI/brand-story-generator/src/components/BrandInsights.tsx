"use client";

import { BrandAnalytics } from "@/lib/analytics";
import { BarChart3, Clock, Type, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  analytics: BrandAnalytics;
}

export function BrandInsights({ analytics }: Props) {
  return (
    <div className="mb-8 p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-brand-500" />
          <h2 className="font-semibold text-base">Brand Data Insights</h2>
        </div>
        {analytics.domainProfile && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">
            {analytics.domainProfile}
          </span>
        )}
      </div>

      {/* Top row – Score cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <MetricCard
          icon={<Zap className="w-4 h-4" />}
          label="Impact Score"
          value={`${analytics.impactScore}/100`}
          accent="text-brand-600"
        />
        <MetricCard
          icon={<Type className="w-4 h-4" />}
          label="Readability"
          value={analytics.readabilityLabel}
          sub={`${analytics.readabilityScore}/100`}
        />
        <MetricCard
          icon={<Clock className="w-4 h-4" />}
          label="Reading Time"
          value={`${analytics.readingTimeSeconds}s`}
          sub={`${analytics.wordCount} words`}
        />
        <MetricCard
          icon={<Target className="w-4 h-4" />}
          label="Action Ratio"
          value={`${analytics.actionRatio}%`}
          sub="Power verbs"
        />
      </div>

      {/* Keywords */}
      <div className="mb-6">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Top Keywords (Density)
        </p>
        <div className="flex flex-wrap gap-2">
          {analytics.keywords.map((kw) => (
            <span
              key={kw.word}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 text-sm font-medium border border-brand-200 dark:border-brand-800"
            >
              {kw.word}
              <span className="text-xs opacity-70">{kw.percentage}%</span>
            </span>
          ))}
          {analytics.keywords.length === 0 && (
            <span className="text-sm text-muted-foreground">No strong keywords detected</span>
          )}
        </div>
      </div>

      {/* Tone bars */}
      <div className="mb-6">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Tone Profile
        </p>
        <div className="space-y-2.5">
          <ToneBar label="Professional" value={analytics.tone.professional} color="bg-blue-500" />
          <ToneBar label="Analytical" value={analytics.tone.analytical} color="bg-emerald-500" />
          <ToneBar label="Creative" value={analytics.tone.creative} color="bg-purple-500" />
          <ToneBar label="Action-Oriented" value={analytics.tone.actionOriented} color="bg-amber-500" />
        </div>
      </div>

      {/* Platform Fit */}
      {analytics.platformFits.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Platform Character Fit
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {analytics.platformFits.map((pf) => (
              <div
                key={pf.platform}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-center",
                  pf.status === "good" && "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800",
                  pf.status === "warning" && "border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800",
                  pf.status === "over" && "border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800"
                )}
              >
                <p className="text-[11px] font-medium capitalize truncate">
                  {pf.platform.replace("-", " ")}
                </p>
                <p className="text-sm font-semibold mt-0.5">
                  {pf.chars}
                  <span className="text-xs font-normal text-muted-foreground">/{pf.limit}</span>
                </p>
                <p
                  className={cn(
                    "text-[10px] mt-0.5 font-medium",
                    pf.status === "good" && "text-emerald-600",
                    pf.status === "warning" && "text-amber-600",
                    pf.status === "over" && "text-red-600"
                  )}
                >
                  {pf.status === "good" ? "Fits" : pf.status === "warning" ? "Near limit" : "Over limit"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* A/B Divergence */}
      {analytics.abDivergence && (
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            A/B Divergence Analysis (Metrics vs Narrative)
          </p>
          <div className="grid sm:grid-cols-3 gap-3 mb-3">
            <div className="rounded-xl border border-[var(--border)] px-3 py-3 text-center">
              <p className="text-[11px] text-muted-foreground mb-1">Variant A – Metrics</p>
              <p className="text-lg font-bold text-blue-600">{analytics.abDivergence.metricsWeight}%</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] px-3 py-3 text-center">
              <p className="text-[11px] text-muted-foreground mb-1">Variant B – Narrative</p>
              <p className="text-lg font-bold text-purple-600">{analytics.abDivergence.narrativeWeight}%</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] px-3 py-3 text-center">
              <p className="text-[11px] text-muted-foreground mb-1">Keyword Diversity</p>
              <p className="text-lg font-bold">{analytics.abDivergence.diversityScore}%</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground bg-secondary/40 rounded-lg px-3 py-2">
            {analytics.abDivergence.recommendation}
          </p>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-secondary/30 px-3 py-3">
      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
        {icon}
        <span className="text-[11px] font-medium">{label}</span>
      </div>
      <p className={cn("text-sm font-bold leading-tight", accent)}>{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

function ToneBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-28 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
      <span className="text-xs font-medium w-8 text-right">{value}%</span>
    </div>
  );
}
