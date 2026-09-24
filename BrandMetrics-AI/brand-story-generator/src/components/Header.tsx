"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { getCurrentUser, logout } from "@/lib/auth";
import { User } from "@/types";
import { LogOut, BookOpen, Menu, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setUser(getCurrentUser());
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push("/");
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/create", label: "Generator" },
    { href: "/dashboard", label: "My Stories" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-lg transition-theme">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md shadow-brand-600/30">
            <BookOpen className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-[15px] tracking-tight">BrandMetrics AI</span>
            <p className="text-[11px] text-muted-foreground -mt-0.5 hidden lg:block">
              Craft your story. Build your legacy.
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href
                  ? "text-brand-600 dark:text-brand-400"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
              {pathname === item.href && (
                <div className="h-0.5 w-full bg-brand-500 rounded-full mt-0.5" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-2 py-1 rounded-full border border-[var(--border)]">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-7 h-7 rounded-full" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium pr-1">{user.name.split(" ")[0]}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2"
              >
                Login
              </Link>
              <Link href="/create" className="btn-primary text-sm !px-4 !py-2">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-secondary">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--background)] px-4 py-4 space-y-1 animate-fade-in">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block py-2.5 px-3 rounded-lg font-medium",
                pathname === item.href ? "bg-brand-50 dark:bg-brand-950/40 text-brand-600" : ""
              )}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="flex items-center gap-2 py-2.5 px-3 text-muted-foreground w-full">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 font-medium text-brand-600">
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
