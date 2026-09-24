"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, getUserStories, deleteStory } from "@/lib/auth";
import { User, GeneratedContent } from "@/types";
import { Plus, Trash2, FileText, Calendar } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stories, setStories] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.push("/login");
      return;
    }
    setUser(u);
    setStories(getUserStories(u.id));
    setLoading(false);
  }, [router]);

  const handleDelete = (id: string) => {
    if (!user || !confirm("Delete this story?")) return;
    deleteStory(user.id, id);
    setStories((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Stories</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.name}</p>
        </div>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Story
        </Link>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-[var(--border)]">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">No stories yet</h2>
          <p className="text-muted-foreground mb-6">Create your first personal brand story in minutes.</p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700"
          >
            <Plus className="w-4 h-4" /> Create Story
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {stories.map((story) => (
            <div
              key={story.id}
              className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-lg truncate">
                    {story.answers.name} — {story.answers.profession}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {story.stories.professional.slice(0, 140)}...
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(story.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(story.id)}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">
                  {story.linkedinHeadline.slice(0, 40)}...
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
