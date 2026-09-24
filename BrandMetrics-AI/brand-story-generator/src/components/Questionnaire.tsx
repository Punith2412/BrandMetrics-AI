"use client";

import { useState } from "react";
import { UserAnswers, ContentType } from "@/types";
import {
  ArrowLeft, ArrowRight, Loader2, Sparkles, Shield,
  Star, MessageCircle, Puzzle, Lightbulb, Target, TrendingUp, Users,
  User, Megaphone, Presentation
} from "lucide-react";
import { cn } from "@/lib/utils";

const STRENGTH_CHIPS = [
  { label: "Leadership", icon: Star },
  { label: "Communication", icon: MessageCircle },
  { label: "Problem Solving", icon: Puzzle },
  { label: "Creativity", icon: Lightbulb },
  { label: "Strategic Thinking", icon: Target },
  { label: "Adaptability", icon: TrendingUp },
  { label: "Collaboration", icon: Users },
];

const CONTENT_TYPES: { value: ContentType; label: string; desc: string; icon: typeof User }[] = [
  {
    value: "full_profile",
    label: "Full Brand Profile",
    desc: "Stories + LinkedIn assets + Content ideas + Ads + Pitch",
    icon: User,
  },
  {
    value: "social_ads",
    label: "Social Ads Focus",
    desc: "High-converting ad copy for LinkedIn, Instagram, Facebook & X",
    icon: Megaphone,
  },
  {
    value: "pitch_deck",
    label: "Pitch Deck Focus",
    desc: "Elevator pitch + 5-slide presentation outline",
    icon: Presentation,
  },
];

type StepConfig = {
  key: keyof UserAnswers | "contentType";
  label: string;
  subtitle?: string;
  placeholder?: string;
  type: "text" | "textarea" | "chips" | "contentType";
  chips?: typeof STRENGTH_CHIPS;
};

const STEPS: StepConfig[] = [
  {
    key: "contentType",
    label: "What do you want to create?",
    subtitle: "Choose the type of brand assets you need.",
    type: "contentType",
  },
  {
    key: "name",
    label: "What's your name?",
    subtitle: "We'll use this to personalize your brand story.",
    placeholder: "e.g. Priya Sharma",
    type: "text",
  },
  {
    key: "profession",
    label: "What do you do?",
    subtitle: "Your role, title, or the work you're known for.",
    placeholder: "e.g. Freelance UX Designer, Content Creator, Founder...",
    type: "text",
  },
  {
    key: "strengths",
    label: "What are your biggest professional strengths?",
    subtitle: "Choose all that apply or describe your strengths in your own words.",
    placeholder: "Or tell us more about your strengths...",
    type: "chips",
    chips: STRENGTH_CHIPS,
  },
  {
    key: "background",
    label: "Briefly share your background or journey",
    subtitle: "A few sentences about how you got here.",
    placeholder: "e.g. Started as a graphic designer, moved into product, now help startups...",
    type: "textarea",
  },
  {
    key: "uniqueValue",
    label: "What makes you unique?",
    subtitle: "Your secret sauce — the thing only you bring.",
    placeholder: "e.g. I combine design with business strategy so products convert...",
    type: "textarea",
  },
  {
    key: "goals",
    label: "What are you trying to achieve right now?",
    subtitle: "Your current professional goals.",
    placeholder: "e.g. Attract high-ticket clients, grow my newsletter, land speaking gigs",
    type: "textarea",
  },
  {
    key: "audience",
    label: "Who is your ideal audience or client?",
    subtitle: "Who do you want this story to resonate with?",
    placeholder: "e.g. Early-stage SaaS founders, mid-career professionals...",
    type: "text",
  },
];

interface Props {
  onComplete: (answers: UserAnswers) => void;
  loading: boolean;
}

export function Questionnaire({ onComplete, loading }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<UserAnswers>>({
    contentType: "full_profile",
  });
  const [selectedChips, setSelectedChips] = useState<string[]>([]);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const value = current.key === "contentType"
    ? answers.contentType || "full_profile"
    : ((answers[current.key as keyof UserAnswers] as string) || "");

  const progress = ((step + 1) / STEPS.length) * 100;

  const canNext =
    current.type === "contentType"
      ? !!answers.contentType
      : current.type === "chips"
      ? selectedChips.length > 0 || value.trim().length > 0
      : value.trim().length > 0;

  const toggleChip = (label: string) => {
    setSelectedChips((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );
  };

  const handleNext = () => {
    let finalValue = value;

    if (current.type === "chips") {
      const chipText = selectedChips.join(", ");
      finalValue = chipText + (value ? (chipText ? ". " : "") + value : "");
      setAnswers((a) => ({ ...a, [current.key]: finalValue }));
    }

    if (isLast) {
      const finalAnswers = {
        ...answers,
        [current.key]: finalValue,
        tonePreference: answers.tonePreference || "professional, authentic",
        contentType: answers.contentType || "full_profile",
      } as UserAnswers;
      onComplete(finalAnswers);
    } else {
      setStep((s) => s + 1);
      setSelectedChips([]);
    }
  };

  return (
    <div className="max-w-lg mx-auto animate-slide-up">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-brand-600 dark:text-brand-400">
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1.5 rounded-full bg-brand-100 dark:bg-brand-950 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-400 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 text-sm font-medium mb-3">
            <Sparkles className="w-4 h-4" />
            AI Personal Brand Story Generator
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 leading-snug">{current.label}</h2>
          {current.subtitle && (
            <p className="text-sm text-muted-foreground">{current.subtitle}</p>
          )}
        </div>

        {/* Content Type Selection */}
        {current.type === "contentType" && (
          <div className="space-y-3">
            {CONTENT_TYPES.map((type) => {
              const Icon = type.icon;
              const active = answers.contentType === type.value;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setAnswers({ ...answers, contentType: type.value })}
                  className={cn(
                    "w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all",
                    active
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-950/40 shadow-sm"
                      : "border-[var(--border)] hover:border-brand-300 hover:bg-secondary/50"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      active
                        ? "bg-brand-600 text-white"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{type.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{type.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Strength Chips */}
        {current.type === "chips" && current.chips && (
          <div className="flex flex-wrap gap-2 justify-center mb-5">
            {current.chips.map((chip) => {
              const Icon = chip.icon;
              const active = selectedChips.includes(chip.label);
              return (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => toggleChip(chip.label)}
                  className={cn("chip", active && "active")}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {chip.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Text / Textarea inputs */}
        {(current.type === "textarea" || current.type === "chips") && (
          <>
            <textarea
              value={value as string}
              onChange={(e) =>
                setAnswers({ ...answers, [current.key]: e.target.value })
              }
              placeholder={current.placeholder}
              rows={current.type === "chips" ? 3 : 4}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none text-[15px]"
              autoFocus={current.type !== "chips"}
            />
            <div className="text-right text-xs text-muted-foreground mt-1.5">
              {(value as string).length}/500
            </div>
          </>
        )}

        {current.type === "text" && (
          <input
            type="text"
            value={value as string}
            onChange={(e) =>
              setAnswers({ ...answers, [current.key]: e.target.value })
            }
            placeholder={current.placeholder}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-brand-500 text-[15px]"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && canNext && handleNext()}
          />
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => {
              setStep((s) => Math.max(0, s - 1));
              setSelectedChips([]);
            }}
            disabled={step === 0 || loading}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium border border-[var(--border)] transition-colors",
              step === 0
                ? "opacity-0 pointer-events-none"
                : "hover:bg-secondary text-muted-foreground"
            )}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canNext || loading}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all",
              canNext && !loading
                ? "btn-primary !py-2.5"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating...
              </>
            ) : isLast ? (
              <>
                <Sparkles className="w-4 h-4" /> Generate Everything
              </>
            ) : (
              <>
                Next <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-5 flex items-center justify-center gap-1.5">
        <Shield className="w-3.5 h-3.5" />
        Your answers are private and used only to craft your brand assets.
      </p>
    </div>
  );
}
