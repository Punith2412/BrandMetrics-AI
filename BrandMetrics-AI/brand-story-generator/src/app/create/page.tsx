"use client";

import { useState } from "react";
import { Questionnaire } from "@/components/Questionnaire";
import { StoryResults } from "@/components/StoryResults";
import { UserAnswers, GeneratedContent } from "@/types";
import { getCurrentUser, saveStory } from "@/lib/auth";

export default function CreatePage() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async (answers: UserAnswers) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      if (!res.ok) throw new Error("Generation failed");
      const result: GeneratedContent = await res.json();
      setContent(result);

      const user = getCurrentUser();
      if (user) {
        saveStory(user.id, result);
      }
    } catch (e) {
      setError("Something went wrong while generating. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 sm:py-14 px-4">
      {!content && (
        <div className="max-w-lg mx-auto mb-2" />
      )}

      {error && (
        <div className="max-w-lg mx-auto mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {!content ? (
        <Questionnaire onComplete={handleComplete} loading={loading} />
      ) : (
        <StoryResults content={content} onReset={() => setContent(null)} />
      )}
    </div>
  );
}
