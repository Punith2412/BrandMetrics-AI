"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button className={cn("p-2 rounded-lg", className)} aria-label="Toggle theme">
        <Sun className="w-4 h-4" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-[var(--border)] text-xs font-medium transition-colors hover:bg-secondary",
        className
      )}
      aria-label="Toggle theme"
    >
      {isDark ? <Moon className="w-3.5 h-3.5 text-brand-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
      <span className="hidden sm:inline text-muted-foreground">{isDark ? "Dark" : "Light"}</span>
      <span
        className={cn(
          "w-8 h-4 rounded-full relative transition-colors",
          isDark ? "bg-brand-600" : "bg-gray-300"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform",
            isDark ? "left-4" : "left-0.5"
          )}
        />
      </span>
    </button>
  );
}
