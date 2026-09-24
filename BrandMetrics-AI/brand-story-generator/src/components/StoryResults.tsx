"use client";

import { useState } from "react";
import { GeneratedContent, StoryVersion } from "@/types";
import {
  Copy, Check, Download, RefreshCw, Linkedin,
  Sparkles, Pencil, Star, Heart, Zap,
  User, Megaphone, Presentation, Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentUser, saveStory } from "@/lib/auth";
import { PlatformAdCard } from "./PlatformAdCard";
import { PrintTemplate } from "./PrintTemplate";
import { BrandInsights } from "./BrandInsights";
import { SpreadsheetGrid } from "./SpreadsheetGrid";
import { exportBrandKitPDF } from "@/utils/pdfExporter";
import { exportContentCalendarCSV } from "@/utils/csvExporter";
import { analyzeBrandContent } from "@/lib/analytics";

interface Props {
  content: GeneratedContent;
  onReset: () => void;
}

const VERSION_META: Record<StoryVersion, { label: string; icon: typeof Star }> = {
  professional: { label: "Professional", icon: Star },
  friendly: { label: "Friendly", icon: Heart },
  bold: { label: "Bold", icon: Zap },
};

type TabKey = "profile" | "ads" | "pitch";

export function StoryResults({ content, onReset }: Props) {
  const initialTab: TabKey =
    content.answers.contentType === "social_ads"
      ? "ads"
      : content.answers.contentType === "pitch_deck"
      ? "pitch"
      : "profile";

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [version, setVersion] = useState<StoryVersion>("professional");
  const [editedStory, setEditedStory] = useState(content.stories.professional);
  const [editedHeadline, setEditedHeadline] = useState(content.linkedinHeadline);
  const [editedBio, setEditedBio] = useState(content.linkedinBio);
  const [editing, setEditing] = useState(false);
  const [copiedFieldId, setCopiedFieldId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "grid">("cards");

  // Compute brand analytics from current content
  const analytics = analyzeBrandContent(
    content.stories[version] || content.stories.professional,
    content.linkedinHeadline,
    content.ads || []
  );

  const handleVersionChange = (v: StoryVersion) => {
    setVersion(v);
    setEditedStory(content.stories[v]);
    setEditing(false);
  };

  const copyText = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedFieldId(id);
    setTimeout(() => setCopiedFieldId(null), 2000);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const fileName = `brand-kit-${content.answers.name || "export"}.pdf`;
      await exportBrandKitPDF("brand-print-package", fileName);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = () => {
    const user = getCurrentUser();
    if (!user) {
      alert("Please sign in to save your stories.");
      return;
    }
    const toSave = {
      ...content,
      stories: { ...content.stories, [version]: editedStory },
      linkedinHeadline: editedHeadline,
      linkedinBio: editedBio,
    };
    saveStory(user.id, toSave);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const contentType = content.answers.contentType || "full_profile";

  const allTabs: { key: TabKey; label: string; icon: typeof User }[] = [
    { key: "profile", label: "Profile", icon: User },
    { key: "ads", label: "Social Ads", icon: Megaphone },
    { key: "pitch", label: "Pitch Deck", icon: Presentation },
  ];

  const tabs =
    contentType === "social_ads"
      ? allTabs.filter((t) => t.key === "ads" || t.key === "profile")
      : contentType === "pitch_deck"
      ? allTabs.filter((t) => t.key === "pitch" || t.key === "profile")
      : allTabs;

  return (
    <div className="max-w-5xl mx-auto animate-slide-up">
      {/* Hidden Print Template for PDF */}
      <PrintTemplate content={content} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-500" />
            Your Brand Kit
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Complete personal brand assets ready to use and customize.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-secondary text-sm font-medium transition-colors"
          >
            <Star className={cn("w-4 h-4", saved && "fill-brand-500 text-brand-500")} />
            {saved ? "Saved!" : "Save"}
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-primary text-sm !py-2"
          >
            <Download className="w-4 h-4" />
            {isExporting ? "Generating..." : "Download Full Kit (PDF)"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-secondary/60 mb-8 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                activeTab === tab.key
                  ? "bg-[var(--card)] text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Brand Data Insights – always visible */}
      <BrandInsights analytics={analytics} />

      {/* ==================== PROFILE TAB ==================== */}
      {activeTab === "profile" && (
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            <section className="p-6 sm:p-7 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-500" />
                  <h2 className="font-semibold">About Me Story</h2>
                </div>
                <button
                  onClick={() => setEditing(!editing)}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg hover:bg-secondary"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  {editing ? "Done" : "Edit"}
                </button>
              </div>

              {editing ? (
                <textarea
                  value={editedStory}
                  onChange={(e) => setEditedStory(e.target.value)}
                  rows={12}
                  className="w-full px-0 py-0 border-0 bg-transparent focus:outline-none resize-none text-[15px] leading-relaxed"
                />
              ) : (
                <div className="text-[15px] leading-relaxed whitespace-pre-line text-[var(--foreground)]/90">
                  {editedStory}
                </div>
              )}
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => copyText(editedStory, "story")}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-secondary text-sm font-medium"
              >
                {copiedFieldId === "story" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copiedFieldId === "story" ? "Copied!" : "Copy Story"}
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl btn-primary text-sm !py-3"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button
                onClick={onReset}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-secondary text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Start Over
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <section className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              <h3 className="font-semibold text-sm mb-3">Choose a Voice</h3>
              <div className="flex flex-col gap-2">
                {(Object.keys(VERSION_META) as StoryVersion[]).map((v) => {
                  const meta = VERSION_META[v];
                  const Icon = meta.icon;
                  return (
                    <button
                      key={v}
                      onClick={() => handleVersionChange(v)}
                      className={cn(
                        "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                        version === v
                          ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                          : "border border-[var(--border)] hover:bg-secondary text-muted-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {meta.label}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                  <h3 className="font-semibold text-sm">LinkedIn Headline</h3>
                </div>
                <button
                  onClick={() => copyText(editedHeadline, "headline")}
                  className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"
                >
                  {copiedFieldId === "headline" ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <p className="text-sm leading-relaxed font-medium">{editedHeadline}</p>
            </section>

            <section className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">LinkedIn Bio</h3>
                <button
                  onClick={() => copyText(editedBio, "bio")}
                  className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"
                >
                  {copiedFieldId === "bio" ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-line text-[var(--foreground)]/90">
                {editedBio}
              </p>
            </section>
          </div>
        </div>
      )}

      {/* ==================== SOCIAL ADS TAB ==================== */}
      {activeTab === "ads" && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <p className="text-sm text-muted-foreground">
              Ready-to-post ad copy. Switch between visual cards and spreadsheet view.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  exportContentCalendarCSV(
                    content.ads || [],
                    content.linkedinHeadline,
                    `content-calendar-${content.answers.name || "export"}.csv`
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-medium hover:bg-secondary transition-colors"
              >
                ⬇ Export CSV
              </button>
              <div className="flex rounded-lg border border-[var(--border)] p-0.5 bg-secondary/40">
                <button
                  onClick={() => setViewMode("cards")}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                    viewMode === "cards"
                      ? "bg-[var(--card)] shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  📋 Cards View
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                    viewMode === "grid"
                      ? "bg-[var(--card)] shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  📊 Spreadsheet View
                </button>
              </div>
            </div>
          </div>

          {viewMode === "cards" ? (
            <div className="grid md:grid-cols-2 gap-5">
              {content.ads?.map((ad) => (
                <PlatformAdCard key={ad.platform} ad={ad} />
              ))}
            </div>
          ) : (
            <SpreadsheetGrid
              ads={content.ads || []}
              headline={content.linkedinHeadline}
            />
          )}
        </div>
      )}

      {/* ==================== PITCH DECK TAB ==================== */}
      {activeTab === "pitch" && (
        <div className="space-y-8">
          <section className="p-6 sm:p-7 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-500" />
                60-Second Elevator Pitch
              </h2>
              <button
                onClick={() => copyText(content.elevatorPitch || "", "pitch")}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-[var(--border)] hover:bg-secondary"
              >
                {copiedFieldId === "pitch" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-500" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
            <p className="text-[15px] leading-relaxed whitespace-pre-line">
              {content.elevatorPitch}
            </p>
          </section>

          <div>
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Presentation className="w-4 h-4 text-brand-500" />
              5-Slide Pitch Deck Outline
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.pitchSlides?.map((slide, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] relative"
                >
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-sm mb-2 pr-8">{slide.title}</h3>
                  <p className="text-sm text-[var(--foreground)]/90 mb-3 leading-relaxed">
                    {slide.coreMessage}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    Visual: {slide.visualCue}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Ideas */}
      {activeTab === "profile" && (
        <section className="mt-8 p-6 sm:p-7 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <h2 className="font-semibold mb-5 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            5 Content Ideas
          </h2>
          <ul className="space-y-3">
            {content.contentIdeas.map((idea, i) => (
              <li
                key={i}
                className="flex gap-3 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-sm font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed flex-1 pt-0.5">{idea}</p>
                <button
                  onClick={() => copyText(idea, `idea-${i}`)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-[var(--card)] transition-opacity"
                >
                  {copiedFieldId === `idea-${i}` ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-center text-xs text-muted-foreground mt-8">
        All content is AI-generated and fully editable. Make it your own.
      </p>
    </div>
  );
}
